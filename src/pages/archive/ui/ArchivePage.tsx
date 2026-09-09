import React from "react";
import { ArchiveAnalytics } from "@/widgets/archive-analytics";
import { ArchiveHistoryList } from "@/widgets/archive-history-list";
import { getPlans, type PlanRecord } from "@/shared/api";
import { PageError } from "@/shared/ui";
import { useLoadedData } from "@/shared/lib";
import { ArchiveSkeleton } from "./ArchiveSkeleton";

export const ArchivePage: React.FC = () => {
  const {
    data: plans,
    isLoading,
    error,
    reload,
  } = useLoadedData<PlanRecord[]>(() => getPlans(20, 0));

  // Порожній архів — не помилка: сюди веде лише збій запиту.
  if (isLoading || error) {
    return (
      <>
        <ArchiveSkeleton />
        {error && <PageError message={error} onRetry={reload} />}
      </>
    );
  }

  return (
    <div className="max-w-6xl w-full mx-auto p-8 space-y-6">
      {/* 1. Верхний виджет: график веса и столбики бюджета */}
      <ArchiveAnalytics />

      {/* 2. Нижний виджет: список прошедших недель */}
      <ArchiveHistoryList plans={plans ?? []} />
    </div>
  );
};
