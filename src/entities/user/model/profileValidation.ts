import type { UserProfile } from "./types";

export const PROFILE_WEIGHT_RANGE = { min: 35, max: 250 } as const;
export const PROFILE_HEIGHT_RANGE = { min: 120, max: 250 } as const;
export const PROFILE_AGE_RANGE = { min: 13, max: 100 } as const;
export const PROFILE_PACE_RANGE = { min: 0.1, max: 1.5 } as const;

type PhysicalData = UserProfile["physical"];

export function getPhysicalFieldError(
  field: keyof Pick<PhysicalData, "currentWeightKg" | "targetWeightKg" | "heightCm" | "age" | "paceKgPerWeek">,
  data: PhysicalData
): string | undefined {
  const value = data[field];

  if (field === "currentWeightKg" || field === "targetWeightKg") {
    if (value < PROFILE_WEIGHT_RANGE.min || value > PROFILE_WEIGHT_RANGE.max) {
      return `Вага має бути від ${PROFILE_WEIGHT_RANGE.min} до ${PROFILE_WEIGHT_RANGE.max} кг`;
    }
    const focus = data.focus.trim();
    if (focus === "Схуднення" && data.targetWeightKg >= data.currentWeightKg) {
      return "Для схуднення цільова вага має бути меншою за поточну";
    }
    if (focus === "Набір маси" && data.targetWeightKg <= data.currentWeightKg) {
      return "Для набору маси цільова вага має бути більшою за поточну";
    }
    return undefined;
  }

  if (field === "paceKgPerWeek") {
    const pace = data.paceKgPerWeek;
    const focus = data.focus.trim();
    if (focus === "Підтримка форми") {
      return pace === 0 ? undefined : "Для підтримання форми темп має бути 0 кг/тиж";
    }
    const isWeightLoss = focus === "Схуднення";
    const min = isWeightLoss ? -PROFILE_PACE_RANGE.max : PROFILE_PACE_RANGE.min;
    const max = isWeightLoss ? -PROFILE_PACE_RANGE.min : PROFILE_PACE_RANGE.max;
    if (pace < min || pace > max) {
      return `Темп має бути від ${min} до ${max} кг/тиж`;
    }
    return undefined;
  }

  const range = field === "heightCm" ? PROFILE_HEIGHT_RANGE : PROFILE_AGE_RANGE;
  return value < range.min || value > range.max
    ? `${field === "heightCm" ? "Зріст" : "Вік"} має бути від ${range.min} до ${range.max} ${
        field === "heightCm" ? "см" : "років"
      }`
    : undefined;
}

export function getPhysicalValidationError(data: PhysicalData): string | undefined {
  return (
    getPhysicalFieldError("currentWeightKg", data) ??
    getPhysicalFieldError("targetWeightKg", data) ??
    getPhysicalFieldError("heightCm", data) ??
    getPhysicalFieldError("age", data) ??
    getPhysicalFieldError("paceKgPerWeek", data)
  );
}