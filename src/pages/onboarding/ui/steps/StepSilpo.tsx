import React, { useState } from "react";
import { Button } from "@/shared/ui";
import { loginWithSilpo } from "@/shared/api";
import type { OnboardingFormData } from "../../model/useOnboardingForm";

interface Props {
  data: OnboardingFormData;
  update: (partial: Partial<OnboardingFormData>) => void;
}

export const StepSilpo: React.FC<Props> = ({ data, update }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = Boolean(data.silpoAccessToken);

  const handleLogin = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const tokens = await loginWithSilpo();
      update({
        silpoAccessToken: tokens.accessToken,
        silpoRefreshToken: tokens.refreshToken ?? "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося увійти");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-xs text-zinc-600 leading-relaxed">
        Агент працює з вашим справжнім акаунтом «Сільпо»: читає каталог і ціни вашого
        магазину, враховує акції та збирає кошик. Для цього потрібен вхід.
      </p>

      {isConnected ? (
        <div className="border border-[#2E7D32] bg-[#DFDACB]/60 rounded-xl p-4 flex items-center justify-between gap-3">
          <div>
            <div className="font-mono text-xs font-black uppercase tracking-wider text-[#2E7D32]">
              ✓ Акаунт підключено
            </div>
            <p className="text-[11px] text-zinc-600 mt-0.5">
              Токен збережеться на бекенді перед генерацією плану
            </p>
          </div>
          <button
            type="button"
            onClick={() => update({ silpoAccessToken: "", silpoRefreshToken: "" })}
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer shrink-0"
          >
            Змінити
          </button>
        </div>
      ) : (
        <Button
          variant="lime"
          size="lg"
          className="w-full"
          disabled={isConnecting}
          onClick={handleLogin}
        >
          {isConnecting ? "Очікуємо вхід…" : "Увійти через Сільпо →"}
        </Button>
      )}

      {error && <p className="text-xs text-[#FF5C00] font-semibold">{error}</p>}

      <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
        Вхід відкриється у новому вікні · пароль лишається в «Сільпо»
      </p>
    </div>
  );
};
