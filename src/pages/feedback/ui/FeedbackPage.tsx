import React from "react";
import { DishRatingWidget } from "@/widgets/dish-rating-widget";
import { AgentDecisionWidget } from "@/widgets/agent-decision-widget";

export const FeedbackPage: React.FC = () => {
  return (
    <div className="max-w-6xl w-full mx-auto p-8 space-y-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-3xl font-black font-mono tracking-tight uppercase text-zinc-900">
          Фідбек за Тиждень 12
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Ваші відповіді тренують персональну модель харчування
        </p>
      </div>

      {/* Основная сетка: Оценка блюд слева (2/3) и Решение агента справа (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <DishRatingWidget />
        </div>

        <div className="lg:col-span-1">
          <AgentDecisionWidget />
        </div>
      </div>
    </div>
  );
};