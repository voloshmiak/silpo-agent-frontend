import React from "react";
import { Card } from "@/shared/ui";
import  { type MealItem, MealRow } from "@/entities/meal";

interface Props {
  meals: MealItem[];
  onToggleComplete?: (id: string) => void;
}

export const MealTimeline: React.FC<Props> = ({ meals, onToggleComplete }) => {
  const completedCount = meals.filter((m) => m.isCompleted).length;

  return (
    <Card className="p-6 space-y-5">
      {/* Заголовок таймлайна */}
      <div className="flex justify-between items-baseline">
        <h2 className="text-sm font-mono font-black uppercase tracking-wider text-zinc-900">
          Понеділок · Силове о 19:00
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
          />
        ))}
      </div>

      {/* Блок рекомендации агента */}
      <div className="bg-[#DFDACB]/60 border border-[#D8D2C2] p-4 rounded-xl flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-zinc-900">
            Агент додав 60 г вуглеводів о 17:30
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">
            За 90 хвилин до силового — щоб вистачило на підходи
          </div>
        </div>
        <span className="bg-[#D2F832] border border-black/30 font-mono text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
          Авто
        </span>
      </div>
    </Card>
  );
};