import { useCallback, useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/shared/api";
import type { UserProfile } from "./types";
import { profileToSettings, settingsToProfile } from "./settingsMapper";

const LOAD_ERROR = "Не вдалося завантажити параметри. Перевірте зʼєднання та спробуйте ще раз.";

/**
 * Налаштування користувача: завантаження, локальне редагування, збереження.
 *
 * Поки запит не повернувся або впав, `profile` лишається `null` — підставляти
 * замість нього демо-профіль не можна. Ці цифри формують раціон і кошик, тож
 * чужі 78 кг і чужі алергени стали б справжніми налаштуваннями людини, яка
 * просто натиснула «Зберегти зміни» на екрані, що виглядав заповненим.
 */
export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  /** Останній стан, підтверджений бекендом — до нього повертає «Скинути». */
  const [baseline, setBaseline] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Лічильник спроб — єдина залежність ефекту, тож перезапит керований. */
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getSettings()
      .then((settings) => {
        if (cancelled) return;
        const loaded = settingsToProfile(settings);
        setProfile(loaded);
        setBaseline(loaded);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setProfile(null);
        setBaseline(null);
        setError(err instanceof Error ? err.message : LOAD_ERROR);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const reload = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setAttempt((value) => value + 1);
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
      const next = settingsToProfile(saved);
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
    reload,
    isLoading,
    isSaving,
    isSaved,
    error,
    isDirty: JSON.stringify(profile) !== JSON.stringify(baseline),
  };
};
