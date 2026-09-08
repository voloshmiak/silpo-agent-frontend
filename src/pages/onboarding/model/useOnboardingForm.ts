import { useState } from "react";
import { countWorkouts, scheduleFromMap, type WorkoutScheduleItem } from "@/entities/user";

export interface OnboardingFormData {
  name: string;
  focus: string;
  targetWeightKg: number | "";
  heightCm: number | "";
  currentWeightKg: number | "";
  age: number | "";
  gender: "чол." | "жін.";
  dietType: string;
  allergens: string[];
  stopProducts: string[];
  note: string;
  workoutDays: WorkoutScheduleItem[];
  budgetUah: number | "";
  /** Токени «Сільпо», отримані на кроці входу — їдуть на бекенд перед генерацією */
  silpoAccessToken: string;
  silpoRefreshToken: string;
}

export const ONBOARDING_STEPS = [
  "Ціль",
  "Фізичні дані",
  "Дієта й обмеження",
  "Тренування",
  "Бюджет",
  "Сільпо",
] as const;

const initialData: OnboardingFormData = {
  name: "",
  focus: "Схуднення",
  targetWeightKg: "",
  heightCm: "",
  currentWeightKg: "",
  age: "",
  gender: "чол.",
  dietType: "Без обмежень",
  allergens: [],
  stopProducts: [],
  note: "",
  workoutDays: scheduleFromMap({ "ПН": "силові", "СР": "силові", "ПТ": "силові" }),
  budgetUah: 2000,
  silpoAccessToken: "",
  silpoRefreshToken: "",
};

export function isStepValid(step: number, data: OnboardingFormData): boolean {
  switch (step) {
    case 0:
      return data.name.trim().length > 0 && data.targetWeightKg !== "";
    case 1:
      return data.heightCm !== "" && data.currentWeightKg !== "" && data.age !== "";
    case 2:
      return true;
    case 3:
      return true;
    case 4:
      return data.budgetUah !== "" && Number(data.budgetUah) > 0;
    case 5:
      return data.silpoAccessToken.trim().length > 0;
    default:
      return false;
  }
}

export function workoutsPerWeek(data: OnboardingFormData): number {
  return countWorkouts(data.workoutDays);
}

export const useOnboardingForm = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingFormData>(initialData);

  const update = (partial: Partial<OnboardingFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const goNext = () => setStep((s) => Math.min(s + 1, ONBOARDING_STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return {
    step,
    data,
    update,
    goNext,
    goBack,
    canProceed: isStepValid(step, data),
    isLastStep: step === ONBOARDING_STEPS.length - 1,
  };
};
