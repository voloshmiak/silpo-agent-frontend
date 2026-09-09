import type { UserSettings, UserSettingsPayload } from "@/shared/api";
import type { DayOfWeek, UserProfile, WorkoutScheduleItem, WorkoutType } from "./types";
import { toDietType, toPromoPriority } from "./vocabulary";

export const WEEK_DAYS: DayOfWeek[] = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "НД"];

/** Темп зміни ваги за замовчуванням, поки користувач не задав власний. */
const PACE_BY_FOCUS: Record<string, number> = {
  "Схуднення": -0.5,
  "Набір маси": 0.3,
  "Підтримка форми": 0,
};

export function defaultPaceForFocus(focus: string): number {
  return PACE_BY_FOCUS[focus] ?? 0;
}

function toWorkoutType(raw: string | undefined): WorkoutType {
  const value = (raw ?? "").trim().toLowerCase();
  if (value.startsWith("кардіо") || value.startsWith("кардио")) return "КАРДІО";
  if (value) return "СИЛОВІ";
  return "—";
}

/** Мапа днів із контракту → всі 7 днів для картки розкладу. */
export function scheduleFromMap(map: Record<string, string>): WorkoutScheduleItem[] {
  return WEEK_DAYS.map((day) => {
    const type = toWorkoutType(map[day]);
    return { day, type, isActive: type !== "—" };
  });
}

/** workouts_per_week має збігатися з кількістю активних днів у розкладі. */
export function countWorkouts(days: WorkoutScheduleItem[]): number {
  return days.filter((item) => item.isActive).length;
}

/** Назад у контракт потрапляють лише активні дні — так само, як їх віддає бекенд. */
export function scheduleToMap(days: WorkoutScheduleItem[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const item of days) {
    if (item.isActive && item.type !== "—") map[item.day] = item.type.toLowerCase();
  }
  return map;
}

export function settingsToProfile(settings: UserSettings): UserProfile {
  return {
    id: settings.user_id,
    physical: {
      currentWeightKg: settings.weight,
      targetWeightKg: settings.target_weight,
      heightCm: settings.height,
      age: settings.age,
      gender: settings.sex === "жін." ? "жін." : "чол.",
      focus: settings.focus,
      paceKgPerWeek: settings.weekly_pace,
      updatedAt: formatUpdatedAt(settings.updated_at),
    },
    schedule: {
      days: scheduleFromMap(settings.workout_schedule ?? {}),
      skipWorkoutToday: settings.missed_workout_today,
      weeklyWorkoutsCount: settings.workouts_per_week,
    },
    dietaryRestrictions: {
      allergens: settings.allergens ?? [],
      stopProducts: settings.excluded_products ?? [],
      dietType: toDietType(settings.diet_type),
    },
    budget: {
      weeklyLimit: settings.weekly_budget,
      promotionsPriority: toPromoPriority(settings.promo_priority),
      deliveryIncluded: settings.delivery_included,
    },
  };
}

export function profileToSettings(profile: UserProfile): UserSettingsPayload {
  return {
    weight: profile.physical.currentWeightKg,
    target_weight:
      profile.physical.focus === "Підтримка форми"
        ? profile.physical.currentWeightKg
        : profile.physical.targetWeightKg,
    height: profile.physical.heightCm,
    age: profile.physical.age,
    sex: profile.physical.gender,
    focus: profile.physical.focus,
    weekly_pace: profile.physical.paceKgPerWeek,
    workouts_per_week: profile.schedule.weeklyWorkoutsCount,
    workout_schedule: scheduleToMap(profile.schedule.days),
    missed_workout_today: profile.schedule.skipWorkoutToday,
    allergens: profile.dietaryRestrictions.allergens,
    excluded_products: profile.dietaryRestrictions.stopProducts,
    diet_type: profile.dietaryRestrictions.dietType,
    weekly_budget: profile.budget.weeklyLimit,
    promo_priority: profile.budget.promotionsPriority,
    delivery_included: profile.budget.deliveryIncluded,
  };
}

/** ISO-дата з бекенду → плашка «ОНОВЛЕНО …». */
export function formatUpdatedAt(iso: string): string {
  const updated = new Date(iso);
  if (Number.isNaN(updated.getTime())) return "щойно";

  const days = Math.floor((Date.now() - updated.getTime()) / 86_400_000);
  if (days <= 0) return "сьогодні";
  if (days === 1) return "вчора";
  if (days < 5) return `${days} дні тому`;
  return `${days} днів тому`;
}
