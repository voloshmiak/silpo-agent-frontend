import React from "react";
import { Card, Button, Badge, FieldLabel, TextInput, TextArea } from "@/shared/ui";
import type { NextWeekInfo } from "@/entities/plan";

function formatMonday(date: Date): string {
  return date.toLocaleDateString("uk-UA", { day: "numeric", month: "long", timeZone: "UTC" });
}

interface Props {
  /** Страви з оцінкою «погано» — агент прибере їх з раціону */
  excludedDishes: string[];
  /** Страви з оцінкою «смачно» */
  likedDishes: string[];
  /** Страви з оцінкою «нормально» */
  neutralDishes: string[];
  /** null — бекенд не віддав номер тижня, тоді без номера */
  nextWeek: NextWeekInfo | null;
  tags: string[];
  fridge: string;
  onFridgeChange: (value: string) => void;
  note: string;
  onNoteChange: (value: string) => void;
  onBuild: () => void;
  onSaveOnly: () => void;
  isSaving: boolean;
  isSaved: boolean;
  error: string | null;
}

const MAX_TITLES = 3;

function listPreview(items: string[]): string {
  if (items.length <= MAX_TITLES) return items.join(", ");
  return `${items.slice(0, MAX_TITLES).join(", ")} і ще ${items.length - MAX_TITLES}`;
}

/**
 * Що саме піде агенту в наступну генерацію. Показуємо тільки те, що вибрав
 * користувач: як агент цим скористається, видно вже в «Коментарі агента»
 * нового плану — наперед бекенд цього не повідомляє.
 */
export const AgentDecisionWidget: React.FC<Props> = ({
  excludedDishes,
  likedDishes,
  neutralDishes,
  nextWeek,
  tags,
  fridge,
  onFridgeChange,
  note,
  onNoteChange,
  onBuild,
  onSaveOnly,
  isSaving,
  isSaved,
  error,
}) => {
  const hasFeedback =
    excludedDishes.length > 0 || likedDishes.length > 0 || neutralDishes.length > 0 || tags.length > 0;

  const rows = [
    { badge: "Не смакує", badgeColor: "bg-[#FF5C00] text-white", items: excludedDishes },
    { badge: "Смакує", badgeColor: "bg-[#D2F832] text-black border border-black/20", items: likedDishes },
    { badge: "Нормально", badgeColor: "bg-[#DFDACB] text-zinc-800", items: neutralDishes },
    { badge: "Теги", badgeColor: "bg-[#DFDACB] text-zinc-800", items: tags },
  ].filter((row) => row.items.length > 0);

  const weekTitle = nextWeek ? `тиждень ${nextWeek.number}` : "новий план";
  const action = nextWeek?.isUpdate ? "оновити" : "побудувати";
  const buildLabel =
    hasFeedback && !isSaved
      ? `Зберегти й ${action} ${weekTitle} →`
      : `${action[0].toUpperCase()}${action.slice(1)} ${weekTitle} →`;
  const weekBadge = nextWeek
    ? `Тиждень ${nextWeek.number}${nextWeek.isUpdate ? " · оновлення" : ""}`
    : "Новий план";

  return (
    <Card className="p-6 flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-baseline gap-2">
          <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-900">
            Що отримає агент
          </h2>
          <Badge variant="lime">{weekBadge}</Badge>
        </div>

        {hasFeedback ? (
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.badge} className="flex items-start gap-2.5 text-xs">
                <span
                  className={`font-mono text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5 ${row.badgeColor}`}
                >
                  {row.badge}
                </span>
                <span className="text-zinc-800 leading-snug">{listPreview(row.items)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-600">
            Оцініть страви або виберіть теги. Без них агент візьме останній збережений фідбек.
          </p>
        )}

        <div className="pt-2 space-y-3">
          <div>
            <FieldLabel hint="через кому">Що є в холодильнику</FieldLabel>
            <TextInput
              value={fridge}
              onChange={(e) => onFridgeChange(e.target.value)}
              placeholder="яйця, рис, броколі"
            />
          </div>
          <div>
            <FieldLabel hint="необовʼязково">Побажання</FieldLabel>
            <TextArea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Наприклад: більше риби, швидкі сніданки"
              className="h-20"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#D8D2C2] space-y-2">
        {nextWeek && (
          <p className="text-[11px] text-zinc-600 leading-snug">
            План на тиждень з {formatMonday(nextWeek.startsOn)}
            {nextWeek.isUpdate && " — для нього вже є план, новий стане поточним"}.
          </p>
        )}

        {error && <p className="text-xs text-[#FF5C00] font-semibold">{error}</p>}

        <Button
          variant="lime"
          size="lg"
          className="w-full text-xs font-black"
          disabled={isSaving}
          onClick={onBuild}
        >
          {isSaving ? "Зберігаємо оцінки…" : buildLabel}
        </Button>

        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            Бюджет і обмеження — з профілю
          </p>
          {isSaved ? (
            <span className="text-[11px] text-[#2E7D32] font-semibold">Оцінки збережено</span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              disabled={!hasFeedback || isSaving}
              onClick={onSaveOnly}
            >
              Лише зберегти
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
