import React, { useState } from "react";
import { useUserProfile, useAuthUser } from "@/entities/user";
import {
  PhysicalDataCard,
  SportScheduleCard,
  DietaryCard,
  BudgetCard,
} from "@/widgets/profile-cards";
import { Button, Card, FieldLabel, TextInput } from "@/shared/ui";

export const ProfilePage: React.FC = () => {
  const {
    profile,
    updateProfile,
    saveChanges,
    resetChanges,
    isLoading: isLoadingSettings,
    isSaving,
    isSaved,
    error: settingsError,
    isDirty,
  } = useUserProfile();
  const { user, isLoading, updateProfile: updateBackendProfile } = useAuthUser();

  const [name, setName] = useState("");
  const [height, setHeight] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [isSavingBackend, setIsSavingBackend] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Синхронізуємо чернетку форми з даними, щойно вони прийшли з бекенду.
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  if (user && user.id !== loadedUserId) {
    setLoadedUserId(user.id);
    setName(user.name);
    setHeight(user.height);
    setWeight(user.weight);
  }

  const handleBudgetChange = (weeklyLimit: number) => {
    updateProfile({
      budget: { ...profile.budget, weeklyLimit },
    });
  };

  const handleScheduleChange = (schedule: typeof profile.schedule) => {
    updateProfile({ schedule });
  };

  const handleRemoveAllergen = (allergen: string) => {
    updateProfile({
      dietaryRestrictions: {
        ...profile.dietaryRestrictions,
        allergens: profile.dietaryRestrictions.allergens.filter((a) => a !== allergen),
      },
    });
  };

  const handleRemoveStopProduct = (product: string) => {
    updateProfile({
      dietaryRestrictions: {
        ...profile.dietaryRestrictions,
        stopProducts: profile.dietaryRestrictions.stopProducts.filter((p) => p !== product),
      },
    });
  };

  const handleSaveBackendProfile = async () => {
    if (!name.trim() || height === "" || weight === "") return;
    setIsSavingBackend(true);
    setSaveError(null);
    try {
      await updateBackendProfile({ name: name.trim(), height: Number(height), weight: Number(weight) });
      // Вага та зріст дублюються в налаштуваннях — тримаємо їх синхронними
      updateProfile({
        physical: {
          ...profile.physical,
          heightCm: Number(height),
          currentWeightKg: Number(weight),
        },
      });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Не вдалося зберегти");
    } finally {
      setIsSavingBackend(false);
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase font-mono">
              Параметри та обмеження
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              {isLoadingSettings
                ? "Завантажуємо збережені параметри…"
                : "Зміни застосовуються до наступного тижневого плану"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetChanges}
              disabled={!isDirty || isSaving}
              className="px-4 py-2 rounded-md border border-zinc-300 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200/50 transition cursor-pointer disabled:opacity-40 disabled:cursor-default"
            >
              Скинути
            </button>
            <button
              onClick={saveChanges}
              disabled={isSaving || isLoadingSettings || !isDirty}
              className="px-4 py-2 rounded-md bg-[#D2F832] border border-black text-black text-xs font-bold uppercase tracking-wider hover:brightness-95 transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSaving
                ? "Збереження..."
                : isSaved && !isDirty
                  ? "✓ Збережено"
                  : "Зберегти зміни"}
            </button>
          </div>
        </div>

        {settingsError && (
          <p className="text-xs text-[#FF5C00] font-semibold">{settingsError}</p>
        )}

        <Card className="p-6">
          <h2 className="text-xs font-mono font-bold tracking-widest uppercase mb-4">
            Ім'я, зріст, вага
          </h2>
          <p className="text-xs text-zinc-500 mb-4">
            Ці дані зберігаються на бекенді та використовуються для розрахунку калорій.
          </p>

          {isLoading ? (
            <p className="text-xs text-zinc-500">Завантаження…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FieldLabel>Ім'я</FieldLabel>
                <TextInput value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <FieldLabel hint="см">Зріст</FieldLabel>
                <TextInput
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
              <div>
                <FieldLabel hint="кг">Вага</FieldLabel>
                <TextInput
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {saveError && <p className="text-xs text-[#FF5C00] font-semibold mt-3">{saveError}</p>}

          <Button
            variant="lime"
            size="sm"
            className="mt-4"
            disabled={isSavingBackend || isLoading}
            onClick={handleSaveBackendProfile}
          >
            {isSavingBackend ? "Збереження..." : "Зберегти на бекенді"}
          </Button>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhysicalDataCard data={profile.physical} />
          <SportScheduleCard
            schedule={profile.schedule}
            onChange={handleScheduleChange}
          />
          <DietaryCard
            data={profile.dietaryRestrictions}
            onRemoveAllergen={handleRemoveAllergen}
            onRemoveStopProduct={handleRemoveStopProduct}
          />
          <BudgetCard
            budget={profile.budget}
            onChangeLimit={handleBudgetChange}
          />
        </div>
    </div>
  );
};
