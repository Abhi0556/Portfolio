// lib/utils/apiClient.ts
import type { ApiResponse } from "@/types/api";

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    });
    const json = (await response.json()) as ApiResponse<T>;
    return json;
  } catch {
    return { data: null, error: "Network error. Please try again." };
  }
}