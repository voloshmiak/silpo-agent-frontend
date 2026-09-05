import React from "react";
import type { UserProfile } from "@/entities/user";

interface Props {
  data: UserProfile["physical"];
}

export const PhysicalDataCard: React.FC<Props> = ({ data }) => {
  return (
    <section className="bg-[#EBE7DC] border border-[#D8D2C2] rounded-xl p-6 flex flex-col justify-between">
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="text-xs font-mono font-bold tracking-widest uppercase">
          Фізичні дані та ціль
        </h2>
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
          Оновлено {data.updatedAt}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between py-1 border-b border-[#DFDACB]">
          <span className="text-zinc-500">Поточна вага</span>
          <span className="font-semibold">{data.currentWeightKg} кг</span>
        </div>
        <div className="flex justify-between py-1 border-b border-[#DFDACB]">
          <span className="text-zinc-500">Цільова вага</span>
          <span className="font-semibold text-[#FF5C00]">{data.targetWeightKg} кг</span>
        </div>
        <div className="flex justify-between py-1 border-b border-[#DFDACB]">
          <span className="text-zinc-500">Зріст</span>
          <span className="font-semibold">{data.heightCm} см</span>
        </div>
        <div className="flex justify-between py-1 border-b border-[#DFDACB]">
          <span className="text-zinc-500">Вік · стать</span>
          <span className="font-semibold">{data.age} · {data.gender}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-[#DFDACB]">
          <span className="text-zinc-500">Фокус</span>
          <span className="font-semibold">{data.focus}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-zinc-500">Темп</span>
          <span className="font-mono font-semibold text-zinc-900">
            {data.paceKgPerWeek > 0 ? `+${data.paceKgPerWeek}` : data.paceKgPerWeek} кг / тиждень
          </span>
        </div>
      </div>
    </section>
  );
};