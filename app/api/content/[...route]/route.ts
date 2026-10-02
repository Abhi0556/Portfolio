import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db/client";
import { getMeta, updateMeta } from "@/lib/db/meta";
import * as expertiseDb from "@/lib/db/expertise";
import * as experienceDb from "@/lib/db/experience";
import * as skillCategoriesDb from "@/lib/db/skill-categories";
import * as skillsDb from "@/lib/db/skills";
import * as projectsDb from "@/lib/db/projects";
import * as processDb from "@/lib/db/process";
import * as testimonialsDb from "@/lib/db/testimonials";
import {
  metaUpdateSchema,
  expertiseCreateSchema,
  expertiseUpdateSchema,
  experienceCreateSchema,
  experienceUpdateSchema,
  skillCategoryCreateSchema,
  skillCategoryUpdateSchema,
  skillCreateSchema,
  skillUpdateSchema,
  projectCreateSchema,
  projectUpdateSchema,
  processCreateSchema,
  processUpdateSchema,
  testimonialCreateSchema,
  testimonialUpdateSchema,
  reorderSchema,
} from "@/lib/utils/validators";
import { checkRateLimit } from "@/lib/utils/rateLimit";
import { isAllowedOrigin } from "@/lib/utils/cors";
import { verifySession } from "@/lib/auth/verify";
import { sanitize, sanitizeJsonArray } from "@/lib/utils/sanitize";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

type AnyDb = ReturnType<typeof getDb>;

interface ResourceConfig {
  createSchema: z.ZodTypeAny;
  updateSchema: z.ZodTypeAny;
  sanitizeStringFields: string[];
  jsonArrayFields: string[];
  getAll: (db: AnyDb) => Promise<unknown[]>;
  getById: (db: AnyDb, id: number) => Promise<unknown | null>;
  create: (db: AnyDb, data: Record<string, unknown>) => Promise<unknown>;
  update: (db: AnyDb, id: number, data: Record<string, unknown>) => Promise<unknown>;
  delete: (db: AnyDb, id: number) => Promise<unknown>;
}

const registry: Record<string, ResourceConfig> = {
  expertise: {
    createSchema: expertiseCreateSchema,
    updateSchema: expertiseUpdateSchema,
    sanitizeStringFields: ["title", "description", "icon"],
    jsonArrayFields: [],
    getAll: expertiseDb.getAllExpertise,
    getById: expertiseDb.getExpertiseById,
    create: (db, data) => expertiseDb.createExpertise(db, data as Parameters<typeof expertiseDb.createExpertise>[1]),
    update: (db, id, data) => expertiseDb.updateExpertise(db, id, data as Parameters<typeof expertiseDb.updateExpertise>[2]),
    delete: expertiseDb.deleteExpertise,
  },
  experience: {
    createSchema: experienceCreateSchema,
    updateSchema: experienceUpdateSchema,
    sanitizeStringFields: ["company", "role", "description", "startDate", "endDate"],
    jsonArrayFields: ["bullets"],
    getAll: experienceDb.getAllExperience,
    getById: experienceDb.getExperienceById,
    create: (db, data) => experienceDb.createExperience(db, data as Parameters<typeof experienceDb.createExperience>[1]),
    update: (db, id, data) => experienceDb.updateExperience(db, id, data as Parameters<typeof experienceDb.updateExperience>[2]),
    delete: experienceDb.deleteExperience,
  },
  "skill-categories": {
    createSchema: skillCategoryCreateSchema,
    updateSchema: skillCategoryUpdateSchema,
    sanitizeStringFields: ["name", "description", "icon"],
    jsonArrayFields: [],
    getAll: skillCategoriesDb.getAllSkillCategories,
    getById: skillCategoriesDb.getSkillCategoryById,
    create: (db, data) => skillCategoriesDb.createSkillCategory(db, data as Parameters<typeof skillCategoriesDb.createSkillCategory>[1]),
    update: (db, id, data) => skillCategoriesDb.updateSkillCategory(db, id, data as Parameters<typeof skillCategoriesDb.updateSkillCategory>[2]),
    delete: skillCategoriesDb.deleteSkillCategory,
  },
  skills: {
    createSchema: skillCreateSchema,
    updateSchema: skillUpdateSchema,
    sanitizeStringFields: ["name"],
    jsonArrayFields: [],
    getAll: skillsDb.getAllSkillsWithCategory,
    getById: skillsDb.getSkillById,
    create: (db, data) => skillsDb.createSkill(db, data as Parameters<typeof skillsDb.createSkill>[1]),
    update: (db, id, data) => skillsDb.updateSkill(db, id, data as Parameters<typeof skillsDb.updateSkill>[2]),
    delete: skillsDb.deleteSkill,
  },
  projects: {
    createSchema: projectCreateSchema,
    updateSchema: projectUpdateSchema,
    sanitizeStringFields: ["title", "shortDescription", "fullDescription"],
    jsonArrayFields: ["tags"],
    getAll: projectsDb.getAllProjects,
    getById: projectsDb.getProjectById,
    create: (db, data) => projectsDb.createProject(db, data as Parameters<typeof projectsDb.createProject>[1]),
    update: (db, id, data) => projectsDb.updateProject(db, id, data as Parameters<typeof projectsDb.updateProject>[2]),
    delete: projectsDb.deleteProject,
  },
  process: {
    createSchema: processCreateSchema,
    updateSchema: processUpdateSchema,
    sanitizeStringFields: ["title", "description"],
    jsonArrayFields: [],
    getAll: processDb.getAllProcess,
    getById: processDb.getProcessById,
    create: (db, data) => processDb.createProcess(db, data as Parameters<typeof processDb.createProcess>[1]),
    update: (db, id, data) => processDb.updateProcess(db, id, data as Parameters<typeof processDb.updateProcess>[2]),
    delete: processDb.deleteProcess,
  },
  testimonials: {
    createSchema: testimonialCreateSchema,
    updateSchema: testimonialUpdateSchema,
    sanitizeStringFields: ["name", "role", "company", "quote"],
    jsonArrayFields: [],
    getAll: testimonialsDb.getAllTestimonials,
    getById: testimonialsDb.getTestimonialById,
    create: (db, data) => testimonialsDb.createTestimonial(db, data as Parameters<typeof testimonialsDb.createTestimonial>[1]),
    update: (db, id, data) => testimonialsDb.updateTestimonial(db, id, data as Parameters<typeof testimonialsDb.updateTestimonial>[2]),
    delete: testimonialsDb.deleteTestimonial,
  },
};

