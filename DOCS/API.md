# 📡 API DOCUMENTATION
## Personal Developer Portfolio
**Version:** 1.0.0
**Status:** LOCKED
**Last Updated:** September 2026

> This document governs every API route, authentication system, data flow,
> animation data contract, and security requirement in this portfolio.
> Read this entire document before writing a single API route.
> Every decision here is deliberate. Every security measure is mandatory.
> No route ships without satisfying every requirement in this document.

---

## 🔴 ABSOLUTE RULES — API LAYER

```
RULE 01: Every route validates input with Zod before ANY processing
RULE 02: Every write route sanitizes strings with sanitize() from lib/utils/sanitize.ts
RULE 03: Every write route sanitizes JSON arrays with sanitizeJsonArray()
RULE 04: Every protected route verifies auth at the HANDLER level — never middleware alone
RULE 05: Every async operation is wrapped in try/catch — no exceptions
RULE 06: Never return raw database errors to the client — log server-side, return safe message
RULE 07: Never expose stack traces in API responses
RULE 08: Never trust any value from the request without validating it first
RULE 09: All responses follow the standard ApiResponse<T> format — no exceptions
RULE 10: Rate limiting is applied before any business logic runs
RULE 11: Never log request bodies that may contain passwords or sensitive data
RULE 12: All timestamps returned from API are ISO strings — never raw SQLite datetime
RULE 13: JSON array fields (bullets, tags, customLinks) are always parsed before returning
RULE 14: Never return password hash or admin credentials in any response — ever
RULE 15: HTTP method must match intent — GET never mutates, POST always creates
```

---

## 1. ARCHITECTURE OVERVIEW

### 1.1 API Layer Position in Data Flow

```
CLIENT REQUEST
      ↓
Rate Limiter (lib/utils/rateLimit.ts)
  → Too many requests? Return 429 immediately
      ↓
Input Parser
  → Parse JSON body or URL params
      ↓
Zod Validator (lib/utils/validators.ts)
  → Invalid input? Return 400 immediately
      ↓
Auth Guard (for protected routes only)
  → Missing or wrong credentials? Return 401 immediately
      ↓
DOMPurify Sanitizer (lib/utils/sanitize.ts)
  → Sanitize all string values before they touch the database
      ↓
Drizzle Query (lib/db/*.ts)
  → Execute parameterized query against Cloudflare D1
      ↓
Response Formatter
  → Shape data into ApiResponse<T> format
  → Parse JSON array strings into real arrays
      ↓
CLIENT RECEIVES CLEAN TYPED RESPONSE
```

### 1.2 Route Organization

```
app/api/
├── auth/
│   ├── login/route.ts          # POST — admin login, returns session token
│   └── logout/route.ts         # POST — invalidate session
├── content/
│   └── [...route]/route.ts     # GET/POST/PUT/DELETE — all content CRUD
├── upload/
│   └── route.ts                # POST — ImageKit asset upload (admin only)
├── contact/
│   └── route.ts                # POST — contact form submission (EmailJS)
└── seed/
    └── route.ts                # POST — one-time admin user seed (disabled after use)
```

### 1.3 Base URL

```
Development:  http://localhost:3000/api
Production:   https://[project].vercel.app/api
```

---

## 2. STANDARD RESPONSE FORMAT

Every single API route in this project returns this exact shape.
No exceptions. No custom shapes. No raw data returns.

```typescript
// types/api.ts

// Standard success response
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  meta?: ResponseMeta;
}

// Optional metadata for list responses
interface ResponseMeta {
  total: number;       // total records in database
  returned: number;    // records returned in this response
}

// Standard error response
interface ApiErrorResponse {
  data: null;
  error: string;       // safe, human-readable — never a raw DB error
}
```

### 2.1 Response Examples

```json
// Success — single item
{
  "data": { "id": 1, "name": "John Doe", "title": "Full Stack Developer" },
  "error": null
}

// Success — list
{
  "data": [{ "id": 1 }, { "id": 2 }],
  "error": null,
  "meta": { "total": 2, "returned": 2 }
}

// Error
{
  "data": null,
  "error": "Validation failed: title is required"
}
```

### 2.2 HTTP Status Codes — Complete Reference

```
200  GET success, PUT success
201  POST success (record created)
400  Zod validation failed — body explains what failed
401  Missing or invalid auth token
403  Authenticated but not authorized for this action
404  Record not found in database
405  HTTP method not allowed on this route
429  Rate limit exceeded
500  Unexpected server error — safe message only, no details
503  Database unavailable
```

---

## 3. AUTHENTICATION SYSTEM

### 3.1 Design Decisions

The admin panel uses a **single-user, token-based session system.**

Why not OAuth or third-party auth:
- This is a personal portfolio — one admin, no public registration
- Zero external auth dependencies means zero external failure points
- Simple, auditable, fully controlled

Why not JWT:
- JWTs require a secret rotation strategy and blacklist for logout
- For a single-user system, a server-side session token stored in
  an HttpOnly cookie is simpler, more secure, and easier to invalidate

### 3.2 Admin User — How Credentials Are Created

**There is NO registration UI. There is NO sign-up page.**
The admin user is created ONCE via a seed script.
After seeding, the seed route is permanently disabled.

The admin credentials table stores:
- Email (stored as plain text — it is your own email, not sensitive)
- Password (stored as bcrypt hash — NEVER stored as plain text)

### 3.3 Admin User Table Schema

