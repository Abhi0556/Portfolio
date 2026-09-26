# 🏗️ PHASE 1 — FOUNDATION & INFRASTRUCTURE
## Personal Developer Portfolio — Implementation Spec for AI Coding Agent
**Version:** 1.0.0
**Depends on:** `DOCS/PRD.md`, `DOCS/TRD.md`, `DOCS/API.md`, `DOCS/Brand.md` (all LOCKED)
**Precondition:** `PROJECT_STATUS.md` audit dated 2026-09-23 has been read and is assumed accurate.

> This document is the ONLY source of truth for Phase 1. Where this document
> gives exact code, use it verbatim — do not "improve" it, rename variables,
> reorder fields, or add anything not written here. Where this document says
> "copy exactly from Brand.md Section X," open that file and copy the block
> character-for-character — do not reconstruct it from memory.
>
> Do NOT proceed to any task outside the "IN SCOPE" list below. If completing
> an in-scope task seems to require touching an out-of-scope file, STOP and
> report it — do not silently expand scope.
>
> Phase 1 is complete only when every checkbox in Section N is literally true,
> verified by running the actual command listed — not assumed.

---

## 0. SCOPE DEFINITION

### 0.1 IN SCOPE — Phase 1 builds ONLY these things
```
A. Project structure corrections (fix audit-flagged inconsistencies)
B. Environment variable correction (.env.example, .env.local keys)
C. next.config.ts (rename from .mjs, add security headers + CSP)
D. Design token foundation: globals.css, tailwind.config.ts, self-hosted fonts,
   font loading + Lenis init in app/layout.tsx
E. Complete Drizzle schema (lib/db/schema.ts) — ALL 9 tables including admin_user
F. Drizzle migration generation + push to Cloudflare D1
G. TypeScript types (types/content.ts, types/api.ts) corrected
H. Complete CRUD query layer (lib/db/*.ts) for all 9 tables
I. Core utilities: lib/utils/validators.ts (full Zod schemas), lib/utils/rateLimit.ts
   lib/utils/sanitize.ts (verify only — likely no changes needed)
J. Third-party client wrappers: lib/imagekit/client.ts, lib/email/emailjs.ts
K. hooks/useContent.ts, hooks/useLenis.ts (fully implemented per documented contracts)
L. constants/index.ts populated
M. Admin bootstrap: install bcryptjs, create scripts/seed-admin.ts, run it once
```

### 0.2 OUT OF SCOPE — do NOT build these in Phase 1, even partially
```
❌ Any file under app/api/**            (Phase 2 — API Layer)
❌ app/admin/layout.tsx auth guard logic (Phase 2/3 — needs auth routes first)
❌ hooks/useAdmin.ts real logic          (needs /api/auth/verify — Phase 2)
❌ hooks/useScrollAnimation.ts           (no documented interface exists yet —
                                           will be specified when Phase 4 defines
                                           actual ScrollTrigger usage patterns)
❌ Any file under components/**          (Phase 3 admin UI / Phase 4 sections)
❌ Any content inside app/page.tsx beyond a minimal placeholder (see Section D.4)
❌ Fixing/deleting .freebuff/            (unidentified — flag to user, do not touch)
```
If you finish everything in 0.1 and are tempted to keep going into 0.2 — stop.
Report Phase 1 complete and wait for the Phase 2 spec.

---

## 1. DECISIONS LOG — resolving audit ambiguities

These are final decisions. Implement them as stated; do not re-litigate.

| # | Ambiguity from audit | Decision |
|---|---|---|
| 1 | ImageKit (locked spec) vs. Cloudflare R2 (found in stub code + `.env.example`) | **ImageKit wins.** It is the TRD/API-locked choice. Delete all R2 references. Rebuild `lib/imagekit/client.ts` and `.env.example` around `@imagekit/nodejs` / `@imagekit/next`. |
| 2 | `admin_user` table missing from schema | **Add it now**, in Phase 1, exactly as specified in `API.md` Section 3.3. The auth *routes* that use it are still Phase 2. |
| 3 | `lib/db/skills.ts` never created; `skill-categories.ts` exists with category-only CRUD | **Keep both files as two separate resources:** `lib/db/skill-categories.ts` (category CRUD, unchanged in purpose) AND a new `lib/db/skills.ts` (individual skill row CRUD + the `by-category` query). This matches API.md's two distinct route groups. |
| 4 | `next.config.mjs` vs. TRD's `next.config.ts`; docs live in `DOCS/` not root | **Rename** `next.config.mjs` → `next.config.ts`. **Leave `DOCS/` folder as-is** — it's a documentation location, not runtime code; not worth the churn. This is a noted, accepted deviation from TRD Section 5, not a bug to fix. |
| 5 | `jsdom` + `@types/jsdom` installed but absent from TRD's locked package table, and use carets (`^`) | **Keep them** — required for server-side DOMPurify, correctly used in `sanitize.ts`. **Pin exact versions** (remove `^`) to whatever is currently in `package-lock.json`, and add both to `DOCS/TRD.md` Section 3 as a documented addition (this is a TRD edit — see Section A.4 below, it's the one exception to "don't touch docs"). |
| 6 | `.freebuff/` directory — unidentified, not in any spec | **Do not touch.** Do not delete, do not inspect contents beyond confirming it exists, do not move it. Flag it back to the user in your Phase 1 completion report as an open question. |

