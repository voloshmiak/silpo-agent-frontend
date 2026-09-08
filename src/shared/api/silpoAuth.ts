/**
 * Вхід через «Сільпо» — OAuth 2.0 Authorization Code + PKCE проти MCP-сервера
 * Сільпо (https://mcp.silpo.ua). Сервер підтримує динамічну реєстрацію клієнта
 * (RFC 7591) і публічних клієнтів (`token_endpoint_auth_method: "none"`), тож
 * увесь потік живе в браузері й не потребує секретів або змін на бекенді.
 *
 * Код повертається у popup-вікно на /silpo-callback.html, яке віддає його
 * назад через postMessage — так стан онбордингу переживає логін.
 */

const MCP_ORIGIN = "https://mcp.silpo.ua";
const DISCOVERY_URL = `${MCP_ORIGIN}/.well-known/oauth-authorization-server`;
const CLIENT_STORAGE_KEY = "silpofit_oauth_client";
const CLIENT_NAME = "SILPOFIT";
const POPUP_FEATURES = "width=480,height=760,menubar=no,toolbar=no";

export interface SilpoTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

interface AuthServerMetadata {
  authorization_endpoint: string;
  token_endpoint: string;
  registration_endpoint?: string;
}

interface StoredClient {
  clientId: string;
  redirectUri: string;
}

function redirectUri(): string {
  return `${window.location.origin}/silpo-callback.html`;
}

async function discover(): Promise<AuthServerMetadata> {
  const response = await fetch(DISCOVERY_URL);
  if (!response.ok) throw new Error("Сільпо не відповідає на запит авторизації");
  return response.json();
}

/**
 * client_id видається безкоштовно й без секрету, але реєструвати його на
 * кожен вхід нема потреби — кешуємо, доки не змінився redirect_uri.
 */
async function getClientId(metadata: AuthServerMetadata): Promise<string> {
  const uri = redirectUri();

  try {
    const cached = localStorage.getItem(CLIENT_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as StoredClient;
      if (parsed.clientId && parsed.redirectUri === uri) return parsed.clientId;
    }
  } catch {
    // зіпсований запис — просто зареєструємось наново
  }

  if (!metadata.registration_endpoint) {
    throw new Error("Сільпо не підтримує реєстрацію застосунку");
  }

  const response = await fetch(absolute(metadata.registration_endpoint), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: CLIENT_NAME,
      redirect_uris: [uri],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
    }),
  });

  if (!response.ok) throw new Error("Не вдалося зареєструвати застосунок у Сільпо");

  const { client_id: clientId } = (await response.json()) as { client_id?: string };
  if (!clientId) throw new Error("Сільпо не повернув client_id");

  try {
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify({ clientId, redirectUri: uri }));
  } catch {
    // приватний режим — переживемо без кешу
  }

  return clientId;
}

/** Метадані можуть містити відносні шляхи (`/register`). */
function absolute(endpoint: string): string {
  return endpoint.startsWith("http") ? endpoint : `${MCP_ORIGIN}${endpoint}`;
}

function randomString(bytes = 32): string {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return base64Url(buffer);
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function pkceChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64Url(new Uint8Array(digest));
}

/** Чекає на authorization code із popup-вікна. */
function awaitCode(popup: Window, expectedState: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let settled = false;

    const finish = (action: () => void) => {
      if (settled) return;
      settled = true;
      window.removeEventListener("message", onMessage);
      clearInterval(closedTimer);
      action();
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const data = event.data as {
        source?: string;
        code?: string;
        state?: string;
        error?: string;
        errorDescription?: string;
      };
      if (data?.source !== "silpo-oauth") return;

      if (data.error) {
        finish(() => reject(new Error(data.errorDescription || data.error!)));
        return;
      }
      if (data.state !== expectedState) {
        finish(() => reject(new Error("Некоректна відповідь Сільпо (state не збігається)")));
        return;
      }
      if (!data.code) {
        finish(() => reject(new Error("Сільпо не повернув код авторизації")));
        return;
      }

      finish(() => resolve(data.code!));
    };

    // Користувач може просто закрити вікно — не залишаємо проміс висіти
    const closedTimer = window.setInterval(() => {
      if (popup.closed) finish(() => reject(new Error("Вікно входу закрито")));
    }, 500);

    window.addEventListener("message", onMessage);
  });
}

/**
 * Відкриває вікно входу «Сільпо» й повертає токени користувача.
 * Викликати треба напряму з обробника кліку — інакше браузер зріже popup.
 */
export async function loginWithSilpo(): Promise<SilpoTokens> {
  const popup = window.open("about:blank", "silpo-login", POPUP_FEATURES);
  if (!popup) throw new Error("Браузер заблокував вікно входу — дозвольте спливні вікна");

  try {
    const metadata = await discover();
    const clientId = await getClientId(metadata);

    const verifier = randomString();
    const state = randomString(16);
    const challenge = await pkceChallenge(verifier);

    const authorizeUrl = new URL(absolute(metadata.authorization_endpoint));
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("client_id", clientId);
    authorizeUrl.searchParams.set("redirect_uri", redirectUri());
    authorizeUrl.searchParams.set("state", state);
    authorizeUrl.searchParams.set("code_challenge", challenge);
    authorizeUrl.searchParams.set("code_challenge_method", "S256");

    popup.location.href = authorizeUrl.toString();

    const code = await awaitCode(popup, state);

    const response = await fetch(absolute(metadata.token_endpoint), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri(),
        client_id: clientId,
        code_verifier: verifier,
      }),
    });

    if (!response.ok) {
      throw new Error("Сільпо відхилив обмін коду на токен");
    }

    const tokens = (await response.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
    };
    if (!tokens.access_token) throw new Error("Сільпо не повернув токен доступу");

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
    };
  } finally {
    if (!popup.closed) popup.close();
  }
}
