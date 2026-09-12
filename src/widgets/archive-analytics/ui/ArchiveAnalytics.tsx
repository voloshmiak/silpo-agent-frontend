import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, PageError } from "@/shared/ui";
import { downloadProgressCsv, getProgress, type ProgressData } from "@/shared/api";

export const ArchiveAnalytics: React.FC = () => {
  const [period, setPeriod] = useState<"4" | "12" | "all">("12");
  const [data, setData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getProgress(period)
      .then((result) => { if (!cancelled) setData(result); })
      .catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Не вдалося завантажити прогрес"); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [period, reloadKey]);
  const points = useMemo(() => (data ? [...data.weight.history, ...data.weight.forecast] : []), [data]);

  if (isLoading || error || !data) {
    return error ? <PageError message={error} onRetry={() => setReloadKey((value) => value + 1)} /> : <div className="h-64 rounded-xl bg-[#ECE8DC] animate-pulse" />;
  }

  const minWeight = Math.min(...points.map((point) => point.weight)) - 1;
  const maxWeight = Math.max(...points.map((point) => point.weight)) + 1;
  const x = (index: number) => 30 + (index / Math.max(1, points.length - 1)) * 360;
  const y = (weight: number) => 140 - ((weight - minWeight) / Math.max(1, maxWeight - minWeight)) * 110;
  const actualPath = data.weight.history.map((point, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(point.weight)}`).join(" ");
  const forecastPoints = [data.weight.history.at(-1), ...data.weight.forecast].filter(Boolean);
  const forecastPath = forecastPoints.map((point, index) => `${index === 0 ? "M" : "L"} ${x(data.weight.history.length - 1 + index)} ${y(point!.weight)}`).join(" ");
  const maxSpend = Math.max(data.expenses.weekly_limit, ...data.expenses.items.map((item) => item.total_cost), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-mono tracking-tight uppercase text-zinc-900">Архів та Прогрес</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Реальні дані вашої ваги та витрат</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#DFDACB] p-1 rounded-xl border border-[#D8D2C2]">
            {(["4", "12", "all"] as const).map((value) => (
              <button key={value} type="button" onClick={() => setPeriod(value)} className={`px-3 py-1 rounded-lg font-mono text-xs font-bold ${period === value ? "bg-[#D2F832] text-black border border-black" : "text-zinc-600"}`}>
                {value === "all" ? "Все" : `${value} тиж`}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => void downloadProgressCsv()}>↓ Експорт CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold tracking-wider">Динаміка ваги</span>
            <div className="flex items-baseline gap-2 mt-1"><span className="text-3xl font-mono font-black">{data.weight.current_weight.toLocaleString("uk-UA")} кг</span><Badge variant="lime">{data.weight.change_kg > 0 ? "+" : ""}{data.weight.change_kg} кг за {data.weight.period_weeks} тиж</Badge></div>
          </div>
          <svg viewBox="0 0 420 160" className="w-full h-40" aria-label="Графік динаміки ваги">
            <line x1="20" y1="30" x2="400" y2="30" stroke="#D8D2C2" strokeDasharray="3 3" />
            <line x1="20" y1="85" x2="400" y2="85" stroke="#D8D2C2" strokeDasharray="3 3" />
            <line x1="20" y1="140" x2="400" y2="140" stroke="#D8D2C2" />
            <path d={actualPath} fill="none" stroke="#18181b" strokeWidth="2.5" />
            <path d={forecastPath} fill="none" stroke="#71717a" strokeWidth="2" strokeDasharray="4 4" />
            {points.map((point, index) => <circle key={`${point.date}-${index}`} cx={x(index)} cy={y(point.weight)} r={point.is_forecast ? 3.5 : 4.5} className={point.is_forecast ? "fill-[#ECE8DC] stroke-zinc-500" : "fill-[#D2F832] stroke-black"} strokeWidth="2" />)}
          </svg>
          <div className="pt-3 border-t border-[#D8D2C2] flex justify-between text-xs font-mono text-zinc-500"><span>Старт: {data.weight.start_weight} кг</span><span>Ціль: {data.weight.target_weight} кг</span></div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-start"><div><span className="text-[10px] font-mono uppercase text-zinc-500 font-bold tracking-wider">Витрати на їжу по тижнях</span><div className="text-3xl font-mono font-black mt-1">{data.expenses.average_spend.toLocaleString("uk-UA")} ₴</div><span className="text-xs font-mono text-zinc-500">сер. чек / тижд</span></div><Badge variant="outline">Ліміт {data.expenses.weekly_limit.toLocaleString("uk-UA")} ₴</Badge></div>
          <div className="mt-6 flex items-end justify-between h-32 px-2 border-b border-[#D8D2C2]">{data.expenses.items.map((item) => <div key={item.id} className="flex flex-col items-center gap-1.5 group relative"><span className="opacity-0 group-hover:opacity-100 absolute -top-6 text-[9px] font-mono bg-black text-white px-1.5 py-0.5 rounded">{item.total_cost} ₴</span><div style={{ height: `${(item.total_cost / maxSpend) * 110}px` }} className={`w-6 sm:w-8 rounded-t-md ${item.is_overspent ? "bg-[#FF5C00]" : "bg-[#DFDACB]"}`} /><span className="text-[10px] font-mono text-zinc-500 font-bold">{item.week_label}</span></div>)}</div>
          <div className="pt-3 border-t border-[#D8D2C2] flex justify-between text-xs font-mono text-zinc-500"><span>В межах ліміту: {data.expenses.weeks_within_limit} з {data.expenses.total_weeks} тиж</span><span className="text-[#FF5C00] font-bold">{data.expenses.overspent_count} перевитрата</span></div>
        </Card>
      </div>
    </div>
  );
};
