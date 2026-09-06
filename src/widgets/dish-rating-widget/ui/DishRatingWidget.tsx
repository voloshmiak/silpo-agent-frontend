import React, { useState } from "react";
import { Card, Badge } from "@/shared/ui";
import { DishRatingGroup, type RatingScore } from "@/features/rate-dish";
import { FeedbackTagsSelector } from "@/features/select-feedback-tags";

interface MealFeedbackItem {
  id: string;
  title: string;
  cookedTimes: number;
  timeMinutes: number;
  initialRating?: RatingScore;
}

const mockFeedbackMeals: MealFeedbackItem[] = [
  {
    id: "f-1",
    title: "Вівсянка на мигдалевому молоці з ягодами та чіа",
    cookedTimes: 5,
    timeMinutes: 10,
    initialRating: "good",
  },
  {
    id: "f-2",
    title: "Куряче філе з булгуром та печеними овочами",
    cookedTimes: 4,
    timeMinutes: 35,
    initialRating: "good",
  },
  {
    id: "f-3",
    title: "Сирники з вишневим соусом без цукру",
    cookedTimes: 4,
    timeMinutes: 25,
    initialRating: "good",
  },
  {
    id: "f-4",
    title: "Форель запечена з броколі та лимоном",
    cookedTimes: 2,
    timeMinutes: 40,
    initialRating: "bad",
  },
];

const availableTagsList = [
  "Занадто складно готувати",
  "Не встигав зʼїсти",
  "Мало білка",
  "Багато мити посуду",
  "Набридла курка",
  "Хочу більше перекусів",
];

export const DishRatingWidget: React.FC = () => {
  const [ratings, setRatings] = useState<Record<string, RatingScore>>({
    "f-1": "good",
    "f-2": "good",
    "f-3": "good",
    "f-4": "bad",
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Занадто складно готувати",
  ]);

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
            Оцініть страви Тижня 12
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            4 основні позиції
          </span>
        </div>

        <div className="space-y-2">
          {mockFeedbackMeals.map((meal) => (
            <div
              key={meal.id}
              className="bg-[#DFDACB]/40 border border-[#D8D2C2] p-3.5 rounded-xl flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-xs font-bold text-zinc-900">{meal.title}</h3>
                <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                  Готували {meal.cookedTimes} рази · {meal.timeMinutes} хв
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