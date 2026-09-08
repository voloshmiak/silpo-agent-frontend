/**
 * Людські назви кроків для екрана генерації.
 *
 * Ключі — імена інструментів, які агент може викликати: MCP-інструменти
 * «Сільпо» (tool_bridge.py), локальні калькулятори (local_tools.py) та
 * finalize_plan. Синоніми навмисно згруповані під один рядок — користувачу
 * важлива стадія, а не конкретний виклик.
 */
export const TOOL_LABELS: Record<string, string> = {
  calc_targets: "Рахуємо цільові калорії та БЖВ",

  silpo_get_my_profile: "Враховуємо ваш профіль і обмеження",
  silpo_get_my_food_restrictions: "Враховуємо ваш профіль і обмеження",

  silpo_list_branches: "Шукаємо найближчий магазин",

  silpo_find_products_batch: "Шукаємо продукти в «Сільпо»",
  silpo_get_products: "Шукаємо продукти в «Сільпо»",
  silpo_get_categories_tree: "Шукаємо продукти в «Сільпо»",

  silpo_get_product_details: "Уточнюємо склад продукту",

  silpo_get_similar_products: "Підбираємо заміни",
  silpo_get_replacements: "Підбираємо заміни",

  silpo_get_promotions: "Ловимо акції та купони",
  silpo_get_my_promos: "Ловимо акції та купони",
  silpo_get_my_coupons: "Ловимо акції та купони",
  silpo_get_my_premium_subscription: "Ловимо акції та купони",

  silpo_get_my_favorites: "Дивимось ваші вподобання",
  silpo_get_my_online_orders: "Дивимось ваші вподобання",
  silpo_get_my_offline_orders: "Дивимось ваші вподобання",

  silpo_get_my_shopping_cart: "Збираємо кошик",
  silpo_update_shopping_cart: "Збираємо кошик",
  silpo_add_or_update_cart_products: "Збираємо кошик",
  silpo_remove_cart_products: "Збираємо кошик",
  silpo_clear_shopping_cart: "Збираємо кошик",

  check_nutrition: "Перевіряємо баланс БЖВ",
  check_budget: "Звіряємо кошик із бюджетом",

  finalize_plan: "Складаємо фінальний план",
};

export const FINALIZE_TOOL = "finalize_plan";

export const INITIAL_STEP_LABEL = "Аналізуємо ваші дані";
export const FINISHING_STEP_LABEL = "Майже готово";

const FALLBACK_LABEL = "Працюємо з даними";

export function formatToolLabel(tool: string): string {
  return TOOL_LABELS[tool] ?? FALLBACK_LABEL;
}