```typescript
// Add to lib/db/schema.ts

export const adminUser = sqliteTable("admin_user", {
  id: integer("id").primaryKey({ autoIncrement: false }).default(1),

  // Your email address — used as login identifier
  email: text("email").notNull().unique(),

  // bcrypt hash of your password — NEVER the plain text password
  // Generated with: bcrypt.hash(plainPassword, 12)
  // Cost factor 12 is the production standard (not 10)
  passwordHash: text("password_hash").notNull(),

  // Active session token — stored server-side
  // HttpOnly cookie on client holds only the token string
  // On logout: set this to null — token instantly invalid
  sessionToken: text("session_token"),

  // When the session expires — null = no active session
  sessionExpiresAt: text("session_expires_at"),

  // Security: track failed login attempts for lockout
  failedAttempts: integer("failed_attempts").notNull().default(0),

  // When the lockout expires — null = not locked out
  lockedUntil: text("locked_until"),

  ...timestamps,
});

export type AdminUser = typeof adminUser.$inferSelect;
export type AdminUserInsert = typeof adminUser.$inferInsert;
```

### 3.4 Required Packages for Auth

```bash
npm install bcryptjs --legacy-peer-deps
npm install -D @types/bcryptjs --legacy-peer-deps
```

Add to TRD.md package lock after installing:
```
bcryptjs: latest stable at install time
```

### 3.5 Seeding Your Admin User — One-Time Setup

**Step 1:** Create the seed script at `scripts/seed-admin.ts`

```typescript
// scripts/seed-admin.ts
// Run ONCE to create your admin user.
// Delete or disable this route immediately after running.
// Never commit your actual password to this file.
// Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local first.

import bcrypt from "bcryptjs";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
    process.exit(1);
  }

  // Cost factor 12 — production standard
  const passwordHash = await bcrypt.hash(password, 12);

  console.log("═══════════════════════════════════════════");
  console.log("Run this SQL in your Cloudflare D1 Console:");
  console.log("═══════════════════════════════════════════");
  console.log(`
INSERT OR IGNORE INTO admin_user (id, email, password_hash)
VALUES (1, '${email}', '${passwordHash}');
  `);
  console.log("═══════════════════════════════════════════");
  console.log("After running the SQL:");
  console.log("1. Delete ADMIN_PASSWORD from .env.local");
  console.log("2. Disable the /api/seed route");
  console.log("═══════════════════════════════════════════");
}

seedAdmin();
```

**Step 2:** Add to `.env.local` (temporarily — delete after seeding):
```
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=YourStrongPassword123!
```

**Step 3:** Add script to `package.json`:
```json
"seed:admin": "npx tsx scripts/seed-admin.ts"
```

**Step 4:** Run it:
```powershell
npm run seed:admin
```

**Step 5:** Copy the SQL output → run it in Cloudflare D1 Console

**Step 6:** Delete `ADMIN_PASSWORD` from `.env.local` immediately

**Step 7:** The seed route is now done — never run it again

### 3.6 Session Token Flow

```
POST /api/auth/login
  → Validate email + password with bcrypt.compare()
  → Generate cryptographically random 64-byte session token
  → Store token hash in admin_user.session_token
  → Set expiry: now + 24 hours in admin_user.session_expires_at
  → Set HttpOnly, Secure, SameSite=Strict cookie on response
  → Return { data: { success: true }, error: null }

Every protected request:
  → Read session token from HttpOnly cookie
  → Compare against stored token in admin_user table
  → Check session_expires_at has not passed
  → If valid → proceed
  → If invalid or expired → return 401

POST /api/auth/logout
  → Set admin_user.session_token = null
  → Set admin_user.session_expires_at = null
  → Clear the cookie on response
  → Token is now permanently invalid even if someone copied it
```

### 3.7 Brute Force Protection

```
Every failed login attempt:
  → Increment admin_user.failed_attempts by 1
  → If failed_attempts >= 5:
      → Set admin_user.locked_until = now + 15 minutes
      → Return 401 with "Too many failed attempts" message
      → Do NOT reveal which field was wrong (email vs password)

Every successful login:
  → Reset admin_user.failed_attempts = 0
  → Reset admin_user.locked_until = null

Every login attempt while locked:
  → Check locked_until before even attempting bcrypt
  → Return 401 with "Account locked. Try again in X minutes"
  → Do NOT run bcrypt — saves CPU, prevents timing attacks
```

---

## 4. CONTENT API — ALL ROUTES

### 4.1 Route Pattern

The content API uses a single catch-all route:
`app/api/content/[...route]/route.ts`

The route segments map to tables:
```
/api/content/meta              → meta table
/api/content/expertise         → expertise table
/api/content/expertise/[id]    → expertise record by id
/api/content/experience        → experience table
/api/content/experience/[id]   → experience record by id
/api/content/skill-categories  → skill_categories table
/api/content/skill-categories/[id] → skill_category by id
/api/content/skills            → skills table
/api/content/skills/[id]       → skill by id
/api/content/skills/by-category/[categoryId] → skills by category
/api/content/projects          → projects table
/api/content/projects/[id]     → project by id
/api/content/projects/featured → featured projects only
/api/content/process           → process table
/api/content/process/[id]      → process step by id
/api/content/testimonials      → testimonials table
/api/content/testimonials/[id] → testimonial by id
```

### 4.2 Complete Route Reference

---

#### 📌 META — Global Site Content

```
GET    /api/content/meta
PUT    /api/content/meta           🔐 Auth required
```

**GET /api/content/meta**
Returns the single meta row controlling all global site content.
This is called once on page load — result is cached.
No auth required — content is public.

Request: None

