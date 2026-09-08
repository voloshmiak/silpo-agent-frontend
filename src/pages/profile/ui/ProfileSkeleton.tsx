import React from "react";

/** Плейсхолдер однієї картки: шапка + рядки різної довжини. */
const SkeletonCard: React.FC<{ rows: number[]; footer?: boolean }> = ({ rows, footer }) => (
  <section className="bg-[#EBE7DC] border border-[#D8D2C2] rounded-xl p-5 space-y-3">
    <div className="flex justify-between items-center">
      <div className="skeleton-block h-3 w-40" />
      <div className="skeleton-block h-2.5 w-24" />
    </div>

    <div className="space-y-2.5 pt-1">
      {rows.map((width, idx) => (
        <div key={idx} className="flex justify-between items-center gap-4">
          <div className="skeleton-block h-3" style={{ width: `${width}%` }} />
          <div className="skeleton-block h-7 w-20 shrink-0" />
        </div>
      ))}
    </div>

    {footer && <div className="skeleton-block h-14 w-full mt-1" />}
  </section>
);

/** Тижнева сітка днів — окрема форма, бо в картці режиму це 7 квадратів. */
const SkeletonSchedule: React.FC = () => (
  <section className="bg-[#EBE7DC] border border-[#D8D2C2] rounded-xl p-5 space-y-4">
    <div className="flex justify-between items-center">
      <div className="skeleton-block h-3 w-36" />
      <div className="skeleton-block h-2.5 w-28" />
    </div>

    <div className="grid grid-cols-7 gap-1.5">
      {Array.from({ length: 7 }).map((_, idx) => (
        <div key={idx} className="skeleton-block h-11" />
      ))}
    </div>

    <div className="skeleton-block h-16 w-full" />
  </section>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="max-w-6xl w-full mx-auto p-8 space-y-6 skeleton-sweep" aria-busy="true">
    <span className="sr-only">Завантажуємо параметри…</span>

    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="skeleton-block h-7 w-80" />
        <div className="skeleton-block h-3 w-64" />
      </div>
      <div className="flex gap-3">
        <div className="skeleton-block h-9 w-24" />
        <div className="skeleton-block h-9 w-36" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SkeletonCard rows={[38, 34, 24, 42, 26, 30]} />
      <SkeletonSchedule />
      <SkeletonCard rows={[46, 40, 32]} footer />
      <SkeletonCard rows={[30, 44, 36]} footer />
    </div>
  </div>
);
