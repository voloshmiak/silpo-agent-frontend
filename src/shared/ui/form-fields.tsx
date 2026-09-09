import React from "react";
import { cn } from "@/shared/lib/utils";

const fieldBase =
  "w-full h-11 px-3 rounded-lg border border-[#D8D2C2] bg-[#E5E0D3]/40 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-500 transition-colors";
const fieldInvalid = "border-[#FF5C00] focus:border-[#FF5C00]";

export const FieldLabel: React.FC<React.PropsWithChildren<{ hint?: string }>> = ({
  children,
  hint,
}) => (
  <div className="flex items-baseline justify-between mb-1.5">
    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
      {children}
    </label>
    {hint && <span className="text-[10px] font-mono text-zinc-400">{hint}</span>}
  </div>
);

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  "aria-invalid": ariaInvalid,
  ...props
}) => (
  <input
    className={cn(fieldBase, ariaInvalid && fieldInvalid, className)}
    aria-invalid={ariaInvalid}
    {...props}
  />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className,
  ...props
}) => (
  <textarea
    className={cn(fieldBase, "h-24 py-2 resize-none", className)}
    {...props}
  />
);

interface PillOption<T extends string> {
  value: T;
  label: string;
}

export function PillSelect<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "px-3.5 py-2 rounded-lg border text-xs font-bold uppercase tracking-wide font-mono transition-all cursor-pointer",
              isActive
                ? "bg-[#D2F832] border-black text-black shadow-sm"
                : "border-[#D8D2C2] bg-[#E5E0D3]/40 text-zinc-600 hover:border-zinc-400"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Пресетні чіпси з множинним вибором — активні показують ✕ для зняття виділення. */
export const MultiSelectChips: React.FC<{
  options: readonly string[];
  values: string[];
  onChange: (values: string[]) => void;
  activeVariant?: "orange" | "outline";
}> = ({ options, values, onChange, activeVariant = "orange" }) => {
  const toggle = (option: string) => {
    onChange(
      values.includes(option) ? values.filter((v) => v !== option) : [...values, option]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = values.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={cn(
              "px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wide font-mono transition-all cursor-pointer flex items-center gap-1.5",
              isActive
                ? activeVariant === "orange"
                  ? "bg-[#FF5C00] border-transparent text-white shadow-sm"
                  : "border-zinc-400 text-zinc-700"
                : "border-[#D8D2C2] bg-[#E5E0D3]/40 text-zinc-600 hover:border-zinc-400"
            )}
          >
            {isActive && <span className="text-[10px]">✕</span>}
            {option}
          </button>
        );
      })}
    </div>
  );
};
