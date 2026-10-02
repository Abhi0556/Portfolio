import { NextResponse } from "next/server";
import type { ApiResponse, ResponseMeta } from "@/types/api";

export function successResponse<T>(
  data: T,
  status = 200,
  meta?: ResponseMeta
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { data, error: null, ...(meta ? { meta } : {}) },
    { status }
  );
}

export function errorResponse(
  message: string,
  status: number
): NextResponse<ApiResponse<null>> {
  return NextResponse.json({ data: null, error: message }, { status });
}
