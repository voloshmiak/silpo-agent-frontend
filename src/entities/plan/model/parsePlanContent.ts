import type { PlanData } from "@/shared/api";

/**
 * Backend stores plan.content as a JSON string: {"answer": "...", "plan_data": {...}}.
 * `plan_data` is the `plan` payload of the final SSE event. `answer` is no longer
 * read — without token events the backend fills it with the raw SSE log.
 */
export function parsePlanContent(content: string): PlanData | null {
  try {
    const parsed = JSON.parse(content) as { plan_data?: unknown };
    return isPlanData(parsed.plan_data) ? parsed.plan_data : null;
  } catch {
    return null;
  }
}

/** Відсіює плани старого контракту (plan_data.cart_items) — вони не рендеряться. */
function isPlanData(value: unknown): value is PlanData {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<PlanData>;
  return Array.isArray(candidate.days) && Array.isArray(candidate.cart);
}
