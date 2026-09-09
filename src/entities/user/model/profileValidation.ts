import type { UserProfile } from "./types";

export const PROFILE_WEIGHT_RANGE = { min: 35, max: 250 } as const;
export const PROFILE_HEIGHT_RANGE = { min: 120, max: 250 } as const;
export const PROFILE_AGE_RANGE = { min: 13, max: 100 } as const;

type PhysicalData = UserProfile["physical"];

export function getPhysicalFieldError(
  field: keyof Pick<PhysicalData, "currentWeightKg" | "targetWeightKg" | "heightCm" | "age">,
  data: PhysicalData
): string | undefined {
  const value = data[field];

  if (field === "currentWeightKg" || field === "targetWeightKg") {
    if (value < PROFILE_WEIGHT_RANGE.min || value > PROFILE_WEIGHT_RANGE.max) {
      return `Вага має бути від ${PROFILE_WEIGHT_RANGE.min} до ${PROFILE_WEIGHT_RANGE.max} кг`;
    }
    if (data.focus === "Схуднення" && data.targetWeightKg >= data.currentWeightKg) {
      return "Для схуднення цільова вага має бути меншою за поточну";
    }
    if (data.focus === "Набір маси" && data.targetWeightKg <= data.currentWeightKg) {
      return "Для набору маси цільова вага має бути більшою за поточну";
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
    getPhysicalFieldError("age", data)
  );
}