import React, { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { getPlan, type PlanRecord } from "@/shared/api";
import { useLoadedData } from "@/shared/lib";
import { PageError } from "@/shared/ui";
import { CartSummary } from "@/widgets/cart-summary";

import {
  dayLabel,
  dayFullLabel,
  parsePlanContent,
  planDayToMacros,
  planDayToMeals,
  planToCartData,
} from "@/entities/plan";

import {
  WeeklyMacros,
  type WeekDayOption,
} from "@/widgets/weekly-macros";

import { MealTimeline } from "@/widgets/meal-timeline";

export const PreviousPlanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const {
    data: planRecord,
    isLoading,
    error,
    reload,
  } = useLoadedData<PlanRecord | null>(() =>
    id ? getPlan(id) : Promise.resolve(null)
  );

  const plan = useMemo(
    () => (planRecord ? parsePlanContent(planRecord.content) : null),
    [planRecord]
  );


  if (!id) {
    return <Navigate to="/archive" replace />;
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl w-full mx-auto p-8">
        <p className="text-sm text-zinc-500">
          Завантаження плану...
        </p>
      </div>
    );
  }

  if (error) {
    return <PageError message={error} onRetry={reload} />;
  }

  if (!planRecord) {
    return (
      <div className="max-w-6xl w-full mx-auto p-8">
        <p className="text-sm text-zinc-500">
          План не знайдено
        </p>
      </div>
    );
  }

  if (!plan || plan.days.length === 0) {
    return (
      <div className="max-w-6xl w-full mx-auto p-8">
        <p className="text-sm text-zinc-500">
          Не вдалося прочитати дані плану
        </p>
      </div>
    );
  }

  const activeDay =
    selectedDay && plan.days.some((day) => day.day === selectedDay)
      ? selectedDay
      : plan.days[0].day;

  const activeDayData =
    plan.days.find((day) => day.day === activeDay) ?? plan.days[0];

  const days: WeekDayOption[] = plan.days.map((day) => ({
    key: day.day,
    label: dayLabel(day.day),
    kcal: day.kcal,
    note: day.workout ? "ТРЕНУВАННЯ" : "ВІДПОЧИНОК",
  }));

  const macros = planDayToMacros(activeDayData, plan);

  const meals = planDayToMeals(activeDayData);

  const cart = planToCartData(plan);

  const timelineTitle =
    `${dayFullLabel(activeDayData.day)} · ` +
    `${activeDayData.workout ? "тренування" : "відпочинок"}`;

  const subtitle =
    `ціль ${plan.targets.kcal} ккал/день · ` +
    `Б ${plan.targets.protein_g} · ` +
    `Ж ${plan.targets.fat_g} · ` +
    `В ${plan.targets.carbs_g}`;

  return (
    <div className="max-w-6xl w-full mx-auto p-8 space-y-6">
      <Link
        to="/archive"
        className="text-sm text-zinc-500 hover:text-zinc-900"
      >
        ← До архіву
      </Link>

      <div>
        <p className="text-xs font-mono text-zinc-500">
          {new Date(planRecord.created_at).toLocaleDateString("uk-UA")}
        </p>
      </div>

      <WeeklyMacros
        macros={macros}
        days={days}
        activeDay={activeDay}
        onDayChange={setSelectedDay}
        title="Попередній план"
        subtitle={subtitle}
        showRegenerate={false}
      />

      <MealTimeline
        meals={meals}
        title={timelineTitle}
        readOnly
      />

      <CartSummary
        cart={cart}
        showOrderButton={false}
        showDeliverySchedule={false}
      />
    </div>
  );
};