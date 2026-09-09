import type { OnboardingFormData } from "./useOnboardingForm";

export const WEIGHT_RANGE = { min: 35, max: 250 } as const;
export const HEIGHT_RANGE = { min: 120, max: 250 } as const;
export const AGE_RANGE = { min: 13, max: 100 } as const;
export const MIN_WEEKLY_BUDGET = 400;

function isInRange(value: number | "", range: { min: number; max: number }): boolean {
  return (
    value !== "" &&
    Number.isFinite(value) &&
    value >= range.min &&
    value <= range.max
  );
}

export function isValidWeight(weight: number | ""): boolean {
  return isInRange(weight, WEIGHT_RANGE);
}

export function isValidBudget(budget: number | ""): boolean {
  return budget !== "" && Number.isFinite(budget) && budget >= MIN_WEEKLY_BUDGET;
}

function getWeightGoalError(data: OnboardingFormData): string | undefined {
  if (!isValidWeight(data.targetWeightKg) || !isValidWeight(data.currentWeightKg)) {
    return undefined;
  }

  if (data.focus === "Схуднення" && data.targetWeightKg >= data.currentWeightKg) {
    return "Для схуднення цільова вага має бути меншою за поточну";
  }

  if (data.focus === "Набір маси" && data.targetWeightKg <= data.currentWeightKg) {
    return "Для набору маси цільова вага має бути більшою за поточну";
  }

  return undefined;
}

export function getFieldError(
  field: keyof OnboardingFormData,
  data: OnboardingFormData
): string | undefined {
  switch (field) {
    case "name":
      if (data.name.trim().length < 2) return "Введіть ім'я (мінімум 2 символи)";
      if (/\d/.test(data.name)) return "Ім'я не може містити цифри";
      return undefined;
    case "targetWeightKg":
      if (!isValidWeight(data.targetWeightKg)) {
        return `Вага має бути від ${WEIGHT_RANGE.min} до ${WEIGHT_RANGE.max} кг`;
      }
      return undefined;
    case "heightCm":
      return isInRange(data.heightCm, HEIGHT_RANGE)
        ? undefined
        : `Зріст має бути від ${HEIGHT_RANGE.min} до ${HEIGHT_RANGE.max} см`;
    case "currentWeightKg":
      if (!isValidWeight(data.currentWeightKg)) {
        return `Вага має бути від ${WEIGHT_RANGE.min} до ${WEIGHT_RANGE.max} кг`;
      }
      return getWeightGoalError(data);
    case "age":
      return isInRange(data.age, AGE_RANGE)
        ? undefined
        : `Вік має бути від ${AGE_RANGE.min} до ${AGE_RANGE.max} років`;
    case "budgetUah":
      return isValidBudget(data.budgetUah)
        ? undefined
        : `Мінімальний бюджет — ${MIN_WEEKLY_BUDGET} ₴ на тиждень`;
    case "silpoAccessToken":
      return data.silpoAccessToken.trim() ? undefined : "Підключіть акаунт «Сільпо»";
    default:
      return undefined;
  }
}

export function getVisibleFieldError(
  field: keyof OnboardingFormData,
  data: OnboardingFormData
): string | undefined {
  const value = data[field];
  const hasValue =
    typeof value === "string" ? value.trim().length > 0 : typeof value === "number";

  return hasValue ? getFieldError(field, data) : undefined;
}

export function isStepValid(step: number, data: OnboardingFormData): boolean {
  switch (step) {
    case 0:
      return (
        !getFieldError("name", data) &&
        (data.focus === "Підтримка форми" || !getFieldError("targetWeightKg", data))
      );
    case 1:
      return (
        !getFieldError("heightCm", data) &&
        !getFieldError("currentWeightKg", data) &&
        !getFieldError("age", data)
      );
    case 2:
    case 3:
      return true;
    case 4:
      return !getFieldError("budgetUah", data);
    case 5:
      return !getFieldError("silpoAccessToken", data);
    default:
      return false;
  }
}
