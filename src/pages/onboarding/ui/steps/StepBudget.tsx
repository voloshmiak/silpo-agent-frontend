import React from "react";
import { FieldLabel, TextInput } from "@/shared/ui";
import type { OnboardingFormData } from "../../model/useOnboardingForm";
import { getVisibleFieldError, MIN_WEEKLY_BUDGET } from "../../model/validation";

interface Props {
  data: OnboardingFormData;
  update: (partial: Partial<OnboardingFormData>) => void;
}

export const StepBudget: React.FC<Props> = ({ data, update }) => {
  const budgetError = getVisibleFieldError("budgetUah", data);

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel hint="₴ / тиждень">Бюджет на закупку</FieldLabel>
        <TextInput
          type="number"
          inputMode="decimal"
          min={MIN_WEEKLY_BUDGET}
          value={data.budgetUah}
          onChange={(e) =>
            update({ budgetUah: e.target.value === "" ? "" : Number(e.target.value) })
          }
          placeholder="2000"
          aria-invalid={Boolean(budgetError)}
        />
        {budgetError && <p className="mt-1 text-xs text-[#FF5C00]">{budgetError}</p>}
        {!budgetError && (
          <p className="mt-1 text-xs text-zinc-500">
            Вкажіть суму від {MIN_WEEKLY_BUDGET} ₴ на тиждень
          </p>
        )}
      </div>
      <p className="text-xs text-zinc-500">
        Агент підбере продукти «Сільпо» з акціями, щоб вкластись у бюджет.
      </p>
    </div>
  );
};
