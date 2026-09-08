import React from "react";
import { FieldLabel } from "@/shared/ui";
import type { OnboardingFormData } from "../../model/useOnboardingForm";

interface Props {
  data: OnboardingFormData;
  update: (partial: Partial<OnboardingFormData>) => void;
}

export const StepTraining: React.FC<Props> = ({ data, update }) => {
  const clamp = (n: number) => Math.min(7, Math.max(0, n));

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel>Тренувань на тиждень</FieldLabel>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => update({ weeklyWorkoutsCount: clamp(data.weeklyWorkoutsCount - 1) })}
            className="w-11 h-11 rounded-lg border border-[#D8D2C2] bg-[#E5E0D3]/40 text-lg font-bold hover:bg-[#DFDACB] cursor-pointer"
          >
            −
          </button>
          <span className="text-3xl font-mono font-black w-10 text-center">
            {data.weeklyWorkoutsCount}
          </span>
          <button
            type="button"
            onClick={() => update({ weeklyWorkoutsCount: clamp(data.weeklyWorkoutsCount + 1) })}
            className="w-11 h-11 rounded-lg border border-[#D8D2C2] bg-[#E5E0D3]/40 text-lg font-bold hover:bg-[#DFDACB] cursor-pointer"
          >
            +
          </button>
        </div>
      </div>
      <p className="text-xs text-zinc-500">
        Агент врахує кількість тренувань при розрахунку калорій і БЖВ.
      </p>
    </div>
  );
};
