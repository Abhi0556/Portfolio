// lib/db/meta.ts
import { eq } from "drizzle-orm";
import { getDb } from "./client";
import { meta, type Meta, type MetaInsert } from "./schema";
import type { CustomLink } from "@/types/content";

export interface MetaWithParsedLinks extends Omit<Meta, "customLinks"> {
  customLinks: CustomLink[];
}

export async function getMeta(
  db: ReturnType<typeof getDb>
): Promise<MetaWithParsedLinks | null> {
  try {
    const rows = await db.select().from(meta).where(eq(meta.id, 1)).limit(1);
    if (!rows.length) return null;
    const row = rows[0];
    let customLinks: CustomLink[] = [];
    try {
      customLinks = JSON.parse(row.customLinks) as CustomLink[];
    } catch {
      customLinks = [];
    }
    return {
      ...row,
      customLinks,
    };
  } catch (error) {
    console.error("[getMeta]", error);
    throw new Error("Failed to fetch meta record");
  }
}

export async function updateMeta(
  db: ReturnType<typeof getDb>,
  data: Partial<MetaInsert> & { customLinks?: CustomLink[] | string }
): Promise<MetaWithParsedLinks> {
  try {
    const updatePayload: Record<string, unknown> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (Array.isArray(data.customLinks)) {
      updatePayload.customLinks = JSON.stringify(data.customLinks);
    }

    await db.update(meta).set(updatePayload).where(eq(meta.id, 1));
    const updated = await getMeta(db);
    if (!updated) {
      throw new Error("Meta record missing after update");
    }
    return updated;
  } catch (error) {
    console.error("[updateMeta]", error);
    throw new Error("Failed to update meta record");
  }
}
