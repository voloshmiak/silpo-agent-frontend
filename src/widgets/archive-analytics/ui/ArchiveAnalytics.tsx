import React, { useState } from "react";
import { Card, Badge, Button } from "@/shared/ui";
import { mockWeightHistory, mockBudgetHistory } from "@/entities/metric";

export const ArchiveAnalytics: React.FC = () => {
  const [period, setPeriod] = useState<"4" | "12" | "all">("12");

  // Расчет точек SVG для графика веса (min 74, max 84)
  const minW = 74;
  const maxW = 84;
  const getY = (val: number) => 140 - ((val - minW) / (maxW - minW)) * 110;
  const getX = (idx: number, total: number) => 30 + (idx / (total - 1)) * 360;

  const actualPoints = mockWeightHistory.filter((p) => !p.isForecast);
  const forecastPoints = mockWeightHistory.filter(
    (p, i) => i >= actualPoints.length - 1
  );

  const actualSvgPath = actualPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i, mockWeightHistory.length)} ${getY(p.weightKg)}`)
    .join(" ");

  const forecastSvgPath = forecastPoints
    .map((p, i) => {
      const globalIdx = actualPoints.length - 1 + i;
      return `${i === 0 ? "M" : "L"} ${getX(globalIdx, mockWeightHistory.length)} ${getY(p.weightKg)}`;
    })
    .join(" ");

  return (
    <div className="space-y-6">
      {/* Шапка экрана Архив */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-mono tracking-tight uppercase text-zinc-900">
            Архів та Прогрес
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            12 тижнів на системі · мета: 75 кг до кінця жовтня
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#DFDACB] p-1 rounded-xl border border-[#D8D2C2]">
            {(["4", "12", "all"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                  period === p
                    ? "bg-[#D2F832] text-black border border-black shadow-sm"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                {p === "all" ? "Все" : `${p} тиж`}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm">
            ⤓ Експорт CSV
          </Button>
        </div>
      </div>

      {/* Сетка графиков */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. График динамики веса */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold tracking-wider">
                  Динаміка ваги
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-mono font-black text-zinc-900">
                    78,4 кг
                  </span>
                  <Badge variant="lime">-3,7 кг за 12 тиж</Badge>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-black inline-block" /> факт
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 border-b border-dashed border-zinc-500 inline-block" /> прогноз
                </span>
              </div>
            </div>

            {/* SVG график */}
            <div className="mt-4 w-full overflow-x-auto">
              <svg viewBox="0 0 420 160" className="w-full h-40">
                {/* Горизонтальные сетки */}
                <line x1="20" y1="30" x2="400" y2="30" stroke="#D8D2C2" strokeDasharray="3 3" />
                <line x1="20" y1="85" x2="400" y2="85" stroke="#D8D2C2" strokeDasharray="3 3" />
                <line x1="20" y1="140" x2="400" y2="140" stroke="#D8D2C2" />

                {/* Линии факта и прогноза */}
                <path d={actualSvgPath} fill="none" stroke="#18181b" strokeWidth="2.5" />
                <path d={forecastSvgPath} fill="none" stroke="#71717a" strokeWidth="2" strokeDasharray="4 4" />

                {/* Точки данных */}
                {mockWeightHistory.map((p, idx) => {
                  const cx = getX(idx, mockWeightHistory.length);
                  const cy = getY(p.weightKg);
                  return (
                    <g key={p.week}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={p.isForecast ? 3.5 : 4.5}
                        className={p.isForecast ? "fill-[#ECE8DC] stroke-zinc-500" : "fill-[#D2F832] stroke-black"}
                        strokeWidth="2"
                      />
                      <text
                        x={cx}
                        y="155"
                        textAnchor="middle"
                        className="text-[10px] font-mono fill-zinc-500 font-bold"
                      >
                        {p.week}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="pt-3 border-t border-[#D8D2C2] flex justify-between text-xs font-mono text-zinc-500">
            <span>Старт: 82,1 кг</span>
            <span>Ціль: 75,0 кг</span>
          </div>
        </Card>

        {/* 2. Столбчатая диаграмма расходов */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold tracking-wider">
                  Витрати на їжу по тижнях
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-mono font-black text-zinc-900">
                    1 850 ₴
                  </span>
                  <span className="text-xs font-mono text-zinc-500">сер. чек / тижд</span>
                </div>
              </div>
              <Badge variant="outline">Ліміт 2 000 ₴</Badge>
            </div>

            {/* Столбики расходов */}
            <div className="mt-6 flex items-end justify-between h-32 px-2 border-b border-[#D8D2C2]">
              {mockBudgetHistory.map((b) => {
                const maxBarHeight = 110;
                const height = (b.actual / 2300) * maxBarHeight;
                const isOver = b.actual > b.limit;

                return (
                  <div key={b.week} className="flex flex-col items-center gap-1.5 group relative">
                    {/* Тултип со значением */}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 text-[9px] font-mono bg-black text-white px-1.5 py-0.5 rounded pointer-events-none">
                      {b.actual} ₴
                    </span>

                    <div
                      style={{ height: `${height}px` }}
                      className={`w-6 sm:w-8 rounded-t-md transition-all ${
                        isOver
                          ? "bg-[#FF5C00]"
                          : b.week === "T12"
                          ? "bg-[#D2F832] border border-black"
                          : "bg-[#DFDACB] hover:bg-[#D4CEBF]"
                      }`}
                    />
                    <span className="text-[10px] font-mono text-zinc-500 font-bold mt-1">
                      {b.week}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#D8D2C2] flex justify-between text-xs font-mono text-zinc-500">
            <span>В межах ліміту: 7 з 8 тиж</span>
            <span className="text-[#FF5C00] font-bold">1 перевитрата (Т6)</span>
          </div>
        </Card>
      </div>
    </div>
  );
};