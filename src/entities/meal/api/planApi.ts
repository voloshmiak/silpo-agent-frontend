import { apiClient } from "@/shared/api";

export interface BackendPlanItem {
  id: string;
  user_id: string;
  title: string;
  content: string; // JSON строка
  created_at: string;
}

export interface ParsedPlanContent {
  answer: string;
  plan_data?: {
    cart_items?: Array<{
      id: string;
      title: string;
      brand?: string;
      price: number;
      count?: number;
      weight?: string;
    }>;
    targets?: {
      calories: number;
      protein: number;
      fat: number;
      carbs: number;
    };
  };
}

export const planApi = {
  // Список всех планов (для Архива)
  async getPlans(limit = 20, offset = 0): Promise<BackendPlanItem[]> {
    return apiClient<BackendPlanItem[]>(`/plans?limit=${limit}&offset=${offset}`);
  },

  // Получить один план
  async getPlanById(id: string): Promise<BackendPlanItem> {
    return apiClient<BackendPlanItem>(`/plans/${id}`);
  },

  // Утилита для парсинга поля content
  parseContent(content: string): ParsedPlanContent {
    try {
      return JSON.parse(content);
    } catch {
      return { answer: content };
    }
  },
};