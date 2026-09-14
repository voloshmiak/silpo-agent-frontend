import { describe, expect, it } from "vitest";
import type { PlanRecord } from "@/shared/api";
import { planWeekStart, predictNextWeek } from "./week";

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
      weekStart: "2026-09-14",
      isUpdate: false,
    });
  });

  it("updates the coming week when it has already been planned", () => {
    const planned = record({ week_number: 13, week_start_date: "2026-09-14" });
    expect(predictNextWeek(planned, sunday)).toEqual({ number: 13, weekStart: "2026-09-14", isUpdate: true });
  });

  it("plans the current week once last week's plan is over", () => {
    expect(predictNextWeek(record(), monday)).toEqual({ number: 13, weekStart: "2026-09-14", isUpdate: false });
  });

  it("names the same Monday before and after midnight, so a tab opened on Sunday stays right", () => {
    const shownOnSunday = predictNextWeek(record(), new Date("2026-09-13T21:00:00Z"));
    expect(shownOnSunday).toEqual(predictNextWeek(record(), monday));
  });

  it("starts over at week 1 after a skipped week", () => {
    const later = new Date("2026-09-23T08:00:00Z");
    expect(predictNextWeek(record(), later)).toEqual({ number: 1, weekStart: "2026-09-21", isUpdate: false });
  });

  it("uses the UTC week boundary like the backend", () => {
    // 01:30 понеділка за Києвом — за UTC ще неділя
    const kyivMondayNight = new Date("2026-09-13T22:30:00Z");
    expect(predictNextWeek(record(), kyivMondayNight)).toMatchObject({ number: 13, weekStart: "2026-09-14" });
  });

  it("accepts week_start_date as a full timestamp", () => {
    const iso = record({ week_start_date: "2026-09-07T00:00:00Z" });
    expect(predictNextWeek(iso, sunday)).toMatchObject({ number: 13, weekStart: "2026-09-14" });
  });

  it("returns null when the backend sent no week number", () => {
    expect(predictNextWeek(record({ week_number: undefined }), sunday)).toBeNull();
    expect(predictNextWeek(null, sunday)).toBeNull();
  });
});

describe("planWeekStart", () => {
  it("keeps a plan made ahead on its own week", () => {
    expect(planWeekStart(record({ week_start_date: "2026-09-14" }), sunday)).toBe("2026-09-14");
  });

  it("keeps this week's plan on this week", () => {
    expect(planWeekStart(record(), sunday)).toBe("2026-09-07");
  });

  it("leaves a plan from a week that is over to the backend default", () => {
    expect(planWeekStart(record(), monday)).toBeUndefined();
  });
});
