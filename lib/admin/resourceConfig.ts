// lib/admin/resourceConfig.ts

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "url"
  | "upload"
  | "string-array"
  | "link-array"
  | "select";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  accept?: string;
  uploadFolder?: string;
  dynamicOptionsKey?: string;
  helpText?: string;
}

export interface ResourceAdminConfig {
  key: string;
  label: string;
  apiBase: string;
  singleRow?: boolean;
  listTitleField?: string;
  hasReorder?: boolean;
  fields: FieldConfig[];
}

// displayOrder is NEVER a form field on any resource below — it is managed
// exclusively by DataTable's Move Up/Down buttons via the reorder endpoint.
// New records get displayOrder: 0 from the server-side Zod default.

export const metaConfig: ResourceAdminConfig = {
  key: "meta",
  label: "Site Meta",
  apiBase: "/api/content/meta",
  singleRow: true,
  fields: [
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "title", label: "Professional Title", type: "text", required: true },
    { name: "tagline", label: "Tagline", type: "textarea", required: true },
    { name: "location", label: "Location", type: "text", required: true },
    { name: "aboutText", label: "About Text", type: "textarea", required: true },
    {
      name: "aboutImageUrl", label: "About Photo", type: "upload",
      accept: "image/jpeg,image/png,image/webp", uploadFolder: "portfolio/meta",
    },
    { name: "email", label: "Contact Email", type: "text", required: true },
    {
      name: "resumeUrl", label: "Resume (PDF)", type: "upload",
      accept: "application/pdf", uploadFolder: "portfolio/meta",
    },
    { name: "footerTagline", label: "Footer Tagline", type: "text" },
    { name: "isOpenToWork", label: "Open to Work", type: "boolean" },
    { name: "githubUrl", label: "GitHub URL", type: "url" },
    { name: "linkedinUrl", label: "LinkedIn URL", type: "url" },
    { name: "twitterUrl", label: "Twitter/X URL", type: "url" },
    { name: "customLinks", label: "Custom Links", type: "link-array" },
  ],
};

export const expertiseConfig: ResourceAdminConfig = {
  key: "expertise", label: "Expertise Cards", apiBase: "/api/content/expertise",
  listTitleField: "title", hasReorder: true,
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    {
      name: "icon", label: "Icon Key", type: "text", required: true,
      helpText: "Icon library key, e.g. 'code' — not raw SVG (stripped by sanitization on save).",
    },
  ],
};

export const experienceConfig: ResourceAdminConfig = {
  key: "experience", label: "Experience", apiBase: "/api/content/experience",
  listTitleField: "company", hasReorder: true,
  fields: [
    { name: "company", label: "Company", type: "text", required: true },
    { name: "role", label: "Role", type: "text", required: true },
    { name: "startDate", label: "Start Date", type: "text", required: true, placeholder: "Jan 2023" },
    { name: "endDate", label: "End Date", type: "text", placeholder: "Present" },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "bullets", label: "Impact Bullets", type: "string-array" },
    {
      name: "logoUrl", label: "Company Logo", type: "upload",
      accept: "image/jpeg,image/png,image/webp,image/svg+xml", uploadFolder: "portfolio/experience",
    },
    { name: "isCurrent", label: "Current Role", type: "boolean" },
  ],
};

export const skillCategoryConfig: ResourceAdminConfig = {
  key: "skill-categories", label: "Skill Categories", apiBase: "/api/content/skill-categories",
  listTitleField: "name", hasReorder: true,
  fields: [
    { name: "name", label: "Category Name", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "icon", label: "Icon Key", type: "text" },
  ],
};

export const skillsConfig: ResourceAdminConfig = {
  key: "skills", label: "Skills", apiBase: "/api/content/skills",
  listTitleField: "name", hasReorder: true,
  fields: [
    { name: "categoryId", label: "Category", type: "select", required: true, dynamicOptionsKey: "categoryId" },
    { name: "name", label: "Skill Name", type: "text", required: true },
    { name: "proficiency", label: "Proficiency (1-100)", type: "number", required: true, min: 1, max: 100 },
    {
      name: "iconUrl", label: "Icon Image", type: "upload",
      accept: "image/jpeg,image/png,image/webp,image/svg+xml", uploadFolder: "portfolio/skills",
    },
  ],
};

export const projectsConfig: ResourceAdminConfig = {
  key: "projects", label: "Projects", apiBase: "/api/content/projects",
  listTitleField: "title", hasReorder: true,
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "shortDescription", label: "Short Description", type: "textarea", required: true },
    { name: "fullDescription", label: "Full Description", type: "textarea", required: true },
    { name: "tags", label: "Tech Stack Tags", type: "string-array" },
    {
      name: "imageUrl", label: "Thumbnail Image", type: "upload",
      accept: "image/jpeg,image/png,image/webp", uploadFolder: "portfolio/projects",
    },
    {
      name: "videoUrl", label: "Demo Video", type: "upload",
      accept: "video/mp4", uploadFolder: "portfolio/projects",
    },
    { name: "liveUrl", label: "Live URL", type: "url" },
    { name: "githubUrl", label: "GitHub URL", type: "url" },
    { name: "isFeatured", label: "Featured Project", type: "boolean" },
  ],
};

export const processConfig: ResourceAdminConfig = {
  key: "process", label: "Process Steps", apiBase: "/api/content/process",
  listTitleField: "title", hasReorder: true,
  fields: [
    { name: "stepNumber", label: "Step Number", type: "number", required: true, min: 1, max: 99 },
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
  ],
};

export const testimonialsConfig: ResourceAdminConfig = {
  key: "testimonials", label: "Testimonials", apiBase: "/api/content/testimonials",
  listTitleField: "name", hasReorder: true,
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "role", label: "Role", type: "text", required: true },
    { name: "company", label: "Company", type: "text", required: true },
    { name: "quote", label: "Quote", type: "textarea", required: true },
    {
      name: "avatarUrl", label: "Avatar", type: "upload",
      accept: "image/jpeg,image/png,image/webp", uploadFolder: "portfolio/testimonials",
    },
  ],
};

// Routable, dashboard-visible resources. skill-categories is deliberately
// excluded — it has no standalone [section] URL, it lives only inside the
// /admin/skills two-panel page (Decision #5).
export const RESOURCE_CONFIGS: ResourceAdminConfig[] = [
  expertiseConfig, experienceConfig, skillsConfig, projectsConfig, processConfig, testimonialsConfig,
];

export function getResourceConfig(key: string): ResourceAdminConfig | undefined {
  return RESOURCE_CONFIGS.find((r) => r.key === key);
}