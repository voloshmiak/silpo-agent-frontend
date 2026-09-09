import React from "react";
import { Button } from "@/shared/ui";

interface Props {
  totalPrice: number;
}

const SILPO_URL = "https://silpo.ua/";

export const OrderCartButton: React.FC<Props> = ({ totalPrice }) => {
  const handleOrder = () => {
    window.location.assign(SILPO_URL);
  };

  return (
    <Button
      variant="lime"
      size="lg"
      className="w-full text-xs font-black tracking-wider"
      onClick={handleOrder}
    >
      Замовити · {totalPrice.toLocaleString("uk-UA")} ₴
    </Button>
  );
};