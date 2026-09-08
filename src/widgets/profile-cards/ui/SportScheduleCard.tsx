import React from "react";
import type { UserProfile, WorkoutType } from "@/entities/user";

/** Клік по дню перемикає тип тренування по колу. */
const NEXT_TYPE: Record<WorkoutType, WorkoutType> = {
  "—": "СИЛОВІ",
  "СИЛОВІ": "КАРДІО",
  "КАРДІО": "—",
};

interface Props {
  schedule: UserProfile["schedule"];
  onChange: (schedule: UserProfile["schedule"]) => void;
}

export const SportScheduleCard: React.FC<Props> = ({ schedule, onChange }) => {
  const toggleSkip = () => {
    onChange({ ...schedule, skipWorkoutToday: !schedule.skipWorkoutToday });
  };

  const cycleDay = (day: string) => {
    const days = schedule.days.map((item) => {
      if (item.day !== day) return item;
      const type = NEXT_TYPE[item.type];
      return { ...item, type, isActive: type !== "—" };
    });
    // workouts_per_week має збігатися з кількістю днів у розкладі
    onChange({
      ...schedule,
      days,
      weeklyWorkoutsCount: days.filter((item) => item.isActive).length,
    });
  };

  return (
    <section className="bg-[#EBE7DC] border border-[#D8D2C2] rounded-xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-xs font-mono font-bold tracking-widest uppercase">
            Спортивний режим
          </h2>
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            {schedule.weeklyWorkoutsCount} заняття на тиждень
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 mb-6">
          {schedule.days.map((item) => (
            <button
              key={item.day}
              type="button"
              onClick={() => cycleDay(item.day)}
              title="Змінити тип тренування"
              className={`flex flex-col items-center justify-center py-2.5 rounded-lg border select-none cursor-pointer transition-colors ${
                item.isActive
                  ? "bg-[#DFDACB] border-zinc-500 text-zinc-900 hover:border-black"
                  : "border-[#D8D2C2] text-zinc-400 opacity-60 hover:opacity-100"
              }`}
            >
              <span className="text-xs font-mono font-bold">{item.day}</span>
              <span className="text-[8px] font-mono tracking-tighter mt-1">
                {item.type}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#DFDACB]/60 p-4 rounded-lg flex items-center justify-between border border-[#D8D2C2]">
        <div>
          <p className="text-xs font-bold text-zinc-800">
            Пропустив тренування сьогодні
          </p>
          <p className="text-[11px] text-zinc-500">
            Агент прибере вуглеводи й перерахує кошик
          </p>
        </div>

        <button
          type="button"
          onClick={toggleSkip}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
            schedule.skipWorkoutToday ? "bg-[#FF5C00]" : "bg-zinc-300"
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              schedule.skipWorkoutToday ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </section>
  );
};