Response:
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "title": "Full Stack Developer",
    "tagline": "I build things for the web",
    "location": "Mumbai, India",
    "aboutText": "I am a passionate...",
    "aboutImageUrl": "https://ik.imagekit.io/...",
    "email": "john@gmail.com",
    "resumeUrl": "https://ik.imagekit.io/.../resume.pdf",
    "footerTagline": "Building digital experiences.",
    "isOpenToWork": true,
    "githubUrl": "https://github.com/...",
    "linkedinUrl": "https://linkedin.com/in/...",
    "twitterUrl": "https://twitter.com/...",
    "customLinks": [
      { "label": "Blog", "url": "https://blog.dev" }
    ],
    "createdAt": "2026-09-21T10:00:00.000Z",
    "updatedAt": "2026-09-21T10:00:00.000Z"
  },
  "error": null
}
```

**PUT /api/content/meta** 🔐
Updates the single meta row. Partial updates supported — only send changed fields.

Request body (all fields optional):
```json
{
  "name": "John Doe",
  "title": "Full Stack Developer",
  "tagline": "I build things for the web",
  "location": "Mumbai, India",
  "aboutText": "Updated about text",
  "aboutImageUrl": "https://ik.imagekit.io/...",
  "email": "john@gmail.com",
  "resumeUrl": "https://ik.imagekit.io/.../resume.pdf",
  "footerTagline": "Building digital experiences.",
  "isOpenToWork": true,
  "githubUrl": "https://github.com/...",
  "linkedinUrl": "https://linkedin.com/in/...",
  "twitterUrl": "https://twitter.com/...",
  "customLinks": [
    { "label": "Blog", "url": "https://blog.dev" }
  ]
}
```

Response:
```json
{
  "data": { "updated": true },
  "error": null
}
```

---

#### 📌 EXPERTISE — What I Do Cards

```
GET    /api/content/expertise
GET    /api/content/expertise/[id]
POST   /api/content/expertise           🔐 Auth required
PUT    /api/content/expertise/[id]      🔐 Auth required
DELETE /api/content/expertise/[id]      🔐 Auth required
```

**GET /api/content/expertise**
Returns all expertise cards ordered by display_order ascending.

Response:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Full Stack Development",
      "description": "End-to-end web applications...",
      "icon": "code",
      "displayOrder": 0,
      "createdAt": "2026-09-21T10:00:00.000Z",
      "updatedAt": "2026-09-21T10:00:00.000Z"
    }
  ],
  "error": null,
  "meta": { "total": 3, "returned": 3 }
}
```

**POST /api/content/expertise** 🔐

Request body:
```json
{
  "title": "Full Stack Development",
  "description": "End-to-end web applications from idea to production.",
  "icon": "code",
  "displayOrder": 0
}
```

Zod Schema:
```typescript
const expertiseCreateSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  icon: z.string().min(1).max(2000),   // name or SVG string
  displayOrder: z.number().int().min(0).default(0),
});
```

---

#### 📌 EXPERIENCE — Work Timeline

```
GET    /api/content/experience
GET    /api/content/experience/[id]
POST   /api/content/experience          🔐 Auth required
PUT    /api/content/experience/[id]     🔐 Auth required
DELETE /api/content/experience/[id]     🔐 Auth required
```

**GET /api/content/experience**
Returns all experience records ordered by display_order ascending.
`bullets` is returned as a parsed JavaScript array — NOT a JSON string.

Response:
```json
{
  "data": [
    {
      "id": 1,
      "company": "TechCorp",
      "logoUrl": "https://ik.imagekit.io/...",
      "role": "Senior Full Stack Developer",
      "startDate": "Jan 2023",
      "endDate": "Present",
      "description": "Leading the frontend architecture...",
      "bullets": [
        "Reduced load time by 40%",
        "Led team of 5 engineers"
      ],
      "isCurrent": true,
      "displayOrder": 0,
      "createdAt": "2026-09-21T10:00:00.000Z",
      "updatedAt": "2026-09-21T10:00:00.000Z"
    }
  ],
  "error": null,
  "meta": { "total": 1, "returned": 1 }
}
```

**POST /api/content/experience** 🔐

Request body:
```json
{
  "company": "TechCorp",
  "logoUrl": "https://ik.imagekit.io/...",
  "role": "Senior Full Stack Developer",
  "startDate": "Jan 2023",
  "endDate": "Present",
  "description": "Leading the frontend architecture.",
  "bullets": ["Reduced load time by 40%", "Led team of 5"],
  "isCurrent": true,
  "displayOrder": 0
}
```

Zod Schema:
```typescript
const experienceCreateSchema = z.object({
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
```

Important: `bullets` arrives as a JavaScript array from the request.
Sanitize each element individually. Store as `JSON.stringify(sanitizedArray)`.
Return as parsed array on read.

---

#### 📌 SKILL CATEGORIES — Dynamic Taxonomy

```
GET    /api/content/skill-categories
GET    /api/content/skill-categories/[id]
POST   /api/content/skill-categories            🔐 Auth required
PUT    /api/content/skill-categories/[id]       🔐 Auth required
DELETE /api/content/skill-categories/[id]       🔐 Auth required
```

**DELETE /api/content/skill-categories/[id]** 🔐
⚠️ Before deleting a category, check if any skills reference it.
If skills exist under this category — return 400 with message:
"Cannot delete category with existing skills. Reassign or delete skills first."
Never orphan skills in the database.

Zod Schema:
```typescript
const skillCategoryCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(300).default(""),
  icon: z.string().max(2000).default(""),
  displayOrder: z.number().int().min(0).default(0),
});
```

---

#### 📌 SKILLS — Individual Skills

```
GET    /api/content/skills
GET    /api/content/skills/[id]
GET    /api/content/skills/by-category/[categoryId]
POST   /api/content/skills                      🔐 Auth required
PUT    /api/content/skills/[id]                 🔐 Auth required
DELETE /api/content/skills/[id]                 🔐 Auth required
```

**GET /api/content/skills**
Returns all skills with their category attached (JOIN query).
Ordered by category display_order then skill display_order.

Response:
```json
{
  "data": [
    {
      "id": 1,
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "Frontend",
        "description": "",
        "icon": "",
        "displayOrder": 0
      },
      "name": "React",
      "proficiency": 95,
      "iconUrl": "https://ik.imagekit.io/...",
      "displayOrder": 0,
      "createdAt": "2026-09-21T10:00:00.000Z",
      "updatedAt": "2026-09-21T10:00:00.000Z"
    }
  ],
  "error": null,
  "meta": { "total": 20, "returned": 20 }
}
```

