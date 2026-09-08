import React from "react";
import { FieldLabel } from "@/shared/ui";
import { WorkoutDaysPicker, countWorkouts } from "@/entities/user";
import type { OnboardingFormData } from "../../model/useOnboardingForm";

interface Props {
  data: OnboardingFormData;
  update: (partial: Partial<OnboardingFormData>) => void;
}

export const StepTraining: React.FC<Props> = ({ data, update }) => {
  const count = countWorkouts(data.workoutDays);

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel hint={`${count} на тиждень`}>Тренувальні дні</FieldLabel>
        <WorkoutDaysPicker
          days={data.workoutDays}
          onChange={(workoutDays) => update({ workoutDays })}
        />
      </div>
      <p className="text-xs text-zinc-500">
        Клік по дню перемикає тип: силові → кардіо → вихідний. Агент врахує розклад
        при розрахунку калорій і БЖВ.
      </p>
    </div>
  );
};
