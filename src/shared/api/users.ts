import { apiClient, setToken } from "./base";
import type { BackendUser } from "@/entities/user";

export interface RegistrationResult {
  user: BackendUser;
  token: string;
  generated_password?: string;
}

export async function createUser(
  name: string,
  email: string,
  silpoToken: string
): Promise<RegistrationResult> {
  const data = await apiClient<RegistrationResult>("/users", {
    method: "POST",
    body: JSON.stringify({ name, email, silpo_token: silpoToken }),
  });
  setToken(data.token);
  return data;
}

export async function loginUser(email: string, password: string): Promise<BackendUser> {
  const data = await apiClient<RegistrationResult>("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.user;
}

export async function changePassword(
  newPassword: string
): Promise<{ status: string; message?: string }> {
  return apiClient<{ status: string; message?: string }>("/users/me/password", {
    method: "PUT",
    body: JSON.stringify({ new_password: newPassword }),
  });
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