Zod Schema:
```typescript
const skillCreateSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().min(1).max(100),
  proficiency: z.number().int().min(1).max(100),
  iconUrl: z.string().url().or(z.literal("")).default(""),
  displayOrder: z.number().int().min(0).default(0),
});
```

---

#### 📌 PROJECTS — Portfolio Work

```
GET    /api/content/projects
GET    /api/content/projects/[id]
GET    /api/content/projects/featured
POST   /api/content/projects                    🔐 Auth required
PUT    /api/content/projects/[id]               🔐 Auth required
DELETE /api/content/projects/[id]               🔐 Auth required
```

**GET /api/content/projects**
Returns all projects ordered by display_order ascending.
`tags` is returned as a parsed JavaScript array — NOT a JSON string.
`isFeatured` is a boolean — NOT 0/1.

**GET /api/content/projects/featured**
Returns only projects where isFeatured = true.
Multiple featured projects supported — no restriction on count.
Ordered by display_order ascending.

Response:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Project Alpha",
      "shortDescription": "A SaaS dashboard...",
      "fullDescription": "Built a complete...",
      "tags": ["React", "Node.js", "PostgreSQL"],
      "imageUrl": "https://ik.imagekit.io/...",
      "videoUrl": "",
      "liveUrl": "https://alpha.dev",
      "githubUrl": "https://github.com/...",
      "isFeatured": true,
      "displayOrder": 0,
      "createdAt": "2026-09-21T10:00:00.000Z",
      "updatedAt": "2026-09-21T10:00:00.000Z"
    }
  ],
  "error": null,
  "meta": { "total": 5, "returned": 5 }
}
```

Zod Schema:
```typescript
const projectCreateSchema = z.object({
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
```

---

#### 📌 PROCESS — How I Work Steps

```
GET    /api/content/process
GET    /api/content/process/[id]
POST   /api/content/process                     🔐 Auth required
PUT    /api/content/process/[id]                🔐 Auth required
DELETE /api/content/process/[id]                🔐 Auth required
```

Zod Schema:
```typescript
const processCreateSchema = z.object({
  stepNumber: z.number().int().min(1).max(99),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  displayOrder: z.number().int().min(0).default(0),
});
```

---

#### 📌 TESTIMONIALS — Social Proof

```
GET    /api/content/testimonials
GET    /api/content/testimonials/[id]
POST   /api/content/testimonials                🔐 Auth required
PUT    /api/content/testimonials/[id]           🔐 Auth required
DELETE /api/content/testimonials/[id]           🔐 Auth required
```

Zod Schema:
```typescript
const testimonialCreateSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  company: z.string().min(1).max(100),
  quote: z.string().min(10).max(1000),
  avatarUrl: z.string().url().or(z.literal("")).default(""),
  displayOrder: z.number().int().min(0).default(0),
});
```

---

## 5. AUTH ROUTES

```
POST   /api/auth/login
POST   /api/auth/logout                         🔐 Auth required
GET    /api/auth/verify                         🔐 Auth required
```

### POST /api/auth/login

Rate limit: 5 attempts per IP per 15 minutes — checked before any logic.
Failed attempts tracked per admin_user row — lockout after 5 failures.

Request body:
```json
{
  "email": "your@email.com",
  "password": "YourPassword123!"
}
```

Zod Schema:
```typescript
const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
});
```

Processing order:
```
1. Rate limit check — return 429 if exceeded
2. Zod validation — return 400 if invalid
3. Fetch admin_user by email from D1
4. Check locked_until — return 401 if locked (show time remaining)
5. bcrypt.compare(password, passwordHash)
6. If wrong: increment failed_attempts, check if >= 5, maybe lock, return 401
7. If correct: reset failed_attempts, generate session token, set cookie, return 200
```

Success Response:
```json
{
  "data": { "success": true },
  "error": null
}
```

Cookie set on success:
```
Name:     portfolio_admin_session
Value:    [64-byte cryptographically random hex token]
HttpOnly: true         (JS cannot access — XSS protection)
Secure:   true         (HTTPS only — production)
SameSite: Strict       (CSRF protection)
MaxAge:   86400        (24 hours)
Path:     /admin       (only sent to admin routes)
```

Error Response — ALWAYS use this exact message regardless of which field was wrong:
```json
{
  "data": null,
  "error": "Invalid credentials"
}
```
Never say "email not found" or "wrong password" — reveals user enumeration info.

### GET /api/auth/verify 🔐

Used by admin layout to check if session is still valid.
Called on every admin page load.

Response (valid):
```json
{
  "data": { "authenticated": true },
  "error": null
}
```

Response (invalid):
```json
{
  "data": null,
  "error": "Unauthorized"
}
```

### POST /api/auth/logout 🔐

Clears session token from database AND clears cookie.

Response:
```json
{
  "data": { "success": true },
  "error": null
}
```

---

## 6. UPLOAD ROUTE

```
POST   /api/upload                              🔐 Auth required
DELETE /api/upload                              🔐 Auth required
```

### POST /api/upload 🔐

Handles file uploads from admin panel to ImageKit.
Uses `@imagekit/nodejs` server-side SDK.
Never accept files from unauthenticated requests.

Request: `multipart/form-data`
```
file:   [binary file data]
folder: [string — ImageKit folder path e.g. "portfolio/projects"]
```

File Validation (before upload):
```
Allowed MIME types: image/jpeg, image/png, image/webp, image/svg+xml,
                    video/mp4, application/pdf
