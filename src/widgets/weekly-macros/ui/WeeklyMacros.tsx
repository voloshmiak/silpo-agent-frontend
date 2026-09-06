import React, { useState } from "react";
import { Card, Progress, Button } from "@/shared/ui";
import type { DailyMacroSummary } from "@/entities/meal";

interface Props {
  macros: DailyMacroSummary;
  onRefreshClick?: () => void;
  onPhotoClick?: () => void;
}

export const WeeklyMacros: React.FC<Props> = ({
  macros,
  onRefreshClick,
  onPhotoClick,
}) => {
  const [activeDay, setActiveDay] = useState("ПН");

  const days = [
    { day: "ПН", cal: 1980, note: "СИЛОВІ" },
    { day: "ВТ", cal: 1760, note: "КАРДІО" },
    { day: "СР", cal: 1640, note: "ВІДПОЧИНОК" },
    { day: "ЧТ", cal: 1980, note: "СИЛОВІ" },
    { day: "ПТ", cal: 1640, note: "ВІДПОЧИНОК" },
    { day: "СБ", cal: 2040, note: "СИЛОВІ" },
    { day: "НД", cal: 1600, note: "ВІДПОЧИНОК" },
  ];

  const macroCards = [
    {
      title: "КАЛОРІЇ",
      current: macros.calories.current,
      target: macros.calories.target,
      unit: "",
      progress: (macros.calories.current / macros.calories.target) * 100,
    },
    {
      title: "БІЛКИ",
      current: macros.protein.current,
      target: macros.protein.target,
      unit: "г",
      progress: (macros.protein.current / macros.protein.target) * 100,
    },
    {
      title: "ВУГЛЕВОДИ",
      current: macros.carbs.current,
      target: macros.carbs.target,
      unit: "г",
      progress: (macros.carbs.current / macros.carbs.target) * 100,
    },
    {
      title: "ЖИРИ",
      current: macros.fat.current,
      target: macros.fat.target,
      unit: "г",
      progress: (macros.fat.current / macros.fat.target) * 100,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Верхний ряд: заголовок недели и вспомогательные кнопки */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black font-mono tracking-tight uppercase text-zinc-900">
            Тиждень 12
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            8–14 вересня · схуднення · 1 780 ккал на день
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefreshClick}>
            ↻ Оновити залишки
          </Button>
          <Button variant="outline" size="sm" onClick={onPhotoClick}>
            ⧉ Фото холодильника
          </Button>
        </div>
      </div>

      {/* Селектор дней недели */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((item) => {
          const isSelected = activeDay === item.day;
          return (
            <button
              key={item.day}
              type="button"
              onClick={() => setActiveDay(item.day)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#D2F832] border-black text-black shadow-sm scale-[1.02]"
                  : "bg-[#ECE8DC] border-[#D8D2C2] text-zinc-700 hover:border-zinc-400"
              }`}
            >
              <span className="text-xs font-mono font-black">{item.day}</span>
              <span className="font-mono font-bold text-sm mt-0.5">{item.cal}</span>
              <span className="text-[8px] font-mono tracking-tight text-zinc-500 uppercase mt-0.5">
                {item.note}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4 карточки КБЖУ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {macroCards.map((m) => (
          <Card key={m.title} className="p-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                {m.title}
              </span>
              <div className="text-2xl font-mono font-black text-zinc-900 mt-1">
                {m.current} {m.unit}
              </div>
              <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                ціль {m.target} {m.unit} · {Math.round(m.progress)}%
              </div>
            </div>
            <Progress value={m.progress} className="mt-3 h-1.5" />
          </Card>
        ))}
      </div>
    </div>
  );
};