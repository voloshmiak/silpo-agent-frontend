import { API_BASE_URL, apiClient, getToken } from "./base";

export interface ProgressPoint {
  date: string;
  week_label: string;
  weight: number;
  is_forecast: boolean;
}

export interface ProgressData {
  weight: {
    current_weight: number;
    start_weight: number;
    target_weight: number;
    change_kg: number;
    period_weeks: number;
    history: ProgressPoint[];
    forecast: ProgressPoint[];
  };
  expenses: {
    weekly_limit: number;
    average_spend: number;
    weeks_within_limit: number;
    total_weeks: number;
    overspent_count: number;
    overspent_labels: string[];
    items: Array<{
      id: string;
      week_number: number;
      week_label: string;
      total_cost: number;
      budget_limit: number;
      is_overspent: boolean;
      date: string;
    }>;
  };
}

export async function getProgress(weeks: "4" | "12" | "all" = "12"): Promise<ProgressData> {
  return apiClient<ProgressData>(`/progress?weeks=${weeks}`);
}

export async function downloadProgressCsv(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/progress/export/csv`, {
    headers: { ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) },
  });
  if (!response.ok) throw new Error(`Не вдалося експортувати CSV (${response.status})`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "silpo_progress.csv";
  link.click();
  URL.revokeObjectURL(url);
}