import React from "react";
import type { OnboardingFormData } from "../../model/useOnboardingForm";
import { getFieldError, WEIGHT_RANGE } from "../../model/validation";
import { FieldLabel, PillSelect, TextInput } from "@/shared/ui";

interface Props {
  data: OnboardingFormData;
  update: (partial: Partial<OnboardingFormData>) => void;
}

const FOCUS_OPTIONS = [
  { value: "Схуднення", label: "Схуднення" },
  { value: "Набір маси", label: "Набір маси" },
  { value: "Підтримка форми", label: "Підтримка форми" },
] as const;

export const StepGoal: React.FC<Props> = ({ data, update }) => {
  const nameError = getFieldError("name", data);
  const weightError = getFieldError("targetWeightKg", data);

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel>Як вас звати</FieldLabel>
        <TextInput
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Іван"
          autoFocus
          aria-invalid={Boolean(nameError)}
        />
        {nameError && <p className="mt-1 text-xs text-[#FF5C00]">{nameError}</p>}
      </div>

      <div>
        <FieldLabel>Ваша ціль</FieldLabel>
        <PillSelect
          options={FOCUS_OPTIONS}
          value={data.focus as (typeof FOCUS_OPTIONS)[number]["value"]}
          onChange={(focus) => update({ focus })}
        />
      </div>

      <div>
        <FieldLabel hint="кг">Цільова вага</FieldLabel>
        <TextInput
          type="number"
          inputMode="decimal"
          min={WEIGHT_RANGE.min}
          max={WEIGHT_RANGE.max}
          value={data.targetWeightKg}
          onChange={(e) =>
            update({ targetWeightKg: e.target.value === "" ? "" : Number(e.target.value) })
          }
          placeholder="72.5"
          aria-invalid={Boolean(weightError)}
        />
        {weightError && <p className="mt-1 text-xs text-[#FF5C00]">{weightError}</p>}
      </div>
    </div>
  );
};
