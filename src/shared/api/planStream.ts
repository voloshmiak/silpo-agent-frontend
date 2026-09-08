import { API_BASE_URL, getToken } from "./base";

export interface PlanStreamParams {
  budgetUah: number;
  workouts?: number;
  sex?: "male" | "female";
  age?: number;
  note?: string;
  fridge?: string;
  targetWeight?: number;
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
  price: number;
  total_price: number;
  /** Поля картки товару «Сільпо» — відсутні в планах, збережених до оновлення контракту */
  slug?: string;
  url?: string;
  image_url?: string;
}

export interface PlanSummary {
  total_uah: number;
  budget_uah: number;
  remaining_uah: number;
  restrictions: string[];
  promotions: string[];
  notes?: string;
}

export interface PlanData {
  targets: PlanTargets;
  days: PlanDay[];
  cart: PlanCartItem[];
  summary: PlanSummary;
}

export interface PlanToolCallEvent {
  type: "tool_call";
  tool: string;
  args: unknown;
}

export interface PlanToolResultEvent {
  type: "tool_result";
  tool: string;
  ok: boolean;
  result: string;
}

export interface PlanFinalEvent {
  type: "plan";
  plan: PlanData | null;
}

export interface PlanErrorEvent {
  type: "error";
  message: string;
  code?: string;
}

export type PlanStreamEvent =
  | PlanToolCallEvent
  | PlanToolResultEvent
  | PlanFinalEvent
  | PlanErrorEvent;

interface StreamPlanHandlers {
  onToolCall?: (event: PlanToolCallEvent) => void;
  onToolResult?: (event: PlanToolResultEvent) => void;
  signal?: AbortSignal;
}

function buildQuery(params: PlanStreamParams): string {
  const search = new URLSearchParams();
  search.set("budget_uah", String(params.budgetUah));
  if (params.workouts !== undefined) search.set("workouts", String(params.workouts));
  if (params.sex) search.set("sex", params.sex);
  if (params.age !== undefined) search.set("age", String(params.age));
  if (params.note) search.set("note", params.note);
  if (params.fridge) search.set("fridge", params.fridge);
  if (params.targetWeight !== undefined) search.set("target_weight", String(params.targetWeight));
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
  params: PlanStreamParams,
  handlers: StreamPlanHandlers = {}
): Promise<PlanData> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/plan/stream?${buildQuery(params)}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal: handlers.signal,
  });

  if (!response.ok || !response.body) {
    let message = `API Error [${response.status}]: ${response.statusText}`;
    try {
      const body = (await response.clone().json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // тіло не JSON — лишаємо statusText
    }
    throw new Error(message);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let final: PlanFinalEvent | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

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

      if (event.type === "tool_call") {
        handlers.onToolCall?.(event);
      } else if (event.type === "tool_result") {
        handlers.onToolResult?.(event);
      } else if (event.type === "plan") {
        final = event;
      } else if (event.type === "error") {
        // Заголовки вже відправлені, тож збій агента приходить подією, не статусом
        throw new Error(event.message || "Агент завершив роботу з помилкою");
      }
    }
  }

  if (!final) {
    throw new Error("Стрім завершився без фінального плану");
  }

  if (!final.plan) {
    throw new Error("Агент не сформував план — спробуйте ще раз");
  }

  return final.plan;
}