---

## 2. SECTION A — PROJECT STRUCTURE CORRECTIONS

Execute in this order:

1. **Rename config file:**
   ```
   git mv next.config.mjs next.config.ts
   ```
   Convert its contents to valid TypeScript (`import type { NextConfig } from "next"`) — see Section C for full required content, which supersedes whatever is currently in the `.mjs` file.

2. **Create the missing skills CRUD file** (do not delete or rename `skill-categories.ts` — it stays, unchanged in responsibility):
   ```
   lib/db/skills.ts   ← NEW FILE, see Section H.5
   ```

3. **Do NOT create** `CONTEXT.md` at root — it is referenced in TRD.md Section 5 but is not something this audit or this phase requires; skip it silently, no need to report.

4. **Update `DOCS/TRD.md` Section 3** (Package Lock table) to add these two rows, pinned to whatever exact version is currently resolved in `package-lock.json` (run `npm ls jsdom @types/jsdom` to get the resolved version, then hardcode it — no carets):
   ```json
   "jsdom": "<exact-resolved-version>",
   ```
   and under devDependencies:
   ```json
   "@types/jsdom": "<exact-resolved-version>",
   ```
   Also update `package.json` itself to pin these two without `^`.

5. **Leave alone, do not modify, do not delete:** `.freebuff/`, `DOCS/` folder structure, `next-env.d.ts`, `tsconfig.tsbuildinfo` (both are auto-generated, harmless).

---

## 3. SECTION B — ENVIRONMENT VARIABLES

### 3.1 Fix `.env.example`
Replace any `CLOUDFLARE_R2_*` entries with the ImageKit variables. Final `.env.example` must contain exactly these keys (values blank, this file is committed to git):

