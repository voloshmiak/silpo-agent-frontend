import { useCallback, useEffect, useState } from "react";
import { clearToken, createUser, getMe, getToken, loginUser } from "@/shared/api";
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

  const registerUser = useCallback(async (name: string, email: string, silpoToken: string) => {
    const result = await createUser(name, email, silpoToken);
    setUser(result.user);
    return result;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const loggedIn = await loginUser(email, password);
    setUser(loggedIn);
    return loggedIn;
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
    signIn,
    logout,
  };
};
