import React from "react";

interface Props {
  availableTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export const FeedbackTagsSelector: React.FC<Props> = ({
  availableTags,
  selectedTags,
  onToggleTag,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {availableTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggleTag(tag)}
            className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              isSelected
                ? "bg-[#D2F832] border-black text-black shadow-sm"
                : "bg-[#DFDACB]/40 border-[#D8D2C2] text-zinc-600 hover:border-zinc-500 hover:text-zinc-900"
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};