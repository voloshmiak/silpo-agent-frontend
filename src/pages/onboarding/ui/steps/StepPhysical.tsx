import React from "react";
import type { OnboardingFormData } from "../../model/useOnboardingForm";
import { FieldLabel, PillSelect, TextInput } from "@/shared/ui";
import {
  getVisibleFieldError,
  AGE_RANGE,
  HEIGHT_RANGE,
  WEIGHT_RANGE,
} from "../../model/validation";

interface Props {
  data: OnboardingFormData;
  update: (partial: Partial<OnboardingFormData>) => void;
}

const GENDER_OPTIONS = [
  { value: "чол.", label: "Чоловіча" },
  { value: "жін.", label: "Жіноча" },
] as const;

export const StepPhysical: React.FC<Props> = ({ data, update }) => {
  const heightError = getVisibleFieldError("heightCm", data);
  const weightError = getVisibleFieldError("currentWeightKg", data);
  const ageError = getVisibleFieldError("age", data);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel hint="см">Зріст</FieldLabel>
          <TextInput
            type="number"
            inputMode="numeric"
            min={HEIGHT_RANGE.min}
            max={HEIGHT_RANGE.max}
            value={data.heightCm}
            onChange={(e) =>
              update({ heightCm: e.target.value === "" ? "" : Number(e.target.value) })
            }
            placeholder="182"
            aria-invalid={Boolean(heightError)}
          />
          {heightError && <p className="mt-1 text-xs text-[#FF5C00]">{heightError}</p>}
          {!heightError && (
            <p className="mt-1 text-xs text-zinc-500">
              Від {HEIGHT_RANGE.min} до {HEIGHT_RANGE.max} см
            </p>
          )}
        </div>
        <div>
          <FieldLabel hint="кг">Поточна вага</FieldLabel>
          <TextInput
            type="number"
            inputMode="decimal"
            min={WEIGHT_RANGE.min}
            max={WEIGHT_RANGE.max}
            value={data.currentWeightKg}
            onChange={(e) =>
              update({ currentWeightKg: e.target.value === "" ? "" : Number(e.target.value) })
            }
            placeholder="78.4"
            aria-invalid={Boolean(weightError)}
          />
          {weightError && <p className="mt-1 text-xs text-[#FF5C00]">{weightError}</p>}
          {!weightError && (
            <p className="mt-1 text-xs text-zinc-500">
              Від {WEIGHT_RANGE.min} до {WEIGHT_RANGE.max} кг
            </p>
          )}
        </div>
      </div>

      <div>
        <FieldLabel hint="років">Вік</FieldLabel>
        <TextInput
          type="number"
          inputMode="numeric"
          min={AGE_RANGE.min}
          max={AGE_RANGE.max}
          value={data.age}
          onChange={(e) => update({ age: e.target.value === "" ? "" : Number(e.target.value) })}
          placeholder="29"
          aria-invalid={Boolean(ageError)}
        />
        {ageError && <p className="mt-1 text-xs text-[#FF5C00]">{ageError}</p>}
        {!ageError && (
          <p className="mt-1 text-xs text-zinc-500">
            Від {AGE_RANGE.min} до {AGE_RANGE.max} років
          </p>
        )}
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
