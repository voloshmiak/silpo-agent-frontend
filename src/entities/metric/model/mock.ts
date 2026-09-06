import type { WeightHistoryPoint, BudgetHistoryItem, ArchivedWeekSummary } from "./types";

export const mockWeightHistory: WeightHistoryPoint[] = [
  { week: "T1", weightKg: 82.1 },
  { week: "T4", weightKg: 80.8 },
  { week: "T8", weightKg: 79.5 },
  { week: "T12", weightKg: 78.4 },
  { week: "T16", weightKg: 76.5, isForecast: true },
  { week: "T20", weightKg: 74.8, isForecast: true },
];

export const mockBudgetHistory: BudgetHistoryItem[] = [
  { week: "T5", actual: 1920, limit: 2000 },
  { week: "T6", actual: 2140, limit: 2000 },
  { week: "T7", actual: 1880, limit: 2000 },
  { week: "T8", actual: 1960, limit: 2000 },
  { week: "T9", actual: 2080, limit: 2000 },
  { week: "T10", actual: 1840, limit: 2000 },
  { week: "T11", actual: 1790, limit: 2000 },
  { week: "T12", actual: 1850, limit: 2000 },
];

export const mockArchivedWeeks: ArchivedWeekSummary[] = [
  {
    weekId: "Т12",
    dateRange: "8–14 ВЕР",
    menuSummary: "Вівсянка · Курка з булгуром · Сирники · Форель",
    spent: 1850,
    diff: -150,
    purchasedRatio: "12/14 куп.",
  },
  {
    weekId: "Т11",
    dateRange: "1–7 ВЕР",
    menuSummary: "Гречка · Яловичина з рисом · Шакшука · Творог",
    spent: 1790,
    diff: -210,
    purchasedRatio: "14/14 куп.",
  },
  {
    weekId: "Т10",
    dateRange: "25–31 СЕР",
    menuSummary: "Омлет · Індичка з кіноа · Салат з тунцем",
    spent: 1840,
    diff: -160,
    purchasedRatio: "13/15 куп.",
  },
  {
    weekId: "Т9",
    dateRange: "18–24 СЕР",
    menuSummary: "Панкейки · Лосось з овочами · Сочевичний суп",
    spent: 2080,
    diff: 80,
    purchasedRatio: "15/15 куп.",
  },
];