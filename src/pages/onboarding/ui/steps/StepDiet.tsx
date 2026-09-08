import React from "react";
import type { OnboardingFormData } from "../../model/useOnboardingForm";
import { FieldLabel, PillSelect, MultiSelectChips, TextArea } from "@/shared/ui";

interface Props {
  data: OnboardingFormData;
  update: (partial: Partial<OnboardingFormData>) => void;
}

const DIET_OPTIONS = [
  { value: "Без обмежень", label: "Без обмежень" },
  { value: "Вегетаріанська", label: "Вегетаріанська" },
  { value: "Веганська", label: "Веганська" },
  { value: "Кето", label: "Кето" },
  { value: "Палео", label: "Палео" },
  { value: "Низький FODMAP", label: "Низький FODMAP" },
] as const;

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
          options={DIET_OPTIONS}
          value={data.dietType as (typeof DIET_OPTIONS)[number]["value"]}
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
