import React from "react";

export const WeekPlanSkeleton: React.FC = () => (
  <div className="max-w-6xl w-full mx-auto p-8 space-y-6 skeleton-sweep" aria-busy="true">
    <span className="sr-only">Завантажуємо план тижня…</span>

    {/* Заголовок тижня та кнопки */}
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="skeleton-block h-8 w-48" />
        <div className="skeleton-block h-3 w-72" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton-block h-8 w-36" />
        <div className="skeleton-block h-8 w-36" />
      </div>
    </div>

    {/* Селектор днів */}
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 7 }).map((_, idx) => (
        <div key={idx} className="skeleton-block h-[72px]" />
      ))}
    </div>

    {/* Картки КБЖУ */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-[#EBE7DC] border border-[#D8D2C2] rounded-xl p-4 space-y-2.5"
        >
          <div className="skeleton-block h-2.5 w-20" />
          <div className="skeleton-block h-7 w-24" />
          <div className="skeleton-block h-2.5 w-28" />
          <div className="skeleton-block h-1.5 w-full" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Таймлайн прийомів їжі */}
      <div className="lg:col-span-2 bg-[#EBE7DC] border border-[#D8D2C2] rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="skeleton-block h-3 w-56" />
          <div className="skeleton-block h-3 w-28" />
        </div>

        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="border border-[#D8D2C2] rounded-xl p-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="skeleton-block w-10 h-10 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="skeleton-block h-2.5 w-32" />
                <div className="skeleton-block h-3 w-full max-w-[260px]" />
                <div className="skeleton-block h-2.5 w-40" />
              </div>
            </div>
            <div className="skeleton-block h-5 w-10 shrink-0" />
          </div>
        ))}
      </div>

      {/* Кошик */}
      <div className="lg:col-span-1 bg-[#EBE7DC] border border-[#D8D2C2] rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="skeleton-block h-3 w-32" />
          <div className="skeleton-block h-3 w-16" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="skeleton-block w-10 h-10 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="skeleton-block h-2.5 w-full max-w-[120px]" />
                  <div className="skeleton-block h-2 w-20" />
                </div>
              </div>
              <div className="skeleton-block h-3 w-14 shrink-0" />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#D8D2C2] space-y-3">
          <div className="flex justify-between items-center">
            <div className="skeleton-block h-2.5 w-16" />
            <div className="skeleton-block h-7 w-28" />
          </div>
          <div className="skeleton-block h-1.5 w-full" />
          <div className="skeleton-block h-11 w-full" />
        </div>
      </div>
    </div>
  </div>
);
