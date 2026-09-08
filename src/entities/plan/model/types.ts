import type { PlanCartItem, PlanTargets } from "@/shared/api";

export interface ParsedPlanContent {
  answer: string;
  cartItems: PlanCartItem[];
  targets: PlanTargets;
}
