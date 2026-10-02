import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasCookie = cookieStore.has(SESSION_COOKIE_NAME);

  if (!hasCookie) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}

