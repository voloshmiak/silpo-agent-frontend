import React, { useState } from "react";
import type { UserProfile } from "@/entities/user";

const FOCUS_OPTIONS = [
  { value: "Схуднення", label: "Схуднення" },
  { value: "Набір маси", label: "Набір маси" },
  { value: "Підтримка форми", label: "Підтримка" },
] as const;

interface Props {
  data: UserProfile["physical"];
  onChange: (physical: UserProfile["physical"]) => void;
}

export const PhysicalDataCard: React.FC<Props> = ({ data, onChange }) => {
  const set = <K extends keyof UserProfile["physical"]>(
    key: K,
    value: UserProfile["physical"][K]
  ) => onChange({ ...data, [key]: value });

  return (
    <section className="bg-[#EBE7DC] border border-[#D8D2C2] rounded-xl p-5 flex flex-col justify-between">
      <div className="flex justify-between items-baseline mb-3">
        <h2 className="text-xs font-mono font-bold tracking-widest uppercase">
          Фізичні дані та ціль
        </h2>
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
          Оновлено {data.updatedAt}
        </span>
      </div>

      <div className="space-y-1 text-sm">
        <NumberRow
          label="Поточна вага"
          unit="кг"
          step={0.1}
          value={data.currentWeightKg}
          onChange={(v) => set("currentWeightKg", v)}
        />
        <NumberRow
          label="Цільова вага"
          unit="кг"
          step={0.1}
          accent
          value={data.targetWeightKg}
          onChange={(v) => set("targetWeightKg", v)}
        />
        <NumberRow
          label="Зріст"
          unit="см"
          value={data.heightCm}
          onChange={(v) => set("heightCm", v)}
        />

        <div className="flex justify-between items-center py-0.5 border-b border-[#DFDACB] gap-3">
          <span className="text-zinc-500 shrink-0">Вік · стать</span>
          <div className="flex items-center gap-2">
            <NumberInput
              value={data.age}
              onChange={(v) => set("age", v)}
              aria-label="Вік"
            />
            <div className="flex gap-1">
              {(["чол.", "жін."] as const).map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => set("gender", gender)}
                  className={`px-2 h-7 rounded-md border text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                    data.gender === gender
                      ? "bg-[#D2F832] border-black text-black"
                      : "border-[#D8D2C2] bg-[#E5E0D3]/40 text-zinc-600 hover:border-zinc-400"
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
        </div>

        <NumberRow
          label="Темп"
          unit="кг/тиж"
          step={0.1}
          value={data.paceKgPerWeek}
          onChange={(v) => set("paceKgPerWeek", v)}
        />

        <div className="flex justify-between items-center py-0.5 gap-3">
          <span className="text-zinc-500 shrink-0">Фокус</span>
          <div className="flex gap-1 flex-wrap justify-end">
            {FOCUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => set("focus", option.value)}
                className={`px-2 h-7 rounded-md border text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                  data.focus === option.value
                    ? "bg-[#D2F832] border-black text-black"
                    : "border-[#D8D2C2] bg-[#E5E0D3]/40 text-zinc-600 hover:border-zinc-400"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const inputClass =
  "w-20 h-7 px-2 text-center rounded-md border border-[#D8D2C2] bg-[#E5E0D3]/40 text-sm font-semibold text-zinc-900 outline-none focus:border-zinc-500 transition-colors";

interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: number;
  onChange: (value: number) => void;
  accent?: boolean;
}

/**
 * Числове поле з власною чернеткою: дозволяє тимчасово порожній рядок під час
 * набору, але назовні віддає лише валідні числа. Значення, що прийшло ззовні
 * (наприклад після «Скинути»), перетирає чернетку.
 */
const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  accent,
  className,
  ...rest
}) => {
  const [draft, setDraft] = useState(String(value));
  const [synced, setSynced] = useState(value);

  if (synced !== value) {
    setSynced(value);
    setDraft(String(value));
  }

  return (
    <input
      {...rest}
      type="number"
      value={draft}
      onChange={(e) => {
        const raw = e.target.value;
        setDraft(raw);
        const parsed = Number(raw);
        if (raw !== "" && !Number.isNaN(parsed)) onChange(parsed);
      }}
      onBlur={() => setDraft(String(value))}
      className={`${inputClass} ${accent ? "text-[#FF5C00]" : ""} ${className ?? ""}`}
    />
  );
};

const NumberRow: React.FC<{
  label: string;
  unit: string;
  value: number;
  step?: number;
  accent?: boolean;
  onChange: (value: number) => void;
}> = ({ label, unit, value, step = 1, accent, onChange }) => (
  <div className="flex justify-between items-center py-0.5 border-b border-[#DFDACB] gap-3">
    <span className="text-zinc-500 shrink-0">{label}</span>
    <div className="flex items-center gap-2">
      <NumberInput
        value={value}
        step={step}
        accent={accent}
        onChange={onChange}
        aria-label={label}
      />
      <span className="text-xs text-zinc-500 w-12">{unit}</span>
    </div>
  </div>
);
