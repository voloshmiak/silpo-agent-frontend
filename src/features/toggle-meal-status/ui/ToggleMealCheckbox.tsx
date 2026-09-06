import React from "react";
import { Checkbox } from "@/shared/ui";

interface Props {
  isCompleted: boolean;
  mealId: string;
  onToggle?: (id: string, nextStatus: boolean) => void;
}

export const ToggleMealCheckbox: React.FC<Props> = ({
  isCompleted,
  mealId,
  onToggle,
}) => {
  return (
    <Checkbox
      checked={isCompleted}
      onChange={(checked) => onToggle?.(mealId, checked)}
    />
  );
};