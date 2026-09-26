// lib/db/expertise.ts
import { asc, eq } from "drizzle-orm";
import { getDb } from "./client";
import { expertise, type Expertise, type ExpertiseInsert } from "./schema";

export async function getAllExpertise(
  db: ReturnType<typeof getDb>
): Promise<Expertise[]> {
  try {
    return await db.select().from(expertise).orderBy(asc(expertise.displayOrder));
  } catch (error) {
    console.error("[getAllExpertise]", error);
    throw new Error("Failed to fetch expertise list");
  }
}

export async function getExpertiseById(
  db: ReturnType<typeof getDb>,
  id: number
): Promise<Expertise | null> {
  try {
    const rows = await db
      .select()
      .from(expertise)
      .where(eq(expertise.id, id))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error("[getExpertiseById]", error);
    throw new Error(`Failed to fetch expertise with id ${id}`);
  }
}

export async function createExpertise(
  db: ReturnType<typeof getDb>,
  data: Omit<ExpertiseInsert, "id" | "createdAt" | "updatedAt">
): Promise<Expertise> {
  try {
    const result = await db.insert(expertise).values(data).returning();
    return result[0];
  } catch (error) {
    console.error("[createExpertise]", error);
    throw new Error("Failed to create expertise item");
  }
}

export async function updateExpertise(
  db: ReturnType<typeof getDb>,
  id: number,
  data: Partial<Omit<ExpertiseInsert, "id" | "createdAt">>
): Promise<Expertise> {
  try {
    const result = await db
      .update(expertise)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(expertise.id, id))
      .returning();
    if (!result[0]) {
      throw new Error(`Expertise item with id ${id} not found`);
    }
    return result[0];
  } catch (error) {
    console.error("[updateExpertise]", error);
    throw new Error(`Failed to update expertise item with id ${id}`);
  }
}

export async function deleteExpertise(
  db: ReturnType<typeof getDb>,
  id: number
): Promise<void> {
  try {
    await db.delete(expertise).where(eq(expertise.id, id));
  } catch (error) {
    console.error("[deleteExpertise]", error);
    throw new Error(`Failed to delete expertise item with id ${id}`);
  }
}
