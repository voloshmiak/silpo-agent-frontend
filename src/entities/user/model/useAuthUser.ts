import { useCallback, useEffect, useState } from "react";
import { createUser, getMe, getToken, updateMe, type UpdateMePayload } from "@/shared/api";
import type { BackendUser } from "./types";

export const useAuthUser = () => {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;

    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const registerUser = useCallback(async (name: string) => {
    const created = await createUser(name);
    setUser(created);
    return created;
  }, []);

  const updateProfile = useCallback(async (payload: UpdateMePayload) => {
    const updated = await updateMe(payload);
    setUser(updated);
    return updated;
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    registerUser,
    updateProfile,
  };
};
