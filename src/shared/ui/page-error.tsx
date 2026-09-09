import React from "react";
import { Button } from "./button";

/**
 * Смуга помилки під скелетоном сторінки.
 *
 * Стоїть саме знизу, а не замість вмісту: скелетон показує, що екран існує і
 * чого саме бракує, а повідомлення пояснює, чому даних немає. Порожній екран
 * з одним рядком тексту читається як «тут нічого й не буває».
 */
export const PageError: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="max-w-6xl w-full mx-auto px-8 pb-8">
    <div
      role="alert"
      className="bg-[#EBE7DC] border border-[#FF5C00]/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div>
        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF5C00]">
          Не вдалося завантажити
        </p>
        <p className="text-sm text-zinc-700 mt-1">{message}</p>
      </div>

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0">
          Спробувати ще раз
        </Button>
      )}
    </div>
  </div>
);
