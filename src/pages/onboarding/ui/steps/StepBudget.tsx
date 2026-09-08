import React from "react";
import { FieldLabel, TextInput } from "@/shared/ui";
import type { OnboardingFormData } from "../../model/useOnboardingForm";

interface Props {
  data: OnboardingFormData;
  update: (partial: Partial<OnboardingFormData>) => void;
}

export const StepBudget: React.FC<Props> = ({ data, update }) => {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel hint="₴ / тиждень">Бюджет на закупку</FieldLabel>
        <TextInput
          type="number"
          inputMode="decimal"
          value={data.budgetUah}
          onChange={(e) =>
            update({ budgetUah: e.target.value === "" ? "" : Number(e.target.value) })
          }
          placeholder="2000"
        />
      </div>
      <p className="text-xs text-zinc-500">
        Агент підбере продукти «Сільпо» з акціями, щоб вкластись у бюджет.
      </p>
    </div>
  );
};