Max file size:      10MB for images, 100MB for videos, 5MB for PDFs
Filename:           Sanitized — strip special chars, replace spaces with hyphens
```

Processing:
```
1. Auth check
2. Validate MIME type against allowlist
3. Validate file size
4. Sanitize filename
5. Upload to ImageKit via @imagekit/nodejs
6. Return ImageKit URL and fileId
```

Response:
```json
{
  "data": {
    "url": "https://ik.imagekit.io/yourid/portfolio/projects/image.webp",
    "fileId": "imagekit_file_id_here",
    "name": "image.webp"
  },
  "error": null
}
```

### DELETE /api/upload 🔐

Deletes a file from ImageKit by fileId.
Always delete from ImageKit when deleting a record that references an asset.

Request body:
```json
{
  "fileId": "imagekit_file_id_here"
}
```

---

## 7. CONTACT ROUTE

```
POST   /api/contact
```

### POST /api/contact

Rate limit: 3 submissions per IP per hour — hard limit.
No auth required — this is the public contact form.

Security layers applied in order:
```
1. Rate limit: 3/hour/IP → 429 if exceeded
2. Zod validation → 400 if invalid
3. Honeypot check → silent 200 if honeypot filled (fool the bot)
4. Timestamp check → 400 if submitted in under 3 seconds (bot speed)
5. Sanitize all fields with sanitize()
6. Send via @emailjs/browser (triggered server-side call)
7. Return success
```

Request body:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "message": "I would love to work with you...",
  "website": "",
  "submittedAt": 1727000000000
}
```

Zod Schema:
```typescript
const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  message: z.string().min(10).max(2000),
  // Honeypot — must be empty string. Bots fill all fields.
  website: z.string().max(0, "Bot detected"),
  // Client timestamps submission time — server checks elapsed time
  submittedAt: z.number().int().positive(),
});
```

Timestamp Check Logic:
```typescript
const elapsed = Date.now() - body.submittedAt;
if (elapsed < 3000) {
  // Submitted in under 3 seconds — definitely a bot
  // Return silent 200 — do not tell bot it was blocked
  return Response.json({ data: { success: true }, error: null });
}
```

Success Response:
```json
{
  "data": { "success": true },
  "error": null
}
```

---

## 8. SEED ROUTE

```
POST   /api/seed
```

### POST /api/seed — ONE TIME USE ONLY

This route creates the initial admin user in D1.
It must be DISABLED permanently after the first successful use.

Disable mechanism: Check an environment variable.
```typescript
if (process.env.SEED_ENABLED !== "true") {
  return Response.json(
    { data: null, error: "Seed route is disabled" },
    { status: 403 }
  );
}
```

After seeding:
1. Remove `SEED_ENABLED=true` from `.env.local`
2. Remove `SEED_ENABLED` from Vercel environment variables
3. The route now permanently returns 403

Request body:
```json
{
  "seedKey": "value-of-SEED_SECRET_KEY-from-env",
  "email": "your@email.com",
  "password": "YourStrongPassword123!"
}
```

Additional env var needed (temporary):
```
SEED_ENABLED=true
SEED_SECRET_KEY=random-string-only-you-know
```

---

## 9. ANIMATION AND DYNAMIC CONTENT CONTRACT

This section governs how dynamic content from the API interacts with
animations. This is critical — read this before building any animated section.

### 9.1 The Core Problem

GSAP ScrollTrigger and Motion animations must know element dimensions and
positions at initialization time. Dynamic content loaded after mount can
cause animations to initialize on empty or incorrectly sized elements —
resulting in broken, janky, or invisible animations.

### 9.2 The Solution — Content-First Animation Pattern

```
WRONG ORDER:
  Component mounts → Animation initializes → Data loads → Layout shifts → Animation broken

CORRECT ORDER:
  Component mounts → Data loads → Layout settles → Animation initializes
```

Implementation rule:
```typescript
// Every animated section that uses dynamic data follows this pattern:

// 1. Fetch data first
const { data, isLoading } = useContent("projects");

// 2. Only initialize animations after data is confirmed loaded
useGSAP(() => {
  if (!data || isLoading) return;   // Guard — never animate on empty content

  // All GSAP setup goes here — runs only when data is present
  gsap.from(".project-card", {
    opacity: 0,
    y: 60,
    stagger: 0.15,
    scrollTrigger: { ... }
  });
}, { dependencies: [data, isLoading] });  // Re-run if data changes
```

### 9.3 Text Animation with Dynamic Content

Dynamic text from the API can be animated in two ways:

**Method A — Animate the whole element (most common)**
The text renders from the database. GSAP or Motion animates the container.
No special setup needed — works for any dynamic text.

```typescript
// Text comes from database
const heroTitle = meta?.name; // "John Doe"

// GSAP animates the element containing it
gsap.from(".hero-title", { opacity: 0, y: 40, duration: 1 });
```

**Method B — Character/Word/Line level animation (SplitText)**
GSAP SplitText splits dynamic text into animatable parts AFTER it renders.
This is how you animate individual letters with different timings.

```typescript
// Text renders from database first
// Then SplitText splits it for per-character animation
import { SplitText } from "gsap/SplitText";

useGSAP(() => {
  if (!meta?.name) return;

  // Split AFTER content is in the DOM
  const split = new SplitText(".hero-title", { type: "chars,words,lines" });

  gsap.from(split.chars, {
    opacity: 0,
    y: 20,
    stagger: 0.03,
    duration: 0.6,
    ease: "power2.out",
  });

  // Cleanup — required to prevent memory leaks
  return () => split.revert();

}, { dependencies: [meta?.name] }); // Re-animate if text changes
```

### 9.4 Hardcoded Text with Custom Animation — How To Do It

Some text should NOT come from the database. Specifically:
- Text where individual characters need completely different animations
- Text with custom font-size changes mid-word
- Text with mixed casing that triggers different keyframe sequences
- Text that is part of the design identity itself (like your name in loader)

This is valid and supported. Here is the contract:

