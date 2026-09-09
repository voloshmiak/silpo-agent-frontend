import { API_BASE_URL, getToken } from "./base";
import { getPlans } from "./plans";

/**
 * Аргументи одного прогону — і тільки вони.
 *
 * Профіль, бюджет, тренування та обмеження бекенд читає з `user_settings`;
 * перебити їх параметрами запиту більше не можна. Раніше екран надсилав свою
 * копію профілю і міг розійтися з базою — половина цифр їхала з форми,
 * половина з БД. Щоб план порахувався по-новому, спершу зберігаємо зміни
 * через `PUT /users/me/settings`, і аж тоді генеруємо.
 */
export interface PlanStreamParams {
  /** Вільний текст користувача. Дієта, алергени й стоп-продукти сюди не пишуться — вони в налаштуваннях */
  note?: string;
  /** Продукти, які вже є вдома, через кому — вони не купуються */
  fridge?: string;
  /** Минулий план, який агент адаптує замість генерації з нуля */
  planId?: string;
}

export type PlanMealSlot = "breakfast" | "lunch" | "snack" | "dinner";

export const PLAN_MEAL_SLOTS: PlanMealSlot[] = ["breakfast", "lunch", "snack", "dinner"];

export interface PlanMeal {
  title: string;
  items: string[];
  kcal: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
}

export interface PlanDay {
  day: string;
  workout: boolean;
  kcal: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  breakfast?: PlanMeal;
  lunch?: PlanMeal;
  snack?: PlanMeal;
  dinner?: PlanMeal;
}

export interface PlanTargets {
  kcal: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  estimated_weeks_to_goal?: number;
  estimated_goal_date?: string;
}

export interface PlanCartItem {
  name: string;
  product_id: string;
  quantity: number;
  unit: string;
  /** Ціна за ОДНУ одиницю після знижок. Для позиції з кількох одиниць це не сума */
  price: number;
  /** Сума всієї позиції після знижок — саме вона показується в рядку кошика */
  total_price: number;
  /** Поля картки товару «Сільпо» — відсутні в планах, збережених до оновлення контракту */
  slug?: string;
  url?: string;
  image_url?: string;
  /** Знижки з розрахунку кошика — теж відсутні у старих планах */
  old_price?: number;
  discount_uah?: number;
}

export interface PlanSummary {
  /** До сплати: товари зі знижками + доставка */
  total_uah: number;
  budget_uah: number;
  remaining_uah: number;
  restrictions: string[];
  promotions: string[];
  notes?: string;
  /** Розклад суми — відсутній у планах, збережених до оновлення контракту */
  products_total_uah?: number;
  delivery_uah?: number;
  discount_uah?: number;
}

export interface PlanData {
  targets: PlanTargets;
  days: PlanDay[];
  cart: PlanCartItem[];
  summary: PlanSummary;
}

/**
 * Ядро проставляє `run_id` на кожній події стріму. Це той самий ідентифікатор,
 * що стоїть у його логах, тож зі скріншота помилки прогін знаходиться одразу.
 */
interface PlanStreamEventBase {
  run_id?: string;
}

export interface PlanToolCallEvent extends PlanStreamEventBase {
  type: "tool_call";
  tool: string;
  args: unknown;
}

export interface PlanToolResultEvent extends PlanStreamEventBase {
  type: "tool_result";
  tool: string;
  ok: boolean;
  result: string;
}

export interface PlanFinalEvent extends PlanStreamEventBase {
  type: "plan";
  plan: PlanData | null;
}

/**
 * Історичний варіант фінальної події: старіші збірки бекенда закривали стрім
 * подією `done` і пакували план у `plan_data`. Ядро шле `plan`, але сумісність
 * тримаємо — старий бекенд не має ламати генерацію.
 */
export interface PlanLegacyFinalEvent extends PlanStreamEventBase {
  type: "done";
  plan?: PlanData | null;
  plan_data?: PlanData | null;
}

export interface PlanErrorEvent extends PlanStreamEventBase {
  type: "error";
  message: string;
  code?: string;
}

export type PlanStreamEvent =
  | PlanToolCallEvent
  | PlanToolResultEvent
  | PlanFinalEvent
  | PlanLegacyFinalEvent
  | PlanErrorEvent;

