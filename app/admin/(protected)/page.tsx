// app/admin/(protected)/page.tsx
"use client";

import Link from "next/link";
import { useContent } from "@/hooks/useContent";
import { RESOURCE_CONFIGS, type ResourceAdminConfig } from "@/lib/admin/resourceConfig";
import type { Meta } from "@/types/content";

export default function AdminDashboard(): React.ReactElement {
  const { data: meta } = useContent<Meta>("/api/content/meta", { revalidate: 0 });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-display-sm text-text-primary">Dashboard</h1>
      {meta ? (
        <p className="text-body-md text-text-secondary">
          Site: <span className="text-text-primary">{meta.name}</span> — {meta.title}
        </p>
      ) : (
        <p className="text-body-md text-text-secondary">
          No site meta configured yet.{" "}
          <Link href="/admin/meta" className="text-accent-primary">
            Set it up →
          </Link>
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {RESOURCE_CONFIGS.map((resource) => (
          <ResourceCountCard key={resource.key} resource={resource} />
        ))}
      </div>
    </div>
  );
}

function ResourceCountCard({ resource }: { resource: ResourceAdminConfig }): React.ReactElement {
  const { data, isLoading } = useContent<unknown[]>(resource.apiBase, { revalidate: 0 });
  return (
    <Link
      href={`/admin/${resource.key}`}
      className="rounded-lg border border-border-primary bg-bg-secondary p-4 hover:border-border-secondary"
    >
      <p className="text-body-sm text-text-secondary">{resource.label}</p>
      <p className="font-display text-display-sm text-text-primary">
        {isLoading ? "…" : (data?.length ?? 0)}
      </p>
    </Link>
  );
}
