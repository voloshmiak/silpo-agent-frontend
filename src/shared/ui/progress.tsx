import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  barColor?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  barColor = "bg-[#D2F832]",
  className,
  ...props
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn("w-full bg-[#D8D2C2]/60 h-2 rounded-full overflow-hidden", className)}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-300 rounded-full", barColor)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};