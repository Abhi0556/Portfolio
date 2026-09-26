// lib/utils/validators.ts
import { z } from "zod";

// ─── META ────────────────────────────────────────────────────────────
export const metaUpdateSchema = z.object({
  name: z.string().min(1).max(150).optional(),
  title: z.string().min(1).max(150).optional(),
  tagline: z.string().min(1).max(300).optional(),
  location: z.string().min(1).max(150).optional(),
  aboutText: z.string().min(1).max(5000).optional(),
  aboutImageUrl: z.string().url().or(z.literal("")).optional(),
  email: z.string().email().max(254).optional(),
  resumeUrl: z.string().url().or(z.literal("")).optional(),
  footerTagline: z.string().max(300).optional(),
  isOpenToWork: z.boolean().optional(),
  githubUrl: z.string().url().or(z.literal("")).optional(),
  linkedinUrl: z.string().url().or(z.literal("")).optional(),
  twitterUrl: z.string().url().or(z.literal("")).optional(),
  customLinks: z
    .array(z.object({ label: z.string().min(1).max(50), url: z.string().url() }))
    .max(10)
    .optional(),
});

// ─── EXPERTISE ───────────────────────────────────────────────────────
export const expertiseCreateSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  icon: z.string().min(1).max(2000),
  displayOrder: z.number().int().min(0).default(0),
});
export const expertiseUpdateSchema = expertiseCreateSchema.partial();

// ─── EXPERIENCE ──────────────────────────────────────────────────────
export const experienceCreateSchema = z.object({
  company: z.string().min(1).max(100),
  logoUrl: z.string().url().or(z.literal("")).default(""),
  role: z.string().min(1).max(150),
  startDate: z.string().min(1).max(20),
  endDate: z.string().min(1).max(20).default("Present"),
  description: z.string().min(1).max(1000),
  bullets: z.array(z.string().min(1).max(300)).min(1).max(10),
  isCurrent: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
});
export const experienceUpdateSchema = experienceCreateSchema.partial();

// ─── SKILL CATEGORIES ────────────────────────────────────────────────
export const skillCategoryCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(300).default(""),
  icon: z.string().max(2000).default(""),
  displayOrder: z.number().int().min(0).default(0),
});
export const skillCategoryUpdateSchema = skillCategoryCreateSchema.partial();

// ─── SKILLS ──────────────────────────────────────────────────────────
export const skillCreateSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().min(1).max(100),
  proficiency: z.number().int().min(1).max(100),
  iconUrl: z.string().url().or(z.literal("")).default(""),
  displayOrder: z.number().int().min(0).default(0),
});
export const skillUpdateSchema = skillCreateSchema.partial();

// ─── PROJECTS ────────────────────────────────────────────────────────
export const projectCreateSchema = z.object({
  title: z.string().min(1).max(150),
  shortDescription: z.string().min(1).max(300),
  fullDescription: z.string().min(1).max(5000),
  tags: z.array(z.string().min(1).max(50)).min(1).max(20),
  imageUrl: z.string().url().or(z.literal("")).default(""),
  videoUrl: z.string().url().or(z.literal("")).default(""),
  liveUrl: z.string().url().or(z.literal("")).default(""),
  githubUrl: z.string().url().or(z.literal("")).default(""),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
});
export const projectUpdateSchema = projectCreateSchema.partial();

// ─── PROCESS ─────────────────────────────────────────────────────────
export const processCreateSchema = z.object({
  stepNumber: z.number().int().min(1).max(99),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  displayOrder: z.number().int().min(0).default(0),
});
export const processUpdateSchema = processCreateSchema.partial();

// ─── TESTIMONIALS ────────────────────────────────────────────────────
export const testimonialCreateSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  company: z.string().min(1).max(100),
  quote: z.string().min(10).max(1000),
  avatarUrl: z.string().url().or(z.literal("")).default(""),
  displayOrder: z.number().int().min(0).default(0),
});
export const testimonialUpdateSchema = testimonialCreateSchema.partial();

// ─── AUTH ────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
});

// ─── CONTACT ─────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  message: z.string().min(10).max(2000),
  website: z.string().max(0, "Bot detected"), // honeypot
  submittedAt: z.number().int().positive(),
});

// ─── SEED (one-time) ─────────────────────────────────────────────────
export const seedSchema = z.object({
  seedKey: z.string().min(1),
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
});

// ─── REORDER (shared across all tables) ─────────────────────────────
export const reorderSchema = z.object({
  order: z
    .array(z.object({ id: z.number().int().positive(), displayOrder: z.number().int().min(0) }))
    .min(1),
});
