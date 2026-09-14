import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DishRatingWidget, type MealFeedbackItem } from "@/widgets/dish-rating-widget";
import { AgentDecisionWidget } from "@/widgets/agent-decision-widget";
import type { RatingScore } from "@/features/rate-dish";
import { PlanGenerationLoader, usePlanGeneration } from "@/features/generate-plan";
import { Card, PageError } from "@/shared/ui";
import { useLoadedData } from "@/shared/lib";
import {
  getPlans,
  saveFeedback,
  PLAN_MEAL_SLOTS,
  type FeedbackDishRating,
  type PlanRecord,
} from "@/shared/api";
import { parsePlanContent, predictNextWeek, type PlanData } from "@/entities/plan";
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

/** Неоцінені страви не надсилаємо — агенту про них сказати нічого. */
function toDishRatings(
  meals: MealFeedbackItem[],
  ratings: Record<string, RatingScore>
): FeedbackDishRating[] {
  return meals.flatMap((meal) => {
    const rating = ratings[meal.id];
    if (!rating) return [];
    return [{ id: meal.id, title: meal.title, cookedTimes: meal.cookedTimes, rating }];
  });
}

function weekLabel(record: PlanRecord | null): string {
  if (!record) return "тижня";
  const date = new Date(record.created_at);
  if (Number.isNaN(date.getTime())) return "тижня";
  return `тижня від ${date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" })}`;
}
export const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: record,
    isLoading,
    error,
    reload,
  } = useLoadedData<PlanRecord | null>(async () => (await getPlans(1, 0))[0] ?? null);

  const plan: PlanData | null = useMemo(
    () => (record ? parsePlanContent(record.content) : null),
    [record]
  );
  const meals = useMemo(() => (plan ? collectMeals(plan) : []), [plan]);

  const [ratings, setRatings] = useState<Record<string, RatingScore>>({});
  const [tags, setTags] = useState<string[]>([]);
  const [fridge, setFridge] = useState("");
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  // Скидається при будь-якій зміні відповідей, щоб не генерувати на старому фідбеку
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { generate, status, currentStep, error: generateError } = usePlanGeneration();

  const dishRatings = useMemo(() => toDishRatings(meals, ratings), [meals, ratings]);
  const hasFeedback = dishRatings.length > 0 || tags.length > 0;
  const nextWeek = predictNextWeek(record);

  const handleRatingChange = (id: string, score: RatingScore) => {
    setRatings((prev) => ({ ...prev, [id]: score }));
    setIsSaved(false);
  };

  const handleToggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    setIsSaved(false);
  };

  /** true — фідбек у базі (або зберігати нічого), false — запит упав. */
  const persistFeedback = async (): Promise<boolean> => {
    if (!record || !hasFeedback || isSaved) return true;
    setSaveError(null);
    setIsSaving(true);
    try {
      await saveFeedback({ plan_id: record.id, dish_ratings: dishRatings, tags });
      setIsSaved(true);
      return true;
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Не вдалося зберегти фідбек");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Агент читає останній фідбек сам, тож спершу він має лягти в базу — і лише
  // тоді генерація. Готовий план передаємо «Тижню» через state, як з онбордингу.
  const handleBuild = async () => {
    if (!(await persistFeedback())) return;
    try {
      const nextPlan = await generate({
        note: note.trim() || undefined,
        fridge: fridge.trim() || undefined,
        week: nextWeek?.week,
      });
      // Тиждень передаємо разом із планом: без запису з бекенду «Тиждень» інакше
      // перегенерував би план наступного тижня як поточний
      navigate("/week", { state: { plan: nextPlan, week: nextWeek?.week } });
    } catch {
      // помилка вже лежить у generateError хука і показується у віджеті
    }
  };

  // «Плану ще немає» — це порожній стан нижче, а не помилка. Сюди веде тільки
  // збій запиту, і тоді сторінка лишається скелетоном із причиною знизу.
  if (isLoading || error) {
    return (
      <>
        <FeedbackSkeleton />
        {error && <PageError message={error} onRetry={reload} />}
      </>
    );
  }

  if (status === "streaming") {
    return (
      <div className="max-w-6xl w-full mx-auto p-8 flex justify-center">
        <PlanGenerationLoader
          step={currentStep}
          title={
            nextWeek
              ? `Агент ${nextWeek.isUpdate ? "оновлює" : "будує"} тиждень ${nextWeek.number}`
              : "Агент будує новий план"
          }
          hint="Враховуємо ваші оцінки й підбираємо товари «Сільпо»"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black font-mono tracking-tight uppercase text-zinc-900">
          Фідбек за {weekLabel(record)}
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Оцінки врахуються в наступному плані
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
            <DishRatingWidget
              meals={meals}
              weekLabel={weekLabel(record)}
              ratings={ratings}
              onRatingChange={handleRatingChange}
              selectedTags={tags}
              onToggleTag={handleToggleTag}
            />
          </div>

          <div className="lg:col-span-1">
            <AgentDecisionWidget
              excludedDishes={dishRatings.filter((d) => d.rating === "bad").map((d) => d.title)}
              likedDishes={dishRatings.filter((d) => d.rating === "good").map((d) => d.title)}
              neutralDishes={dishRatings.filter((d) => d.rating === "neutral").map((d) => d.title)}
              nextWeek={nextWeek}
              tags={tags}
              fridge={fridge}
              onFridgeChange={setFridge}
              note={note}
              onNoteChange={setNote}
              onBuild={() => void handleBuild()}
              onSaveOnly={() => void persistFeedback()}
              isSaving={isSaving}
              isSaved={isSaved}
              error={saveError ?? (status === "error" ? generateError : null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
