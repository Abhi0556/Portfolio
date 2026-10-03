// app/admin/(protected)/[section]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useContent } from "@/hooks/useContent";
import { DataTable } from "@/components/admin/DataTable";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { apiFetch } from "@/lib/utils/apiClient";
import {
  getResourceConfig, metaConfig, skillCategoryConfig, skillsConfig,
  type ResourceAdminConfig,
} from "@/lib/admin/resourceConfig";
import { getCreateSchema, getUpdateSchema } from "@/lib/admin/schemaLookup";
import {
  metaUpdateSchema,
  skillCreateSchema,
  skillUpdateSchema,
  skillCategoryCreateSchema,
  skillCategoryUpdateSchema,
} from "@/lib/utils/validators";

interface Record0 {
  id: number;
  [key: string]: unknown;
}

export default function AdminSectionPage(): React.ReactElement {
  const params = useParams() as { section: string };
  const section = params.section;

  if (section === "meta") return <MetaEditorPanel />;
  if (section === "skills") return <SkillsPanel />;

  const config = getResourceConfig(section);
  if (!config) {
    return <p className="text-body-sm text-error">Unknown section: {section}</p>;
  }
  return <StandardResourcePanel config={config} />;
}

// ── STANDARD LIST + CREATE/EDIT PANEL (expertise, experience, projects, process, testimonials) ──
function StandardResourcePanel({ config }: { config: ResourceAdminConfig }): React.ReactElement {
  const { data, isLoading, mutate } = useContent<Record0[]>(config.apiBase, { revalidate: 0 });
  const [editingRecord, setEditingRecord] = useState<Record0 | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const records = data ?? [];

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Delete this record? This cannot be undone.")) return;
    const result = await apiFetch(`${config.apiBase}/${id}`, { method: "DELETE" });
    if (result.error) {
      setError(result.error);
      return;
    }
    mutate();
  };

  const handleReorder = async (id: number, direction: "up" | "down"): Promise<void> => {
    const index = records.findIndex((r) => r.id === id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= records.length) return;
    const current = records[index];
    const swap = records[swapIndex];
    await apiFetch(`${config.apiBase}/reorder`, {
      method: "PUT",
      body: JSON.stringify({
        order: [
          { id: current.id, displayOrder: swap.displayOrder },
          { id: swap.id, displayOrder: current.displayOrder },
        ],
      }),
    });
    mutate();
  };

  const handleSubmit = async (formData: Record<string, unknown>): Promise<void> => {
    setIsSubmitting(true);
    setError(null);
    const isEdit = editingRecord !== null;
    const url = isEdit ? `${config.apiBase}/${editingRecord.id}` : config.apiBase;
    const result = await apiFetch(url, {
      method: isEdit ? "PUT" : "POST",
      body: JSON.stringify(formData),
    });
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setIsEditorOpen(false);
    setEditingRecord(null);
    mutate();
  };

  if (isEditorOpen) {
    return (
      <div className="max-w-2xl space-y-4">
        <h1 className="font-display text-display-sm text-text-primary">
          {editingRecord ? `Edit ${config.label}` : `New ${config.label}`}
        </h1>
        {error && <p className="text-body-sm text-error">{error}</p>}
        <ContentEditor
          fields={config.fields}
          initialData={editingRecord ?? {}}
          schema={editingRecord ? getUpdateSchema(config.key) : getCreateSchema(config.key)}
          isSubmitting={isSubmitting}
          onSubmit={(d) => void handleSubmit(d)}
          onCancel={() => {
            setIsEditorOpen(false);
            setEditingRecord(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-display-sm text-text-primary">{config.label}</h1>
        <button
          type="button"
          onClick={() => {
            setEditingRecord(null);
            setIsEditorOpen(true);
          }}
          className="rounded-md bg-accent-primary px-4 py-2 text-body-sm text-text-inverse"
        >
          + Add New
        </button>
      </div>
      {error && <p className="text-body-sm text-error">{error}</p>}
      <DataTable
        columns={[{ key: config.listTitleField ?? "id", label: config.label }]}
        records={records}
        onEdit={(r) => {
          setEditingRecord(r as Record0);
          setIsEditorOpen(true);
        }}
        onDelete={(id) => void handleDelete(id)}
        onReorder={config.hasReorder ? (id, dir) => void handleReorder(id, dir) : undefined}
        isLoading={isLoading}
      />
    </div>
  );
}

// ── META — single-row edit form, no list, no create/delete ──
function MetaEditorPanel(): React.ReactElement {
  const { data, isLoading, mutate } = useContent<Record<string, unknown>>("/api/content/meta", { revalidate: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData: Record<string, unknown>): Promise<void> => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    const result = await apiFetch("/api/content/meta", { method: "PUT", body: JSON.stringify(formData) });
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    mutate();
  };

  if (isLoading) return <p className="text-body-sm text-text-tertiary">Loading...</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="font-display text-display-sm text-text-primary">Site Meta</h1>
      {error && <p className="text-body-sm text-error">{error}</p>}
      {success && <p className="text-body-sm text-success">Saved.</p>}
      <ContentEditor
        fields={metaConfig.fields}
        initialData={data ?? {}}
        schema={metaUpdateSchema}
        isSubmitting={isSubmitting}
        onSubmit={(d) => void handleSubmit(d)}
      />
    </div>
  );
}

// ── SKILLS — two-panel: categories (left) + skills (right, category dropdown) ──
function SkillsPanel(): React.ReactElement {
  const { data: categories, mutate: mutateCategories } = useContent<Record0[]>(
    "/api/content/skill-categories", { revalidate: 0 }
  );
  const { data: skills, isLoading: skillsLoading, mutate: mutateSkills } = useContent<Record0[]>(
    "/api/content/skills", { revalidate: 0 }
  );

  const [categoryEditing, setCategoryEditing] = useState<Record0 | null>(null);
  const [categoryEditorOpen, setCategoryEditorOpen] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [skillEditing, setSkillEditing] = useState<Record0 | null>(null);
  const [skillEditorOpen, setSkillEditorOpen] = useState(false);
  const [skillError, setSkillError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = (categories ?? []).map((c) => ({
    label: c.name as string,
    value: c.id,
  }));

  const submitCategory = async (formData: Record<string, unknown>): Promise<void> => {
    setIsSubmitting(true);
    setCategoryError(null);
    const isEdit = categoryEditing !== null;
    const url = isEdit
      ? `/api/content/skill-categories/${categoryEditing.id}`
      : "/api/content/skill-categories";
    const result = await apiFetch(url, { method: isEdit ? "PUT" : "POST", body: JSON.stringify(formData) });
    setIsSubmitting(false);
    if (result.error) {
      setCategoryError(result.error);
      return;
    }
    setCategoryEditorOpen(false);
    setCategoryEditing(null);
    mutateCategories();
  };

  const deleteCategory = async (id: number): Promise<void> => {
    if (!window.confirm("Delete this category?")) return;
    const result = await apiFetch(`/api/content/skill-categories/${id}`, { method: "DELETE" });
    if (result.error) {
      // surfaces API.md's "Cannot delete category with existing skills..." message
      setCategoryError(result.error);
      return;
    }
    mutateCategories();
  };

  const submitSkill = async (formData: Record<string, unknown>): Promise<void> => {
    setIsSubmitting(true);
    setSkillError(null);
    const isEdit = skillEditing !== null;
    const url = isEdit ? `/api/content/skills/${skillEditing.id}` : "/api/content/skills";
    const result = await apiFetch(url, { method: isEdit ? "PUT" : "POST", body: JSON.stringify(formData) });
    setIsSubmitting(false);
    if (result.error) {
      setSkillError(result.error);
      return;
    }
    setSkillEditorOpen(false);
    setSkillEditing(null);
    mutateSkills();
  };

  const deleteSkill = async (id: number): Promise<void> => {
    if (!window.confirm("Delete this skill?")) return;
    const result = await apiFetch(`/api/content/skills/${id}`, { method: "DELETE" });
    if (result.error) {
      setSkillError(result.error);
      return;
    }
    mutateSkills();
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-display-sm text-text-primary">Skill Categories</h2>
          <button
            type="button"
            onClick={() => {
              setCategoryEditing(null);
              setCategoryEditorOpen(true);
            }}
            className="rounded-md bg-accent-primary px-3 py-1.5 text-body-sm text-text-inverse"
          >
            + Add
          </button>
        </div>
        {categoryError && <p className="text-body-sm text-error">{categoryError}</p>}
        {categoryEditorOpen ? (
          <ContentEditor
            fields={skillCategoryConfig.fields}
            initialData={categoryEditing ?? {}}
            schema={categoryEditing ? skillCategoryUpdateSchema : skillCategoryCreateSchema}
            isSubmitting={isSubmitting}
            onSubmit={(d) => void submitCategory(d)}
            onCancel={() => {
              setCategoryEditorOpen(false);
              setCategoryEditing(null);
            }}
          />
        ) : (
          <DataTable
            columns={[{ key: "name", label: "Name" }]}
            records={categories ?? []}
            onEdit={(r) => {
              setCategoryEditing(r as Record0);
              setCategoryEditorOpen(true);
            }}
            onDelete={(id) => void deleteCategory(id)}
            isLoading={!categories}
          />
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-display-sm text-text-primary">Skills</h2>
          <button
            type="button"
            disabled={categoryOptions.length === 0}
            onClick={() => {
              setSkillEditing(null);
              setSkillEditorOpen(true);
            }}
            className="rounded-md bg-accent-primary px-3 py-1.5 text-body-sm text-text-inverse disabled:opacity-50"
          >
            + Add
          </button>
        </div>
        {categoryOptions.length === 0 && (
          <p className="text-body-xs text-text-tertiary">Add a category first.</p>
        )}
        {skillError && <p className="text-body-sm text-error">{skillError}</p>}
        {skillEditorOpen ? (
          <ContentEditor
            fields={skillsConfig.fields}
            initialData={skillEditing ?? {}}
            schema={skillEditing ? skillUpdateSchema : skillCreateSchema}
            dynamicOptions={{ categoryId: categoryOptions }}
            isSubmitting={isSubmitting}
            onSubmit={(d) => void submitSkill(d)}
            onCancel={() => {
              setSkillEditorOpen(false);
              setSkillEditing(null);
            }}
          />
        ) : (
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "proficiency", label: "Proficiency" },
            ]}
            records={skills ?? []}
            onEdit={(r) => {
              setSkillEditing(r as Record0);
              setSkillEditorOpen(true);
            }}
            onDelete={(id) => void deleteSkill(id)}
            isLoading={skillsLoading}
          />
        )}
      </section>
    </div>
  );
}
