import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { hashSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { adminUser } from "@/lib/db/schema";

export interface SessionVerification {
  valid: boolean;
}

export async function verifySession(request: NextRequest): Promise<SessionVerification> {
  try {
    const rawToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!rawToken) {
      return { valid: false };
    }

    const db = getDb();
    const [user] = await db.select().from(adminUser).where(eq(adminUser.id, 1));

    if (!user || !user.sessionToken || !user.sessionExpiresAt) {
      return { valid: false };
    }

    const tokenMatches = user.sessionToken === hashSessionToken(rawToken);
    const notExpired = new Date(user.sessionExpiresAt).getTime() > Date.now();

    return { valid: tokenMatches && notExpired };
  } catch (error) {
    console.error("[verifySession]", error);
    return { valid: false };
  }
}
