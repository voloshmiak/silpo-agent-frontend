import React from "react";
import type { UserProfile } from "@/entities/user";

interface Props {
  data: UserProfile["dietaryRestrictions"];
  onRemoveAllergen?: (allergen: string) => void;
  onRemoveStopProduct?: (product: string) => void;
}

export const DietaryCard: React.FC<Props> = ({
  data,
  onRemoveAllergen,
  onRemoveStopProduct,
}) => {
  return (
    <section className="bg-[#EBE7DC] border border-[#D8D2C2] rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-baseline">
        <h2 className="text-xs font-mono font-bold tracking-widest uppercase">
          Харчові обмеження
        </h2>
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
          Жорсткі правила
        </span>
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-2">
          Алергени
        </span>
        <div className="flex flex-wrap gap-2">
          {data.allergens.map((allergen) => (
            <span
              key={allergen}
              className="bg-[#FF5C00] text-white text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1.5"
            >
              <button
                type="button"
                onClick={() => onRemoveAllergen?.(allergen)}
                className="text-white/70 hover:text-white text-[10px]"
              >
                ✕
              </button>
              {allergen}
            </span>
          ))}
        </div>
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-2">
          Стоп-продукти
        </span>
        <div className="flex flex-wrap gap-2">
          {data.stopProducts.map((item) => (
            <span
              key={item}
              className="border border-zinc-400 text-zinc-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5"
            >
              <button
                type="button"
                onClick={() => onRemoveStopProduct?.(item)}
                className="text-zinc-400 hover:text-zinc-700 text-[10px]"
              >
                ✕
              </button>
              {item}
            </span>
          ))}
        </div>
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-2">
          Тип харчування
        </span>
        <span className="bg-[#D2F832] border border-black/30 text-black text-xs font-bold px-3 py-1 rounded-full uppercase inline-block">
          {data.dietType}
        </span>
      </div>
    </section>
  );
};