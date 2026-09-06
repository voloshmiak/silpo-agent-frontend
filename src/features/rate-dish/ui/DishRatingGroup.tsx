import React from "react";

export type RatingScore = "bad" | "neutral" | "good";

interface Props {
  dishId: string;
  value?: RatingScore;
  onChange?: (dishId: string, rating: RatingScore) => void;
}

export const DishRatingGroup: React.FC<Props> = ({ dishId, value, onChange }) => {
  const options: { score: RatingScore; emoji: string }[] = [
    { score: "bad", emoji: "😖" },
    { score: "neutral", emoji: "😐" },
    { score: "good", emoji: "😋" },
  ];

  return (
    <div className="flex items-center gap-1.5 bg-[#DFDACB]/60 p-1 rounded-xl border border-[#D8D2C2]">
      {options.map((opt) => {
        const isSelected = value === opt.score;
        return (
          <button
            key={opt.score}
            type="button"
            onClick={() => onChange?.(dishId, opt.score)}
            className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all cursor-pointer ${
              isSelected
                ? "bg-[#D2F832] border border-black scale-105 shadow-sm"
                : "opacity-40 hover:opacity-100"
            }`}
          >
            {opt.emoji}
          </button>
        );
      })}
    </div>
  );
};