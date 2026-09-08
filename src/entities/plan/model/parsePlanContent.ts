import type { ParsedPlanContent } from "./types";

/** Backend stores plan.content as a JSON string: {"answer": "...", "plan_data": {...}} */
export function parsePlanContent(content: string): ParsedPlanContent | null {
  try {
    const parsed = JSON.parse(content) as {
      answer?: string;
      plan_data?: { cart_items?: ParsedPlanContent["cartItems"]; targets?: ParsedPlanContent["targets"] };
    };

    return {
      answer: parsed.answer ?? "",
      cartItems: parsed.plan_data?.cart_items ?? [],
      targets: parsed.plan_data?.targets ?? {},
    };
  } catch {
    return null;
  }
}
