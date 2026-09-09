import { describe, it, expect } from "vitest";
import { getFieldError, isValidBudget, isValidWeight } from "./validation";

describe("Onboarding Validation", () => {
  it("validates realistic body weight", () => {
    expect(isValidWeight(75)).toBe(true);
    expect(isValidWeight(10)).toBe(false);
    expect(isValidWeight(400)).toBe(false);
  });

  it("validates Silpo minimal weekly budget", () => {
    expect(isValidBudget(1500)).toBe(true);
    expect(isValidBudget(200)).toBe(false);
  });

  it("rejects digits in the name", () => {
    expect(
      getFieldError("name", {
        name: "Іван123",
      } as Parameters<typeof getFieldError>[1])
    ).toBe("Ім'я не може містити цифри");
  });
});
