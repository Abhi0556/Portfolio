// lib/db/admin-user.ts
import { eq } from "drizzle-orm";
import { getDb } from "./client";
import { adminUser, type AdminUser } from "./schema";

export async function getAdminUserByEmail(
  db: ReturnType<typeof getDb>,
  email: string
): Promise<AdminUser | null> {
  try {
    const rows = await db
      .select()
      .from(adminUser)
      .where(eq(adminUser.email, email))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error("[getAdminUserByEmail]", error);
    throw new Error("Failed to fetch admin user by email");
  }
}

export async function createAdminUser(
  db: ReturnType<typeof getDb>,
  data: { email: string; passwordHash: string }
): Promise<AdminUser> {
  try {
    const existing = await db.select().from(adminUser).where(eq(adminUser.id, 1)).limit(1);
    if (existing.length > 0) {
      throw new Error("Admin user already exists");
    }
    const result = await db
      .insert(adminUser)
      .values({
        id: 1,
        email: data.email,
        passwordHash: data.passwordHash,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("[createAdminUser]", error);
    throw error;
  }
}

export async function updateAdminUserSession(
  db: ReturnType<typeof getDb>,
  id: number,
  data: { sessionToken: string | null; sessionExpiresAt: string | null }
): Promise<void> {
  try {
    await db
      .update(adminUser)
      .set({
        sessionToken: data.sessionToken,
        sessionExpiresAt: data.sessionExpiresAt,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(adminUser.id, id));
  } catch (error) {
    console.error("[updateAdminUserSession]", error);
    throw new Error("Failed to update admin user session");
  }
}

export async function updateAdminUserLockoutState(
  db: ReturnType<typeof getDb>,
  id: number,
  data: { failedAttempts: number; lockedUntil: string | null }
): Promise<void> {
  try {
    await db
      .update(adminUser)
      .set({
        failedAttempts: data.failedAttempts,
        lockedUntil: data.lockedUntil,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(adminUser.id, id));
  } catch (error) {
    console.error("[updateAdminUserLockoutState]", error);
    throw new Error("Failed to update admin user lockout state");
  }
}
