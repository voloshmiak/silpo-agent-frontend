import React, { useState } from "react";
import { Button } from "@/shared/ui";

interface Props {
  totalPrice: number;
  onOrderSuccess?: () => void;
}

export const OrderCartButton: React.FC<Props> = ({ totalPrice, onOrderSuccess }) => {
  const [isOrdering, setIsOrdering] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const handleOrder = async () => {
    setIsOrdering(true);
    try {
      // Имитация отправки заказа в API Сільпо
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsOrdered(true);
      onOrderSuccess?.();
    } finally {
      setIsOrdering(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="w-full py-3 bg-[#DFDACB] border border-[#2E7D32] text-[#2E7D32] rounded-xl text-center font-mono font-bold text-xs uppercase">
        ✓ Замовлення оформлено
      </div>
    );
  }

  return (
    <Button
      variant="lime"
      size="lg"
      className="w-full text-xs font-black tracking-wider"
      disabled={isOrdering}
      onClick={handleOrder}
    >
      {isOrdering ? "Оформлення..." : `Замовити в один клік · ${totalPrice.toLocaleString("uk-UA")} ₴`}
    </Button>
  );
};