interface StreamPlanHandlers {
  onToolCall?: (event: PlanToolCallEvent) => void;
  onToolResult?: (event: PlanToolResultEvent) => void;
  signal?: AbortSignal;
}

/**
 * Збій генерації разом із тим, що потрібно для розбору: `runId` — ідентифікатор
 * прогону в логах ядра, `code` — машинний код (напр. `silpo_token_expired`),
 * на який UI може зреагувати окремо від тексту.
 */
export class PlanStreamError extends Error {
  readonly code?: string;
  readonly runId?: string;

  constructor(message: string, options: { code?: string; runId?: string } = {}) {
    super(message);
    this.name = "PlanStreamError";
    this.code = options.code;
    this.runId = options.runId;
  }
}

/**
 * Агент шле подію кожні кілька секунд, а найдовша законна пауза — один хід
 * моделі. Якщо мовчання триває довше, з'єднання вже мертве: краще сказати це
 * вголос, ніж лишити користувача з вічним спінером.
 */
const STALL_TIMEOUT_MS = 3 * 60 * 1000;

/** Коди збоїв, для яких є що сказати користувачу зрозумілою мовою. */
const CODE_MESSAGES: Record<string, string> = {
  silpo_token_expired: "Доступ до «Сільпо» протермінувався — підключіть акаунт ще раз.",
};

/** Дописує до повідомлення слід, за яким збій можна знайти в логах. */
function withTrace(message: string, runId?: string, lastTool?: string): string {
  const trace = [
    lastTool ? `останній крок: ${lastTool}` : null,
    runId ? `ID: ${runId}` : null,
  ].filter(Boolean);
  return trace.length > 0 ? `${message} (${trace.join(", ")})` : message;
}

/** Чи схожа структура на план, а не на порожню обгортку події. */
function looksLikePlan(value: unknown): value is PlanData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PlanData>;
  return Array.isArray(candidate.days) || Array.isArray(candidate.cart);
}

/**
 * Знімок історії на старті прогону. Порівняння з ним — єдиний спосіб відрізнити
 * щойно збережений план від попереднього, не покладаючись на годинник браузера.
 */
