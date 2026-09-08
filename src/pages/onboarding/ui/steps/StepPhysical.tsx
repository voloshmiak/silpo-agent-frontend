import React from "react";
import type { OnboardingFormData } from "../../model/useOnboardingForm";
import { FieldLabel, PillSelect, TextInput } from "@/shared/ui";

interface Props {
  data: OnboardingFormData;
  update: (partial: Partial<OnboardingFormData>) => void;
}

const GENDER_OPTIONS = [
  { value: "чол.", label: "Чоловіча" },
  { value: "жін.", label: "Жіноча" },
] as const;

export const StepPhysical: React.FC<Props> = ({ data, update }) => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel hint="см">Зріст</FieldLabel>
          <TextInput
            type="number"
            inputMode="numeric"
            value={data.heightCm}
            onChange={(e) =>
              update({ heightCm: e.target.value === "" ? "" : Number(e.target.value) })
            }
            placeholder="182"
          />
        </div>
        <div>
          <FieldLabel hint="кг">Поточна вага</FieldLabel>
          <TextInput
            type="number"
            inputMode="decimal"
            value={data.currentWeightKg}
            onChange={(e) =>
              update({ currentWeightKg: e.target.value === "" ? "" : Number(e.target.value) })
            }
            placeholder="78.4"
          />
        </div>
      </div>

      <div>
        <FieldLabel hint="років">Вік</FieldLabel>
        <TextInput
          type="number"
          inputMode="numeric"
          value={data.age}
          onChange={(e) => update({ age: e.target.value === "" ? "" : Number(e.target.value) })}
          placeholder="29"
        />
      </div>

      <div>
        <FieldLabel>Стать</FieldLabel>
        <PillSelect
          options={GENDER_OPTIONS}
          value={data.gender}
          onChange={(gender) => update({ gender })}
        />
      </div>
    </div>
  );
};