```typescript
// Section component — hardcoded text, custom animation
// When you hardcode text here — it is intentional design, not laziness
// Document WHY it is hardcoded with a comment

export default function Loader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Hardcoded — loader name animation is a design element, not content
    // Each character has deliberately different animation for brand identity
    tl.from(".loader-char-j", { opacity: 0, y: -20, duration: 0.4 })
      .from(".loader-char-o", { opacity: 0, y: 20, duration: 0.4 }, "-=0.2")
      .from(".loader-char-h", { opacity: 0, scale: 0, duration: 0.5 }, "-=0.3")
      // ...etc

  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* Hardcoded — intentional design identity element */}
      <span className="loader-char-j">J</span>
      <span className="loader-char-o">O</span>
      <span className="loader-char-h">H</span>
      <span className="loader-char-n">N</span>
    </div>
  );
}
```

### 9.5 Mixing Hardcoded and Dynamic Text

You can use dynamic text as the source but process it for animation:

```typescript
// Dynamic source — comes from database
const title = meta?.name; // "John Doe"

// Custom hardcoded animation logic applied to dynamic content
useGSAP(() => {
  if (!title) return;

  // Split the dynamic text into individual characters
  // Then animate each character with your custom timing
  const chars = title.split("").map((char, i) => ({
    char,
    delay: i * 0.05,
    isUppercase: char === char.toUpperCase() && char !== " ",
  }));

  // Different animation for uppercase vs lowercase
  chars.forEach(({ isUppercase }, i) => {
    gsap.from(`.title-char-${i}`, {
      opacity: 0,
      y: isUppercase ? -30 : 30,   // Uppercase drops from top, lowercase from bottom
      duration: isUppercase ? 0.6 : 0.4,
      delay: i * 0.05,
    });
  });

}, { dependencies: [title] });

// Render — split dynamic text into individually targetable spans
return (
  <h1>
    {title?.split("").map((char, i) => (
      <span key={i} className={`title-char-${i}`}>
        {char === " " ? "\u00A0" : char}
      </span>
    ))}
  </h1>
);
```

### 9.6 ScrollTrigger.refresh() — Required After Dynamic Content

Every section that uses ScrollTrigger with dynamic content MUST call
`ScrollTrigger.refresh()` after data loads and the DOM has settled.

```typescript
useEffect(() => {
  if (!isLoading && data) {
    // Give DOM one frame to settle after data renders
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }
}, [isLoading, data]);
```

### 9.7 Content Loading States

Every section must handle three states gracefully:
```
LOADING:   Show skeleton UI — maintain layout dimensions
           Prevents layout shift when content loads
           Prevents ScrollTrigger from measuring wrong positions

LOADED:    Render content → then initialize animations

ERROR:     Show fallback — section still renders, just without data
           Never crash the page because one API call failed
```

```typescript
// Pattern every section follows:
if (isLoading) return <SectionSkeleton />;       // Maintains layout
if (error || !data) return <SectionFallback />;  // Safe fallback
return <SectionContent data={data} />;           // Real content + animations
```

---

## 10. DATA FETCHING — useContent HOOK CONTRACT

The `useContent()` hook is the ONLY way sections fetch data.
No section ever calls fetch() directly. No section uses useEffect + fetch.

### 10.1 Hook Interface

```typescript
// hooks/useContent.ts

interface UseContentOptions {
  revalidate?: number;    // Cache duration in seconds — default 300 (5 min)
  enabled?: boolean;      // Set false to defer fetching — default true
}

interface UseContentReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  mutate: () => void;     // Call to force refresh — used after admin updates
}

function useContent<T>(
  endpoint: string,
  options?: UseContentOptions
): UseContentReturn<T>
```

### 10.2 Usage Examples

```typescript
// Fetch meta (hero, about, footer data)
const { data: meta, isLoading } = useContent<Meta>("/api/content/meta");

// Fetch all projects
const { data: projects, isLoading } = useContent<Project[]>("/api/content/projects");

// Fetch featured projects only
const { data: featured } = useContent<Project[]>("/api/content/projects/featured");

// Fetch skills with category data
const { data: skills } = useContent<SkillWithCategory[]>("/api/content/skills");

// Fetch by category
const { data: skills } = useContent<Skill[]>(
  `/api/content/skills/by-category/${categoryId}`,
  { enabled: !!categoryId }
);
```

### 10.3 Cache Strategy

```
Public content (GET routes, no auth):
  → Cached for 5 minutes in memory
  → On admin update: mutate() called → cache cleared → fresh fetch
  → Never hits D1 on every component render

Admin panel (write operations):
  → No caching — always fresh
  → After successful write: call mutate() on affected useContent instance
```

---

## 11. ADMIN PANEL — API INTERACTION PATTERN

### 11.1 Admin Data Flow

```
Admin opens /admin/projects
  ↓
useContent<Project[]>("/api/content/projects") called
  ↓
Projects list renders in DataTable component
  ↓
Admin clicks "Add Project" → opens ContentEditor form
  ↓
Admin fills form, clicks "Save"
  ↓
Frontend Zod validation (UX only — not security)
  ↓
POST /api/content/projects called with session cookie
  ↓
API: rate limit → Zod → auth → sanitize → Drizzle write → D1
  ↓
Success response returned
  ↓
mutate() called on useContent instance
  ↓
Cache cleared → fresh GET fired → DataTable updates
  ↓
Portfolio page reflects new project — no redeploy needed
```

### 11.2 Admin Section to Route Mapping

| Admin Page | Reads From | Writes To |
|---|---|---|
| /admin | All tables (counts only) | — |
| /admin/meta | GET /api/content/meta | PUT /api/content/meta |
| /admin/expertise | GET /api/content/expertise | POST/PUT/DELETE /api/content/expertise |
| /admin/experience | GET /api/content/experience | POST/PUT/DELETE /api/content/experience |
| /admin/skills | GET /api/content/skill-categories + skills | POST/PUT/DELETE both |
| /admin/projects | GET /api/content/projects | POST/PUT/DELETE /api/content/projects |
| /admin/process | GET /api/content/process | POST/PUT/DELETE /api/content/process |
| /admin/testimonials | GET /api/content/testimonials | POST/PUT/DELETE /api/content/testimonials |
| /admin/upload | — | POST/DELETE /api/upload |

