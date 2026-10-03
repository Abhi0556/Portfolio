// components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";

const NAV_ITEMS: Array<{ label: string; href: string }> = [
  { label: "Dashboard", href: "/admin" },
  { label: "Site Meta", href: "/admin/meta" },
  { label: "Expertise", href: "/admin/expertise" },
  { label: "Experience", href: "/admin/experience" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Process", href: "/admin/process" },
  { label: "Testimonials", href: "/admin/testimonials" },
];

export function AdminSidebar(): React.ReactElement {
  const pathname = usePathname();
  const { logout } = useAdmin();

  return (
    <nav className="w-56 shrink-0 border-r border-border-primary bg-bg-secondary p-4">
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={
                pathname === item.href
                  ? "block rounded-md bg-accent-muted px-3 py-2 text-body-sm text-accent-primary"
                  : "block rounded-md px-3 py-2 text-body-sm text-text-secondary hover:text-text-primary"
              }
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => void logout()}
        className="mt-6 w-full rounded-md border border-border-secondary px-3 py-2 text-body-sm text-text-secondary hover:text-text-primary"
      >
        Log Out
      </button>
    </nav>
  );
}
