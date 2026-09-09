import React, { useState } from "react";
import { Button } from "@/shared/ui";
import { PlanGenerationLoader, usePlanGeneration } from "@/features/generate-plan";
import type { PlanData } from "@/entities/plan";
import { ONBOARDING_STEPS, useOnboardingForm, workoutsPerWeek } from "../model/useOnboardingForm";
import { StepGoal } from "./steps/StepGoal";
import { StepPhysical } from "./steps/StepPhysical";
import { StepDiet } from "./steps/StepDiet";
import { StepTraining } from "./steps/StepTraining";
import { StepBudget } from "./steps/StepBudget";
import { StepSilpo } from "./steps/StepSilpo";
import { saveSilpoToken } from "@/shared/api/users";
import { updateSettings } from "@/shared/api";
import { defaultPaceForFocus, scheduleToMap } from "@/entities/user";

interface Props {
  registerUser: (name: string) => Promise<unknown>;
  onGenerationStarted: () => void;
  onComplete: (plan: PlanData) => void;
}

export const OnboardingPage: React.FC<Props> = ({
  registerUser,
  onGenerationStarted,
  onComplete,
}) => {
  const { step, data, update, goNext, goBack, canProceed, isLastStep } = useOnboardingForm();
  const { status, currentStep, generate, error } = usePlanGeneration();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isSubmitting = status === "streaming";

  const handlePrimaryAction = async () => {
    if (!isLastStep) {
      goNext();
      return;
    }

    setSubmitError(null);
    try {
      const userName = data.name.trim() || "Користувач";
      onGenerationStarted();

      // 1. Створюємо юзера та записуємо JWT
      await registerUser(userName);

      // 2. Зберігаємо параметри та обмеження — усі 4 блоки екрана профілю
      //    (зріст і вага теж живуть тут, окремого PUT /users/me більше немає)
      await updateSettings({
        weight: Number(data.currentWeightKg) || 75,
        target_weight:
          Number(data.targetWeightKg) || Number(data.currentWeightKg) || 75,
        height: Number(data.heightCm) || 180,
        age: Number(data.age) || 25,
        sex: data.gender,
        focus: data.focus,
        weekly_pace: defaultPaceForFocus(data.focus),
        workouts_per_week: workoutsPerWeek(data),
        workout_schedule: scheduleToMap(data.workoutDays),
        missed_workout_today: false,
        allergens: data.allergens,
        excluded_products: data.stopProducts,
        diet_type: data.dietType,
        weekly_budget: Number(data.budgetUah) || 2000,
        promo_priority: "Високий",
        delivery_included: true,
      });

      // 3. Зберігаємо токен Сільпо, отриманий на кроці входу (критично перед генерацією)
      await saveSilpoToken(data.silpoAccessToken, data.silpoRefreshToken || undefined);

      // 4. Запускаємо SSE-потік генерації плану. Профіль, бюджет, тренування
      //    та обмеження бекенд візьме з налаштувань, збережених на кроці 2 —
      //    звідси їде лише те, чого в них немає: побажання вільним текстом.
      const plan = await generate({ note: data.note.trim() });

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
    <StepSilpo data={data} update={update} />,
  ];

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-[#F4F1E8] text-zinc-900 flex items-center justify-center font-sans p-6">
        <PlanGenerationLoader step={currentStep} />
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
