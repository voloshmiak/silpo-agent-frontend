import React, { useState } from "react";
import { DIET_TYPE_OPTIONS, type UserProfile } from "@/entities/user";
import { PillSelect } from "@/shared/ui";

interface Props {
  data: UserProfile["dietaryRestrictions"];
  onChange: (data: UserProfile["dietaryRestrictions"]) => void;
}

export const DietaryCard: React.FC<Props> = ({ data, onChange }) => {
  const set = <K extends keyof UserProfile["dietaryRestrictions"]>(
    key: K,
    value: UserProfile["dietaryRestrictions"][K]
  ) => onChange({ ...data, [key]: value });

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
        <ChipList
          values={data.allergens}
          onChange={(allergens) => set("allergens", allergens)}
          variant="orange"
          placeholder="+ алерген"
        />
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-2">
          Стоп-продукти
        </span>
        <ChipList
          values={data.stopProducts}
          onChange={(stopProducts) => set("stopProducts", stopProducts)}
          variant="outline"
          placeholder="+ продукт"
        />
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-2">
          Тип харчування
        </span>
        <PillSelect
          options={DIET_TYPE_OPTIONS}
          value={data.dietType}
          onChange={(dietType) => set("dietType", dietType)}
        />
      </div>
    </section>
  );
};

const CHIP_STYLES = {
  orange: "bg-[#FF5C00] text-white",
  outline: "border border-zinc-400 text-zinc-700",
} as const;

const REMOVE_STYLES = {
  orange: "text-white/70 hover:text-white",
  outline: "text-zinc-400 hover:text-zinc-700",
} as const;

/**
 * Список довільних значень. Пресетів тут навмисно немає: алергія чи нелюбимий
 * продукт можуть бути будь-якими, а обмеження, яке нема куди вписати, просто
 * не потрапить у план.
 *
 * Введене додається і по Enter, і по втраті фокуса — інакше набране слово тихо
 * зникало б у того, хто одразу натиснув «Зберегти зміни».
 */
const ChipList: React.FC<{
  values: string[];
  onChange: (values: string[]) => void;
  variant: keyof typeof CHIP_STYLES;
  placeholder: string;
}> = ({ values, onChange, variant, placeholder }) => {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const value = draft.trim();
    setDraft("");
    // Той самий продукт в іншому регістрі — це один продукт, а не два
    if (!value || values.some((item) => item.toLowerCase() === value.toLowerCase())) return;
    onChange([...values, value]);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {values.map((value) => (
        <span
          key={value}
          className={`${CHIP_STYLES[variant]} text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1.5`}
        >
          <button
            type="button"
            aria-label={`Прибрати ${value}`}
            onClick={() => onChange(values.filter((item) => item !== value))}
            className={`${REMOVE_STYLES[variant]} text-[10px] cursor-pointer`}
          >
            ✕
          </button>
          {value}
        </span>
      ))}

      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          }
        }}
        onBlur={commit}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-28 h-7 px-3 rounded-full border border-dashed border-[#C9C2AF] bg-transparent text-xs text-zinc-700 placeholder:text-zinc-400 placeholder:uppercase placeholder:font-mono outline-none focus:border-solid focus:border-zinc-500 transition-colors"
      />
    </div>
  );
};
