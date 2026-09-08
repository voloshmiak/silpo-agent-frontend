import React, { useState } from "react";
import { Button } from "@/shared/ui";
import { useAuthUser } from "@/entities/user";
import { usePlanGeneration } from "@/features/generate-plan";
import type { ParsedPlanContent } from "@/entities/plan";
import { ONBOARDING_STEPS, useOnboardingForm } from "../model/useOnboardingForm";
import { StepGoal } from "./steps/StepGoal";
import { StepPhysical } from "./steps/StepPhysical";
import { StepDiet } from "./steps/StepDiet";
import { StepTraining } from "./steps/StepTraining";
import { StepBudget } from "./steps/StepBudget";

interface Props {
  onComplete: (plan: ParsedPlanContent) => void;
}

function buildNote(data: ReturnType<typeof useOnboardingForm>["data"]): string {
  const parts: string[] = [];
  if (data.dietType !== "Без обмежень") parts.push(`тип харчування: ${data.dietType}`);
  if (data.allergens.length) parts.push(`алергія: ${data.allergens.join(", ")}`);
  if (data.stopProducts.length) parts.push(`не їсти: ${data.stopProducts.join(", ")}`);
  if (data.note.trim()) parts.push(data.note.trim());
  return parts.join("; ");
}

export const OnboardingPage: React.FC<Props> = ({ onComplete }) => {
  const { step, data, update, goNext, goBack, canProceed, isLastStep } = useOnboardingForm();
  const { registerUser, updateProfile } = useAuthUser();
  const { status, toolEvents, generate, error } = usePlanGeneration();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitting = status === "streaming";

  const handlePrimaryAction = async () => {
    if (!isLastStep) {
      goNext();
      return;
    }

    setSubmitError(null);
    try {
      await registerUser(data.name.trim());
      await updateProfile({
        name: data.name.trim(),
        weight: Number(data.currentWeightKg),
        height: Number(data.heightCm),
      });

      const plan = await generate({
        budgetUah: Number(data.budgetUah),
        workouts: data.weeklyWorkoutsCount,
        sex: data.gender === "чол." ? "male" : "female",
        age: Number(data.age),
        note: buildNote(data),
        targetWeight: Number(data.targetWeightKg),
      });

      onComplete(plan);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Щось пішло не так");
    }
  };

  const steps = [
    <StepGoal data={data} update={update} />,
    <StepPhysical data={data} update={update} />,
    <StepDiet data={data} update={update} />,
    <StepTraining data={data} update={update} />,
    <StepBudget data={data} update={update} />,
  ];

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-[#F4F1E8] text-zinc-900 flex items-center justify-center font-sans p-6">
        <div className="max-w-md w-full bg-[#ECE8DC] border border-[#D8D2C2] rounded-2xl p-8 text-center space-y-5">
          <h2 className="text-xl font-black font-mono uppercase">Агент будує ваш план…</h2>
          <p className="text-xs text-zinc-500">Це займе трохи часу — читаємо каталог «Сільпо» й рахуємо БЖВ</p>
          <div className="space-y-2 text-left max-h-52 overflow-y-auto">
            {toolEvents.map((event, idx) => (
              <div
                key={idx}
                className="text-[11px] font-mono bg-[#DFDACB]/60 border border-[#D8D2C2] rounded-lg px-3 py-2 text-zinc-700"
              >
                {event.tool}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1E8] text-zinc-900 flex items-center justify-center font-sans p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <span className="font-mono tracking-[0.25em] text-sm font-semibold uppercase text-zinc-900">
            SILPOFIT
          </span>
        </div>

        {/* Прогресс по шагам */}
        <div className="flex gap-1.5">
          {ONBOARDING_STEPS.map((label, idx) => (
            <div
              key={label}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                idx <= step ? "bg-[#D2F832]" : "bg-[#D8D2C2]"
              }`}
            />
          ))}
        </div>

        <div className="bg-[#ECE8DC] border border-[#D8D2C2] rounded-2xl p-7">
          <div className="mb-6">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Крок {step + 1} з {ONBOARDING_STEPS.length}
            </span>
            <h1 className="text-2xl font-black font-mono uppercase tracking-tight mt-1">
              {ONBOARDING_STEPS[step]}
            </h1>
          </div>

          {steps[step]}

          {(submitError || error) && (
            <p className="text-xs text-[#FF5C00] font-semibold mt-4">{submitError ?? error}</p>
          )}

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <Button variant="outline" onClick={goBack} disabled={isSubmitting}>
                ← Назад
              </Button>
            )}
            <Button
              variant="lime"
              className="flex-1"
              disabled={!canProceed || isSubmitting}
              onClick={handlePrimaryAction}
            >
              {isLastStep ? "Згенерувати →" : "Далі →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
