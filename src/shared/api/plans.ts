import { apiClient } from "./base";

export interface PlanRecord {
  id: string;
  user_id: string;
  title: string;
  content: string;
  week_number?: number;
  week_start_date?: string;
  created_at: string;
}

export async function getPlans(limit = 20, offset = 0): Promise<PlanRecord[]> {
  return apiClient<PlanRecord[]>(`/plans?limit=${limit}&offset=${offset}`);
}

export async function getPlan(id: string): Promise<PlanRecord> {
  return apiClient<PlanRecord>(`/plans/${id}`);
}
