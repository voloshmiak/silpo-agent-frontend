import React from "react";
import type { UserProfile } from "@/entities/user";

interface Props {
  budget: UserProfile["budget"];
  onChangeLimit: (newLimit: number) => void;
}

export const BudgetCard: React.FC<Props> = ({ budget, onChangeLimit }) => {
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

        <div className="text-4xl font-serif font-bold text-zinc-900 my-3">
          {budget.weeklyLimit.toLocaleString("uk-UA")} ₴
        </div>

        <input
          type="range"
          min="1000"
          max="3500"
          step="50"
          value={budget.weeklyLimit}
          onChange={(e) => onChangeLimit(Number(e.target.value))}
          className="w-full h-2 bg-zinc-300 rounded-lg appearance-none cursor-pointer accent-[#D2F832]"
        />
        <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-1">
          <span>1 000 ₴</span>
          <span>3 500 ₴</span>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-[#DFDACB] text-xs">
        <div className="flex justify-between">
          <span className="text-zinc-500">Середні витрати за 8 тижнів</span>
          <span className="font-mono font-semibold">{budget.averageSpent8Weeks} ₴</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Пріоритет акцій Сільпо</span>
          <span className="font-semibold text-[#FF5C00]">{budget.promotionsPriority}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Доставка</span>
          <span className="font-semibold text-zinc-800">
            {budget.deliveryIncluded ? "Включена в бюджет" : "Не включена"}
          </span>
        </div>
      </div>
    </section>
  );
};