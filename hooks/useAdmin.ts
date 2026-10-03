// hooks/useAdmin.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/utils/apiClient";

interface LoginResult {
  success: boolean;
  error?: string;
}

interface UseAdminReturn {
  isAuthenticated: boolean | null; // null = still checking
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

export function useAdmin(): UseAdminReturn {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const result = await apiFetch<{ authenticated: boolean }>("/api/auth/verify");
    setIsAuthenticated(!result.error && Boolean(result.data?.authenticated));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    const result = await apiFetch<{ success: boolean }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (result.error) {
      return { success: false, error: result.error };
    }
    setIsAuthenticated(true);
    return { success: true };
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setIsAuthenticated(false);
    router.push("/admin/login");
  }, [router]);

  return { isAuthenticated, isLoading, login, logout };
}
