import React, { useState } from "react";
import type { CartProduct } from "../model/types";
import { formatCurrency } from "@/shared/lib";

interface Props {
  product: CartProduct;
}

export const CartProductRow: React.FC<Props> = ({ product }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(product.imageUrl) && !imageFailed;

  return (
    <div className="flex justify-between items-center py-2 text-xs gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {showImage ? (
          <img
            src={product.imageUrl}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="w-10 h-10 rounded bg-white border border-[#D8D2C2] object-contain shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded bg-[#DFDACB] border border-[#D8D2C2] flex items-center justify-center font-mono text-[9px] text-zinc-500 font-bold shrink-0">
            {product.brand.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="min-w-0">
          {product.url ? (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-zinc-900 leading-tight hover:text-[#FF5C00] hover:underline underline-offset-2 transition-colors"
            >
              {product.title}
            </a>
          ) : (
            <div className="font-semibold text-zinc-900 leading-tight">{product.title}</div>
          )}

          <div className="text-[11px] text-zinc-500 mt-0.5">
            {product.brand} · {product.weightVolume} · {product.count} шт
            {product.discountPercent && (
              <span className="ml-1.5 bg-[#FF5C00] text-white text-[9px] font-bold px-1 py-0.2 rounded font-mono">
                -{product.discountPercent}%
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="font-mono font-bold text-zinc-900 shrink-0">
        {formatCurrency(product.price)}
      </div>
    </div>
  );
};
