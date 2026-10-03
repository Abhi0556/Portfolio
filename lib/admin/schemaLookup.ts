// lib/admin/schemaLookup.ts
import type { z } from "zod";
import {
  expertiseCreateSchema,
  expertiseUpdateSchema,
  experienceCreateSchema,
  experienceUpdateSchema,
  skillCreateSchema,
  skillUpdateSchema,
  projectCreateSchema,
  projectUpdateSchema,
  processCreateSchema,
  processUpdateSchema,
  testimonialCreateSchema,
  testimonialUpdateSchema,
  skillCategoryCreateSchema,
  skillCategoryUpdateSchema,
} from "@/lib/utils/validators";

const CREATE_SCHEMAS: Record<string, z.ZodTypeAny> = {
  expertise: expertiseCreateSchema,
  experience: experienceCreateSchema,
  skills: skillCreateSchema,
  projects: projectCreateSchema,
  process: processCreateSchema,
  testimonials: testimonialCreateSchema,
  "skill-categories": skillCategoryCreateSchema,
};

const UPDATE_SCHEMAS: Record<string, z.ZodTypeAny> = {
  expertise: expertiseUpdateSchema,
  experience: experienceUpdateSchema,
  skills: skillUpdateSchema,
  projects: projectUpdateSchema,
  process: processUpdateSchema,
  testimonials: testimonialUpdateSchema,
  "skill-categories": skillCategoryUpdateSchema,
};

export function getCreateSchema(key: string): z.ZodTypeAny {
  return CREATE_SCHEMAS[key];
}

export function getUpdateSchema(key: string): z.ZodTypeAny {
  return UPDATE_SCHEMAS[key];
}