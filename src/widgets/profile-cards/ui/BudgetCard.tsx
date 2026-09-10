import React from "react";
import { PROMO_PRIORITY_OPTIONS, type UserProfile } from "@/entities/user";
import { PillSelect, Switch } from "@/shared/ui";

interface Props {
  budget: UserProfile["budget"];
  onChange: (budget: UserProfile["budget"]) => void;
}

export const BudgetCard: React.FC<Props> = ({ budget, onChange }) => {
  const set = <K extends keyof UserProfile["budget"]>(
    key: K,
    value: UserProfile["budget"][K]
  ) => onChange({ ...budget, [key]: value });

  return (
    <section className="bg-[#EBE7DC] border border-[#D8D2C2] rounded-xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <h2 className="text-xs font-mono font-bold tracking-widest uppercase">
            Бюджет на тиждень
          </h2>
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Ліміт витрат
          </span>
        </div>

        <div className="text-4xl font-serif font-bold tabular-nums lining-nums text-zinc-900 my-3">
          {budget.weeklyLimit.toLocaleString("uk-UA")} ₴
        </div>

        <input
          type="range"
          min="500"
          max="10000"
          step="50"
          value={budget.weeklyLimit}
          onChange={(e) => set("weeklyLimit", Number(e.target.value))}
          aria-label="Ліміт витрат на тиждень"
          className="w-full h-2 bg-zinc-300 rounded-lg appearance-none cursor-pointer accent-[#D2F832]"
        />
        <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-1">
          <span>500 ₴</span>
          <span>10 000 ₴</span>
        </div>
      </div>

      <div className="space-y-3 pt-4 mt-4 border-t border-[#DFDACB] text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-2">
            Пріоритет акцій Сільпо
          </span>
          <PillSelect
            options={PROMO_PRIORITY_OPTIONS}
            value={budget.promotionsPriority}
            onChange={(promotionsPriority) => set("promotionsPriority", promotionsPriority)}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-zinc-800">Доставка в бюджеті</p>
            <p className="text-[11px] text-zinc-500">
              {budget.deliveryIncluded
                ? "Ліміт враховує вартість доставки"
                : "Ліміт рахується лише за продукти"}
            </p>
          </div>
          <Switch
            checked={budget.deliveryIncluded}
            onCheckedChange={(deliveryIncluded) => set("deliveryIncluded", deliveryIncluded)}
          />
        </div>
      </div>
    </section>
  );
};
