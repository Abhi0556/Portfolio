// types/content.ts
export type {
  Meta,
  MetaInsert,
  Expertise,
  ExpertiseInsert,
  Experience,
  ExperienceInsert,
  SkillCategory,
  SkillCategoryInsert,
  Skill,
  SkillInsert,
  Project,
  ProjectInsert,
  Process,
  ProcessInsert,
  Testimonial,
  TestimonialInsert,
  AdminUser,
  AdminUserInsert,
} from "@/lib/db/schema";

// Composite type returned by GET /api/content/skills (JOIN with category)
// per API.md Section 4.2 — not a DB table, constructed in lib/db/skills.ts
export interface SkillWithCategory {
  id: number;
  categoryId: number;
  category: {
    id: number;
    name: string;
    description: string;
    icon: string;
    displayOrder: number;
  };
  name: string;
  proficiency: number;
  iconUrl: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Parsed shape of Meta.customLinks after JSON.parse — used wherever
// the API layer or a future component consumes it
export interface CustomLink {
  label: string;
  url: string;
}