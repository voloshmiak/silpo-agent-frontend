import type { CartData } from "./types";

export const mockCartData: CartData = {
  items: [
    {
      id: "c-1",
      title: "Філе куряче охолоджене",
      brand: "Наша Ряба",
      weightVolume: "1 кг",
      count: 2,
      price: 189.8,
    },
    {
      id: "c-2",
      title: "Йогурт грецький 10%",
      brand: "Галичина",
      weightVolume: "400 г",
      count: 4,
      price: 131.6,
      discountPercent: 25,
    },
    {
      id: "c-3",
      title: "Булгур",
      brand: "Жменька",
      weightVolume: "900 г",
      count: 1,
      price: 78.9,
    },
    {
      id: "c-4",
      title: "Ягоди заморожені, мікс",
      brand: "Rud",
      weightVolume: "300 г",
      count: 2,
      price: 159.0,
    },
    {
      id: "c-5",
      title: "Молоко мигдалеве",
      brand: "Alpro",
      weightVolume: "1 л",
      count: 3,
      price: 197.7,
      discountPercent: 15,
    },
  ],
  totalPrice: 1850.4,
  discountSaved: 214.6,
  budgetLimit: 2000,
  deliveryTimeSlot: "18:00–20:00",
};