async function latestPlanId(): Promise<string | null> {
  try {
    const [latest] = await getPlans(1, 0);
    return latest?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Останній рубіж: стрім міг обірватися вже після того, як бекенд зберіг план.
 * Тоді план існує, і забрати його з /plans чесніше, ніж просити користувача
 * генерувати заново те, що вже пораховано. Береться лише запис, якого не було
 * на старті, — інакше ми б видали старий план за новий.
 */
async function recoverSavedPlan(baseline: Promise<string | null>): Promise<PlanData | null> {
  try {
    const baselineId = await baseline;
    const [latest] = await getPlans(1, 0);
    if (!latest || latest.id === baselineId) return null;

    const content: unknown =
      typeof latest.content === "string" ? JSON.parse(latest.content) : latest.content;
    if (!content || typeof content !== "object") return null;

    const record = content as { plan?: unknown; plan_data?: unknown };
    const candidate = record.plan_data ?? record.plan ?? content;
    return looksLikePlan(candidate) ? candidate : null;
  } catch (error) {
    console.warn("Не вдалося підтягнути збережений план:", error);
    return null;
  }
}

/** Порожній рядок, коли передавати нічого — тоді й `?` в URL не з'явиться. */
function buildQuery(params: PlanStreamParams): string {
  const search = new URLSearchParams();
  if (params.note) search.set("note", params.note);
  if (params.fridge) search.set("fridge", params.fridge);
  if (params.planId) search.set("plan_id", params.planId);
  return search.toString();
}

/**
 * Manually parses the `/plan/stream` SSE response. Native EventSource can't
 * send the Authorization header, so this reads the fetch body stream instead.
 *
 * The agent emits `tool_call`/`tool_result` while it works, then exactly one
 * `plan` event carrying the whole structured plan — there is no text to stream
 * token by token. Unknown event types are ignored on purpose, so a core that
 * still sends the retired `token` events keeps working.
 */
export async function streamPlan(
  params: PlanStreamParams = {},
  handlers: StreamPlanHandlers = {}
): Promise<PlanData> {
  const token = getToken();

  // Власний контролер, щоб уміти обірвати стрім самим (зависання), не забравши
  // при цьому зовнішній signal у того, хто нас викликав.
  const controller = new AbortController();
  const abortFromCaller = () => controller.abort();
  handlers.signal?.addEventListener("abort", abortFromCaller);

  let stalled = false;
  let stallTimer: ReturnType<typeof setTimeout> | undefined;
  const armStallTimer = () => {
    if (stallTimer !== undefined) clearTimeout(stallTimer);
    stallTimer = setTimeout(() => {
      stalled = true;
      controller.abort();
    }, STALL_TIMEOUT_MS);
  };

  // Тримаємо слід прогону поза циклом: коли стрім обірветься, це єдине, що
  // лишиться сказати про те, де саме він обірвався.
  let runId: string | undefined;
  let lastTool: string | undefined;

  // Запит іде паралельно зі стрімом, тож на щасливому шляху його ніхто не чекає.
  const baselinePlanId = latestPlanId();
  let recovery: Promise<PlanData | null> | undefined;
  const recoverOnce = () => {
    if (!recovery) recovery = recoverSavedPlan(baselinePlanId);
    return recovery;
  };

  try {
    armStallTimer();
    const query = buildQuery(params);
    const response = await fetch(`${API_BASE_URL}/plan/stream${query ? `?${query}` : ""}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      let message = `API Error [${response.status}]: ${response.statusText}`;
      try {
        const body = (await response.clone().json()) as { error?: string };
        if (body.error) message = body.error;
      } catch {
        // тіло не JSON — лишаємо statusText
      }
      throw new PlanStreamError(message);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let final: PlanData | null = null;
    let sawPlanEvent = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      armStallTimer();

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() ?? "";

      for (const chunk of chunks) {
        const dataLine = chunk
          .split("\n")
          .find((line) => line.startsWith("data:"));
        if (!dataLine) continue;

        const raw = dataLine.slice(5).trim();
        if (!raw) continue;

        let event: PlanStreamEvent;
        try {
          event = JSON.parse(raw) as PlanStreamEvent;
        } catch {
          // пошкоджений фрейм не має валити всю генерацію
          continue;
        }

        if (event.run_id) runId = event.run_id;

        if (event.type === "tool_call") {
          lastTool = event.tool;
          handlers.onToolCall?.(event);
        } else if (event.type === "tool_result") {
          handlers.onToolResult?.(event);
        } else if (event.type === "plan" || event.type === "done") {
          sawPlanEvent = true;
          const candidate = event.plan ?? ("plan_data" in event ? event.plan_data : undefined);
          if (looksLikePlan(candidate)) final = candidate;
        } else if (event.type === "error") {
          // Заголовки вже відправлені, тож збій агента приходить подією, не статусом
          const known = event.code ? CODE_MESSAGES[event.code] : undefined;
          throw new PlanStreamError(
            withTrace(known ?? event.message ?? "Агент завершив роботу з помилкою", runId, lastTool),
            { code: event.code, runId }
          );
        }
      }
    }

    if (final) return final;

    if (sawPlanEvent) {
      throw new PlanStreamError(withTrace("Агент не сформував план — спробуйте ще раз", runId, lastTool), {
        runId,
      });
    }

    // Ядро й бекенд завжди закривають стрім подією `plan` або `error`. Якщо не
    // прийшло жодної — обірвалося з'єднання, а не робота агента, і план цілком
    // міг уже лягти в базу.
    const recovered = await recoverOnce();
    if (recovered) return recovered;

    throw new PlanStreamError(
      withTrace("Зв'язок з агентом обірвався до кінця генерації. Спробуйте ще раз.", runId, lastTool),
      { runId }
    );
  } catch (error) {
    // Скасування користувачем — не збій, нічого не відновлюємо.
    if (handlers.signal?.aborted) throw error;

    const recovered = await recoverOnce();
    if (recovered) return recovered;

    if (stalled) {
      throw new PlanStreamError(
        withTrace("Агент перестав відповідати. Спробуйте згенерувати план ще раз.", runId, lastTool),
        { runId }
      );
    }
    throw error;
  } finally {
    if (stallTimer !== undefined) clearTimeout(stallTimer);
    handlers.signal?.removeEventListener("abort", abortFromCaller);
  }
}