```bash
# ─── EmailJS (public — safe for browser) ───────────────────────────
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=

# ─── Cloudflare D1 (server-only) ────────────────────────────────────
CLOUDFLARE_D1_DATABASE_ID=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=

# ─── ImageKit (PUBLIC_KEY + URL_ENDPOINT are frontend-safe) ─────────
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

# ─── Admin ───────────────────────────────────────────────────────────
ADMIN_SECRET_KEY=

# ─── One-time seed (delete both lines after running scripts/seed-admin.ts) ──
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

### 3.2 Fix `.env.local`
Add the three `IMAGEKIT_*` keys with real values obtained from the ImageKit dashboard (Developer Options). Remove any `CLOUDFLARE_R2_*` keys if present. Do not touch `NEXT_PUBLIC_EMAILJS_*`, `CLOUDFLARE_D1_*`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `ADMIN_SECRET_KEY` — these audited as already correctly present.

Add temporarily (for Section M seeding), then delete after seeding runs successfully:
```
ADMIN_EMAIL=<your real email>
ADMIN_PASSWORD=<a strong password, 8-128 chars>
```

**Never commit `.env.local`.** Confirm it is still listed in `.gitignore` (audit confirmed it already is — just don't regress this).

---

## 4. SECTION C — `next.config.ts`

Full required content (TypeScript, replaces the `.mjs` file entirely):

```typescript
import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://ik.imagekit.io data:;
  media-src 'self' https://ik.imagekit.io;
  font-src 'self';
  connect-src 'self' https://ik.imagekit.io;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`;

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader.replace(/\n/g, " ").trim() },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
  async headers(): Promise<
    Array<{ source: string; headers: Array<{ key: string; value: string }> }>
  > {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

**Note on `IMAGEKIT_URL_ENDPOINT`:** if your ImageKit URL endpoint is not the default `ik.imagekit.io` subdomain, replace the hostname above with your actual endpoint's hostname. Do not hardcode a guess — read the value from `.env.local` yourself and use the real hostname.

---

## 5. SECTION D — DESIGN TOKEN FOUNDATION

### 5.1 `styles/globals.css`
Must contain:
1. The three `@tailwind` directives (already present — keep them, they go first).
2. The **entire** `:root { ... }` CSS custom properties block from `Brand.md` Section 2.2 — copy it verbatim, character-for-character. Do not paraphrase, reorder, or "clean up" any value, including the code comments inside it (they document *why* each value was chosen and must stay attached to the correct variable).
3. Also append the type-scale, line-height, letter-spacing block from `Brand.md` Section 3.5, and the spacing/radius block from `Brand.md` Section 4 — same verbatim rule.
4. Also append the animation timing tokens block from `Brand.md` Section 5.2, and the z-index scale from `Brand.md` Section 7.3.

Do not add any CSS rule beyond custom properties in this file — no component styles, no resets beyond Tailwind's own.

### 5.2 `tailwind.config.ts`
Replace entirely with the exact config given in `Brand.md` Section 10 ("TAILWIND CONFIGURATION — COMPLETE"). Copy verbatim. Do not merge it with whatever minimal config currently exists — full replacement.

### 5.3 Fonts — self-hosting
1. Download Clash Display and Satoshi per `Brand.md` Section 11 (manual download from Fontshare — this step cannot be automated by the agent; if font files cannot be obtained, STOP and report this blocker rather than substituting a different font or leaving `public/fonts/` empty and silently proceeding).
2. Place exactly these files:
   ```
   public/fonts/clash-display/ClashDisplay-Medium.woff2
   public/fonts/clash-display/ClashDisplay-Semibold.woff2
   public/fonts/clash-display/ClashDisplay-Bold.woff2
   public/fonts/satoshi/Satoshi-Regular.woff2
   public/fonts/satoshi/Satoshi-Medium.woff2
   public/fonts/satoshi/Satoshi-Bold.woff2
   ```
   JetBrains Mono needs no manual download — loaded via `next/font/google`.
3. Remove the `.gitkeep` file once real fonts are in place.

### 5.4 `app/layout.tsx`
This is the one file in Phase 1 allowed to touch the root layout. Required contents:

```typescript
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

import "@/styles/globals.css";

const clashDisplay = localFont({
  src: [
    { path: "../public/fonts/clash-display/ClashDisplay-Medium.woff2", weight: "500" },
    { path: "../public/fonts/clash-display/ClashDisplay-Semibold.woff2", weight: "600" },
    { path: "../public/fonts/clash-display/ClashDisplay-Bold.woff2", weight: "700" },
  ],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const satoshi = localFont({
  src: [
    { path: "../public/fonts/satoshi/Satoshi-Regular.woff2", weight: "400" },
    { path: "../public/fonts/satoshi/Satoshi-Medium.woff2", weight: "500" },
    { path: "../public/fonts/satoshi/Satoshi-Bold.woff2", weight: "700" },
  ],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal developer portfolio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${satoshi.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg-primary text-text-primary font-body antialiased">
        {children}
      </body>
    </html>
  );
}
```

**Do NOT initialize Lenis inside `layout.tsx` directly.** Lenis initialization belongs in `hooks/useLenis.ts` (Section K.2), and `layout.tsx` stays a server component. If Lenis needs a client boundary, that wiring happens in Phase 4 when a `<Providers>` client wrapper is introduced alongside real page content — do not invent that wrapper now. This file's only Phase 1 job is fonts + CSS + metadata.

### 5.5 `app/page.tsx`
Minimal placeholder only — do not import any section components (none are built yet):

```typescript
export default function Home(): React.ReactElement {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="font-mono text-body-sm text-text-tertiary">
        Foundation phase — sections not yet built.
      </p>
    </main>
  );
}
```

---

## 6. SECTION E — COMPLETE DATABASE SCHEMA

Replace `lib/db/schema.ts` in full with the content below. This is the single source of truth — every other Phase 1 file (types, CRUD, validators) must match these field names and types exactly.

```typescript
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
```

**Rules for this file:**
- Never add a field not listed above without updating this spec first.
- `bullets`, `tags`, `customLinks` are `text` columns holding JSON strings — Drizzle does NOT parse them automatically. Parsing/stringifying happens exclusively in the `lib/db/*.ts` query layer (Section H), never in API routes, never in components.
- `isOpenToWork`, `isCurrent`, `isFeatured` use Drizzle's `{ mode: "boolean" }` — this makes Drizzle return real `true`/`false` in JS even though SQLite stores `0`/`1`. Do not manually convert these.

---

## 7. SECTION F — MIGRATION WORKFLOW

Run these commands in order. Do not skip verification steps.

1. Generate migration SQL from the schema:
   ```bash
   npm run db:generate
   ```
   This must produce a new file under `drizzle/` (e.g. `drizzle/0000_xxxx.sql`). Open it and confirm it contains `CREATE TABLE` statements for all 9 tables listed in Section E — if any table is missing from the generated SQL, STOP, do not proceed, report the discrepancy.

2. Apply the migration to the actual Cloudflare D1 database:
   ```bash
   npm run db:migrate
   ```
   This requires `CLOUDFLARE_D1_DATABASE_ID`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` to be correctly set in `.env.local` (audit confirms these are present — do not re-verify their values, only that the migrate command succeeds against them).

3. Verify by opening Drizzle Studio and visually confirming all 9 tables exist with correct columns:
   ```bash
   npm run db:studio
   ```

4. Report the exact output of steps 1 and 2 in your completion summary — do not just say "migration ran," paste the actual terminal output.

If `npm run db:generate` or `npm run db:migrate` scripts do not exist in `package.json`, add them first:
```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:studio": "drizzle-kit studio"
```

---

## 8. SECTION G — TYPESCRIPT TYPES

### 8.1 `types/content.ts`
Keep as a re-export of schema types (audit confirms this pattern is already correct) — but add the two composite/derived types the API layer needs that aren't 1:1 with a DB row:

```typescript
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
```

### 8.2 `types/api.ts`
Fix the missing `meta` field and the empty `ApiRequest`:

```typescript
// types/api.ts

export interface ResponseMeta {
  total: number;
  returned: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  meta?: ResponseMeta;
}

// Standard shape for a bulk reorder request body — used by every
// PUT /api/content/[table]/reorder route (built in Phase 2)
export interface ReorderRequest {
  order: Array<{ id: number; displayOrder: number }>;
}
```

Delete the previously empty `ApiRequest` interface entirely — it had no documented shape anywhere in the spec docs and was a hallucinated placeholder. Do not reintroduce it unless a future spec defines its exact fields.

---

## 9. SECTION H — DATABASE CRUD LAYER

**General rules for every file in this section:**
- Every exported function has an explicit return type and full try/catch — but note: **these functions throw or return typed results; they do NOT format `ApiResponse<T>`.** That formatting happens in the API route layer (Phase 2). This layer's job is only: talk to Drizzle, parse/stringify JSON columns, return typed data or `null`/throw.
- Every function takes `db: ReturnType<typeof getDb>` as its first parameter (the Drizzle instance from `lib/db/client.ts`) — never instantiate a DB connection inside these files.
- Never use `SELECT *` conceptually — Drizzle's `.select()` with no column list is fine since Drizzle already knows the schema's shape and this project does not expose `admin_user`'s sensitive columns through any of these files' public functions (see H.9).

### 9.1 `lib/db/meta.ts`
```typescript
export async function getMeta(db): Promise<Meta | null>
// SELECT the single row where id = 1. Return null if not seeded yet.
// Parse customLinks from JSON string to CustomLink[] before returning
// (extend the Meta type at the call site or return a parsed variant —
// keep the DB-layer return type honest: define and export
// `MetaWithParsedLinks` here if needed, do not silently change Meta's shape)

export async function updateMeta(db, data: Partial<MetaInsert>): Promise<Meta>
// UPDATE the row where id = 1. If customLinks is present in `data`,
// JSON.stringify it before writing. Always set updatedAt to
// new Date().toISOString(). Return the updated row (re-fetch after write).
```

### 9.2 `lib/db/expertise.ts`
```typescript
export async function getAllExpertise(db): Promise<Expertise[]>
// ORDER BY displayOrder ASC

export async function getExpertiseById(db, id: number): Promise<Expertise | null>

export async function createExpertise(db, data: ExpertiseInsert): Promise<Expertise>
// omit id/timestamps from input type at call site — createdAt/updatedAt
// default via schema; return the inserted row

export async function updateExpertise(db, id: number, data: Partial<ExpertiseInsert>): Promise<Expertise>
// set updatedAt: new Date().toISOString()

export async function deleteExpertise(db, id: number): Promise<void>
```

### 9.3 `lib/db/experience.ts`
Same five-function shape as 9.2 (`getAllExperience`, `getExperienceById`, `createExperience`, `updateExperience`, `deleteExperience`), ORDER BY displayOrder ASC, **plus**:
- `bullets` must be `JSON.parse`d on every read and `JSON.stringify`d on every write (create + update), matching API.md Section 4.2's explicit instruction: "Sanitize each element individually. Store as `JSON.stringify(sanitizedArray)`. Return as parsed array on read." (Sanitization itself happens in the API route with `sanitizeJsonArray()` — this file only handles the JSON (de)serialization, not sanitization.)

### 9.4 `lib/db/skill-categories.ts`
Fix the existing stub to real implementation:
```typescript
export async function getAllSkillCategories(db): Promise<SkillCategory[]>
// ORDER BY displayOrder ASC

export async function getSkillCategoryById(db, id: number): Promise<SkillCategory | null>

export async function createSkillCategory(db, data: SkillCategoryInsert): Promise<SkillCategory>

export async function updateSkillCategory(db, id: number, data: Partial<SkillCategoryInsert>): Promise<SkillCategory>

export async function deleteSkillCategory(db, id: number): Promise<{ deleted: boolean; blocked?: boolean }>
// Per API.md 4.2: BEFORE deleting, check if any row in `skills` has
// categoryId = id. If yes, return { deleted: false, blocked: true }
// and do NOT delete — the API route layer (Phase 2) turns this into
// the 400 response "Cannot delete category with existing skills..."
// This file must not throw for that case — it's an expected outcome,
// not an error.
```

### 9.5 `lib/db/skills.ts` (NEW FILE)
```typescript
export async function getAllSkillsWithCategory(db): Promise<SkillWithCategory[]>
// JOIN skills with skillCategories on categoryId.
// ORDER BY skillCategories.displayOrder ASC, then skills.displayOrder ASC
// Shape each row into the SkillWithCategory type from types/content.ts —
// category as a nested object, exactly matching API.md 4.2's example response.

export async function getSkillById(db, id: number): Promise<Skill | null>

export async function getSkillsByCategory(db, categoryId: number): Promise<Skill[]>
// ORDER BY displayOrder ASC

export async function createSkill(db, data: SkillInsert): Promise<Skill>

export async function updateSkill(db, id: number, data: Partial<SkillInsert>): Promise<Skill>

export async function deleteSkill(db, id: number): Promise<void>
```

### 9.6 `lib/db/projects.ts`
Same five-function shape as 9.2, ORDER BY displayOrder ASC, **plus**:
- `tags` JSON (de)serialization exactly like `experience.bullets` (Section 9.3).
- One additional function:
```typescript
export async function getFeaturedProjects(db): Promise<Project[]>
// WHERE isFeatured = true, ORDER BY displayOrder ASC
// No limit on count — API.md 4.2 explicitly states "no restriction on count"
```

### 9.7 `lib/db/process.ts`
Same five-function shape as 9.2 (`getAllProcess`, `getProcessById`, `createProcess`, `updateProcess`, `deleteProcess`), ORDER BY displayOrder ASC. No JSON columns, no special cases.

### 9.8 `lib/db/testimonials.ts`
Same five-function shape as 9.2 (`getAllTestimonials`, `getTestimonialById`, `createTestimonial`, `updateTestimonial`, `deleteTestimonial`), ORDER BY displayOrder ASC. No JSON columns.

### 9.9 `lib/db/admin-user.ts` (NEW FILE — infrastructure only, no auth logic)
This file exists so the seed script (Section M) and the future Phase 2 auth routes have a query layer to call. **It must never be imported by any public/content-facing code path.**
```typescript
export async function getAdminUserByEmail(db, email: string): Promise<AdminUser | null>

export async function createAdminUser(db, data: { email: string; passwordHash: string }): Promise<AdminUser>
// id is always 1 — this is an INSERT OR IGNORE style operation since
// only one admin_user row should ever exist. Use Drizzle's
// .onConflictDoNothing() if the D1/SQLite driver supports it, otherwise
// check getAdminUserByEmail first and throw if a row already exists.

export async function updateAdminUserSession(
  db,
  id: number,
  data: { sessionToken: string | null; sessionExpiresAt: string | null }
): Promise<void>

export async function updateAdminUserLockoutState(
  db,
  id: number,
  data: { failedAttempts: number; lockedUntil: string | null }
): Promise<void>
```
Do not build login/verify/logout logic here — only these narrow, single-purpose functions. The orchestration (bcrypt.compare, cookie setting, lockout decision logic) belongs entirely to Phase 2's `/api/auth/*` routes per API.md Section 3.6/3.7.

---

## 10. SECTION I — CORE UTILITIES

### 10.1 `lib/utils/validators.ts`
Replace the empty stub with the **complete** set of Zod schemas below. These are copied directly from `API.md` where it already specifies them, plus the ones API.md left implicit (meta update, reorder, seed). Do not invent additional fields; do not loosen any `.min()`/`.max()` constraint.

```typescript
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
```

### 10.2 `lib/utils/rateLimit.ts`
Implement using `rate-limiter-flexible`'s `RateLimiterMemory`, with four named profiles matching every documented limit in `API.md`/`TRD.md`:

```typescript
// lib/utils/rateLimit.ts
import { RateLimiterMemory } from "rate-limiter-flexible";
import type { NextRequest } from "next/server";

// Profile definitions — points/duration per API.md and TRD.md 7.1:
//   public   → 60 requests / 60s per IP   (public GET content routes)
//   login    → 5 requests / 900s per IP   (admin login attempts)
//   contact  → 3 requests / 3600s per IP  (contact form)
const limiters = {
  public: new RateLimiterMemory({ points: 60, duration: 60 }),
  login: new RateLimiterMemory({ points: 5, duration: 900 }),
  contact: new RateLimiterMemory({ points: 3, duration: 3600 }),
} as const;

export type RateLimitProfile = keyof typeof limiters;

export interface RateLimitResult {
  success: boolean;
  remainingPoints?: number;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "unknown";
}

export async function checkRateLimit(
  request: NextRequest,
  profile: RateLimitProfile
): Promise<RateLimitResult> {
  try {
    const ip = getClientIp(request);
    const result = await limiters[profile].consume(ip);
    return { success: true, remainingPoints: result.remainingPoints };
  } catch (rejection) {
    // rate-limiter-flexible throws its own rejection object on exhaustion,
    // not a real Error — this catch branch means "rate limited," not a bug
    return { success: false };
  }
}
```

**Note:** `RateLimiterMemory` is in-process memory only — per TRD Section 12.9, this is accepted as sufficient for a personal portfolio (documented limitation, not a bug to fix in this phase).

**Note on write/admin routes:** API.md does not give admin POST/PUT/DELETE routes their own distinct numeric limit — Phase 2 route handlers should apply the `public` profile to those routes unless a future spec revision says otherwise. Do not invent a stricter number.

### 10.3 `lib/utils/sanitize.ts`
Audit marks this **Complete**. Verify only — open the file and confirm:
- It exports both `sanitize(value: string): string` and `sanitizeJsonArray(value: string[]): string[]`.
- It uses `jsdom` to construct a `window` object and passes it to `DOMPurify(window)`, consistent with `dompurify`'s documented server-side usage.
- `sanitizeJsonArray` sanitizes each array element individually (per API.md Section 12.2) and does not crash on malformed input — malformed JSON handling itself happens at the call site (API route parses JSON first; this function only receives an already-valid array).

If all three are true, make no changes and note "verified, no changes" in your completion report. If any is false, fix only the specific gap — do not rewrite the whole file.

---

## 11. SECTION J — THIRD-PARTY CLIENT WRAPPERS

### 11.1 `lib/imagekit/client.ts`
Replace the stray `r2` stub entirely:

```typescript
// lib/imagekit/client.ts
import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});

export interface UploadResult {
  url: string;
  fileId: string;
  name: string;
}

export async function uploadFile(
  file: Buffer,
  fileName: string,
  folder: string
): Promise<UploadResult> {
  try {
    const result = await imagekit.files.upload({
      file,
      fileName,
      folder,
    });
    return { url: result.url, fileId: result.fileId, name: result.name };
  } catch (error) {
    console.error("[ImageKit uploadFile]", error);
    throw new Error("Failed to upload file to ImageKit");
  }
}

export async function deleteFile(fileId: string): Promise<void> {
  try {
    await imagekit.files.delete(fileId);
  } catch (error) {
    console.error("[ImageKit deleteFile]", error);
    throw new Error("Failed to delete file from ImageKit");
  }
}
```

⚠️ **VERIFY:** The exact method names `imagekit.files.upload(...)` and `imagekit.files.delete(...)` are written to match `@imagekit/nodejs@7.3.0`'s documented API shape as understood at spec-writing time. Before finalizing this file, the agent must check the actual installed package's type definitions (`node_modules/@imagekit/nodejs/dist/**/*.d.ts` or its README) to confirm these method names and the shape of the `upload()` options/response object match exactly. If they differ, use the real signatures from the installed package — do not silently keep a wrong signature just because it matches this spec text.

This file only provides the two helper functions. It is NOT called from anywhere yet — `/api/upload/route.ts` (Phase 2) will import and use it.

### 11.2 `lib/email/emailjs.ts`
```typescript
// lib/email/emailjs.ts
// NOTE: @emailjs/browser is a CLIENT-SIDE ONLY package (per TRD.md 8.8).
// This file will be imported directly by the Contact section component
// in Phase 4 — it does not run on the server and is not called from any
// API route. It exists now only as a typed, ready-to-use wrapper.
"use client";

import emailjs from "@emailjs/browser";

export interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(payload: ContactFormPayload): Promise<void> {
  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
      { ...payload },
      { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string }
    );
  } catch (error) {
    console.error("[EmailJS sendContactEmail]", error);
    throw new Error("Failed to send message. Please try again.");
  }
}
```
⚠️ **VERIFY:** `emailjs.send()`'s exact parameter order/shape against the installed `@emailjs/browser@4.4.1` types before treating this as final — same caveat as 11.1.

---

## 12. SECTION K — DATA-FETCHING & SCROLL INFRASTRUCTURE HOOKS

### 12.1 `hooks/useContent.ts`
Implement exactly the interface documented in `TRD.md` Section 10.1 — no more, no less:

```typescript
// hooks/useContent.ts
"use client";

