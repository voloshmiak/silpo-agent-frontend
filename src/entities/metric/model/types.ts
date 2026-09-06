export interface WeightHistoryPoint {
  week: string; // "T1", "T4", "T8", "T12"
  weightKg: number;
  isForecast?: boolean;
}

export interface BudgetHistoryItem {
  week: string; // "T5", "T6", ...
  actual: number;
  limit: number;
}

export interface ArchivedWeekSummary {
  weekId: string; // "Т12"
  dateRange: string; // "8–14 ВЕР"
  menuSummary: string; // "Вівсянка · Курка з булгуром · Сирники · Форель"
  spent: number;
  diff: number; // -150
  purchasedRatio: string; // "12/14 куп."
}