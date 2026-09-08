import { PLAN_MEAL_SLOTS, type PlanData, type PlanDay, type PlanMealSlot } from "@/shared/api";
import type { CartData } from "@/entities/cart";
import type { DailyMacroSummary, MealItem, MealType } from "@/entities/meal";

export const DAY_LABELS: Record<string, string> = {
  monday: "ПН",
  tuesday: "ВТ",
  wednesday: "СР",
  thursday: "ЧТ",
  friday: "ПТ",
  saturday: "СБ",
  sunday: "НД",
};

export const DAY_FULL_LABELS: Record<string, string> = {
  monday: "Понеділок",
  tuesday: "Вівторок",
  wednesday: "Середа",
  thursday: "Четвер",
  friday: "П'ятниця",
  saturday: "Субота",
  sunday: "Неділя",
};

const SLOT_META: Record<PlanMealSlot, { time: string; type: MealType }> = {
  breakfast: { time: "08:00", type: "СНІДАНОК" },
  lunch: { time: "13:00", type: "ОБІД" },
  snack: { time: "17:00", type: "ПЕРЕКУС" },
  dinner: { time: "20:00", type: "ВЕЧЕРЯ" },
};

export function dayLabel(day: string): string {
  return DAY_LABELS[day] ?? day.slice(0, 2).toUpperCase();
}

export function dayFullLabel(day: string): string {
  return DAY_FULL_LABELS[day] ?? day;
}

/** Розгортає день плану у рядки таймлайну. Порожні слоти пропускаються. */
export function planDayToMeals(day: PlanDay): MealItem[] {
  return PLAN_MEAL_SLOTS.flatMap((slot) => {
    const meal = day[slot];
    if (!meal) return [];

    const { time, type } = SLOT_META[slot];
    return [
      {
        id: `${day.day}-${slot}`,
        time,
        type,
        title: meal.title,
        items: meal.items,
        calories: meal.kcal,
        protein: meal.protein_g,
        fat: meal.fat_g,
        carbs: meal.carbs_g,
        isCompleted: false,
        note: day.workout && slot === "lunch" ? "ТРЕНУВАЛЬНИЙ ДЕНЬ" : undefined,
      },
    ];
  });
}

export function planDayToMacros(day: PlanDay, plan: PlanData): DailyMacroSummary {
  const { targets } = plan;
  return {
    calories: { current: day.kcal, target: targets.kcal },
    protein: { current: day.protein_g, target: targets.protein_g },
    carbs: { current: day.carbs_g, target: targets.carbs_g },
    fat: { current: day.fat_g, target: targets.fat_g },
  };
}

export function planToCartData(plan: PlanData): CartData {
  return {
    // product_id повторюється між позиціями у відповіді агента, тож індекс
    // обов'язковий — інакше React отримає дублікати ключів
    items: plan.cart.map((item, index) => ({
      id: `${item.product_id}-${index}`,
      title: item.name,
      brand: "СІЛЬПО",
      weightVolume: item.unit ?? "",
      count: item.quantity,
      price: item.price,
      imageUrl: item.image_url,
      url: item.url,
    })),
    totalPrice: plan.summary.total_uah,
    discountSaved: 0,
    budgetLimit: plan.summary.budget_uah,
    deliveryTimeSlot: "18:00–20:00",
  };
}
