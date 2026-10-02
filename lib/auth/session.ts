import { randomBytes, createHash } from "crypto";

export const SESSION_COOKIE_NAME = "portfolio_admin_session";
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function generateSessionToken(): string {
  return randomBytes(64).toString("hex");
}

// Only the HASH is stored in admin_user.session_token — never the raw token.
// This matches API.md 3.6: "Store token hash in admin_user.session_token"
export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
