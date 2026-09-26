// lib/db/process.ts
import { asc, eq } from "drizzle-orm";
import { getDb } from "./client";
import { process, type Process, type ProcessInsert } from "./schema";

export async function getAllProcess(
  db: ReturnType<typeof getDb>
): Promise<Process[]> {
  try {
    return await db.select().from(process).orderBy(asc(process.displayOrder));
  } catch (error) {
    console.error("[getAllProcess]", error);
    throw new Error("Failed to fetch process steps");
  }
}

export async function getProcessById(
  db: ReturnType<typeof getDb>,
  id: number
): Promise<Process | null> {
  try {
    const rows = await db.select().from(process).where(eq(process.id, id)).limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error("[getProcessById]", error);
    throw new Error(`Failed to fetch process step with id ${id}`);
  }
}

export async function createProcess(
  db: ReturnType<typeof getDb>,
  data: Omit<ProcessInsert, "id" | "createdAt" | "updatedAt">
): Promise<Process> {
  try {
    const result = await db.insert(process).values(data).returning();
    return result[0];
  } catch (error) {
    console.error("[createProcess]", error);
    throw new Error("Failed to create process step");
  }
}

export async function updateProcess(
  db: ReturnType<typeof getDb>,
  id: number,
  data: Partial<Omit<ProcessInsert, "id" | "createdAt">>
): Promise<Process> {
  try {
    const result = await db
      .update(process)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(process.id, id))
      .returning();
    if (!result[0]) {
      throw new Error(`Process step with id ${id} not found`);
    }
    return result[0];
  } catch (error) {
    console.error("[updateProcess]", error);
    throw new Error(`Failed to update process step with id ${id}`);
  }
}

export async function deleteProcess(
  db: ReturnType<typeof getDb>,
  id: number
): Promise<void> {
  try {
    await db.delete(process).where(eq(process.id, id));
  } catch (error) {
    console.error("[deleteProcess]", error);
    throw new Error(`Failed to delete process step with id ${id}`);
  }
}
