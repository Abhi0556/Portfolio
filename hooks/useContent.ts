// hooks/useContent.ts
"use client";

import { useCallback, useEffect, useState } from "react";

interface UseContentOptions {
  revalidate?: number; // seconds, default 300
  enabled?: boolean; // default true
}

interface UseContentReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  mutate: () => void;
}

// Simple in-memory cache shared across hook instances within one
// browser session — cleared on full page reload. Keyed by endpoint.
const cache = new Map<string, { data: unknown; timestamp: number }>();

export function useContent<T>(
  endpoint: string,
  options: UseContentOptions = {}
): UseContentReturn<T> {
  const { revalidate = 300, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!enabled) return;

    const cached = cache.get(endpoint);
    const isFresh = cached && Date.now() - cached.timestamp < revalidate * 1000;
    if (isFresh) {
      setData(cached.data as T);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint);
      const json = (await response.json()) as { data: T | null; error: string | null };
      if (json.error) {
        setError(json.error);
        setData(null);
      } else {
        cache.set(endpoint, { data: json.data, timestamp: Date.now() });
        setData(json.data);
      }
    } catch {
      setError("Failed to fetch content.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, revalidate, enabled]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const mutate = useCallback((): void => {
    cache.delete(endpoint);
    void fetchData();
  }, [endpoint, fetchData]);

  return { data, isLoading, error, mutate };
}

