import React, { useState } from "react";
import { Card, Badge } from "@/shared/ui";
import { DishRatingGroup, type RatingScore } from "@/features/rate-dish";
import { FeedbackTagsSelector } from "@/features/select-feedback-tags";
import { saveFeedback } from "@/shared/api";

export interface MealFeedbackItem {
  id: string;
  title: string;
  /** Скільки разів страва зустрічається в тижневому плані */
  cookedTimes: number;
}

const availableTagsList = [
  "Занадто складно готувати",
  "Не встигав зʼїсти",
  "Мало білка",
  "Багато мити посуду",
  "Набридла курка",
  "Хочу більше перекусів",
];

interface Props {
  meals: MealFeedbackItem[];
  weekLabel: string;
  planId: string;
}

export const DishRatingWidget: React.FC<Props> = ({ meals, weekLabel, planId }) => {
  const [ratings, setRatings] = useState<Record<string, RatingScore>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRatingChange = (id: string, score: RatingScore) => {
    setRatings((prev) => ({ ...prev, [id]: score }));
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      await saveFeedback({
        plan_id: planId,
        dish_ratings: meals
          .filter((meal) => ratings[meal.id])
          .map((meal) => ({
            id: meal.id,
            title: meal.title,
            cookedTimes: meal.cookedTimes,
            rating: ratings[meal.id] === "good" ? "good" : "bad",
          })),
        tags: selectedTags,
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося зберегти фідбек");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Секция 1: Оценка блюд */}
      <div>
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-900">
            Оцініть страви {weekLabel}
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            {meals.length} позицій
          </span>
        </div>

        <div className="space-y-2">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-[#DFDACB]/40 border border-[#D8D2C2] p-3.5 rounded-xl flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-xs font-bold text-zinc-900">{meal.title}</h3>
                <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                  У плані {meal.cookedTimes}× на тиждень
                </div>
              </div>

              <DishRatingGroup
                dishId={meal.id}
                value={ratings[meal.id]}
                onChange={handleRatingChange}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Секция 2: Теги замечаний */}
      <div className="pt-4 border-t border-[#D8D2C2]">
        <div className="flex justify-between items-baseline mb-3">
          <h3 className="text-xs font-mono font-bold uppercase text-zinc-900">
            Що було не так? (швидкі теги)
          </h3>
          <Badge variant="outline">Мультивибір</Badge>
        </div>

        <FeedbackTagsSelector
          availableTags={availableTagsList}
          selectedTags={selectedTags}
          onToggleTag={handleToggleTag}
        />
      </div>
      <div className="pt-4 border-t border-[#D8D2C2] flex items-center justify-between gap-3">
        {error && <p className="text-xs text-[#FF5C00] font-semibold">{error}</p>}
        {saved && !error && <p className="text-xs text-[#2E7D32] font-semibold">Фідбек збережено</p>}
        <button type="button" onClick={handleSave} disabled={isSaving || Object.keys(ratings).length === 0} className="ml-auto rounded-lg border border-black bg-[#D2F832] px-4 py-2 text-[11px] font-mono font-bold uppercase disabled:opacity-50">
          {isSaving ? "Збереження..." : "Зберегти фідбек"}
        </button>
      </div>
    </Card>
  );
};