const REORDERABLE_TABLES = new Set(Object.keys(registry));

function sanitizeResourceData(
  data: Record<string, unknown>,
  resource: ResourceConfig
): Record<string, unknown> {
  const sanitized = { ...data };
  for (const field of resource.sanitizeStringFields) {
    if (typeof sanitized[field] === "string") {
      sanitized[field] = sanitize(sanitized[field] as string);
    }
  }
  for (const field of resource.jsonArrayFields) {
    if (Array.isArray(sanitized[field])) {
      sanitized[field] = sanitizeJsonArray(sanitized[field] as string[]);
    }
  }
  return sanitized;
}

function sanitizeMetaData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...data };
  const textFields = ["name", "title", "tagline", "location", "aboutText", "footerTagline"];
  for (const field of textFields) {
    if (typeof sanitized[field] === "string") {
      sanitized[field] = sanitize(sanitized[field] as string);
    }
  }
  if (Array.isArray(sanitized.customLinks)) {
    sanitized.customLinks = (sanitized.customLinks as Array<{ label: string; url: string }>).map(
      (link) => ({ label: sanitize(link.label), url: link.url })
    );
  }
  return sanitized;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ route: string[] }> }
): Promise<NextResponse> {
  try {
    const rateLimitResult = await checkRateLimit(request, "public");
    if (!rateLimitResult.success) {
      return errorResponse("Too many requests", 429);
    }

    const { route } = await context.params;
    const [table, ...rest] = route;
    const db = getDb();

    // ── META ────────────────────────────────────────────────────────
    if (table === "meta") {
      const result = await getMeta(db);
      if (!result) return errorResponse("Content not found", 404);
      return successResponse(result);
    }

    const resource = registry[table];
    if (!resource) return errorResponse("Content not found", 404);

    // ── SPECIAL SUB-ROUTES ──────────────────────────────────────────
    if (table === "projects" && rest[0] === "featured") {
      const results = await projectsDb.getFeaturedProjects(db);
      return successResponse(results, 200, { total: results.length, returned: results.length });
    }

    if (table === "skills" && rest[0] === "by-category" && rest[1]) {
      const categoryId = Number(rest[1]);
      if (Number.isNaN(categoryId)) return errorResponse("Invalid category id", 400);
      const results = await skillsDb.getSkillsByCategory(db, categoryId);
      return successResponse(results, 200, { total: results.length, returned: results.length });
    }

    // ── SINGLE RECORD BY ID ─────────────────────────────────────────
    if (rest.length === 1 && !Number.isNaN(Number(rest[0]))) {
      const id = Number(rest[0]);
      const record = await resource.getById(db, id);
      if (!record) return errorResponse("Record not found", 404);
      return successResponse(record);
    }

    // ── LIST ALL ───────────────────────────────────────────────────
    if (rest.length === 0) {
      const records = await resource.getAll(db);
      return successResponse(records, 200, { total: records.length, returned: records.length });
    }

    return errorResponse("Content not found", 404);
  } catch (error) {
    console.error("[GET /api/content]", error);
    return errorResponse("Failed to fetch data", 500);
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ route: string[] }> }
): Promise<NextResponse> {
  try {
    const rateLimitResult = await checkRateLimit(request, "public");
    if (!rateLimitResult.success) return errorResponse("Too many requests", 429);

    if (!isAllowedOrigin(request)) return errorResponse("Forbidden", 403);

    const session = await verifySession(request);
    if (!session.valid) return errorResponse("Unauthorized", 401);

    const { route } = await context.params;
    const [table, ...rest] = route;

    const resource = registry[table];
    if (!resource) return errorResponse("Content not found", 404);
    if (rest.length !== 0) return errorResponse("Content not found", 404);

    const body: unknown = await request.json();
    const result = resource.createSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(`Validation failed: ${result.error.errors[0].message}`, 400);
    }

    const sanitized = sanitizeResourceData(result.data as Record<string, unknown>, resource);

    const db = getDb();
    const created = await resource.create(db, sanitized);
    return successResponse(created, 201);
  } catch (error) {
    console.error("[POST /api/content]", error);
    return errorResponse("Failed to create record", 500);
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ route: string[] }> }
): Promise<NextResponse> {
  try {
    const rateLimitResult = await checkRateLimit(request, "public");
    if (!rateLimitResult.success) return errorResponse("Too many requests", 429);

    if (!isAllowedOrigin(request)) return errorResponse("Forbidden", 403);

    const session = await verifySession(request);
    if (!session.valid) return errorResponse("Unauthorized", 401);

    const { route } = await context.params;
    const [table, ...rest] = route;
    const db = getDb();

    // ── META UPDATE ──────────────────────────────────────────────────
    if (table === "meta" && rest.length === 0) {
      const body: unknown = await request.json();
      const result = metaUpdateSchema.safeParse(body);
      if (!result.success) {
        return errorResponse(`Validation failed: ${result.error.errors[0].message}`, 400);
      }
      const sanitized = sanitizeMetaData(result.data);
      const updated = await updateMeta(db, sanitized);
      return successResponse({ updated: true, ...updated });
    }

    // ── REORDER ──────────────────────────────────────────────────────
    if (rest[0] === "reorder" && rest.length === 1) {
      if (!REORDERABLE_TABLES.has(table)) return errorResponse("Content not found", 404);
      const body: unknown = await request.json();
      const result = reorderSchema.safeParse(body);
      if (!result.success) {
        return errorResponse(`Validation failed: ${result.error.errors[0].message}`, 400);
      }
      const resource = registry[table];
      for (const item of result.data.order) {
        await resource.update(db, item.id, { displayOrder: item.displayOrder });
      }
      return successResponse({ updated: true });
    }

    // ── STANDARD RECORD UPDATE ───────────────────────────────────────
    const resource = registry[table];
    if (!resource) return errorResponse("Content not found", 404);
    if (rest.length !== 1 || Number.isNaN(Number(rest[0]))) {
      return errorResponse("Content not found", 404);
    }
    const id = Number(rest[0]);

    const existing = await resource.getById(db, id);
    if (!existing) return errorResponse("Record not found", 404);

    const body: unknown = await request.json();
    const result = resource.updateSchema.safeParse(body);
    if (!result.success) {
      return errorResponse(`Validation failed: ${result.error.errors[0].message}`, 400);
    }

    const sanitized = sanitizeResourceData(result.data as Record<string, unknown>, resource);
    const updated = await resource.update(db, id, sanitized);
    return successResponse(updated);
  } catch (error) {
    console.error("[PUT /api/content]", error);
    return errorResponse("Failed to update record", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ route: string[] }> }
): Promise<NextResponse> {
  try {
    const rateLimitResult = await checkRateLimit(request, "public");
    if (!rateLimitResult.success) return errorResponse("Too many requests", 429);

    if (!isAllowedOrigin(request)) return errorResponse("Forbidden", 403);

    const session = await verifySession(request);
    if (!session.valid) return errorResponse("Unauthorized", 401);

    const { route } = await context.params;
    const [table, ...rest] = route;
    const resource = registry[table];
    if (!resource) return errorResponse("Content not found", 404);
    if (rest.length !== 1 || Number.isNaN(Number(rest[0]))) {
      return errorResponse("Content not found", 404);
    }
    const id = Number(rest[0]);
    const db = getDb();

    const existing = await resource.getById(db, id);
    if (!existing) return errorResponse("Record not found", 404);

    const result = await resource.delete(db, id);

    if (table === "skill-categories" && result && typeof result === "object" && "blocked" in result) {
      const guardResult = result as { deleted: boolean; blocked?: boolean };
      if (guardResult.blocked) {
        return errorResponse(
          "Cannot delete category with existing skills. Reassign or delete skills first.",
          400
        );
      }
    }

    return successResponse({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/content]", error);
    return errorResponse("Failed to delete record", 500);
  }
}




