// lib/db/skills.ts
import { asc, eq } from "drizzle-orm";
import { getDb } from "./client";
import { skillCategories, skills, type Skill, type SkillInsert } from "./schema";
import type { SkillWithCategory } from "@/types/content";

export async function getAllSkillsWithCategory(
  db: ReturnType<typeof getDb>
): Promise<SkillWithCategory[]> {
  try {
    const rows = await db
      .select({
        skill: skills,
        category: skillCategories,
      })
      .from(skills)
      .innerJoin(skillCategories, eq(skills.categoryId, skillCategories.id))
      .orderBy(asc(skillCategories.displayOrder), asc(skills.displayOrder));

    return rows.map(({ skill, category }) => ({
      id: skill.id,
      categoryId: skill.categoryId,
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        icon: category.icon,
        displayOrder: category.displayOrder,
      },
      name: skill.name,
      proficiency: skill.proficiency,
      iconUrl: skill.iconUrl,
      displayOrder: skill.displayOrder,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    }));
  } catch (error) {
    console.error("[getAllSkillsWithCategory]", error);
    throw new Error("Failed to fetch skills with categories");
  }
}

export async function getSkillById(
  db: ReturnType<typeof getDb>,
  id: number
): Promise<Skill | null> {
  try {
    const rows = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error("[getSkillById]", error);
    throw new Error(`Failed to fetch skill with id ${id}`);
  }
}

export async function getSkillsByCategory(
  db: ReturnType<typeof getDb>,
  categoryId: number
): Promise<Skill[]> {
  try {
    return await db
      .select()
      .from(skills)
      .where(eq(skills.categoryId, categoryId))
      .orderBy(asc(skills.displayOrder));
  } catch (error) {
    console.error("[getSkillsByCategory]", error);
    throw new Error(`Failed to fetch skills for category ${categoryId}`);
  }
}

export async function createSkill(
  db: ReturnType<typeof getDb>,
  data: Omit<SkillInsert, "id" | "createdAt" | "updatedAt">
): Promise<Skill> {
  try {
    const result = await db.insert(skills).values(data).returning();
    return result[0];
  } catch (error) {
    console.error("[createSkill]", error);
    throw new Error("Failed to create skill");
  }
}

export async function updateSkill(
  db: ReturnType<typeof getDb>,
  id: number,
  data: Partial<Omit<SkillInsert, "id" | "createdAt">>
): Promise<Skill> {
  try {
    const result = await db
      .update(skills)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(skills.id, id))
      .returning();
    if (!result[0]) {
      throw new Error(`Skill with id ${id} not found`);
    }
    return result[0];
  } catch (error) {
    console.error("[updateSkill]", error);
    throw new Error(`Failed to update skill with id ${id}`);
  }
}

export async function deleteSkill(
  db: ReturnType<typeof getDb>,
  id: number
): Promise<void> {
  try {
    await db.delete(skills).where(eq(skills.id, id));
  } catch (error) {
    console.error("[deleteSkill]", error);
    throw new Error(`Failed to delete skill with id ${id}`);
  }
}
