import type { PlanRecord } from "@/shared/api";

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

/** YYYY-MM-DD — формат `week_start` у `/plan/stream`. */
function toIsoDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * `week_start` для перегенерації збереженого плану, щоб новий ліг на той самий
 * тиждень: план, складений у неділю на наступний, інакше «переїхав» би на
 * поточний. Для плану з тижня, що вже минув, — undefined: такий тиждень бекенд
 * спланувати не дасть, і план ляже на поточний.
 */
export function planWeekStart(record: PlanRecord, now = new Date()): string | undefined {
  const monday = planMonday(record);
  return monday !== null && monday >= utcMonday(now) ? toIsoDate(monday) : undefined;
}

/** Куди ляже наступний план і який номер тижня він отримає. */
export interface NextWeekInfo {
  number: number;
  /** Понеділок тижня плану, YYYY-MM-DD — іде в `week_start` як є */
  weekStart: string;
  /** Для цього тижня план уже є — новий стане ще одним планом того ж тижня */
  isUpdate: boolean;
}

/**
 * Наступний план після останнього. Якщо останній план — на поточний тиждень
 * (або вже на наступний), будуємо наступний тиждень; якщо він старший —
 * поточний. Номер рахується так само, як `PlanRepo.NextWeekInfo` на бекенді:
 * той самий тиждень — той самий номер, тиждень одразу після — +1, інакше 1.
 *
 * Результат — конкретний понеділок, тож він лишається правдою й тоді, коли
 * сторінку відкрили в неділю, а кнопку натиснули в понеділок.
 */
export function predictNextWeek(record: PlanRecord | null, now = new Date()): NextWeekInfo | null {
  if (!record?.week_number) return null;
  const lastMonday = planMonday(record);
  if (lastMonday === null) return null;

  const thisMonday = utcMonday(now);
  const target = lastMonday >= thisMonday ? thisMonday + WEEK_MS : thisMonday;

  const number =
    lastMonday === target
      ? record.week_number
      : lastMonday === target - WEEK_MS
      ? record.week_number + 1
      : 1;

  return { number, weekStart: toIsoDate(target), isUpdate: lastMonday === target };
}
