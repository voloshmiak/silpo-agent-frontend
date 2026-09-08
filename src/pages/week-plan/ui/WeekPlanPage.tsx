import React, { useEffect, useState } from "react";
import { WeeklyMacros } from "@/widgets/weekly-macros";
import { MealTimeline } from "@/widgets/meal-timeline";
import { CartSummary } from "@/widgets/cart-summary";
import { SimpleMarkdown, Card } from "@/shared/ui";
import { mockMealItems, mockDailyMacros, type MealItem } from "@/entities/meal";
import { mockCartData, type CartData } from "@/entities/cart";
import { useUserProfile } from "@/entities/user";
import { getPlans, type PlanRecord } from "@/shared/api";
import { parsePlanContent, type ParsedPlanContent } from "@/entities/plan";
import { usePlanGeneration } from "@/features/generate-plan";

interface Props {
  initialPlan?: ParsedPlanContent | null;
}

function planToCartData(plan: ParsedPlanContent): CartData {
  const items = plan.cartItems.map((item) => ({
    id: item.id,
    title: item.name,
    brand: "СІЛЬПО",
    weightVolume: "",
    count: 1,
    price: item.price,
  }));
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return {
    items,
    totalPrice,
    discountSaved: 0,
    budgetLimit: totalPrice,
    deliveryTimeSlot: "18:00–20:00",
  };
}

export const WeekPlanPage: React.FC<Props> = ({ initialPlan }) => {
  const [meals, setMeals] = useState<MealItem[]>(mockMealItems);
  const [macros] = useState(mockDailyMacros);
  const [cart] = useState(mockCartData);
  const { profile } = useUserProfile();

  const [planRecord, setPlanRecord] = useState<PlanRecord | null>(null);
  const [plan, setPlan] = useState<ParsedPlanContent | null>(initialPlan ?? null);
  const { generate, status: regenStatus, error: regenError } = usePlanGeneration();

  useEffect(() => {
    if (initialPlan) return;

    getPlans(1, 0)
      .then(([latest]) => {
        if (!latest) return;
        setPlanRecord(latest);
        setPlan(parsePlanContent(latest.content));
      })
      .catch(() => {
        // не авторизовано або бек недоступний — лишаємось на демо-даних
      });
  }, [initialPlan]);

  const handleToggleMeal = (id: string) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isCompleted: !m.isCompleted } : m))
    );
  };

  const handleRegenerate = async (reason: string) => {
    try {
      const result = await generate({
        budgetUah: profile.budget.weeklyLimit,
        workouts: profile.schedule.weeklyWorkoutsCount,
        sex: profile.physical.gender === "чол." ? "male" : "female",
        age: profile.physical.age,
        note: reason,
        targetWeight: profile.physical.targetWeightKg,
        planId: planRecord?.id,
      });
      setPlan(result);
    } catch {
      // помилка вже збережена в regenError хука і показується нижче
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto p-8 space-y-6">
      <WeeklyMacros
        macros={macros}
        onRefreshClick={() => alert("Залишки оновлено")}
        onRegenerate={handleRegenerate}
        isRegenerating={regenStatus === "streaming"}
      />

      {regenStatus === "error" && regenError && (
        <p className="text-xs text-[#FF5C00] font-semibold">{regenError}</p>
      )}

      {plan && (
        <Card className="p-6">
          <h2 className="text-xs font-mono font-bold tracking-widest uppercase mb-4">
            План від агента
          </h2>
          <SimpleMarkdown text={plan.answer} />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <MealTimeline meals={meals} onToggleComplete={handleToggleMeal} />
        </div>

        <div className="lg:col-span-1">
          <CartSummary
            cart={plan ? planToCartData(plan) : cart}
            onOrderSuccess={() => console.log("Замовлення успішно відправлено!")}
          />
        </div>
      </div>
    </div>
  );
};
