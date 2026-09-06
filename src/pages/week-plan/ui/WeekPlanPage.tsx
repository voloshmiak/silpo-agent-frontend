import React, { useState } from "react";
import { WeeklyMacros } from "@/widgets/weekly-macros";
import { MealTimeline } from "@/widgets/meal-timeline";
import { CartSummary } from "@/widgets/cart-summary";
import { mockMealItems, mockDailyMacros, type MealItem } from "@/entities/meal";
import { mockCartData } from "@/entities/cart";

export const WeekPlanPage: React.FC = () => {
  const [meals, setMeals] = useState<MealItem[]>(mockMealItems);
  const [macros] = useState(mockDailyMacros);
  const [cart] = useState(mockCartData);

  const handleToggleMeal = (id: string) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isCompleted: !m.isCompleted } : m))
    );
  };

  return (
    <div className="max-w-6xl w-full mx-auto p-8 space-y-6">
      {/* 1. Верхний виджет: дни недели + 4 плашки БЖУ */}
      <WeeklyMacros
        macros={macros}
        onRefreshClick={() => alert("Залишки оновлено")}
        onPhotoClick={() => alert("Відкрито сканування фото")}
      />

      {/* 2. Основная сетка: таймлайн блюд слева (2/3) и корзина Сільпо справа (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <MealTimeline
            meals={meals}
            onToggleComplete={handleToggleMeal}
          />
        </div>

        <div className="lg:col-span-1">
          <CartSummary
            cart={cart}
            onOrderSuccess={() => console.log("Замовлення успішно відправлено!")}
          />
        </div>
      </div>
    </div>
  );
};