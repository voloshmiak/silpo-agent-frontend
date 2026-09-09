import React from "react";
import { getPhysicalValidationError, useUserProfile } from "@/entities/user";
import {
  PhysicalDataCard,
  SportScheduleCard,
  DietaryCard,
  BudgetCard,
} from "@/widgets/profile-cards";
import { PageError } from "@/shared/ui";
import { ProfileSkeleton } from "./ProfileSkeleton";

export const ProfilePage: React.FC = () => {
  const {
    profile,
    updateProfile,
    saveChanges,
    resetChanges,
    reload,
    isLoading: isLoadingSettings,
    isSaving,
    isSaved,
    error: settingsError,
    isDirty,
  } = useUserProfile();

  // Доки налаштування їдуть з бекенду — скелетон замість чужих цифр. Якщо не
  // доїхали, скелетон лишається, а причину видно знизу.
  if (isLoadingSettings || !profile) {
    return (
      <>
        <ProfileSkeleton />
        {!isLoadingSettings && (
          <PageError
            message={settingsError ?? "Параметри не завантажились."}
            onRetry={reload}
          />
        )}
      </>
    );
  }

  const physicalValidationError = getPhysicalValidationError(profile.physical);

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
              disabled={isSaving || !isDirty || Boolean(physicalValidationError)}
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
        {physicalValidationError && (
          <p className="text-xs text-[#FF5C00] font-semibold">{physicalValidationError}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhysicalDataCard
            data={profile.physical}
            onChange={(physical) => updateProfile({ physical })}
          />
          <SportScheduleCard
            schedule={profile.schedule}
            onChange={(schedule) => updateProfile({ schedule })}
          />
          <DietaryCard
            data={profile.dietaryRestrictions}
            onChange={(dietaryRestrictions) => updateProfile({ dietaryRestrictions })}
          />
          <BudgetCard
            budget={profile.budget}
            onChange={(budget) => updateProfile({ budget })}
          />
        </div>
    </div>
  );
};