### 11.3 Reorder Pattern

All tables have a `displayOrder` field.
Reordering in admin saves a new displayOrder for each affected record.

```typescript
// When admin drags to reorder — fires PATCH-style bulk update
// Send array of { id, displayOrder } pairs

// Implemented as: PUT /api/content/[table]/reorder
// Request body:
{
  "order": [
    { "id": 3, "displayOrder": 0 },
    { "id": 1, "displayOrder": 1 },
    { "id": 2, "displayOrder": 2 }
  ]
}
```

---

## 12. SECURITY — COMPLETE API THREAT MODEL

### 12.1 SQL Injection
**Vector:** Malicious SQL in any request field.
**Prevention:**
- Drizzle ORM parameterized queries — never string interpolation
- Zod validates all input types before Drizzle receives them
- Reject requests with unexpected field types immediately

### 12.2 NoSQL / JSON Injection
**Vector:** Malicious content inside JSON array fields (bullets, tags, customLinks).
**Prevention:**
- `sanitizeJsonArray()` processes every element individually
- Each string element stripped of all HTML and script content
- Invalid JSON returns empty array — never crashes or executes

### 12.3 XSS — Stored
**Vector:** Admin saves script tag into D1. Frontend renders it. Executes in visitor browsers.
**Prevention:**
- `sanitize()` strips ALL HTML tags and attributes — plain text only output
- Content Security Policy headers block inline script execution
- `dangerouslySetInnerHTML` is forbidden — zero uses in entire codebase
- Even if malicious content reaches D1 somehow — CSP blocks execution

### 12.4 CSRF — Cross Site Request Forgery
**Vector:** Malicious site tricks admin browser into firing authenticated requests.
**Prevention:**
- `SameSite=Strict` cookie — browser never sends cookie on cross-origin requests
- Origin header verified on all write routes
- Admin session only valid from your Vercel domain

### 12.5 Session Hijacking
**Vector:** Session token stolen via network or XSS.
**Prevention:**
- `HttpOnly` cookie — JavaScript cannot read the token (XSS cannot steal it)
- `Secure` flag — token only sent over HTTPS
- Sessions expire after 24 hours — automatic invalidation
- Logout immediately invalidates token in D1 — stolen token becomes useless

### 12.6 Brute Force Login
**Vector:** Bot tries thousands of passwords against /api/auth/login.
**Prevention:**
- rate-limiter-flexible: 5 attempts per IP per 15 minutes at route level
- admin_user table: 5 failed_attempts → 15 minute lockout at application level
- bcrypt cost factor 12 — each attempt takes ~300ms — slows automated attacks
- Same error message for wrong email or wrong password — no enumeration

### 12.7 User Enumeration
**Vector:** API reveals whether an email exists ("email not found" vs "wrong password").
**Prevention:**
- Always return "Invalid credentials" regardless of which field failed
- bcrypt.compare() still runs even when email not found (timing attack prevention)
- Response time is consistent — no fast-fail that reveals existence

### 12.8 Timing Attacks on Auth
**Vector:** Measuring response time to determine if email exists (compare runs faster when not found).
**Prevention:**
- Always run bcrypt.compare() even when user is not found
- Compare against a fake hash — keeps timing consistent

### 12.9 Rate Limit Bypass
**Vector:** Attacker rotates IPs to bypass per-IP rate limiting.
**Prevention:**
- Rate limiting is a deterrent, not a guarantee — this is known
- bcrypt cost factor is the real protection — makes each attempt expensive
- For a personal portfolio, per-IP limiting is sufficient

### 12.10 Admin Route Discovery
**Vector:** Attacker scans for /admin, /dashboard, /cms etc.
**Prevention:**
- Route is /admin — discoverable but protected by auth
- robots.txt: `Disallow: /admin` — not indexed by search engines
- No admin links in public-facing HTML
- Auth guard returns 401 — not 403 (does not confirm route exists)

### 12.11 File Upload Attacks
**Vector:** Attacker uploads malicious file (PHP shell, SVG with script, executable).
**Prevention:**
- MIME type allowlist — only image/video/PDF accepted
- MIME type verified from file buffer — not just file extension
- File size limits enforced
- Filename sanitized — no path traversal characters
- Files go directly to ImageKit CDN — never stored on server filesystem

### 12.12 API Response Data Leakage
**Vector:** API accidentally returns passwordHash or sessionToken fields.
**Prevention:**
- admin_user table is NEVER queried from public content routes
- SELECT explicitly lists allowed columns — never SELECT *
- TypeScript return types enforce what can be returned
- password_hash and session_token columns stripped from any response

### 12.13 Environment Variable Exposure
**Vector:** Sensitive keys leaked via client-side bundle.
**Prevention:**
- CLOUDFLARE_API_TOKEN, IMAGEKIT_PRIVATE_KEY, ADMIN_SECRET_KEY: server-only
- Only NEXT_PUBLIC_ vars (EmailJS) go to client bundle
- Never access process.env in client components

### 12.14 Dependency Vulnerabilities
**Vector:** Outdated packages with known CVEs.
**Prevention:**
- All packages locked to exact verified versions in TRD.md
- npm audit run regularly — all highs and criticals resolved
- No auto-updates — every update reviewed and confirmed

### 12.15 D1 Quota Exhaustion
**Vector:** Attacker hammers public GET routes to exhaust 5M reads/day free quota.
**Prevention:**
- rate-limiter-flexible: 60 requests per IP per minute on all public routes
- All GET responses cached — D1 only hit on cache miss
- Cloudflare WAF (free tier) can be enabled as additional layer

---

## 13. ERROR HANDLING STANDARD

### 13.1 Server-Side Error Logging
```typescript
// Log the real error server-side for debugging
console.error("[API /api/content/projects POST]", error);

// Return safe message to client — never the real error
return Response.json(
  { data: null, error: "Failed to create project. Please try again." },
  { status: 500 }
);
```

