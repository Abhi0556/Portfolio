// lib/db/experience.ts
import { asc, eq } from "drizzle-orm";
import { getDb } from "./client";
import { experience, type Experience, type ExperienceInsert } from "./schema";

export interface ExperienceWithParsedBullets extends Omit<Experience, "bullets"> {
  bullets: string[];
}

function parseBullets(row: Experience): ExperienceWithParsedBullets {
  let bullets: string[] = [];
  try {
    bullets = JSON.parse(row.bullets) as string[];
  } catch {
    bullets = [];
  }
  return { ...row, bullets };
}

export async function getAllExperience(
  db: ReturnType<typeof getDb>
): Promise<ExperienceWithParsedBullets[]> {
  try {
    const rows = await db.select().from(experience).orderBy(asc(experience.displayOrder));
    return rows.map(parseBullets);
  } catch (error) {
    console.error("[getAllExperience]", error);
    throw new Error("Failed to fetch experience list");
  }
}

export async function getExperienceById(
  db: ReturnType<typeof getDb>,
  id: number
): Promise<ExperienceWithParsedBullets | null> {
  try {
    const rows = await db
      .select()
      .from(experience)
      .where(eq(experience.id, id))
      .limit(1);
    if (!rows[0]) return null;
    return parseBullets(rows[0]);
  } catch (error) {
    console.error("[getExperienceById]", error);
    throw new Error(`Failed to fetch experience item with id ${id}`);
  }
}

export async function createExperience(
  db: ReturnType<typeof getDb>,
  data: Omit<ExperienceInsert, "id" | "createdAt" | "updatedAt" | "bullets"> & {
    bullets?: string[] | string;
  }
): Promise<ExperienceWithParsedBullets> {
  try {
    const bulletsStr = Array.isArray(data.bullets)
      ? JSON.stringify(data.bullets)
      : typeof data.bullets === "string"
      ? data.bullets
      : "[]";

    const result = await db
      .insert(experience)
      .values({ ...data, bullets: bulletsStr })
      .returning();
    return parseBullets(result[0]);
  } catch (error) {
    console.error("[createExperience]", error);
    throw new Error("Failed to create experience item");
  }
}

export async function updateExperience(
  db: ReturnType<typeof getDb>,
  id: number,
  data: Partial<Omit<ExperienceInsert, "id" | "createdAt" | "bullets">> & {
    bullets?: string[] | string;
  }
): Promise<ExperienceWithParsedBullets> {
  try {
    const updatePayload: Record<string, unknown> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    if (Array.isArray(data.bullets)) {
      updatePayload.bullets = JSON.stringify(data.bullets);
    }
    const result = await db
      .update(experience)
      .set(updatePayload)
      .where(eq(experience.id, id))
      .returning();
    if (!result[0]) {
      throw new Error(`Experience item with id ${id} not found`);
    }
    return parseBullets(result[0]);
  } catch (error) {
    console.error("[updateExperience]", error);
    throw new Error(`Failed to update experience item with id ${id}`);
  }
}

export async function deleteExperience(
  db: ReturnType<typeof getDb>,
  id: number
): Promise<void> {
  try {
    await db.delete(experience).where(eq(experience.id, id));
  } catch (error) {
    console.error("[deleteExperience]", error);
    throw new Error(`Failed to delete experience item with id ${id}`);
  }
}
