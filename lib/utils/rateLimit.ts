// lib/utils/rateLimit.ts
import { RateLimiterMemory } from "rate-limiter-flexible";
import type { NextRequest } from "next/server";

// Profile definitions — points/duration per API.md and TRD.md 7.1:
//   public   → 60 requests / 60s per IP   (public GET content routes)
//   login    → 5 requests / 900s per IP   (admin login attempts)
//   contact  → 3 requests / 3600s per IP  (contact form)
const limiters = {
  public: new RateLimiterMemory({ points: 60, duration: 60 }),
  login: new RateLimiterMemory({ points: 5, duration: 900 }),
  contact: new RateLimiterMemory({ points: 3, duration: 3600 }),
} as const;

export type RateLimitProfile = keyof typeof limiters;

export interface RateLimitResult {
  success: boolean;
  remainingPoints?: number;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "unknown";
}

export async function checkRateLimit(
  request: NextRequest,
  profile: RateLimitProfile
): Promise<RateLimitResult> {
  try {
    const ip = getClientIp(request);
    const result = await limiters[profile].consume(ip);
    return { success: true, remainingPoints: result.remainingPoints };
  } catch (rejection) {
    // rate-limiter-flexible throws its own rejection object on exhaustion,
    // not a real Error — this catch branch means "rate limited," not a bug
    return { success: false };
  }
}
