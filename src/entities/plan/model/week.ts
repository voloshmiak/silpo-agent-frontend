import type { PlanRecord, PlanStreamParams } from "@/shared/api";

export type PlanWeekTarget = NonNullable<PlanStreamParams["week"]>;

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Понеділок тижня в UTC — саме так межу тижня рахує бекенд. */
function utcMonday(date: Date): number {
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - daysSinceMonday);
}

function planMonday(record: PlanRecord): number | null {
  if (!record.week_start_date) return null;
  const start = new Date(record.week_start_date);
  return Number.isNaN(start.getTime()) ? null : utcMonday(start);
}

/**
 * Тиждень, до якого належить уже збережений план, у термінах `/plan/stream`.
 * Перегенерація має лягти на той самий тиждень: план, складений у неділю на
 * наступний, інакше «переїхав» би на поточний.
 */
export function planWeekTarget(record: PlanRecord, now = new Date()): PlanWeekTarget {
  const monday = planMonday(record);
  return monday !== null && monday > utcMonday(now) ? "next" : "current";
}

/** Куди ляже наступний план і який номер тижня він отримає. */
export interface NextWeekInfo {
  number: number;
  week: PlanWeekTarget;
  /** Для цього тижня план уже є — новий стане ще одним планом того ж тижня */
  isUpdate: boolean;
  /** Понеділок тижня плану, опівніч UTC */
  startsOn: Date;
}

/**
 * Наступний план після останнього. Якщо останній план — на поточний тиждень
 * (або вже на наступний), будуємо наступний тиждень; якщо він старший —
 * поточний. Номер рахується так само, як `PlanRepo.NextWeekInfo` на бекенді:
 * той самий тиждень — той самий номер, тиждень одразу після — +1, інакше 1.
 */
export function predictNextWeek(record: PlanRecord | null, now = new Date()): NextWeekInfo | null {
  if (!record?.week_number) return null;
  const lastMonday = planMonday(record);
  if (lastMonday === null) return null;

  const thisMonday = utcMonday(now);
  const week: PlanWeekTarget = lastMonday >= thisMonday ? "next" : "current";
  const target = week === "next" ? thisMonday + WEEK_MS : thisMonday;

  const number =
    lastMonday === target
      ? record.week_number
      : lastMonday === target - WEEK_MS
      ? record.week_number + 1
      : 1;

  return { number, week, isUpdate: lastMonday === target, startsOn: new Date(target) };
}
