import React, { useState } from "react";
import { Card, Badge } from "@/shared/ui";
import { DishRatingGroup, type RatingScore } from "@/features/rate-dish";
import { FeedbackTagsSelector } from "@/features/select-feedback-tags";

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
}

export const DishRatingWidget: React.FC<Props> = ({ meals, weekLabel }) => {
  const [ratings, setRatings] = useState<Record<string, RatingScore>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleRatingChange = (id: string, score: RatingScore) => {
    setRatings((prev) => ({ ...prev, [id]: score }));
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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
    </Card>
  );
};