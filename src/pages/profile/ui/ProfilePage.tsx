import React from "react";
import { useUserProfile } from "@/entities/user";
import {
  PhysicalDataCard,
  SportScheduleCard,
  DietaryCard,
  BudgetCard,
} from "@/widgets/profile-cards";
import { ProfileSkeleton } from "./ProfileSkeleton";

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
  // Доки налаштування їдуть з бекенду, показуємо скелетон замість чужих цифр
  if (isLoadingSettings || !profile) {
    return <ProfileSkeleton />;
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

  return (
    <div className="max-w-6xl w-full mx-auto p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase font-mono">
              Параметри та обмеження
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Зміни застосовуються до наступного тижневого плану
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
              disabled={isSaving || !isDirty}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhysicalDataCard
            data={profile.physical}
            onChange={(physical) => updateProfile({ physical })}
          />
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
