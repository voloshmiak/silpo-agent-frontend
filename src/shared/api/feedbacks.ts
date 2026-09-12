import { apiClient } from "./base";

export interface FeedbackDishRating {
  id: string;
  title: string;
  cookedTimes: number;
  timeMinutes?: number;
  rating: "good" | "bad";
}

export interface FeedbackRecord {
  id: string;
  user_id: string;
  plan_id: string;
  dish_ratings: FeedbackDishRating[];
  tags: string[];
  created_at: string;
}

export async function saveFeedback(payload: {
  plan_id: string;
  dish_ratings: FeedbackDishRating[];
  tags: string[];
}): Promise<FeedbackRecord> {
  return apiClient<FeedbackRecord>("/feedbacks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getLatestFeedback(): Promise<FeedbackRecord> {
  return apiClient<FeedbackRecord>("/feedbacks/latest");
}