import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  className,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "w-6 h-6 rounded-md border flex items-center justify-center transition-all cursor-pointer select-none",
        checked
          ? "bg-[#D2F832] border-black text-black font-black"
          : "border-[#D8D2C2] bg-[#E2DDD0]/40 hover:border-zinc-400",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {checked && <span className="text-xs">✓</span>}
    </button>
  );
};