import { useCallback, useEffect, useState } from "react";

interface UseContentOptions {
  revalidate?: number; // seconds, default 300
  enabled?: boolean; // default true
}

interface UseContentReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  mutate: () => void;
}

// Simple in-memory cache shared across hook instances within one
// browser session — cleared on full page reload. Keyed by endpoint.
const cache = new Map<string, { data: unknown; timestamp: number }>();

export function useContent<T>(
  endpoint: string,
  options: UseContentOptions = {}
): UseContentReturn<T> {
  const { revalidate = 300, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!enabled) return;

    const cached = cache.get(endpoint);
    const isFresh = cached && Date.now() - cached.timestamp < revalidate * 1000;
    if (isFresh) {
      setData(cached.data as T);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint);
      const json = (await response.json()) as { data: T | null; error: string | null };
      if (json.error) {
        setError(json.error);
        setData(null);
      } else {
        cache.set(endpoint, { data: json.data, timestamp: Date.now() });
        setData(json.data);
      }
    } catch {
      setError("Failed to fetch content.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, revalidate, enabled]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const mutate = useCallback((): void => {
    cache.delete(endpoint);
    void fetchData();
  }, [endpoint, fetchData]);

  return { data, isLoading, error, mutate };
}
```

**Known limitation, accepted for Phase 1:** since no `/api/content/*` routes exist yet (Phase 2), calling this hook right now will always resolve to `error: "Failed to fetch content."` against a 404. This is expected and correct — the hook's contract is complete and will start working the moment Phase 2 ships the routes it calls. Do not add any Phase-2-anticipating logic (mock data, fallback content) to compensate — that would violate scope.

### 12.2 `hooks/useLenis.ts`
Implement the Lenis + GSAP ScrollTrigger bridge exactly per `TRD.md` Section 10.3 and `Brand.md` Section 5.6's config values:

```typescript
// hooks/useLenis.ts
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLenis(): void {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number): void => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return (): void => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);
}
```

⚠️ **VERIFY:** `lenis@1.1.9`'s exact constructor option names (`orientation` vs `direction`, `gestureOrientation` vs `gestureDirection`, `smoothWheel` vs `smooth`) against the installed package's actual TypeScript types before finalizing — Brand.md's own config block (Section 5.6) uses `direction`/`gestureDirection`/`smooth` naming from an older Lenis API; the installed `1.1.9` may use different option names. Check `node_modules/lenis/dist/types/lenis.d.ts` (or equivalent) and use whatever that file actually declares — this is exactly the kind of API-shape assumption that must be verified against the real package, not assumed from the brand doc's possibly-outdated example.

This hook is built now but **not yet called from anywhere** — no client wrapper component exists yet to invoke it (that's explicitly deferred per Section 5.4's note). It exists as ready, tested-in-isolation infrastructure for Phase 4.

---

## 13. SECTION L — `constants/index.ts`

Populate with real values (currently all empty per audit):

```typescript
// constants/index.ts

export const SECTION_IDS = {
  LOADER: "loader",
  HERO: "hero",
  ABOUT: "about",
  EXPERTISE: "expertise",
  EXPERIENCE: "experience",
  SKILLS: "skills",
  PROJECTS: "projects",
  PROCESS: "process",
  TESTIMONIALS: "testimonials",
  CONTACT: "contact",
  FOOTER: "footer",
} as const;

export const NAV_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: "About", href: `#${SECTION_IDS.ABOUT}` },
  { label: "Experience", href: `#${SECTION_IDS.EXPERIENCE}` },
  { label: "Skills", href: `#${SECTION_IDS.SKILLS}` },
  { label: "Projects", href: `#${SECTION_IDS.PROJECTS}` },
  { label: "Process", href: `#${SECTION_IDS.PROCESS}` },
  { label: "Contact", href: `#${SECTION_IDS.CONTACT}` },
];

// Numeric values sourced directly from Brand.md Section 5.2 —
// mirrors the CSS custom properties for use in GSAP (which needs
// numbers, not CSS var strings)
export const ANIMATION_CONFIG = {
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    slower: 0.9,
    slowest: 1.2,
  },
  easing: {
    standard: "power2.out",
    cinematic: "power3.out",
    dramatic: "power4.out",
    elastic: "elastic.out(1, 0.5)",
    back: "back.out(1.7)",
    linear: "none",
    inOut: "power2.inOut",
  },
} as const;
```

---

## 14. SECTION M — ADMIN BOOTSTRAP

1. Install bcryptjs (TRD.md Section 3.4):
   ```bash
   npm install bcryptjs --legacy-peer-deps
   npm install -D @types/bcryptjs --legacy-peer-deps
   ```
   Then add both to `DOCS/TRD.md` Section 3's package table at whatever exact version got installed (same pinning rule as Section A.4).

2. Create `scripts/seed-admin.ts` exactly as specified in `API.md` Section 3.5, Step 1 — copy that code block verbatim, it is already complete and correct.

3. Add to `package.json`:
   ```json
   "seed:admin": "npx tsx scripts/seed-admin.ts"
   ```
   (Install `tsx` as a dev dependency if not already present: `npm install -D tsx --legacy-peer-deps` — check first, do not duplicate if already installed.)

4. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local` (Section 3.2 already covers this).

5. Run it:
   ```bash
   npm run seed:admin
   ```

6. Copy the SQL output the script prints, and run it against the actual D1 database (via `wrangler d1 execute` or the Cloudflare dashboard D1 console — use whichever the project already has tooling for; if neither is set up, report this as a blocker rather than guessing at a `wrangler` command that hasn't been verified against this project's actual Cloudflare setup).

7. **Immediately after confirming the INSERT succeeded:** delete `ADMIN_PASSWORD` (and `ADMIN_EMAIL`, optionally) from `.env.local`.

8. Report in your completion summary: "admin_user row seeded successfully" or the specific blocker if step 6 could not be completed.

---

## 15. SECTION N — PHASE 1 EXIT CHECKLIST (Definition of Done)

Every line below must be independently verified by actually running the command shown — not inferred from having written the code.

```
STRUCTURE
□ next.config.ts exists (not .mjs), builds without error
□ lib/db/skills.ts exists with all 6 functions from Section 9.5
□ .freebuff/ untouched, flagged in report — not deleted, not inspected

ENVIRONMENT
□ .env.example contains no CLOUDFLARE_R2_* keys, contains all 3 IMAGEKIT_* keys
□ .env.local contains real ImageKit values (agent confirms presence, never
  prints the actual secret values in any output or report)

DATABASE
□ `npm run db:generate` produces migration SQL with all 9 CREATE TABLE
  statements (meta, expertise, experience, skill_categories, skills,
  projects, process, testimonials, admin_user)
□ `npm run db:migrate` completes successfully against live D1 — paste
  real terminal output in report
□ `npm run db:studio` visually confirms all 9 tables with correct columns

TYPES & CRUD
□ `npx tsc --noEmit` passes with ZERO errors across the whole project
□ Every function listed in Section 9 (H.1–H.9) exists, is exported,
  has an explicit return type, and has complete try/catch
□ No function in lib/db/*.ts returns a bare `null` stub — every one
  performs a real Drizzle query

UTILITIES
□ lib/utils/validators.ts exports every schema listed in Section 10.1 —
  grep the file to confirm no schema was skipped
□ lib/utils/rateLimit.ts exports checkRateLimit() with all 3 profiles
□ lib/utils/sanitize.ts verified (or fixed) per Section 10.3

CLIENTS & HOOKS
□ lib/imagekit/client.ts uses @imagekit/nodejs, zero references to R2 remain
  anywhere in the codebase (grep for "r2", "R2", "CLOUDFLARE_R2" — zero hits)
□ lib/email/emailjs.ts exists with sendContactEmail() fully implemented
□ hooks/useContent.ts matches the TRD 10.1 interface exactly
□ hooks/useLenis.ts implemented, Lenis option names verified against
  installed package types (not copy-pasted blind from Brand.md)

DESIGN FOUNDATION
□ styles/globals.css contains the full verbatim CSS custom properties
  block from Brand.md 2.2 (spot-check 5 random variables exist with
  exact correct values)
□ tailwind.config.ts matches Brand.md Section 10 exactly
□ Font files present in public/fonts/ (not just .gitkeep) OR blocker
  explicitly reported if fonts could not be downloaded
□ app/layout.tsx loads all 3 fonts, applies CSS variable classes,
  imports globals.css

ADMIN BOOTSTRAP
□ bcryptjs installed and pinned in package.json (no caret)
□ scripts/seed-admin.ts exists, matches API.md 3.5 verbatim
□ admin_user table has exactly one row after seeding (verify via
  db:studio), ADMIN_PASSWORD removed from .env.local afterward

BUILD HEALTH
□ `npm run build` completes with zero errors (note: it is expected
  and ACCEPTABLE that app/page.tsx is still just a placeholder —
  build success means no broken imports/types, not a finished site)
□ `npm run lint` passes with zero errors
□ Grep for "TODO", "FIXME", ": any" (excluding justified/commented
  exceptions), "console.log" → zero unexplained hits
```

**Do not report Phase 1 as complete until every box above is checked against real command output.** If any item cannot be completed (e.g. font download, D1 CLI access), stop, report exactly which item and why, and wait for guidance rather than marking it done anyway.

---

## 16. FINAL REPORTING FORMAT

When Phase 1 work concludes, report back in this shape:

```
✅ PHASE 1 STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLETED:
• [item] — [real verification evidence, e.g. actual command output]

BLOCKED (could not complete, needs input):
• [item] — [exact reason]

VERIFY FLAGS RAISED (Section 11.1, 11.2, 12.2 — API shape checks):
• [package] — [what was checked, what was found, any deviation from this spec]

OPEN QUESTIONS FOR USER:
• .freebuff/ directory — still unidentified, untouched as instructed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
