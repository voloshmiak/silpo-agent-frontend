import React, { useState } from "react";
import { Card, Button, Badge } from "@/shared/ui";

export const AgentDecisionWidget: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const changesList = [
    {
      badge: "ВИЛУЧЕНО",
      badgeColor: "bg-[#FF5C00] text-white",
      text: "Форель запечена прибрана з раціону на наступні 3 тижні",
    },
    {
      badge: "СПРОЩЕНО",
      badgeColor: "bg-[#D2F832] text-black border border-black/20",
      text: "Середній час приготування обідів зменшено з 35 хв до 20 хв",
    },
    {
      badge: "СІЛЬПО",
      badgeColor: "bg-[#DFDACB] text-zinc-800",
      text: "Автозаміна на напівфабрикати власного виробництва «Сільпо» (котлети з індички)",
    },
    {
      badge: "КАЛОРІЇ",
      badgeColor: "bg-[#DFDACB] text-zinc-800",
      text: "Планка збережена: 1 780 ккал/день (дефіцит підтверджено)",
    },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsGenerating(false);
    setIsGenerated(true);
  };

  return (
    <Card className="p-6 flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-900">
            Що агент змінить
          </h2>
          <Badge variant="lime">Тиждень 13</Badge>
        </div>

        <p className="text-xs text-zinc-600">
          На основі ваших оцінок та тегу «Занадто складно готувати» алгоритм оновив параметри генерації:
        </p>

        {/* Список изменений */}
        <div className="space-y-3 pt-2">
          {changesList.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs">
              <span
                className={`font-mono text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5 ${item.badgeColor}`}
              >
                {item.badge}
              </span>
              <span className="text-zinc-800 leading-snug">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Кнопка действия */}
      <div className="pt-4 border-t border-[#D8D2C2] space-y-2">
        {isGenerated ? (
          <div className="w-full py-3 bg-[#D2F832] border border-black text-black font-mono font-black text-xs uppercase text-center rounded-xl">
            ✓ Тиждень 13 сформовано!
          </div>
        ) : (
          <Button
            variant="lime"
            size="lg"
            className="w-full text-xs font-black"
            disabled={isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? "Генерація плану..." : "Побудувати тиждень 13 →"}
          </Button>
        )}

        <p className="text-center text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
          Збереже бюджет до 2 000 ₴
        </p>
      </div>
    </Card>
  );
};