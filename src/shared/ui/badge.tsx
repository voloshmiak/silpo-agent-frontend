import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "orange" | "lime" | "outline" | "neutral";
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "outline",
  className,
  children,
  ...props
}) => {
  const variants = {
    orange: "bg-[#FF5C00] text-white border-transparent",
    lime: "bg-[#D2F832] text-black border-black/20 font-black",
    outline: "border-[#D8D2C2] text-zinc-700 bg-transparent",
    neutral: "bg-[#DFDACB] text-zinc-800 border-transparent",
  };

  return (
    <span
      className={cn(
        "text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1 border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};