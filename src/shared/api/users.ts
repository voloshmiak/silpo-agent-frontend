import { apiClient, setToken } from "./base";
import type { BackendUser } from "@/entities/user";

interface CreateUserResponse {
  user: BackendUser;
  token: string;
}

export async function createUser(name: string): Promise<BackendUser> {
  const data = await apiClient<CreateUserResponse>("/users", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  setToken(data.token);
  return data.user;
}

export async function getMe(): Promise<BackendUser> {
  return apiClient<BackendUser>("/users/me");
}

export async function saveSilpoToken(
  accessToken: string,
  refreshToken?: string
): Promise<{ status: string }> {
  return apiClient<{ status: string }>("/users/me/silpo-token", {
    method: "POST",
    body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
  });
}
