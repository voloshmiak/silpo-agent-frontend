import { useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { API_BASE_URL, authStorage } from "@/shared/api";

export interface StreamParams {
  budget_uah: number;
  workouts?: number;
  sex?: "male" | "female";
  age?: number;
  note?: string;
  fridge?: string;
  target_weight?: number;
  plan_id?: string;
}

export const usePlanStream = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [currentTool, setCurrentTool] = useState<{ tool: string; args: unknown } | null>(null);
  const [finalPlan, setFinalPlan] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startStream = async (params: StreamParams, onComplete?: (data: unknown) => void) => {
    setIsStreaming(true);
    setStreamText("");
    setCurrentTool(null);
    setError(null);

    const token = authStorage.getToken();
    const query = new URLSearchParams({
      budget_uah: params.budget_uah.toString(),
      ...(params.workouts !== undefined && { workouts: params.workouts.toString() }),
      ...(params.sex && { sex: params.sex }),
      ...(params.age && { age: params.age.toString() }),
      ...(params.note && { note: params.note }),
      ...(params.fridge && { fridge: params.fridge }),
      ...(params.target_weight && { target_weight: params.target_weight.toString() }),
      ...(params.plan_id && { plan_id: params.plan_id }),
    }).toString();

    try {
      await fetchEventSource(`${API_BASE_URL}/plan/stream?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onmessage(ev) {
          try {
            const data = JSON.parse(ev.data);

            if (data.type === "tool_call") {
              setCurrentTool({ tool: data.tool, args: data.args });
            }

            if (data.type === "token") {
              setStreamText((prev) => prev + data.text);
            }

            if (data.type === "plan") {
              setFinalPlan(data);
              onComplete?.(data);
            }
          } catch (err) {
            console.error("Ошибка парсинга SSE сообщения:", err);
          }
        },
        onerror(err) {
          setError("Помилка з'єднання зі стрімом");
          setIsStreaming(false);
          throw err; // прерывает ретраи
        },
        onclose() {
          setIsStreaming(false);
        },
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setIsStreaming(false);
    }
  };

  return {
    isStreaming,
    streamText,
    currentTool,
    finalPlan,
    error,
    startStream,
  };
};