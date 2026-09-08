export interface CartProduct {
  id: string;
  title: string;
  brand: string;
  weightVolume: string;
  count: number;
  price: number;
  discountPercent?: number;
  /** Прев'ю товару з каталогу «Сільпо» */
  imageUrl?: string;
  /** Посилання на картку товару на silpo.ua */
  url?: string;
}

export interface CartData {
  items: CartProduct[];
  totalPrice: number;
  discountSaved: number;
  budgetLimit: number;
  deliveryTimeSlot: string;
}