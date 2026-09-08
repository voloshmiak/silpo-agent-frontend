import React from "react";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Профіль", path: "/profile" },
  { label: "Тиждень", path: "/week" },
  { label: "Архів", path: "/archive" },
  { label: "Фідбек", path: "/feedback" },
];

interface HeaderProps {
  onLogout?: () => void;
  userName?: string;
}

/** «Михайло Волошенко» → «МВ», «Іван» → «ІВ». */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "—";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export const Header: React.FC<HeaderProps> = ({ onLogout, userName = "" }) => {
  return (
    <header className="w-full bg-[#F4F1E8] border-b border-[#D8D2C2] px-8 py-3.5 flex items-center justify-between">
      {/* Левая часть: логотип и навигация */}
      <div className="flex items-center gap-10">
        <span className="font-mono tracking-[0.25em] text-sm font-semibold uppercase text-zinc-900">
          SILPOFIT
        </span>

        <nav className="flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative pb-1 text-sm transition-colors ${
                  isActive
                    ? "font-bold text-zinc-900"
                    : "font-medium text-zinc-500 hover:text-zinc-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-[-14px] left-0 w-full h-[3px] bg-[#D2F832] rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Правая часть: аватар и выход */}
      <div className="flex items-center gap-3">
        <div
          title={userName || undefined}
          className="w-8 h-8 rounded bg-zinc-900 text-[#F4F1E8] font-mono text-xs flex items-center justify-center font-bold"
        >
          {getInitials(userName)}
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="px-3 py-1.5 rounded-md border border-[#D8D2C2] text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          Вийти
        </button>
      </div>
    </header>
  );
};