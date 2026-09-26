// types/api.ts

export interface ResponseMeta {
  total: number;
  returned: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  meta?: ResponseMeta;
}

// Standard shape for a bulk reorder request body — used by every
// PUT /api/content/[table]/reorder route (built in Phase 2)
export interface ReorderRequest {
  order: Array<{ id: number; displayOrder: number }>;
}
