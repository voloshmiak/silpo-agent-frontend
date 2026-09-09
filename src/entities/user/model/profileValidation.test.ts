import { describe, expect, it } from "vitest";
import {
  getPhysicalFieldError,
  getPhysicalValidationError,
} from "./profileValidation";
import type { UserProfile } from "./types";

const physical = (overrides: Partial<UserProfile["physical"]> = {}): UserProfile["physical"] => ({
  currentWeightKg: 70,
  targetWeightKg: 69,
  heightCm: 170,
  age: 30,
  gender: "чол.",
  focus: "Схуднення",
  paceKgPerWeek: -0.5,
  updatedAt: "сьогодні",
  ...overrides,
});

describe("Profile physical validation", () => {
  it("accepts a lower target weight for weight loss", () => {
    expect(getPhysicalValidationError(physical())).toBeUndefined();
  });

  it("rejects an invalid target weight", () => {
    expect(getPhysicalFieldError("targetWeightKg", physical({ targetWeightKg: -10 }))).toContain(
      "від 35 до 250"
    );
  });

  it("rejects a target that contradicts the focus", () => {
    expect(
      getPhysicalFieldError("currentWeightKg", physical({ targetWeightKg: 75 }))
    ).toBe("Для схуднення цільова вага має бути меншою за поточну");
  });

  it("rejects a lower target when gaining weight", () => {
    const data = physical({
      currentWeightKg: 80,
      targetWeightKg: 60,
      focus: "Набір маси",
    });

    expect(getPhysicalFieldError("targetWeightKg", data)).toBe(
      "Для набору маси цільова вага має бути більшою за поточну"
    );
    expect(getPhysicalValidationError(data)).toBe(
      "Для набору маси цільова вага має бути більшою за поточну"
    );
  });
});