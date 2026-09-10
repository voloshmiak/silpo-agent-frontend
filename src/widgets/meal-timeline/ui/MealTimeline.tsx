import React from "react";
import { Card } from "@/shared/ui";
import  { type MealItem, MealRow } from "@/entities/meal";

interface Props {
  meals: MealItem[];
  title?: string;
  onToggleComplete?: (id: string) => void;
  readOnly?: boolean;
}

export const MealTimeline: React.FC<Props> = ({
  meals,
  title = "Раціон дня",
  onToggleComplete,
  readOnly = false,
}) => {
  const completedCount = meals.filter((m) => m.isCompleted).length;

  return (
    <Card className="p-6 space-y-5">
      {/* Заголовок таймлайна */}
      <div className="flex justify-between items-baseline">
        <h2 className="text-sm font-mono font-black uppercase tracking-wider text-zinc-900">
          {title}
        </h2>
        <span className="text-xs font-mono text-zinc-500 font-bold">
          {completedCount} з {meals.length} виконано
        </span>
      </div>

      {/* Список строк блюд */}
      <div className="space-y-3">
        {meals.map((meal) => (
          <MealRow
            key={meal.id}
            meal={meal}
            onToggleComplete={onToggleComplete}
            readOnly={readOnly}
          />
        ))}
      </div>

    </Card>
  );
};