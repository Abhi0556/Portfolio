// lib/db/schema.ts
// SINGLE SOURCE OF TRUTH for all database tables.

import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ─── SHARED TIMESTAMP COLUMNS ───────────────────────────────────────
// updatedAt is NOT auto-updated by SQLite — every UPDATE query in the
// lib/db/*.ts layer MUST explicitly set updatedAt: new Date().toISOString()
const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
};

// ─── META — single row, id always 1 ─────────────────────────────────
export const meta = sqliteTable("meta", {
  id: integer("id").primaryKey({ autoIncrement: false }).default(1),
  name: text("name").notNull(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull(),
  location: text("location").notNull(),
  aboutText: text("about_text").notNull(),
  aboutImageUrl: text("about_image_url").notNull().default(""),
  email: text("email").notNull(),
  resumeUrl: text("resume_url").notNull().default(""),
  footerTagline: text("footer_tagline").notNull().default(""),
  isOpenToWork: integer("is_open_to_work", { mode: "boolean" })
    .notNull()
    .default(true),
  githubUrl: text("github_url").notNull().default(""),
  linkedinUrl: text("linkedin_url").notNull().default(""),
  twitterUrl: text("twitter_url").notNull().default(""),
  // JSON array of { label: string; url: string } — stored as text,
  // parsed/stringified in lib/db/meta.ts, never parsed elsewhere
  customLinks: text("custom_links").notNull().default("[]"),
  ...timestamps,
});
export type Meta = typeof meta.$inferSelect;
export type MetaInsert = typeof meta.$inferInsert;

// ─── EXPERTISE — "What I Do" cards ──────────────────────────────────
export const expertise = sqliteTable("expertise", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  ...timestamps,
});
export type Expertise = typeof expertise.$inferSelect;
export type ExpertiseInsert = typeof expertise.$inferInsert;

// ─── EXPERIENCE — work timeline ─────────────────────────────────────
export const experience = sqliteTable("experience", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  company: text("company").notNull(),
  logoUrl: text("logo_url").notNull().default(""),
  role: text("role").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull().default("Present"),
  description: text("description").notNull(),
  // JSON array of strings — stored as text
  bullets: text("bullets").notNull().default("[]"),
  isCurrent: integer("is_current", { mode: "boolean" }).notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  ...timestamps,
});
export type Experience = typeof experience.$inferSelect;
export type ExperienceInsert = typeof experience.$inferInsert;

// ─── SKILL CATEGORIES — dynamic taxonomy ────────────────────────────
export const skillCategories = sqliteTable("skill_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  icon: text("icon").notNull().default(""),
  displayOrder: integer("display_order").notNull().default(0),
  ...timestamps,
});
export type SkillCategory = typeof skillCategories.$inferSelect;
export type SkillCategoryInsert = typeof skillCategories.$inferInsert;

// ─── SKILLS — individual skills, FK to skillCategories ──────────────
export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => skillCategories.id),
  name: text("name").notNull(),
  proficiency: integer("proficiency").notNull(),
  iconUrl: text("icon_url").notNull().default(""),
  displayOrder: integer("display_order").notNull().default(0),
  ...timestamps,
});
export type Skill = typeof skills.$inferSelect;
export type SkillInsert = typeof skills.$inferInsert;

// ─── PROJECTS — portfolio work ───────────────────────────────────────
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  // JSON array of strings — stored as text
  tags: text("tags").notNull().default("[]"),
  imageUrl: text("image_url").notNull().default(""),
  videoUrl: text("video_url").notNull().default(""),
  liveUrl: text("live_url").notNull().default(""),
  githubUrl: text("github_url").notNull().default(""),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  ...timestamps,
});
export type Project = typeof projects.$inferSelect;
export type ProjectInsert = typeof projects.$inferInsert;

// ─── PROCESS — "How I Work" steps ───────────────────────────────────
export const process = sqliteTable("process", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stepNumber: integer("step_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  ...timestamps,
});
export type Process = typeof process.$inferSelect;
export type ProcessInsert = typeof process.$inferInsert;

// ─── TESTIMONIALS — social proof ────────────────────────────────────
export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  quote: text("quote").notNull(),
  avatarUrl: text("avatar_url").notNull().default(""),
  displayOrder: integer("display_order").notNull().default(0),
  ...timestamps,
});
export type Testimonial = typeof testimonials.$inferSelect;
export type TestimonialInsert = typeof testimonials.$inferInsert;

// ─── ADMIN USER — single row, id always 1 ───────────────────────────
// Per API.md Section 3.3 — do not add fields not listed there.
export const adminUser = sqliteTable("admin_user", {
  id: integer("id").primaryKey({ autoIncrement: false }).default(1),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  sessionToken: text("session_token"),
  sessionExpiresAt: text("session_expires_at"),
  failedAttempts: integer("failed_attempts").notNull().default(0),
  lockedUntil: text("locked_until"),
  ...timestamps,
});
export type AdminUser = typeof adminUser.$inferSelect;
export type AdminUserInsert = typeof adminUser.$inferInsert;