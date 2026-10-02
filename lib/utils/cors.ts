import type { NextRequest } from "next/server";

export function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const allowedOrigin = process.env.ALLOWED_ORIGIN;

  // Same-origin requests (no Origin header, e.g. server-rendered navigation
  // or same-site fetches in some browsers) are allowed through — this check
  // exists specifically to block cross-origin browser requests per
  // TRD.md Threat 09.
  if (!origin) return true;

  return origin === allowedOrigin;
}
