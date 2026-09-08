import { useCallback, useEffect, useState } from "react";
import { clearToken, createUser, getMe, getToken } from "@/shared/api";
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

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    registerUser,
    logout,
  };
};
