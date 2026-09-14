import { describe, expect, it } from "vitest";
import type { PlanRecord } from "@/shared/api";
import { planWeekTarget, predictNextWeek } from "./week";

// 2026-09-07 і 2026-09-14 — понеділки
const record = (overrides: Partial<PlanRecord> = {}): PlanRecord => ({
  id: "plan-1",
  user_id: "user-1",
  title: "Plan",
  content: "{}",
  week_number: 12,
  week_start_date: "2026-09-07",
  created_at: "2026-09-07T10:00:00Z",
  ...overrides,
});

const sunday = new Date("2026-09-13T10:00:00Z");
const monday = new Date("2026-09-14T08:00:00Z");

describe("predictNextWeek", () => {
  it("plans the coming week on a Sunday when this week already has a plan", () => {
    expect(predictNextWeek(record(), sunday)).toEqual({
      number: 13,
      week: "next",
      isUpdate: false,
      startsOn: new Date("2026-09-14T00:00:00Z"),
    });
  });

  it("updates the coming week when it has already been planned", () => {
    const planned = record({ week_number: 13, week_start_date: "2026-09-14" });
    expect(predictNextWeek(planned, sunday)).toMatchObject({ number: 13, week: "next", isUpdate: true });
  });

  it("plans the current week once last week's plan is over", () => {
    expect(predictNextWeek(record(), monday)).toMatchObject({ number: 13, week: "current", isUpdate: false });
  });

  it("starts over at week 1 after a skipped week", () => {
    const later = new Date("2026-09-23T08:00:00Z");
    expect(predictNextWeek(record(), later)).toMatchObject({ number: 1, week: "current", isUpdate: false });
  });

  it("uses the UTC week boundary like the backend", () => {
    // 01:30 понеділка за Києвом — за UTC ще неділя
    const kyivMondayNight = new Date("2026-09-13T22:30:00Z");
    expect(predictNextWeek(record(), kyivMondayNight)).toMatchObject({ number: 13, week: "next" });
  });

  it("accepts week_start_date as a full timestamp", () => {
    const iso = record({ week_start_date: "2026-09-07T00:00:00Z" });
    expect(predictNextWeek(iso, sunday)).toMatchObject({ number: 13, week: "next" });
  });

  it("returns null when the backend sent no week number", () => {
    expect(predictNextWeek(record({ week_number: undefined }), sunday)).toBeNull();
    expect(predictNextWeek(null, sunday)).toBeNull();
  });
});

describe("planWeekTarget", () => {
  it("keeps a plan made ahead on the coming week", () => {
    expect(planWeekTarget(record({ week_start_date: "2026-09-14" }), sunday)).toBe("next");
  });

  it("treats this week's plan as current", () => {
    expect(planWeekTarget(record(), sunday)).toBe("current");
  });
});
