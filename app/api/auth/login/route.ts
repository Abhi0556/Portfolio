import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { checkRateLimit } from "@/lib/utils/rateLimit";
import { loginSchema } from "@/lib/utils/validators";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { getDb } from "@/lib/db/client";
import { getAdminUserByEmail, updateAdminUserSession, updateAdminUserLockoutState } from "@/lib/db/admin-user";
import { generateSessionToken, hashSessionToken, SESSION_COOKIE_NAME, SESSION_DURATION_MS } from "@/lib/auth/session";

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

// Precomputed once at module load — used only to keep bcrypt timing
// consistent when the submitted email does not exist. Never logged,
// never compared against a real password.
const DUMMY_HASH = bcrypt.hashSync("timing-attack-mitigation-dummy", 12);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rateLimitResult = await checkRateLimit(request, "login");
    if (!rateLimitResult.success) return errorResponse("Too many requests", 429);

    const body: unknown = await request.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(`Validation failed: ${result.error.errors[0].message}`, 400);
    }
    const { email, password } = result.data;

    const db = getDb();
    const user = await getAdminUserByEmail(db, email);

    if (user && user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
      const minutesLeft = Math.ceil(
        (new Date(user.lockedUntil).getTime() - Date.now()) / 60000
      );
      return errorResponse(`Account locked. Try again in ${minutesLeft} minutes.`, 401);
    }

    const passwordHashToCheck = user ? user.passwordHash : DUMMY_HASH;
    const passwordMatches = await bcrypt.compare(password, passwordHashToCheck);

    if (!user || !passwordMatches) {
      if (user) {
        const nextFailedAttempts = user.failedAttempts + 1;
        const shouldLock = nextFailedAttempts >= LOCKOUT_THRESHOLD;
        await updateAdminUserLockoutState(db, user.id, {
          failedAttempts: nextFailedAttempts,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString() : null,
        });
      }
      return errorResponse("Invalid credentials", 401);
    }

    await updateAdminUserLockoutState(db, user.id, { failedAttempts: 0, lockedUntil: null });

    const rawToken = generateSessionToken();
    const tokenHash = hashSessionToken(rawToken);
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
    await updateAdminUserSession(db, user.id, { sessionToken: tokenHash, sessionExpiresAt: expiresAt });

    const response = successResponse({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, rawToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return errorResponse("Login failed. Please try again.", 500);
  }
}
