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

export interface PlanCartItem {
  id: string;
  name: string;
  price: number;
  [key: string]: unknown;
}

export interface PlanTargets {
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  [key: string]: unknown;
}

export interface PlanStreamResult {
  answer: string;
  cart_items: PlanCartItem[];
  targets: PlanTargets;
}

export interface PlanToolCallEvent {
  type: "tool_call";
  tool: string;
  args: unknown;
}

export interface PlanTokenEvent {
  type: "token";
  text: string;
}

export interface PlanFinalEvent {
  type: "plan";
  answer: string;
  plan: {
    cart_items: PlanCartItem[];
    targets: PlanTargets;
  };
}

export type PlanStreamEvent = PlanToolCallEvent | PlanTokenEvent | PlanFinalEvent;

interface StreamPlanHandlers {
  onToolCall?: (event: PlanToolCallEvent) => void;
  onToken?: (event: PlanTokenEvent) => void;
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
 */
export async function streamPlan(
  params: PlanStreamParams,
  handlers: StreamPlanHandlers = {}
): Promise<PlanStreamResult> {
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

      const event = JSON.parse(raw) as PlanStreamEvent;

      if (event.type === "tool_call") {
        handlers.onToolCall?.(event);
      } else if (event.type === "token") {
        handlers.onToken?.(event);
      } else if (event.type === "plan") {
        final = event;
      }
    }
  }

  if (!final) {
    throw new Error("Стрім завершився без фінального плану");
  }

  return {
    answer: final.answer,
    cart_items: final.plan.cart_items,
    targets: final.plan.targets,
  };
}
