import React, { useMemo, useState } from "react";
import { WeeklyMacros, type WeekDayOption } from "@/widgets/weekly-macros";
import { MealTimeline } from "@/widgets/meal-timeline";
import { CartSummary } from "@/widgets/cart-summary";
import { Button, Card, PageError } from "@/shared/ui";
import { useLoadedData } from "@/shared/lib";
import { useUserProfile } from "@/entities/user";
import { getPlans, type PlanRecord } from "@/shared/api";
import {
  dayFullLabel,
  dayLabel,
  parsePlanContent,
  planDayToMacros,
  planDayToMeals,
  planToCartData,
  type PlanData,
} from "@/entities/plan";
import { usePlanGeneration } from "@/features/generate-plan";
import { PlanGenerationLoader } from "@/features/generate-plan/ui/PlanGenerationLoader";
import { WeekPlanSkeleton } from "./WeekPlanSkeleton";

interface Props {
  initialPlan?: PlanData | null;
}

export const WeekPlanPage: React.FC<Props> = ({ initialPlan }) => {
  const { profile } = useUserProfile();

  // План щойно з онбордингу вже на руках — тоді запит за останнім зайвий.
  const {
    data: planRecord,
    isLoading: isLoadingRecord,
    error: loadError,
    reload,
  } = useLoadedData<PlanRecord | null>(async () =>
    initialPlan ? null : (await getPlans(1, 0))[0] ?? null
  );
  const isLoadingPlan = !initialPlan && isLoadingRecord;

  const loadedPlan = useMemo(
    () => (planRecord ? parsePlanContent(planRecord.content) : null),
    [planRecord]
  );

  const [generatedPlan, setGeneratedPlan] = useState<PlanData | null>(initialPlan ?? null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});
  const plan = generatedPlan ?? loadedPlan;
  const [renderedPlan, setRenderedPlan] = useState<PlanData | null>(plan);
  const { generate, status: regenStatus, currentStep, error: regenError } = usePlanGeneration();

  // Новий план — скидаємо вибраний день і відмітки виконання
  if (renderedPlan !== plan) {
    setRenderedPlan(plan);
    setSelectedDay(null);
    setCompletedMeals({});
  }

  const activeDay = selectedDay ?? plan?.days[0]?.day ?? "";

  const days: WeekDayOption[] = useMemo(() => {
    if (!plan) return [];
    return plan.days.map((day) => ({
      key: day.day,
      label: dayLabel(day.day),
      kcal: day.kcal,
      note: day.workout ? "ТРЕНУВАННЯ" : "ВІДПОЧИНОК",
    }));
  }, [plan]);

  const activeDayData = plan?.days.find((day) => day.day === activeDay) ?? plan?.days[0];

  const meals = useMemo(() => {
    const source = activeDayData ? planDayToMeals(activeDayData) : [];
    return source.map((meal) => ({
      ...meal,
      isCompleted: completedMeals[meal.id] ?? meal.isCompleted,
    }));
  }, [activeDayData, completedMeals]);

  const handleToggleMeal = (id: string) => {
    setCompletedMeals((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Профіль сюди більше не їде — бекенд читає його з `user_settings`. Гілка
  // `!profile` лишається як ознака того, що налаштування ще вантажаться: поки
  // їх немає, кнопка все одно заблокована.
  const handleRegenerate = async (reason: string) => {
    if (!profile) return;
    try {
      const result = await generate({
        note: reason,
        planId: planRecord?.id,
      });
      setGeneratedPlan(result);
    } catch {
      // помилка вже збережена в regenError хука і показується нижче
    }
  };

  const isRegenerating = regenStatus === "streaming";

  // Збій запиту — не те саме, що відсутній план: там пропонуємо згенерувати,
  // тут показувати нема чого, бо ми не знаємо, є план чи ні.
  if (isLoadingPlan || (loadError && !plan)) {
    return (
      <>
        <WeekPlanSkeleton />
        {loadError && <PageError message={loadError} onRetry={reload} />}
      </>
    );
  }

  // Плану ще немає (або він без днів) — показуємо порожній стан, а не демо-тиждень
  if (!plan || !activeDayData) {
    return (
      <div className="max-w-6xl w-full mx-auto p-8">
        {isRegenerating ? (
          <div className="flex justify-center py-8">
            <PlanGenerationLoader step={currentStep} />
          </div>
        ) : (
          <Card className="p-8 text-center space-y-4 max-w-lg mx-auto">
            <h2 className="text-lg font-black font-mono uppercase tracking-tight">
              Плану ще немає
            </h2>
            <p className="text-xs text-zinc-500">
              Агент побудує тиждень із раціоном і кошиком «Сільпо» на основі ваших
              параметрів та бюджету.
            </p>
            {regenStatus === "error" && regenError && (
              <p className="text-xs text-[#FF5C00] font-semibold">{regenError}</p>
            )}
            <Button
              variant="lime"
              size="lg"
              disabled={!profile}
              onClick={() => handleRegenerate("")}
            >
              {profile ? "Згенерувати план →" : "Завантажуємо параметри…"}
            </Button>
          </Card>
        )}
      </div>
    );
  }

  const macros = planDayToMacros(activeDayData, plan);
  const cart = planToCartData(plan);
  const subtitle = `ціль ${plan.targets.kcal} ккал/день · Б ${plan.targets.protein_g} · Ж ${plan.targets.fat_g} · В ${plan.targets.carbs_g}`;
  const timelineTitle = `${dayFullLabel(activeDayData.day)} · ${
    activeDayData.workout ? "тренування" : "відпочинок"
  }`;

  if (isRegenerating) {
    return (
      <div className="max-w-6xl w-full mx-auto p-8 flex justify-center">
        <PlanGenerationLoader
          step={currentStep}
          title="Агент оновлює план"
          hint="Перебираємо каталог «Сільпо» під нові умови"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full mx-auto p-8 space-y-6">
      <WeeklyMacros
        macros={macros}
        days={days}
        activeDay={activeDay}
        onDayChange={setSelectedDay}
        subtitle={subtitle}
        onRegenerate={handleRegenerate}
        isRegenerating={isRegenerating}
      />

      {regenStatus === "error" && regenError && (
        <p className="text-xs text-[#FF5C00] font-semibold">{regenError}</p>
      )}

      <PlanNotes plan={plan} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <MealTimeline
            meals={meals}
            title={timelineTitle}
            onToggleComplete={handleToggleMeal}
          />
        </div>

        <div className="lg:col-span-1">
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  );
};

/** Єдиний текстовий блок, що лишився в контракті: підсумок від агента. */
const PlanNotes: React.FC<{ plan: PlanData }> = ({ plan }) => {
  const { summary, targets } = plan;
  const hasContent =
    summary.notes || summary.restrictions.length > 0 || summary.promotions.length > 0;

  if (!hasContent) return null;

  return (
    <Card className="p-6 space-y-3">
      <div>
        <h2 className="text-xs font-mono font-bold tracking-widest uppercase">
          Коментар агента
        </h2>
      </div>

      {summary.notes && (
        <p className="text-xs text-zinc-700 leading-relaxed">{summary.notes}</p>
      )}

      {summary.restrictions.length > 0 && (
        <p className="text-[11px] text-zinc-600">
          <span className="font-mono uppercase text-zinc-500">Обмеження: </span>
          {summary.restrictions.join(", ")}
        </p>
      )}

      {summary.promotions.length > 0 && (
        <p className="text-[11px] text-zinc-600">
          <span className="font-mono uppercase text-zinc-500">Акції: </span>
          {summary.promotions.join(", ")}
        </p>
      )}

      {targets.estimated_goal_date && (
        <p className="text-[11px] font-mono text-zinc-500">
          Ціль орієнтовно до {targets.estimated_goal_date}
          {targets.estimated_weeks_to_goal
            ? ` · ${Math.round(targets.estimated_weeks_to_goal)} тиж.`
            : ""}
        </p>
      )}
    </Card>
  );
};
