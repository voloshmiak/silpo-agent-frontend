import React from "react";
import { SilpoCatcher } from "./SilpoCatcher";

interface Props {
  /** Поточний крок агента — людський рядок із toolLabels. */
  step: string;
  title?: string;
  hint?: string;
  generatedPassword?: string;
}

export const PlanGenerationLoader: React.FC<Props> = ({
  step,
  title = "Агент будує ваш план",
  hint = "Це займе трохи часу — читаємо каталог «Сільпо» й рахуємо БЖВ",
  generatedPassword,
}) => (
  <div className="w-[clamp(320px,60vw,2000px)] bg-[#ECE8DC] border border-[#D8D2C2] rounded-2xl p-6 sm:p-8 text-center space-y-5">
    <div className="space-y-2">
      <h2 className="text-xl font-black font-mono uppercase tracking-tight">{title}</h2>
      <p className="text-xs text-zinc-500">{hint}</p>
    </div>

    <div className="flex items-center justify-center gap-3">
      <span className="flex items-end gap-1" aria-hidden="true">
        <i className="plan-dot w-1 h-1 rounded-full bg-zinc-500" />
        <i className="plan-dot plan-dot-2 w-1.5 h-1.5 rounded-full bg-zinc-700" />
        <i className="plan-dot plan-dot-3 w-1 h-1 rounded-full bg-zinc-500" />
      </span>
      <span key={step} className="plan-step-text font-mono text-sm font-semibold tracking-tight" role="status" aria-live="polite">
        {step}…
      </span>
    </div>

    <SilpoCatcher />
    {generatedPassword && (
      <div className="rounded-lg border border-[#D8D2C2] bg-[#F4F1E8] px-3 py-2 text-left text-xs">
        <p className="font-semibold text-zinc-700">Пароль для входу:</p>
        <code className="font-mono text-sm text-zinc-900">{generatedPassword}</code>
        <p className="mt-1 text-[10px] text-zinc-500">Збережіть його, якщо лист не прийшов.</p>
      </div>
    )}
  </div>
);
