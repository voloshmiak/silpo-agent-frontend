import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "lime" | "orange" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider transition-all select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
      lime: "bg-[#D2F832] text-black border border-black hover:brightness-95 shadow-sm active:translate-y-[1px]",
      orange: "bg-[#FF5C00] text-white hover:bg-[#e05200] shadow-sm active:translate-y-[1px]",
      outline: "border border-[#D8D2C2] text-zinc-800 bg-[#E5E0D3]/40 hover:bg-[#DFDACB] active:bg-[#D5CFC0]",
      ghost: "text-zinc-600 hover:text-zinc-950 hover:bg-[#DFDACB]/50",
    };

    const sizes = {
      sm: "h-8 px-3 text-[11px] rounded-md",
      md: "h-10 px-4 text-xs rounded-lg",
      lg: "h-12 px-6 text-sm rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";