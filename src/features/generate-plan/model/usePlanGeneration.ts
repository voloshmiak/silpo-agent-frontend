import { useCallback, useState } from "react";
import { streamPlan, type PlanStreamParams, type PlanToolCallEvent } from "@/shared/api";
import type { ParsedPlanContent } from "@/entities/plan";

export type PlanGenerationStatus = "idle" | "streaming" | "done" | "error";

export const usePlanGeneration = () => {
  const [status, setStatus] = useState<PlanGenerationStatus>("idle");
  const [toolEvents, setToolEvents] = useState<PlanToolCallEvent[]>([]);
  const [result, setResult] = useState<ParsedPlanContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (params: PlanStreamParams) => {
    setStatus("streaming");
    setToolEvents([]);
    setError(null);

    try {
      const streamed = await streamPlan(params, {
        onToolCall: (event) => setToolEvents((prev) => [...prev, event]),
      });

      const parsed: ParsedPlanContent = {
        answer: streamed.answer,
        cartItems: streamed.cart_items,
        targets: streamed.targets,
      };

      setResult(parsed);
      setStatus("done");
      return parsed;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Не вдалося згенерувати план");
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setToolEvents([]);
    setResult(null);
    setError(null);
  }, []);

  return { status, toolEvents, result, error, generate, reset };
};
