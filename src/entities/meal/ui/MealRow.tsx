import React from "react";
import type { MealItem } from "../model/types";
import { Checkbox } from "@/shared/ui";

interface Props {
  meal: MealItem;
  onToggleComplete?: (id: string) => void;
}

export const MealRow: React.FC<Props> = ({ meal, onToggleComplete }) => {
  return (
    <div className="bg-[#DFDACB]/40 hover:bg-[#DFDACB]/70 border border-[#D8D2C2] p-4 rounded-xl flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        {/* Иконка-заглушка */}
        <div className="w-10 h-10 rounded-lg bg-[#D4CEBF] border border-[#C5BEAE] flex items-center justify-center font-mono text-xs text-zinc-600">
          🍽️
        </div>

        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-zinc-500 font-semibold tracking-wider">
            <span>{meal.time}</span>
            <span>·</span>
            <span>{meal.type}</span>
            {meal.note && (
              <>
                <span>·</span>
                <span className="text-[#FF5C00]">{meal.note}</span>
              </>
            )}
          </div>

          <h3 className="text-xs font-bold text-zinc-900 mt-0.5">{meal.title}</h3>

          <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-zinc-600">
            <span>Б <b className="text-zinc-900">{meal.protein} г</b></span>
            <span>Ж <b className="text-zinc-900">{meal.fat} г</b></span>
            <span>В <b className="text-zinc-900">{meal.carbs} г</b></span>
            <span className="text-zinc-400">·</span>
            <span>
              {meal.cookingTimeMinutes > 0 ? `Готувати ${meal.cookingTimeMinutes} хв` : "Без готування"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="font-mono font-bold text-sm text-zinc-900">{meal.calories}</div>
        <Checkbox
          checked={meal.isCompleted}
          onChange={() => onToggleComplete?.(meal.id)}
        />
      </div>
    </div>
  );
};