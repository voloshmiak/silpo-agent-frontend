import React from "react";

export const FeedbackSkeleton: React.FC = () => (
  <div className="max-w-6xl w-full mx-auto p-8 space-y-6 skeleton-sweep" aria-busy="true">
    <span className="sr-only">Завантажуємо тиждень для оцінки…</span>

    <div className="space-y-2">
      <div className="skeleton-block h-8 w-80" />
      <div className="skeleton-block h-3 w-96 max-w-full" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Оцінка страв */}
      <div className="lg:col-span-2 bg-[#EBE7DC] border border-[#D8D2C2] rounded-xl p-6 space-y-5">
        <div className="flex justify-between items-center">
          <div className="skeleton-block h-3 w-52" />
          <div className="skeleton-block h-3 w-24" />
        </div>

        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="border border-[#D8D2C2] rounded-xl p-3.5 flex items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="skeleton-block h-3 w-full max-w-[280px]" />
                <div className="skeleton-block h-2.5 w-36" />
              </div>
              <div className="flex gap-1.5 shrink-0">
                {Array.from({ length: 3 }).map((__, i) => (
                  <div key={i} className="skeleton-block w-9 h-9" />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#D8D2C2] space-y-3">
          <div className="flex justify-between items-center">
            <div className="skeleton-block h-3 w-56" />
            <div className="skeleton-block h-5 w-24" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[128, 96, 112, 84, 140, 104].map((width, idx) => (
              <div key={idx} className="skeleton-block h-8" style={{ width }} />
            ))}
          </div>
        </div>
      </div>

      {/* Рішення агента */}
      <div className="lg:col-span-1 bg-[#EBE7DC] border border-[#D8D2C2] rounded-xl p-6 space-y-5">
        <div className="flex justify-between items-center">
          <div className="skeleton-block h-3 w-40" />
          <div className="skeleton-block h-5 w-20" />
        </div>

        <div className="skeleton-block h-8 w-full" />

        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div className="skeleton-block h-4 w-16 shrink-0" />
              <div className="skeleton-block h-8 flex-1" />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#D8D2C2] space-y-2">
          <div className="skeleton-block h-11 w-full" />
          <div className="skeleton-block h-2.5 w-40 mx-auto" />
        </div>
      </div>
    </div>
  </div>
);
