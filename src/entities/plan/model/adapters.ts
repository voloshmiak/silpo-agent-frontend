import {
  PLAN_MEAL_SLOTS,
  type PlanCartItem,
  type PlanData,
  type PlanDay,
  type PlanMealSlot,
} from "@/shared/api";
import type { CartData, CartProduct } from "@/entities/cart";
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

/**
 * Одиниці, у яких виражена сама кількість позиції: 0.75 кг — це і є кількість,
 * а не «0.75 шт вагою кілограм». Усе інше — фасування («330 г», «10 шт»), і тоді
 * кількість рахується штуками.
 */
const QUANTITY_UNITS = new Set(["кг", "г", "л", "мл"]);

function describeQuantity(item: PlanCartItem): Pick<CartProduct, "weightVolume" | "countLabel"> {
  const unit = (item.unit ?? "").trim();
  if (QUANTITY_UNITS.has(unit.toLowerCase())) {
    return { weightVolume: "", countLabel: `${item.quantity} ${unit}` };
  }
  return { weightVolume: unit, countLabel: `${item.quantity} шт` };
}

export function planToCartData(plan: PlanData): CartData {
  const { summary } = plan;
  const productsTotal =
    summary.products_total_uah ?? plan.cart.reduce((sum, item) => sum + item.total_price, 0);

  return {
    // product_id повторюється між позиціями у відповіді агента, тож індекс
    // обов'язковий — інакше React отримає дублікати ключів
    items: plan.cart.map((item, index) => {
      // Ядро віддає і ціну за одиницю, і суму позиції; у рядку показується сума,
      // інакше «0.75 кг» чи «2 шт» виглядають як ціна одного кілограма чи однієї
      // банки і не сходяться з підсумком кошика.
      const discount = item.discount_uah ?? 0;
      const oldTotal = item.total_price + discount;

      return {
        id: `${item.product_id}-${index}`,
        title: item.name,
        brand: "СІЛЬПО",
        ...describeQuantity(item),
        unitPrice: item.price,
        total: item.total_price,
        oldTotal: discount > 0 ? Number(oldTotal.toFixed(2)) : undefined,
        discountPercent:
          discount > 0 && oldTotal > 0 ? Math.round((discount / oldTotal) * 100) : undefined,
        imageUrl: item.image_url,
        url: item.url,
      };
    }),
    productsTotal,
    deliveryPrice: summary.delivery_uah ?? 0,
    totalPrice: summary.total_uah,
    discountSaved: summary.discount_uah ?? 0,
    budgetLimit: summary.budget_uah,
    deliveryTimeSlot: "18:00–20:00",
  };
}
