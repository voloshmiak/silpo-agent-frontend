import React, { useState } from "react";
import { Card, Progress, Button } from "@/shared/ui";
import type { DailyMacroSummary } from "@/entities/meal";

export interface WeekDayOption {
  key: string;
  label: string;
  kcal: number;
  note: string;
}

interface Props {
  macros: DailyMacroSummary;
  days: WeekDayOption[];
  activeDay: string;
  onDayChange: (key: string) => void;
  title?: string;
  subtitle?: string;
  onRefreshClick?: () => void;
  onRegenerate?: (reason: string) => void;
  isRegenerating?: boolean;
}

export const WeeklyMacros: React.FC<Props> = ({
  macros,
  days,
  activeDay,
  onDayChange,
  title = "Тиждень",
  subtitle,
  onRefreshClick,
  onRegenerate,
  isRegenerating,
}) => {
  const [isReasonOpen, setIsReasonOpen] = useState(false);
  const [reason, setReason] = useState("");

  const submitRegenerate = () => {
    if (!reason.trim()) return;
    onRegenerate?.(reason.trim());
    setIsReasonOpen(false);
    setReason("");
  };

  const macroCards = [
    {
      title: "КАЛОРІЇ",
      current: macros.calories.current,
      target: macros.calories.target,
      unit: "",
    },
    {
      title: "БІЛКИ",
      current: macros.protein.current,
      target: macros.protein.target,
      unit: "г",
    },
    {
      title: "ВУГЛЕВОДИ",
      current: macros.carbs.current,
      target: macros.carbs.target,
      unit: "г",
    },
    {
      title: "ЖИРИ",
      current: macros.fat.current,
      target: macros.fat.target,
      unit: "г",
    },
  ].map((m) => ({ ...m, progress: m.target > 0 ? (m.current / m.target) * 100 : 0 }));

  return (
    <div className="space-y-6">
      {/* Верхний ряд: заголовок недели и вспомогательные кнопки */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black font-mono tracking-tight uppercase text-zinc-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-zinc-500 font-mono mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefreshClick}>
            ↻ Оновити залишки
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReasonOpen((open) => !open)}
            disabled={isRegenerating}
          >
            {isRegenerating ? "Генерація…" : "⟳ Перегенерувати"}
          </Button>
        </div>
      </div>

      {isReasonOpen && (
        <div className="bg-[#ECE8DC] border border-[#D8D2C2] rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            autoFocus
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitRegenerate()}
            placeholder="Причина: наприклад, забагато курки цього тижня"
            className="flex-1 w-full h-10 px-3 rounded-lg border border-[#D8D2C2] bg-[#E5E0D3]/40 text-sm outline-none focus:border-zinc-500"
          />
          <div className="flex gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => setIsReasonOpen(false)}>
              Скасувати
            </Button>
            <Button variant="lime" size="sm" onClick={submitRegenerate} disabled={!reason.trim()}>
              Перегенерувати
            </Button>
          </div>
        </div>
      )}

      {/* Селектор дней недели */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((item) => {
          const isSelected = activeDay === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onDayChange(item.key)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#D2F832] border-black text-black shadow-sm scale-[1.02]"
                  : "bg-[#ECE8DC] border-[#D8D2C2] text-zinc-700 hover:border-zinc-400"
              }`}
            >
              <span className="text-xs font-mono font-black">{item.label}</span>
              <span className="font-mono font-bold text-sm mt-0.5">{item.kcal}</span>
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
