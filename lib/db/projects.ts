// lib/db/projects.ts
import { asc, eq } from "drizzle-orm";
import { getDb } from "./client";
import { projects, type Project, type ProjectInsert } from "./schema";

export interface ProjectWithParsedTags extends Omit<Project, "tags"> {
  tags: string[];
}

function parseTags(row: Project): ProjectWithParsedTags {
  let tags: string[] = [];
  try {
    tags = JSON.parse(row.tags) as string[];
  } catch {
    tags = [];
  }
  return { ...row, tags };
}

export async function getAllProjects(
  db: ReturnType<typeof getDb>
): Promise<ProjectWithParsedTags[]> {
  try {
    const rows = await db.select().from(projects).orderBy(asc(projects.displayOrder));
    return rows.map(parseTags);
  } catch (error) {
    console.error("[getAllProjects]", error);
    throw new Error("Failed to fetch projects list");
  }
}

export async function getProjectById(
  db: ReturnType<typeof getDb>,
  id: number
): Promise<ProjectWithParsedTags | null> {
  try {
    const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (!rows[0]) return null;
    return parseTags(rows[0]);
  } catch (error) {
    console.error("[getProjectById]", error);
    throw new Error(`Failed to fetch project with id ${id}`);
  }
}

export async function getFeaturedProjects(
  db: ReturnType<typeof getDb>
): Promise<ProjectWithParsedTags[]> {
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.isFeatured, true))
      .orderBy(asc(projects.displayOrder));
    return rows.map(parseTags);
  } catch (error) {
    console.error("[getFeaturedProjects]", error);
    throw new Error("Failed to fetch featured projects");
  }
}

export async function createProject(
  db: ReturnType<typeof getDb>,
  data: Omit<ProjectInsert, "id" | "createdAt" | "updatedAt" | "tags"> & {
    tags?: string[] | string;
  }
): Promise<ProjectWithParsedTags> {
  try {
    const tagsStr = Array.isArray(data.tags)
      ? JSON.stringify(data.tags)
      : typeof data.tags === "string"
      ? data.tags
      : "[]";

    const result = await db
      .insert(projects)
      .values({ ...data, tags: tagsStr })
      .returning();
    return parseTags(result[0]);
  } catch (error) {
    console.error("[createProject]", error);
    throw new Error("Failed to create project");
  }
}

export async function updateProject(
  db: ReturnType<typeof getDb>,
  id: number,
  data: Partial<Omit<ProjectInsert, "id" | "createdAt" | "tags">> & {
    tags?: string[] | string;
  }
): Promise<ProjectWithParsedTags> {
  try {
    const updatePayload: Record<string, unknown> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    if (Array.isArray(data.tags)) {
      updatePayload.tags = JSON.stringify(data.tags);
    }
    const result = await db
      .update(projects)
      .set(updatePayload)
      .where(eq(projects.id, id))
      .returning();
    if (!result[0]) {
      throw new Error(`Project with id ${id} not found`);
    }
    return parseTags(result[0]);
  } catch (error) {
    console.error("[updateProject]", error);
    throw new Error(`Failed to update project with id ${id}`);
  }
}

export async function deleteProject(
  db: ReturnType<typeof getDb>,
  id: number
): Promise<void> {
  try {
    await db.delete(projects).where(eq(projects.id, id));
  } catch (error) {
    console.error("[deleteProject]", error);
    throw new Error(`Failed to delete project with id ${id}`);
  }
}