### 13.2 Validation Error Format
```typescript
// Zod validation failure — return which field failed
const result = schema.safeParse(body);
if (!result.success) {
  return Response.json(
    {
      data: null,
      error: `Validation failed: ${result.error.errors[0].message}`
    },
    { status: 400 }
  );
}
```

### 13.3 What To NEVER Return in an Error Response
```
✅ "Failed to create project. Please try again."
✅ "Validation failed: title is required"
✅ "Invalid credentials"

❌ Raw database error strings
❌ SQL query text
❌ Stack traces
❌ File paths
❌ Environment variable names
❌ Package versions
❌ "Wrong password" or "Email not found"
```

---

## 14. API ROUTE IMPLEMENTATION TEMPLATE

Every API route follows this EXACT structure. No deviations.

```typescript
// app/api/content/[table]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanitize } from "@/lib/utils/sanitize";
import { checkRateLimit } from "@/lib/utils/rateLimit";
import { verifySession } from "@/lib/auth/verify";
import { getDb } from "@/lib/db/client";

// ─── ZOD SCHEMA ────────────────────────────────────────────────────
const createSchema = z.object({
  // Define schema fields here
});

// ─── GET ───────────────────────────────────────────────────────────
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Rate limit
    const rateLimitResult = await checkRateLimit(request, "public");
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { data: null, error: "Too many requests" },
        { status: 429 }
      );
    }

    // 2. Database query
    const db = getDb(/* D1 binding */);
    const records = await getRecords(db);

    // 3. Return
    return NextResponse.json({
      data: records,
      error: null,
      meta: { total: records.length, returned: records.length },
    });

  } catch (error) {
    console.error("[GET /api/content/table]", error);
    return NextResponse.json(
      { data: null, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// ─── POST ──────────────────────────────────────────────────────────
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Rate limit
    const rateLimitResult = await checkRateLimit(request, "admin");
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { data: null, error: "Too many requests" },
        { status: 429 }
      );
    }

    // 2. Auth verification
    const session = await verifySession(request);
    if (!session.valid) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3. Parse body
    const body: unknown = await request.json();

    // 4. Zod validation
    const result = createSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { data: null, error: `Validation failed: ${result.error.errors[0].message}` },
        { status: 400 }
      );
    }

    // 5. Sanitize
    const sanitized = {
      ...result.data,
      title: sanitize(result.data.title),
      // sanitize every string field individually
    };

    // 6. Database write
    const db = getDb(/* D1 binding */);
    const created = await createRecord(db, sanitized);

    // 7. Return
    return NextResponse.json({ data: created, error: null }, { status: 201 });

  } catch (error) {
    console.error("[POST /api/content/table]", error);
    return NextResponse.json(
      { data: null, error: "Failed to create record" },
      { status: 500 }
    );
  }
}
```

---

## 15. API MAINTENANCE PROTOCOL

This document must be updated when:
```
→ A new API route is added
→ A route's request/response shape changes
→ A new Zod schema is added or changed
→ A new security threat is identified and mitigated
→ A new package affecting auth or security is installed
→ The admin user seeding process is changed
→ Rate limit values are changed
→ Session expiry duration is changed
```

The agent making these changes is responsible for updating
this document in the same task delivery.

---

## 16. QUICK REFERENCE — ALL ROUTES

```
PUBLIC ROUTES (no auth required):
  GET    /api/content/meta
  GET    /api/content/expertise
  GET    /api/content/expertise/[id]
  GET    /api/content/experience
  GET    /api/content/experience/[id]
  GET    /api/content/skill-categories
  GET    /api/content/skill-categories/[id]
  GET    /api/content/skills
  GET    /api/content/skills/[id]
  GET    /api/content/skills/by-category/[categoryId]
  GET    /api/content/projects
  GET    /api/content/projects/[id]
  GET    /api/content/projects/featured
  GET    /api/content/process
  GET    /api/content/process/[id]
  GET    /api/content/testimonials
  GET    /api/content/testimonials/[id]
  POST   /api/contact
  POST   /api/auth/login

PROTECTED ROUTES (🔐 session cookie required):
  PUT    /api/content/meta
  POST   /api/content/expertise
  PUT    /api/content/expertise/[id]
  DELETE /api/content/expertise/[id]
  POST   /api/content/experience
  PUT    /api/content/experience/[id]
  DELETE /api/content/experience/[id]
  POST   /api/content/skill-categories
  PUT    /api/content/skill-categories/[id]
  DELETE /api/content/skill-categories/[id]
  POST   /api/content/skills
  PUT    /api/content/skills/[id]
  DELETE /api/content/skills/[id]
  POST   /api/content/projects
  PUT    /api/content/projects/[id]
  DELETE /api/content/projects/[id]
  POST   /api/content/process
  PUT    /api/content/process/[id]
  DELETE /api/content/process/[id]
  POST   /api/content/testimonials
  PUT    /api/content/testimonials/[id]
  DELETE /api/content/testimonials/[id]
  PUT    /api/content/[table]/reorder
  POST   /api/upload
  DELETE /api/upload
  POST   /api/auth/logout
  GET    /api/auth/verify

ONE-TIME ROUTE (disabled after use):
  POST   /api/seed
```

---

*This document is version controlled alongside the codebase.
Last verified: September 2026.
Next review trigger: Any new route, security finding, or schema change.*
```

---

**Save that as `API.md` at the root of your project alongside `CONTEXT.md` and `TRD.md`.**

Before we move to implementation there are **two things you need to do first:**

**1.** Add `bcryptjs` to your project:
```powershell
npm install bcryptjs --legacy-peer-deps
npm install -D @types/bcryptjs --legacy-peer-deps
```

**2.** Add these two new env vars to `.env.local`:
```
SEED_ENABLED=true
SEED_SECRET_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

**Once those are done — confirm and we move straight into implementation starting with the Drizzle schema push to D1, then auth system, then API routes one by one.**