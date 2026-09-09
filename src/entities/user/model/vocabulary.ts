/**
 * Значення, які їдуть у `user_settings` текстом, і їхні списки для інтерфейсу.
 *
 * Живуть тут, а не в екранах: онбординг і профіль редагують ті самі поля, а
 * бекенд зводить ці лейбли до ідентифікаторів ядра за таблицею аліасів. Два
 * незалежні списки означали б, що варіант, доданий на одному екрані, ядро не
 * впізнає — і прогін впаде на валідації замість того, щоб дати план.
 */

export const DIET_TYPES = [
  "Без обмежень",
  "Вегетаріанська",
  "Веганська",
  "Кето",
  "Палео",
  "Низький FODMAP",
] as const;

export type DietType = (typeof DIET_TYPES)[number];

export const PROMO_PRIORITIES = ["Високий", "Середній", "Низький"] as const;

export type PromoPriority = (typeof PROMO_PRIORITIES)[number];

function toOptions<T extends string>(values: readonly T[]) {
  return values.map((value) => ({ value, label: value }));
}

export const DIET_TYPE_OPTIONS = toOptions(DIET_TYPES);
export const PROMO_PRIORITY_OPTIONS = toOptions(PROMO_PRIORITIES);

/**
 * Значення з БД → канонічний лейбл. Бекенд може віддати інший регістр
 * («БЕЗ ОБМЕЖЕНЬ») — без зведення жодна плашка не підсвітилась би як обрана.
 */
function canonical<T extends string>(values: readonly T[], raw: string, fallback: T): T {
  const needle = (raw ?? "").trim().toLowerCase();
  return values.find((value) => value.toLowerCase() === needle) ?? fallback;
}

export function toDietType(raw: string): DietType {
  return canonical(DIET_TYPES, raw, "Без обмежень");
}

export function toPromoPriority(raw: string): PromoPriority {
  return canonical(PROMO_PRIORITIES, raw, "Середній");
}
