/** Форматирует число в украинские гривны: 1850.4 -> "1 850,40 ₴" */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ₴`;
}

/** Форматирует целую сумму без копеек: 2000 -> "2 000 ₴" */
export function formatCurrencyInt(amount: number): string {
  return `${amount.toLocaleString("uk-UA")} ₴`;
}

/** Форматирует вес: 78.4 -> "78,4 кг" */
export function formatWeight(kg: number): string {
  return `${kg.toString().replace(".", ",")} кг`;
}