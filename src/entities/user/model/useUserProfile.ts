import { useCallback, useEffect, useState } from "react";
import { getSettings, getToken, updateSettings } from "@/shared/api";
import type { UserProfile } from "./types";
import { profileToSettings, settingsToProfile } from "./settingsMapper";

/**
 * Стартові значення для користувача, який ще не зберігав налаштувань.
 * Це НЕ плейсхолдер завантаження: доки триває запит, profile === null і
 * сторінка показує скелетон, щоб не блимати чужими цифрами.
 */
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
    updatedAt: "—",
  },
  schedule: {
    weeklyWorkoutsCount: 4,
    skipWorkoutToday: false,
    days: [
      { day: "ПН", type: "СИЛОВІ", isActive: true },
      { day: "ВТ", type: "КАРДІО", isActive: true },
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
  const [profile, setProfile] = useState<UserProfile | null>(() =>
    getToken() ? null : initialProfileMock
  );
  /** Останній стан, підтверджений бекендом — до нього повертає «Скинути». */
  const [baseline, setBaseline] = useState<UserProfile | null>(profile);
  const [isLoading, setIsLoading] = useState(() => Boolean(getToken()));
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) return;

    getSettings()
      .then((settings) => {
        const loaded = settingsToProfile(settings, initialProfileMock);
        setProfile(loaded);
        setBaseline(loaded);
      })
      .catch(() => {
        // налаштувань ще немає або бек недоступний — даємо порожню форму,
        // яку користувач заповнить і збереже сам
        setProfile(initialProfileMock);
        setBaseline(initialProfileMock);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...partial } : prev));
    setIsSaved(false);
  }, []);

  const saveChanges = useCallback(async () => {
    if (!profile) return null;
    setIsSaving(true);
    setError(null);
    try {
      const saved = await updateSettings(profileToSettings(profile));
      const next = settingsToProfile(saved, initialProfileMock);
      setProfile(next);
      setBaseline(next);
      setIsSaved(true);
      return next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося зберегти налаштування");
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [profile]);

  const resetChanges = useCallback(() => {
    setProfile(baseline);
    setError(null);
    setIsSaved(false);
  }, [baseline]);

  return {
    profile,
    updateProfile,
    saveChanges,
    resetChanges,
    isLoading,
    isSaving,
    isSaved,
    error,
    isDirty: JSON.stringify(profile) !== JSON.stringify(baseline),
  };
};
