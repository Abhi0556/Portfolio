// lib/db/skill-categories.ts
import { asc, eq } from "drizzle-orm";
import { getDb } from "./client";
import { skillCategories, skills, type SkillCategory, type SkillCategoryInsert } from "./schema";

export async function getAllSkillCategories(
  db: ReturnType<typeof getDb>
): Promise<SkillCategory[]> {
  try {
    return await db.select().from(skillCategories).orderBy(asc(skillCategories.displayOrder));
  } catch (error) {
    console.error("[getAllSkillCategories]", error);
    throw new Error("Failed to fetch skill categories");
  }
}

export async function getSkillCategoryById(
  db: ReturnType<typeof getDb>,
  id: number
): Promise<SkillCategory | null> {
  try {
    const rows = await db
      .select()
      .from(skillCategories)
      .where(eq(skillCategories.id, id))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error("[getSkillCategoryById]", error);
    throw new Error(`Failed to fetch skill category with id ${id}`);
  }
}

export async function createSkillCategory(
  db: ReturnType<typeof getDb>,
  data: Omit<SkillCategoryInsert, "id" | "createdAt" | "updatedAt">
): Promise<SkillCategory> {
  try {
    const result = await db.insert(skillCategories).values(data).returning();
    return result[0];
  } catch (error) {
    console.error("[createSkillCategory]", error);
    throw new Error("Failed to create skill category");
  }
}

export async function updateSkillCategory(
  db: ReturnType<typeof getDb>,
  id: number,
  data: Partial<Omit<SkillCategoryInsert, "id" | "createdAt">>
): Promise<SkillCategory> {
  try {
    const result = await db
      .update(skillCategories)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(skillCategories.id, id))
      .returning();
    if (!result[0]) {
      throw new Error(`Skill category with id ${id} not found`);
    }
    return result[0];
  } catch (error) {
    console.error("[updateSkillCategory]", error);
    throw new Error(`Failed to update skill category with id ${id}`);
  }
}

export async function deleteSkillCategory(
  db: ReturnType<typeof getDb>,
  id: number
): Promise<{ deleted: boolean; blocked?: boolean }> {
  try {
    const existingSkills = await db
      .select()
      .from(skills)
      .where(eq(skills.categoryId, id))
      .limit(1);

    if (existingSkills.length > 0) {
      return { deleted: false, blocked: true };
    }

    await db.delete(skillCategories).where(eq(skillCategories.id, id));
    return { deleted: true };
  } catch (error) {
    console.error("[deleteSkillCategory]", error);
    throw new Error(`Failed to delete skill category with id ${id}`);
  }
}