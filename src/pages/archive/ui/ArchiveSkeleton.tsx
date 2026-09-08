import React from "react";

/** Плейсхолдер картки з графіком: підпис, велике число і поле діаграми. */
const SkeletonChart: React.FC = () => (
  <div className="bg-[#EBE7DC] border border-[#D8D2C2] rounded-xl p-6 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="skeleton-block h-2.5 w-32" />
        <div className="skeleton-block h-8 w-40" />
      </div>
      <div className="skeleton-block h-4 w-28" />
    </div>

    <div className="skeleton-block h-40 w-full" />

    <div className="pt-3 border-t border-[#D8D2C2] flex justify-between">
      <div className="skeleton-block h-3 w-24" />
      <div className="skeleton-block h-3 w-24" />
    </div>
  </div>
);

export const ArchiveSkeleton: React.FC = () => (
  <div className="max-w-6xl w-full mx-auto p-8 space-y-6 skeleton-sweep" aria-busy="true">
    <span className="sr-only">Завантажуємо архів…</span>

    {/* Шапка з перемикачем періоду */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="skeleton-block h-8 w-72" />
        <div className="skeleton-block h-3 w-80" />
      </div>
      <div className="flex items-center gap-2">
        <div className="skeleton-block h-9 w-44" />
        <div className="skeleton-block h-8 w-32" />
      </div>
    </div>

    {/* Два графіки */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonChart />
      <SkeletonChart />
    </div>

    {/* Список тижнів */}
    <div className="bg-[#EBE7DC] border border-[#D8D2C2] rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="skeleton-block h-3 w-56" />
        <div className="skeleton-block h-3 w-32" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 py-1">
            <div className="space-y-2 flex-1">
              <div className="skeleton-block h-3 w-48" />
              <div className="skeleton-block h-2.5 w-full max-w-[420px]" />
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="skeleton-block h-3 w-16" />
              <div className="skeleton-block h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
