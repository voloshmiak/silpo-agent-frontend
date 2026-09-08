import React, { useEffect, useState } from "react";
import { Card, Badge } from "@/shared/ui";
import { mockArchivedWeeks } from "@/entities/metric";
import { getPlans, type PlanRecord } from "@/shared/api";
import { parsePlanContent, type PlanData } from "@/entities/plan";
import { formatCurrencyInt } from "@/shared/lib";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
}

/** У плані більше немає текстової відповіді — короткий опис збираємо з даних. */
function buildPreview(plan: PlanData | null): string {
  if (!plan) return "";
  if (plan.summary.notes) return plan.summary.notes.replace(/\s+/g, " ").trim().slice(0, 90);
  return `${plan.targets.kcal} ккал/день · ${plan.cart.length} позицій · ${formatCurrencyInt(
    Math.round(plan.summary.total_uah)
  )}`;
}

/**
 * Заголовок план бекенд будує з тексту стріму; без token-подій туди потрапляє
 * сирий SSE-лог, тож такі заголовки підміняємо датою.
 */
function planTitle(title: string, createdAt: string): string {
  const looksLikeRawLog = title.includes("data:") || title.includes('{"type"');
  if (title.trim() && !looksLikeRawLog) return title;
  return `План від ${formatDate(createdAt)}`;
}

export const ArchiveHistoryList: React.FC = () => {
  const [plans, setPlans] = useState<PlanRecord[] | null>(null);

  useEffect(() => {
    getPlans(20, 0)
      .then(setPlans)
      .catch(() => setPlans(null));
  }, []);

  if (plans && plans.length > 0) {
    return (
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
            Історія тижневих планів
          </h2>
          <span className="text-xs font-mono text-zinc-500">Показано {plans.length} планів</span>
        </div>

        <div className="divide-y divide-[#D8D2C2]/60">
          {plans.map((plan) => {
            const parsed = parsePlanContent(plan.content);
            const preview = buildPreview(parsed);

            return (
              <div
                key={plan.id}
                className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#DFDACB]/30 px-2 rounded-lg transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-900">
                    {planTitle(plan.title, plan.created_at)}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                    {preview}
                    {preview.length === 90 && "…"}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto font-mono text-xs">
                  <span className="text-zinc-500">{formatDate(plan.created_at)}</span>
                  <Badge variant="outline" className="text-[10px]">
                    Деталі →
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
          Історія тижневих планів
        </h2>
        <span className="text-xs font-mono text-zinc-500">
          Показано останні 4 тижні
        </span>
      </div>

      <div className="divide-y divide-[#D8D2C2]/60">
        {mockArchivedWeeks.map((item) => (
          <div
            key={item.weekId}
            className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#DFDACB]/30 px-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 text-center">
                <span className="font-mono font-black text-sm text-zinc-900">
                  {item.weekId}
                </span>
                <div className="text-[10px] font-mono text-zinc-500 uppercase">
                  {item.dateRange}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-zinc-900">
                  {item.menuSummary}
                </div>
                <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                  Виконано прийомів: {item.purchasedRatio}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end md:self-auto font-mono text-xs">
              <div className="text-right">
                <div className="font-bold text-zinc-900">{item.spent} ₴</div>
                <div
                  className={`text-[10px] font-bold ${
                    item.diff <= 0 ? "text-emerald-700" : "text-[#FF5C00]"
                  }`}
                >
                  {item.diff <= 0 ? `${item.diff} ₴` : `+${item.diff} ₴`}
                </div>
              </div>

              <Badge variant="outline" className="text-[10px]">
                Деталі →
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
