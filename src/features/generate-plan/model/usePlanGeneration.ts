import { useCallback, useState } from "react";
import { streamPlan, type PlanData, type PlanStreamParams } from "@/shared/api";
import {
  FINALIZE_TOOL,
  FINISHING_STEP_LABEL,
  INITIAL_STEP_LABEL,
  formatToolLabel,
} from "./toolLabels";

export type PlanGenerationStatus = "idle" | "streaming" | "done" | "error";

export const usePlanGeneration = () => {
  const [status, setStatus] = useState<PlanGenerationStatus>("idle");
  const [currentStep, setCurrentStep] = useState<string>(INITIAL_STEP_LABEL);
  const [result, setResult] = useState<PlanData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (params: PlanStreamParams) => {
    setStatus("streaming");
    setCurrentStep(INITIAL_STEP_LABEL);
    setError(null);

    try {
      const plan = await streamPlan(params, {
        onToolCall: (event) => setCurrentStep(formatToolLabel(event.tool)),
        onToolResult: (event) => {
          // finalize_plan — останній виклик у прогоні: далі модель дописує
          // план без жодних подій, тож рядок не має завмирати на інструменті
          if (event.tool === FINALIZE_TOOL) setCurrentStep(FINISHING_STEP_LABEL);
        },
      });

      setResult(plan);
      setStatus("done");
      return plan;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Не вдалося згенерувати план");
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setCurrentStep(INITIAL_STEP_LABEL);
    setResult(null);
    setError(null);
  }, []);

  return { status, currentStep, result, error, generate, reset };
};
