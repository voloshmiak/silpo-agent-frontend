import React from "react";
import type { WorkoutScheduleItem, WorkoutType } from "../model/types";

/** Клік по дню перемикає тип тренування по колу. */
const NEXT_TYPE: Record<WorkoutType, WorkoutType> = {
  "—": "СИЛОВІ",
  "СИЛОВІ": "КАРДІО",
  "КАРДІО": "—",
};

interface Props {
  days: WorkoutScheduleItem[];
  onChange: (days: WorkoutScheduleItem[]) => void;
}

/** Тижнева сітка тренувань — спільна для профілю та онбордингу. */
export const WorkoutDaysPicker: React.FC<Props> = ({ days, onChange }) => {
  const cycleDay = (day: string) => {
    onChange(
      days.map((item) => {
        if (item.day !== day) return item;
        const type = NEXT_TYPE[item.type];
        return { ...item, type, isActive: type !== "—" };
      })
    );
  };

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {days.map((item) => (
        <button
          key={item.day}
          type="button"
          onClick={() => cycleDay(item.day)}
          title="Змінити тип тренування"
          className={`flex flex-col items-center justify-center py-2 rounded-lg border select-none cursor-pointer transition-colors ${
            item.isActive
              ? "bg-[#DFDACB] border-zinc-500 text-zinc-900 hover:border-black"
              : "border-[#D8D2C2] text-zinc-400 opacity-60 hover:opacity-100"
          }`}
        >
          <span className="text-xs font-mono font-bold">{item.day}</span>
          <span className="text-[8px] font-mono tracking-tighter mt-1">{item.type}</span>
        </button>
      ))}
    </div>
  );
};
