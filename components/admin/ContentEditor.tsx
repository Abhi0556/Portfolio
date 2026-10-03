// components/admin/ContentEditor.tsx
"use client";

import { useState } from "react";
import type { z } from "zod";
import { ImageUploader } from "./ImageUploader";
import type { FieldConfig } from "@/lib/admin/resourceConfig";

interface ContentEditorProps {
  fields: FieldConfig[];
  initialData: Record<string, unknown>;
  schema: z.ZodTypeAny;
  dynamicOptions?: Record<string, Array<{ label: string; value: number }>>;
  isSubmitting: boolean;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

export function ContentEditor({
  fields, initialData, schema, dynamicOptions, isSubmitting, onSubmit, onCancel,
}: ContentEditorProps): React.ReactElement {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);
  const [clientError, setClientError] = useState<string | null>(null);

  const setField = (name: string, value: unknown): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    const result = schema.safeParse(formData);
    if (!result.success) {
      setClientError(result.error.errors[0].message);
      return;
    }
    setClientError(null);
    onSubmit(result.data as Record<string, unknown>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {clientError && <p className="text-body-sm text-error">{clientError}</p>}
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-body-sm text-text-secondary">{field.label}</label>
          {renderField(field, formData, setField, dynamicOptions)}
          {field.helpText && <p className="mt-1 text-body-xs text-text-tertiary">{field.helpText}</p>}
        </div>
      ))}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-accent-primary px-4 py-2 text-body-sm text-text-inverse disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border-secondary px-4 py-2 text-body-sm text-text-primary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function renderField(
  field: FieldConfig,
  formData: Record<string, unknown>,
  setField: (name: string, value: unknown) => void,
  dynamicOptions?: Record<string, Array<{ label: string; value: number }>>
): React.ReactElement {
  const value = formData[field.name];

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          required={field.required}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => setField(field.name, e.target.value)}
          rows={4}
          className="w-full rounded-md border border-border-primary bg-bg-tertiary px-3 py-2 text-body-md text-text-primary"
        />
      );

    case "number":
      return (
        <input
          type="number"
          required={field.required}
          min={field.min}
          max={field.max}
          value={(value as number) ?? ""}
          onChange={(e) => setField(field.name, Number(e.target.value))}
          className="w-full rounded-md border border-border-primary bg-bg-tertiary px-3 py-2 text-body-md text-text-primary"
        />
      );

    case "boolean":
      return (
        <input
          type="checkbox"
          checked={(value as boolean) ?? false}
          onChange={(e) => setField(field.name, e.target.checked)}
        />
      );

    case "upload":
      return (
        <ImageUploader
          currentUrl={(value as string) ?? ""}
          folder={field.uploadFolder ?? "portfolio/misc"}
          accept={field.accept ?? "image/*"}
          onUploaded={(url) => setField(field.name, url)}
        />
      );

    case "string-array":
      return (
        <StringArrayEditor
          values={(value as string[]) ?? []}
          onChange={(next) => setField(field.name, next)}
        />
      );

    case "link-array":
      return (
        <LinkArrayEditor
          values={(value as Array<{ label: string; url: string }>) ?? []}
          onChange={(next) => setField(field.name, next)}
        />
      );

    case "select": {
      const options = (field.dynamicOptionsKey ? dynamicOptions?.[field.dynamicOptionsKey] : undefined) ?? [];
      return (
        <select
          required={field.required}
          value={(value as number) ?? ""}
          onChange={(e) => setField(field.name, Number(e.target.value))}
          className="w-full rounded-md border border-border-primary bg-bg-tertiary px-3 py-2 text-body-md text-text-primary"
        >
          <option value="" disabled>
            Select...
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    case "url":
    case "text":
    default:
      return (
        <input
          type={field.type === "url" ? "url" : "text"}
          required={field.required}
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => setField(field.name, e.target.value)}
          className="w-full rounded-md border border-border-primary bg-bg-tertiary px-3 py-2 text-body-md text-text-primary"
        />
      );
  }
}

function StringArrayEditor({
  values, onChange,
}: {
  values: string[];
  onChange: (next: string[]) => void;
}): React.ReactElement {
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={v}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 rounded-md border border-border-primary bg-bg-tertiary px-3 py-2 text-body-md text-text-primary"
          />
          <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))} className="text-error">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...values, ""])} className="text-body-sm text-accent-primary">
        + Add item
      </button>
    </div>
  );
}

function LinkArrayEditor({
  values, onChange,
}: {
  values: Array<{ label: string; url: string }>;
  onChange: (next: Array<{ label: string; url: string }>) => void;
}): React.ReactElement {
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            placeholder="Label"
            value={v.label}
            onChange={(e) => {
              const next = [...values];
              next[i] = { ...next[i], label: e.target.value };
              onChange(next);
            }}
            className="w-1/3 rounded-md border border-border-primary bg-bg-tertiary px-3 py-2 text-body-md text-text-primary"
          />
          <input
            placeholder="https://..."
            value={v.url}
            onChange={(e) => {
              const next = [...values];
              next[i] = { ...next[i], url: e.target.value };
              onChange(next);
            }}
            className="flex-1 rounded-md border border-border-primary bg-bg-tertiary px-3 py-2 text-body-md text-text-primary"
          />
          <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))} className="text-error">
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, { label: "", url: "" }])}
        className="text-body-sm text-accent-primary"
      >
        + Add link
      </button>
    </div>
  );
}
