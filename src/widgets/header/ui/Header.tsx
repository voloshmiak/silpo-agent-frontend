import React from "react";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = "Тиждень",
  onTabChange,
}) => {
  const navItems = ["Профіль", "Тиждень", "Архів", "Фідбек"];

  return (
    <header className="w-full bg-[#F4F1E8] border-b border-[#D8D2C2] px-8 py-3.5 flex items-center justify-between">
      {/* Левая часть: логотип и навигация */}
      <div className="flex items-center gap-10">
        <span className="font-mono tracking-[0.25em] text-sm font-semibold uppercase text-zinc-900">
          SILPOFIT
        </span>

        <nav className="flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = activeTab === item;
            return (
              <button
                key={item}
                onClick={() => onTabChange?.(item)}
                className={`relative pb-1 text-sm transition-colors ${
                  isActive
                    ? "font-bold text-zinc-900"
                    : "font-medium text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-[-14px] left-0 w-full h-[3px] bg-[#D2F832] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Правая часть: бюджет и аватар */}
      <div className="flex items-center gap-4">
        <div className="text-xs font-mono tracking-wider text-zinc-700">
          1 850 ₴ <span className="text-zinc-400">/</span> 2 000 ₴
        </div>
        <div className="w-8 h-8 rounded bg-zinc-900 text-[#F4F1E8] font-mono text-xs flex items-center justify-center font-bold">
          MB
        </div>
      </div>
    </header>
  );
};