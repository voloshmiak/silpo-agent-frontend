import React, { useState } from "react";
import { getPhysicalValidationError, useUserProfile } from "@/entities/user";
import { changePassword } from "@/shared/api";
import {
  PhysicalDataCard,
  SportScheduleCard,
  DietaryCard,
  BudgetCard,
} from "@/widgets/profile-cards";
import { PageError } from "@/shared/ui";
import { ProfileSkeleton } from "./ProfileSkeleton";

export const ProfilePage: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
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

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);
    if (newPassword.length < 8) {
      setPasswordError("Новий пароль має містити щонайменше 8 символів");
      return;
    }
    if (newPassword !== passwordConfirmation) {
      setPasswordError("Паролі не збігаються");
      return;
    }
    setIsChangingPassword(true);
    try {
      const result = await changePassword(oldPassword, newPassword);
      setPasswordMessage(result.message ?? "Пароль успішно оновлено");
      setOldPassword("");
      setNewPassword("");
      setPasswordConfirmation("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Не вдалося оновити пароль");
    } finally {
      setIsChangingPassword(false);
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

        <section className="bg-[#DFDACB]/60 border border-[#D8D2C2] rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xs font-mono font-bold tracking-widest uppercase">Безпека акаунта</h2>
              <p className="text-xs text-zinc-500 mt-1">Змініть пароль для наступних входів у SILPOFIT.</p>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Email · пароль</span>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end" onSubmit={handlePasswordChange}>
            <input aria-label="Поточний пароль" type="password" required value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} placeholder="Поточний пароль" className="w-full h-10 px-3 rounded-lg border border-[#D8D2C2] bg-[#E5E0D3]/40 text-sm outline-none focus:border-zinc-500" />
            <input aria-label="Новий пароль" type="password" required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Новий пароль" className="w-full h-10 px-3 rounded-lg border border-[#D8D2C2] bg-[#E5E0D3]/40 text-sm outline-none focus:border-zinc-500" />
            <input aria-label="Підтвердження нового пароля" type="password" required value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} placeholder="Повторіть новий пароль" className="w-full h-10 px-3 rounded-lg border border-[#D8D2C2] bg-[#E5E0D3]/40 text-sm outline-none focus:border-zinc-500" />
            <button type="submit" disabled={isChangingPassword} className="h-10 px-4 rounded-md bg-[#D2F832] border border-black text-black text-xs font-bold uppercase tracking-wider disabled:opacity-50">
              {isChangingPassword ? "Збереження..." : "Змінити пароль"}
            </button>
          </form>
          {passwordError && <p className="text-xs text-[#FF5C00] font-semibold">{passwordError}</p>}
          {passwordMessage && <p className="text-xs text-[#2E7D32] font-semibold">{passwordMessage}</p>}
        </section>
    </div>
  );
};
