import { useState } from "react";

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
  weeklyWorkoutsCount: number;
  budgetUah: number | "";
}

export const ONBOARDING_STEPS = [
  "Ціль",
  "Фізичні дані",
  "Дієта й обмеження",
  "Тренування",
  "Бюджет",
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
  weeklyWorkoutsCount: 3,
  budgetUah: 2000,
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
    default:
      return false;
  }
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
