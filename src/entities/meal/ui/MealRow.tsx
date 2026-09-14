import React from "react";
import type { MealItem } from "../model/types";
import { Checkbox } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface Props {
  meal: MealItem;
  onToggleComplete?: (id: string) => void;
  readOnly?: boolean;
}

export const MealRow: React.FC<Props> = ({ meal, onToggleComplete, readOnly = false }) => {
  return (
    <div className={cn(
      "bg-[#DFDACB]/40 border border-[#D8D2C2] p-4 rounded-xl flex items-center justify-between transition-colors",
      !readOnly && "hover:bg-[#DFDACB]/70"
    )}>
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Иконка-заглушка */}
        <div className="w-10 h-10 rounded-lg bg-[#D4CEBF] border border-[#C5BEAE] flex items-center justify-center font-mono text-xs text-zinc-600 shrink-0">
          🍽️
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-mono uppercase text-zinc-500 font-semibold tracking-wider">
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

          {meal.items && meal.items.length > 0 && (
            <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
              {meal.items.join(" · ")}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[11px] font-mono text-zinc-600">
            <span className="whitespace-nowrap">Б <b className="text-zinc-900">{meal.protein} г</b></span>
            <span className="whitespace-nowrap">Ж <b className="text-zinc-900">{meal.fat} г</b></span>
            <span className="whitespace-nowrap">В <b className="text-zinc-900">{meal.carbs} г</b></span>
            {meal.cookingTimeMinutes !== undefined && (
              <>
                <span className="text-zinc-400">·</span>
                <span className="whitespace-nowrap">
                  {meal.cookingTimeMinutes > 0
                    ? `Готувати ${meal.cookingTimeMinutes} хв`
                    : "Без готування"}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div className="font-mono font-bold text-sm text-zinc-900">{meal.calories}</div>
        <Checkbox
          checked={meal.isCompleted}
          onChange={() => {
            if (!readOnly) {
              onToggleComplete?.(meal.id);
            }
          }}
          disabled={readOnly}
          className={
            readOnly
              ? "!opacity-100 !cursor-default pointer-events-none"
              : undefined
          }
        />
      </div>
    </div>
  );
};