// components/admin/DataTable.tsx
"use client";

interface Column {
  key: string;
  label: string;
}

interface DataTableRecord {
  id: number;
  [key: string]: unknown;
}

interface DataTableProps {
  columns: Column[];
  records: DataTableRecord[];
  onEdit: (record: DataTableRecord) => void;
  onDelete: (id: number) => void;
  onReorder?: (id: number, direction: "up" | "down") => void;
  isLoading: boolean;
}

export function DataTable({
  columns, records, onEdit, onDelete, onReorder, isLoading,
}: DataTableProps): React.ReactElement {
  if (isLoading) return <p className="text-body-sm text-text-tertiary">Loading...</p>;
  if (records.length === 0) return <p className="text-body-sm text-text-tertiary">No records yet.</p>;

  return (
    <table className="w-full border-collapse text-body-sm">
      <thead>
        <tr className="border-b border-border-primary text-left text-text-secondary">
          {onReorder && <th className="w-16 py-2">Order</th>}
          {columns.map((col) => (
            <th key={col.key} className="py-2">
              {col.label}
            </th>
          ))}
          <th className="py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record, index) => (
          <tr key={record.id} className="border-b border-border-primary text-text-primary">
            {onReorder && (
              <td className="py-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => onReorder(record.id, "up")}
                  className="disabled:opacity-30"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={index === records.length - 1}
                  onClick={() => onReorder(record.id, "down")}
                  className="disabled:opacity-30"
                  aria-label="Move down"
                >
                  ↓
                </button>
              </td>
            )}
            {columns.map((col) => (
              <td key={col.key} className="py-2">
                {String(record[col.key] ?? "")}
              </td>
            ))}
            <td className="space-x-3 py-2">
              <button type="button" onClick={() => onEdit(record)} className="text-accent-primary">
                Edit
              </button>
              <button type="button" onClick={() => onDelete(record.id)} className="text-error">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
