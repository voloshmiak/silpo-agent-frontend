export type MealType = "СНІДАНОК" | "ОБІД" | "ПЕРЕКУС" | "ВЕЧЕРЯ";

export interface MealItem {
  id: string;
  time: string;
  type: MealType;
  title: string;
  /** Склад страви з плану агента: ["вівсянка 80г", "молоко 200мл"] */
  items?: string[];
  cookingTimeMinutes?: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  isCompleted: boolean;
  iconType?: "bowl" | "meat" | "milk" | "pancake";
  note?: string; // наприклад: "ПЕРЕД ТРЕНУВАННЯМ" або "ПІСЛЯ ТРЕНУВАННЯ"
}

export interface DailyMacroSummary {
  calories: { current: number; target: number };
  protein: { current: number; target: number };
  carbs: { current: number; target: number };
  fat: { current: number; target: number };
}

export interface RatedMealItem {
  id: string;
  title: string;
  cookedTimes: number;
  cookingTimeMinutes: number;
}