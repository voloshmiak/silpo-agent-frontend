export interface CartProduct {
  id: string;
  title: string;
  brand: string;
  /** Фасування однієї одиниці: «330 г», «1 кг». Порожнє для вагового товару */
  weightVolume: string;
  /** Готовий підпис кількості: «2 шт», «0.75 кг» — одиниця залежить від товару */
  countLabel: string;
  /** Ціна за одиницю після знижок */
  unitPrice: number;
  /** Сума всієї позиції після знижок — саме вона показується в рядку */
  total: number;
  /** Сума позиції до знижок; показується закресленою, якщо є знижка */
  oldTotal?: number;
  discountPercent?: number;
  /** Прев'ю товару з каталогу «Сільпо» */
  imageUrl?: string;
  /** Посилання на картку товару на silpo.ua */
  url?: string;
}

export interface CartData {
  items: CartProduct[];
  /** Сума товарів після знижок */
  productsTotal: number;
  /** Вартість доставки */
  deliveryPrice: number;
  /** До сплати: товари зі знижками + доставка */
  totalPrice: number;
  discountSaved: number;
  budgetLimit: number;
  deliveryTimeSlot: string;
}