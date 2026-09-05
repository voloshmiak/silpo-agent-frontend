import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, className }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer",
        checked ? "bg-[#FF5C00]" : "bg-[#D8D2C2]",
        className
      )}
    >
      <div
        className={cn(
          "bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
};