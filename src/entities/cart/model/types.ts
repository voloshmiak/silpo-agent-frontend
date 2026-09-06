export interface CartProduct {
  id: string;
  title: string;
  brand: string;
  weightVolume: string;
  count: number;
  price: number;
  discountPercent?: number;
}

export interface CartData {
  items: CartProduct[];
  totalPrice: number;
  discountSaved: number;
  budgetLimit: number;
  deliveryTimeSlot: string;
}