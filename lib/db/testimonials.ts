// lib/db/testimonials.ts
import { asc, eq } from "drizzle-orm";
import { getDb } from "./client";
import { testimonials, type Testimonial, type TestimonialInsert } from "./schema";

export async function getAllTestimonials(
  db: ReturnType<typeof getDb>
): Promise<Testimonial[]> {
  try {
    return await db.select().from(testimonials).orderBy(asc(testimonials.displayOrder));
  } catch (error) {
    console.error("[getAllTestimonials]", error);
    throw new Error("Failed to fetch testimonials");
  }
}

export async function getTestimonialById(
  db: ReturnType<typeof getDb>,
  id: number
): Promise<Testimonial | null> {
  try {
    const rows = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id))
      .limit(1);
    return rows[0] ?? null;
  } catch (error) {
    console.error("[getTestimonialById]", error);
    throw new Error(`Failed to fetch testimonial with id ${id}`);
  }
}

export async function createTestimonial(
  db: ReturnType<typeof getDb>,
  data: Omit<TestimonialInsert, "id" | "createdAt" | "updatedAt">
): Promise<Testimonial> {
  try {
    const result = await db.insert(testimonials).values(data).returning();
    return result[0];
  } catch (error) {
    console.error("[createTestimonial]", error);
    throw new Error("Failed to create testimonial");
  }
}

export async function updateTestimonial(
  db: ReturnType<typeof getDb>,
  id: number,
  data: Partial<Omit<TestimonialInsert, "id" | "createdAt">>
): Promise<Testimonial> {
  try {
    const result = await db
      .update(testimonials)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(testimonials.id, id))
      .returning();
    if (!result[0]) {
      throw new Error(`Testimonial with id ${id} not found`);
    }
    return result[0];
  } catch (error) {
    console.error("[updateTestimonial]", error);
    throw new Error(`Failed to update testimonial with id ${id}`);
  }
}

export async function deleteTestimonial(
  db: ReturnType<typeof getDb>,
  id: number
): Promise<void> {
  try {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  } catch (error) {
    console.error("[deleteTestimonial]", error);
    throw new Error(`Failed to delete testimonial with id ${id}`);
  }
}
