import { describe, it, expect } from "vitest";
import { getFieldError, isStepValid, isValidBudget, isValidWeight } from "./validation";

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

  it("requires a lower target weight when losing weight", () => {
    const data = {
      name: "Іван",
      focus: "Схуднення",
      targetWeightKg: 80,
      currentWeightKg: 75,
    } as Parameters<typeof getFieldError>[1];

    expect(getFieldError("currentWeightKg", data)).toBe(
      "Для схуднення цільова вага має бути меншою за поточну"
    );
    expect(getFieldError("targetWeightKg", data)).toBeUndefined();
  });

  it("requires a higher target weight when gaining weight", () => {
    const data = {
      name: "Іван",
      focus: "Набір маси",
      targetWeightKg: 75,
      currentWeightKg: 80,
    } as Parameters<typeof getFieldError>[1];

    expect(getFieldError("currentWeightKg", data)).toBe(
      "Для набору маси цільова вага має бути більшою за поточну"
    );
    expect(getFieldError("targetWeightKg", data)).toBeUndefined();
  });

  it("does not require a target weight for maintenance", () => {
    const data = {
      name: "Іван",
      focus: "Підтримка форми",
      targetWeightKg: "",
      currentWeightKg: "",
    } as Parameters<typeof getFieldError>[1];

    expect(isStepValid(0, data)).toBe(true);
  });
});
