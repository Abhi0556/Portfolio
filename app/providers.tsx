// app/providers.tsx
"use client";

import { useLenis } from "@/hooks/useLenis";

export function Providers({ children }: { children: React.ReactNode }): React.ReactElement {
  useLenis();
  return <>{children}</>;
}