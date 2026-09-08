export interface BackendUser {
  id: string;
  name: string;
  weight: number;
  height: number;
  created_at: string;
}

export type DayOfWeek = "ПН" | "ВТ" | "СР" | "ЧТ" | "ПТ" | "СБ" | "НД";
export type WorkoutType = "СИЛОВІ" | "КАРДІО" | "—";

export interface WorkoutScheduleItem {
  day: DayOfWeek;
  type: WorkoutType;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  physical: {
    currentWeightKg: number;
    targetWeightKg: number;
    heightCm: number;
    age: number;
    gender: "чол." | "жін.";
    focus: string;
    paceKgPerWeek: number;
    updatedAt: string;
  };
  schedule: {
    days: WorkoutScheduleItem[];
    skipWorkoutToday: boolean;
    weeklyWorkoutsCount: number;
  };
  dietaryRestrictions: {
    allergens: string[];
    stopProducts: string[];
    dietType: string;
  };
  budget: {
    weeklyLimit: number;
    averageSpent8Weeks: number;
    promotionsPriority: "Високий" | "Середній" | "Низький";
    deliveryIncluded: boolean;
  };
}