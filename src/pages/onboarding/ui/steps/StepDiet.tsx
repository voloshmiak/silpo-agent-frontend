import React from "react";
import type { OnboardingFormData } from "../../model/useOnboardingForm";
import { FieldLabel, PillSelect, MultiSelectChips, TextArea } from "@/shared/ui";
import { DIET_TYPE_OPTIONS } from "@/entities/user";

interface Props {
  data: OnboardingFormData;
  update: (partial: Partial<OnboardingFormData>) => void;
}

const ALLERGEN_OPTIONS = ["Лактоза", "Горіхи", "Глютен", "Морепродукти", "Соя", "Яйця"] as const;

const STOP_PRODUCT_OPTIONS = [
  "Гриби",
  "Кінза",
  "Печінка",
  "Часник",
  "Цибуля",
  "Морква",
  "Гострий перець",
] as const;

export const StepDiet: React.FC<Props> = ({ data, update }) => {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel>Тип харчування</FieldLabel>
        <PillSelect
          options={DIET_TYPE_OPTIONS}
          value={data.dietType}
          onChange={(dietType) => update({ dietType })}
        />
      </div>

      <div>
        <FieldLabel hint="виключаються жорстко">Алергени</FieldLabel>
        <MultiSelectChips
          options={ALLERGEN_OPTIONS}
          values={data.allergens}
          onChange={(allergens) => update({ allergens })}
          activeVariant="orange"
        />
      </div>

      <div>
        <FieldLabel hint="агент їх ігнорує">Стоп-продукти</FieldLabel>
        <MultiSelectChips
          options={STOP_PRODUCT_OPTIONS}
          values={data.stopProducts}
          onChange={(stopProducts) => update({ stopProducts })}
          activeVariant="outline"
        />
      </div>

      <div>
        <FieldLabel>Додаткові побажання</FieldLabel>
        <TextArea
          value={data.note}
          onChange={(e) => update({ note: e.target.value })}
          placeholder="Наприклад: хочу більше риби, готую швидко"
        />
      </div>
    </div>
  );
};
