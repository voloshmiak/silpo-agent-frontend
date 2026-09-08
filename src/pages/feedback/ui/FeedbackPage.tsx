import React, { useEffect, useMemo, useState } from "react";
import { DishRatingWidget, type MealFeedbackItem } from "@/widgets/dish-rating-widget";
import { AgentDecisionWidget } from "@/widgets/agent-decision-widget";
import { Card } from "@/shared/ui";
import { getPlans, getToken, PLAN_MEAL_SLOTS, type PlanRecord } from "@/shared/api";
import { parsePlanContent, type PlanData } from "@/entities/plan";
import { FeedbackSkeleton } from "./FeedbackSkeleton";

/** Унікальні страви тижня: одна й та сама назва часто повторюється по днях. */
function collectMeals(plan: PlanData): MealFeedbackItem[] {
  const byTitle = new Map<string, MealFeedbackItem>();

  for (const day of plan.days) {
    for (const slot of PLAN_MEAL_SLOTS) {
      const meal = day[slot];
      if (!meal?.title) continue;

      const existing = byTitle.get(meal.title);
      if (existing) {
        existing.cookedTimes += 1;
      } else {
        byTitle.set(meal.title, {
          id: `${slot}-${byTitle.size}`,
          title: meal.title,
          cookedTimes: 1,
        });
      }
    }
  }

  return [...byTitle.values()].sort((a, b) => b.cookedTimes - a.cookedTimes);
}

function weekLabel(record: PlanRecord | null): string {
  if (!record) return "тижня";
  const date = new Date(record.created_at);
  if (Number.isNaN(date.getTime())) return "тижня";
  return `тижня від ${date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" })}`;
}

export const FeedbackPage: React.FC = () => {
  const [record, setRecord] = useState<PlanRecord | null>(null);
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;

    getPlans(1, 0)
      .then(([latest]) => {
        if (!latest) return;
        setRecord(latest);
        setPlan(parsePlanContent(latest.content));
      })
      .catch(() => {
        // плану немає або бек недоступний — покажемо порожній стан
      })
      .finally(() => setIsLoading(false));
  }, []);

  const meals = useMemo(() => (plan ? collectMeals(plan) : []), [plan]);

  if (isLoading) {
    return <FeedbackSkeleton />;
  }

  return (
    <div className="max-w-6xl w-full mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black font-mono tracking-tight uppercase text-zinc-900">
          Фідбек за {weekLabel(record)}
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Ваші відповіді тренують персональну модель харчування
        </p>
      </div>

      {meals.length === 0 ? (
        <Card className="p-8 text-center space-y-2 max-w-lg mx-auto">
          <h2 className="text-lg font-black font-mono uppercase tracking-tight">
            Немає що оцінювати
          </h2>
          <p className="text-xs text-zinc-500">
            Згенеруйте тижневий план — і страви з нього зʼявляться тут для оцінки.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <DishRatingWidget meals={meals} weekLabel={weekLabel(record)} />
          </div>

          <div className="lg:col-span-1">
            <AgentDecisionWidget />
          </div>
        </div>
      )}
    </div>
  );
};
