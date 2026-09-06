import React from "react";
import { ArchiveAnalytics } from "@/widgets/archive-analytics";
import { ArchiveHistoryList } from "@/widgets/archive-history-list";

export const ArchivePage: React.FC = () => {
  return (
    <div className="max-w-6xl w-full mx-auto p-8 space-y-6">
      {/* 1. Верхний виджет: график веса и столбики бюджета */}
      <ArchiveAnalytics />

      {/* 2. Нижний виджет: список прошедших недель */}
      <ArchiveHistoryList />
    </div>
  );
};