import { apiClient, authStorage } from "@/shared/api";
import type { UserProfile } from "../model/types";

interface AuthResponse {
  user: UserProfile;
  token: string;
}

export const userApi = {
  // Инициализация/регистрация пользователя
  async initUser(name = "Денис"): Promise<UserProfile> {
    const existingToken = authStorage.getToken();
    if (existingToken) {
      try {
        return await apiClient<UserProfile>("/users/me");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        authStorage.clearToken();
      }
    }

    const res = await apiClient<AuthResponse>("/users", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    authStorage.setToken(res.token);
    return res.user;
  },

  // Обновление веса и роста
  async updateProfile(data: { name: string; weight: number; height: number }): Promise<UserProfile> {
    return apiClient<UserProfile>("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Сохранение токена Silpo
  async saveSilpoToken(accessToken: string, refreshToken?: string): Promise<{ status: string }> {
    return apiClient<{ status: string }>("/users/me/silpo-token", {
      method: "POST",
      body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
    });
  },
};