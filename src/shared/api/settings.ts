import { apiClient } from "./base";

/** Відповідь GET/PUT /users/me/settings — 4 блоки екрана «Параметри та обмеження». */
export interface UserSettings {
  user_id: string;
  weight: number;
  target_weight: number;
  height: number;
  age: number;
  sex: string;
  focus: string;
  weekly_pace: number;
  workouts_per_week: number;
  /** Тільки тренувальні дні: {"ПН": "силові", "ВТ": "кардіо"} */
  workout_schedule: Record<string, string>;
  missed_workout_today: boolean;
  allergens: string[];
  excluded_products: string[];
  diet_type: string;
  weekly_budget: number;
  promo_priority: string;
  delivery_included: boolean;
  updated_at: string;
}

/** Тіло PUT — усе те саме, крім полів, які проставляє бекенд. */
export type UserSettingsPayload = Omit<UserSettings, "user_id" | "updated_at">;

export async function getSettings(): Promise<UserSettings> {
  return apiClient<UserSettings>("/users/me/settings");
}

export async function updateSettings(
  payload: Partial<UserSettingsPayload>
): Promise<UserSettings> {
  return apiClient<UserSettings>("/users/me/settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
