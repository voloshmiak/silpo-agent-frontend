import React, { useEffect, useState } from "react";
import { ArchiveAnalytics } from "@/widgets/archive-analytics";
import { ArchiveHistoryList } from "@/widgets/archive-history-list";
import { getPlans, getToken, type PlanRecord } from "@/shared/api";
import { ArchiveSkeleton } from "./ArchiveSkeleton";

export const ArchivePage: React.FC = () => {
  const [plans, setPlans] = useState<PlanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;

    getPlans(20, 0)
      .then(setPlans)
      .catch(() => setPlans([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <ArchiveSkeleton />;
  }

  return (
    <div className="max-w-6xl w-full mx-auto p-8 space-y-6">
      {/* 1. Верхний виджет: график веса и столбики бюджета */}
      <ArchiveAnalytics />

      {/* 2. Нижний виджет: список прошедших недель */}
      <ArchiveHistoryList plans={plans} />
    </div>
  );
};
