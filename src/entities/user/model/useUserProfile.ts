import { useState } from "react";
import type { UserProfile } from "./types";

export const initialProfileMock: UserProfile = {
  id: "usr_1",
  physical: {
    currentWeightKg: 78.4,
    targetWeightKg: 72.5,
    heightCm: 182,
    age: 29,
    gender: "чол.",
    focus: "Схуднення",
    paceKgPerWeek: -0.6,
    updatedAt: "2 дні тому",
  },
  schedule: {
    weeklyWorkoutsCount: 4,
    skipWorkoutToday: false,
    days: [
      { day: "ПН", type: "СИЛОВІ", isActive: true },
      { day: "ВТ", type: "КАРДІО", isActive: false },
      { day: "СР", type: "—", isActive: false },
      { day: "ЧТ", type: "СИЛОВІ", isActive: true },
      { day: "ПТ", type: "—", isActive: false },
      { day: "СБ", type: "СИЛОВІ", isActive: true },
      { day: "НД", type: "—", isActive: false },
    ],
  },
  dietaryRestrictions: {
    allergens: ["Лактоза", "Горіхи"],
    stopProducts: ["Гриби", "Кінза", "Печінка"],
    dietType: "Без обмежень",
  },
  budget: {
    weeklyLimit: 2000,
    averageSpent8Weeks: 1933,
    promotionsPriority: "Високий",
    deliveryIncluded: true,
  },
};

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(initialProfileMock);
  const [isSaving, setIsSaving] = useState(false);

  const updateProfile = (partial: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      // Здесь в будущем будет: await api.updateProfile(profile)
      console.log("Данные готовы для отправки на бэк:", profile);
    } finally {
      setIsSaving(false);
    }
  };

  const resetChanges = () => {
    setProfile(initialProfileMock);
  };

  return {
    profile,
    updateProfile,
    saveChanges,
    resetChanges,
    isSaving,
  };
};