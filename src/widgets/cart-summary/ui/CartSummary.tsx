import React from "react";
import { Card, Progress, Badge } from "@/shared/ui";
import { CartProductRow, type CartData } from "@/entities/cart";
import { OrderCartButton } from "@/features/order-silpo-cart";
import { formatCurrency } from "@/shared/lib";

interface Props {
  cart: CartData;
  onOrderSuccess?: () => void;
}

export const CartSummary: React.FC<Props> = ({ cart, onOrderSuccess }) => {
  const budgetPercentage = Math.min(
    100,
    Math.round((cart.totalPrice / cart.budgetLimit) * 100)
  );
  const remaining = cart.budgetLimit - cart.totalPrice;

  return (
    <Card className="p-6 flex flex-col justify-between space-y-6">
      <div>
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-sm font-mono font-black tracking-widest uppercase text-zinc-900">
            Кошик «Сільпо»
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            {cart.items.length} позицій
          </span>
        </div>

        {/* Список товаров */}
        <div className="space-y-1 divide-y divide-[#D8D2C2]/60">
          {cart.items.map((item) => (
            <CartProductRow key={item.id} product={item} />
          ))}
        </div>

        <div className="pt-2">
          <span className="text-xs font-mono text-zinc-500 cursor-pointer hover:text-zinc-800">
            + ще 9 позицій
          </span>
        </div>
      </div>

      {/* Итоговый расчет и кнопка действия */}
      <div className="space-y-4 pt-4 border-t border-[#D8D2C2]">
        <div className="flex justify-between items-end">
          <span className="text-xs uppercase font-mono text-zinc-500 font-bold">Разом</span>
          <span className="text-3xl font-mono font-black text-zinc-900">
            {formatCurrency(cart.totalPrice)}
          </span>
        </div>

        <div className="bg-[#DFDACB]/60 p-2.5 rounded-lg flex items-center justify-between text-xs">
          <Badge variant="orange">Акції</Badge>
          <span className="font-mono text-zinc-700">
            Заощаджено {cart.discountSaved.toFixed(2).replace(".", ",")} ₴
          </span>
        </div>

        {/* Прогресс бюджета */}
        <div>
          <Progress value={budgetPercentage} />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
            <span>{budgetPercentage}% бюджету</span>
            <span>лишилось {remaining > 0 ? remaining.toFixed(0) : 0} ₴</span>
          </div>
        </div>

        {/* Интерактивная кнопка из features */}
        <OrderCartButton
          totalPrice={cart.totalPrice}
          onOrderSuccess={onOrderSuccess}
        />

        <div className="text-center text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
          Доставка сьогодні · {cart.deliveryTimeSlot}
        </div>
      </div>
    </Card>
  );
};