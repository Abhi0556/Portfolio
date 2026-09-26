# 📄 TECHNICAL REQUIREMENTS DOCUMENT (TRD)
## Personal Developer Portfolio
**Version:** 1.0.0
**Status:** LOCKED
**Last Updated:** September 2026

> This document is the single source of technical truth for this project.
> Read it in full before touching a single file. Every decision made here
> was deliberate. Nothing is accidental. Nothing is negotiable unless
> explicitly marked as such. If you are an AI agent, this document
> replaces all assumptions. Do not install new packages. Do not upgrade
> versions. Do not refactor what was not asked. Do not add what was not
> planned. Surgical precision is a professional obligation.

---

## 🔴 ABSOLUTE RULES — READ FIRST, FOLLOW ALWAYS

```
RULE 01: Never upgrade any package version without explicit user confirmation
RULE 02: Never install a package not listed in this document without asking first
RULE 03: Never modify a file outside the scope of the current task
RULE 04: Never hardcode any content, text, color, or value that belongs in the database
RULE 05: Never use the `any` TypeScript type without written justification in a comment
RULE 06: Never write async code without complete try/catch error handling
RULE 07: Never trust frontend validation alone — always validate server-side with Zod
RULE 08: Never use dangerouslySetInnerHTML anywhere in this codebase
RULE 09: Never interpolate user input directly into any database query
RULE 10: Never expose sensitive environment variables with NEXT_PUBLIC_ prefix
RULE 11: Never check authentication only in middleware — always double-verify at API route level
RULE 12: Never leave TODOs, placeholders, or incomplete logic in delivered code
RULE 13: Never log sensitive data — not in development, not in production, never
RULE 14: Never add console.log to production code
RULE 15: Never run npm install without --legacy-peer-deps flag in this project
```

---

## 1. PROJECT OVERVIEW

### 1.1 What This Is
A next-level personal developer portfolio website. This is NOT a basic static
resume site. This is a cinematic, scroll-driven, motion-first web experience
that showcases the developer as a premium, senior-level full-stack engineer
through storytelling, animation, and design.

The experience must feel like visiting an award-winning agency or product website.
Every scroll must feel intentional. Every transition must feel earned.
The visitor must feel something within the first 3 seconds.

### 1.2 Core Experience Goals
- Buttery smooth scroll — zero jank, zero lag, weighted and organic feel
- Scroll-driven storytelling — each section is a scene, not a page block
- Cinematic section reveals — elements arrive, they do not flash or pop
- Fully dynamic content — every visible word controlled from admin panel
- Premium dark aesthetic — confident, modern, typographically precise
- Production security — not a toy project, treated as a real product

### 1.3 Design References
Study these URLs to understand the visual and motion target:

| URL | Extract |
|---|---|
| https://www.outskill.com/ | Typography system, color palette, spatial generosity, aesthetic language |
| https://studio-onto.com/ | Scroll-as-narrative, scene-by-scene reveals, cinematic text entrances |
| https://desdoigts.com/ | Weighted organic scroll physics, momentum transitions, parallax depth |
| http://www.science.clinic/try-it | Precision motion, calculated timing, nothing gratuitous |

### 1.4 Design DNA
```
Outskill Soul          → typography, color, restraint, negative space doing the work
studio-onto Structure  → scroll = narrative, section = scene, cinematic reveals
desdoigts Physics      → weighted scroll, organic motion, layered 3D depth
science.clinic Rules   → calculated timing, every frame earned, nothing random
```

---

## 2. TECHNOLOGY STACK — FULLY LOCKED

### 2.1 Core Stack

| Role | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js | `15.5.18` | App Router, TypeScript strict mode |
| Language | TypeScript | `5.8.3` | Strict mode enabled, no `any` |
| Styling | Tailwind CSS | `3.4.17` | JIT, CSS variables for design tokens |
| 3D / WebGL | Three.js | `0.177.0` | Core 3D engine |
| 3D React Layer | React Three Fiber | `9.7.0` | React renderer for Three.js |
| 3D Helpers | React Three Drei | `10.7.8` | Helper components for R3F |
| Animation (Macro) | GSAP | `3.12.5` | ScrollTrigger, complex timelines |
| Animation (React) | @gsap/react | `2.1.2` | GSAP hooks for React |
| Animation (Micro) | Motion | `12.23.6` | Component-level, hover, routes |
| Smooth Scroll | Lenis | `1.1.9` | Buttery scroll, Lenis/React import |
| ORM | Drizzle ORM | `0.44.2` | Type-safe, edge-compatible, D1-native |
| Database | Cloudflare D1 | N/A | SQLite at edge, never pauses on free tier |
| Asset Storage | ImageKit | `@imagekit/next@2.1.5` + `@imagekit/nodejs@7.3.0` | CDN, signed URLs, no card required |
| Email | EmailJS | `@emailjs/browser@4.4.1` | No backend, no custom domain needed |
| Rate Limiting | rate-limiter-flexible | `7.1.1` | Per-IP limiting on API routes |
| Input Validation | Zod | `3.23.8` | Schema-first, all API inputs |
| XSS Sanitization | DOMPurify | `3.2.6` | All admin input before D1 writes |
| Class Utility | clsx | `2.1.1` | Conditional class names |
| Class Merge | tailwind-merge | `2.4.0` | Merge Tailwind without conflicts |
| Hosting | Vercel | Free tier | Native Next.js, auto-deploy from GitHub |
| Admin | Next.js /admin route | Built-in | Built now, not deferred |

### 2.2 Development Tools

| Tool | Version | Role |
|---|---|---|
| Drizzle Kit | `0.31.1` | Schema generation and D1 migrations |
| ESLint | `9.30.1` | Linting |
| eslint-config-next | `15.5.18` | Next.js ESLint rules — must match Next.js version |
| Prettier | `3.3.3` | Code formatting |
| prettier-plugin-tailwindcss | `0.6.5` | Auto-sort Tailwind classes |
| PostCSS | `8.5.6` | CSS processing |
| @types/node | `20.17.57` | Node.js type definitions |
| @types/react | `19.1.8` | React type definitions |
| @types/react-dom | `19.1.6` | React DOM type definitions |
| @types/three | `0.177.0` | Three.js type definitions |
| @types/dompurify | `3.0.5` | DOMPurify type definitions |
| @cloudflare/workers-types | `4.20251119.0` | Cloudflare D1 type definitions |

### 2.3 Runtime Environment
- Node.js: 20.x minimum (required by @types/node@20)
- Package Manager: npm
- Install Flag: ALWAYS use `--legacy-peer-deps` on this project
- OS: Cross-platform (Windows PowerShell, macOS Terminal, Linux)

### 2.4 Why Each Tool Was Chosen

**Next.js 15.x over Next.js 16.x:**
Next.js 16 introduces breaking changes including Turbopack as default, Node.js 20+
minimum enforcement, and a full caching architecture overhaul. Next.js 15.5.18 is
the latest fully patched 15.x release with all CVEs resolved. Stability over
bleeding edge.

**Drizzle ORM over Prisma:**
Prisma has known incompatibility issues with Next.js App Router and Cloudflare D1.
Drizzle is fully edge-compatible, lightweight with zero runtime overhead, and
natively supports D1 with parameterized queries that prevent SQL injection by
default. Type-safe and schema-first.

**Cloudflare D1 over Supabase / Firebase:**
Supabase pauses databases after 7 days of inactivity on the free tier.
Firebase Storage now requires a billing card even on the free tier.
D1 never pauses, never requires a card, and provides 5M row reads/day,
100K writes/day, and 5GB storage on the free tier — far beyond what a
portfolio will ever consume.

**ImageKit over Cloudflare R2:**
Cloudflare R2 bucket creation now requires the Blaze billing plan (credit card).
ImageKit free tier provides 20GB bandwidth/month, 3GB storage, signed URLs,
domain-level restrictions, and a full CDN — no card required.
Two packages are used: `@imagekit/nodejs` for server-side upload logic in
API routes, and `@imagekit/next` for rendering optimized images in frontend
components.

**@emailjs/browser over Resend:**
Resend requires DNS verification records (MX, TXT, DKIM) on a custom domain.
Vercel free tier provides .vercel.app subdomains which do not allow DNS
modifications. EmailJS works entirely without a custom domain on its free
tier of 200 emails/month — more than sufficient for a portfolio contact form.

**Motion over Framer Motion:**
Framer Motion was rebranded to Motion in early 2025. The `framer-motion`
package is no longer actively developed. All imports use `motion/react`.

**Lenis over native scroll:**
Lenis normalizes scroll behavior across all browsers and devices. It creates
the weighted, organic scroll physics seen on desdoigts.com and integrates
directly with GSAP ScrollTrigger for scroll-locked sequences.

**rate-limiter-flexible over next-rate-limit:**
`next-rate-limit` is abandoned (last published 3+ years ago, max version 0.0.3).
`rate-limiter-flexible` is actively maintained, production-tested, and works
with in-memory stores for simple use cases like contact form rate limiting.

---

## 3. PACKAGE LOCK — VERIFIED INSTALLED VERSIONS

These are the EXACT versions installed and verified on September 2026.
Do NOT upgrade any of these without explicit user confirmation.
If a CVE is found, report it to the user — do NOT auto-fix.

```json
{
  "dependencies": {
    "@cloudflare/workers-types": "4.20251119.0",
    "@emailjs/browser": "4.4.1",
    "@gsap/react": "2.1.2",
    "@imagekit/next": "2.1.5",
    "@imagekit/nodejs": "7.3.0",
    "@react-three/drei": "10.7.8",
    "@react-three/fiber": "9.7.0",
    "bcryptjs": "2.4.3",
    "clsx": "2.1.1",
    "dompurify": "3.2.6",
    "drizzle-orm": "0.44.2",
    "gsap": "3.12.5",
    "jsdom": "30.1.0",
    "lenis": "1.1.9",
    "motion": "12.23.6",
    "next": "15.5.18",
    "rate-limiter-flexible": "7.1.1",
    "react": "19.1.4",
    "react-dom": "19.1.4",
    "tailwind-merge": "2.4.0",
    "three": "0.177.0",
    "zod": "3.23.8"
  },
  "devDependencies": {
    "@types/bcryptjs": "2.4.6",
    "@types/dompurify": "3.0.5",
    "@types/jsdom": "30.0.0",
    "@types/node": "20.17.57",
    "@types/react": "19.1.8",
    "@types/react-dom": "19.1.6",
    "@types/three": "0.177.0",
    "autoprefixer": "10.6.1",
    "dotenv": "18.0.4",
    "drizzle-kit": "0.31.1",
    "eslint": "9.30.1",
    "eslint-config-next": "15.5.18",
    "postcss": "8.5.6",
    "prettier": "3.3.3",
    "prettier-plugin-tailwindcss": "0.6.5",
    "tailwindcss": "3.4.17",
    "tsx": "4.19.2",
    "typescript": "5.8.3"
  }
}
```

---

## 4. ENVIRONMENT VARIABLES

### 4.1 Complete Variable Reference

```bash
# ─── EmailJS ──────────────────────────────────────────────────────────────────
# These are NEXT_PUBLIC_ because @emailjs/browser runs client-side
# They are public keys — safe to expose on the frontend
NEXT_PUBLIC_EMAILJS_SERVICE_ID=        # From emailjs.com dashboard → Email Services
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=       # From emailjs.com dashboard → Email Templates
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=        # From emailjs.com dashboard → Account → API Keys

# ─── Cloudflare D1 ────────────────────────────────────────────────────────────
# These are SERVER-SIDE ONLY — never prefix with NEXT_PUBLIC_
CLOUDFLARE_D1_DATABASE_ID=             # D1 Dashboard → your database → Database ID
CLOUDFLARE_ACCOUNT_ID=                 # Cloudflare Dashboard → right sidebar → Account ID
CLOUDFLARE_API_TOKEN=                  # API Tokens → Create Token → Edit Cloudflare Workers template

# ─── ImageKit ─────────────────────────────────────────────────────────────────
# PRIVATE_KEY is SERVER-SIDE ONLY — used only in API routes via @imagekit/nodejs
# PUBLIC_KEY and URL_ENDPOINT are safe for frontend — used by @imagekit/next
IMAGEKIT_PUBLIC_KEY=                   # ImageKit Dashboard → Developer Options → Public Key
IMAGEKIT_PRIVATE_KEY=                  # ImageKit Dashboard → Developer Options → Private Key
IMAGEKIT_URL_ENDPOINT=                 # ImageKit Dashboard → Developer Options → URL Endpoint

# ─── Admin ────────────────────────────────────────────────────────────────────
# SERVER-SIDE ONLY — minimum 32 character random string
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ADMIN_SECRET_KEY=                      # Secret key for admin panel authentication
```

### 4.2 Variable Security Classification

| Variable | Frontend Safe | Why |
|---|---|---|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | ✅ Yes | EmailJS public key — designed for browser use |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | ✅ Yes | EmailJS public key — designed for browser use |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | ✅ Yes | EmailJS public key — designed for browser use |
| `CLOUDFLARE_D1_DATABASE_ID` | ❌ No | Database identifier — server only |
| `CLOUDFLARE_ACCOUNT_ID` | ❌ No | Account identifier — server only |
| `CLOUDFLARE_API_TOKEN` | ❌ No | Full API access — server only |
| `IMAGEKIT_PUBLIC_KEY` | ✅ Yes | Used by @imagekit/next for image rendering |
| `IMAGEKIT_PRIVATE_KEY` | ❌ No | Upload signing — server only |
| `IMAGEKIT_URL_ENDPOINT` | ✅ Yes | CDN base URL — used in frontend image URLs |
| `ADMIN_SECRET_KEY` | ❌ No | Auth secret — server only, never exposed |

---

## 5. FOLDER STRUCTURE — COMPLETE FILE MAP

```
portfolio/
│
├── app/                                      # Next.js App Router root
│   ├── layout.tsx                            # Root layout — providers, fonts, Lenis init
│   ├── page.tsx                              # Homepage — section imports ONLY, zero logic
│   ├── admin/
│   │   ├── layout.tsx                        # Admin layout — auth guard + sidebar wrapper
│   │   ├── page.tsx                          # Admin dashboard — overview of all content
│   │   └── [section]/
│   │       └── page.tsx                      # Dynamic editor — /admin/projects, /admin/skills etc.
│   └── api/
│       ├── content/
│       │   └── [...route]/
│       │       └── route.ts                  # Unified CRUD API for all D1 content
│       └── contact/
│           └── route.ts                      # Contact form — EmailJS + rate limiting + honeypot
│
├── components/
│   ├── sections/                             # One file per portfolio section
│   │   ├── Loader.tsx                        # 00 — Loading screen
│   │   ├── Hero.tsx                          # 01 — Hero section
│   │   ├── About.tsx                         # 02 — About / Who I Am
│   │   ├── Expertise.tsx                     # 03 — What I Do cards
│   │   ├── Experience.tsx                    # 04 — Work timeline
│   │   ├── Skills.tsx                        # 05 — Skills grid
│   │   ├── Projects.tsx                      # 06 — Selected projects
│   │   ├── Process.tsx                       # 07 — How I Work steps
│   │   ├── Testimonials.tsx                  # 08 — Testimonials
│   │   ├── Contact.tsx                       # 09 — Contact / Open to Work
│   │   └── Footer.tsx                        # 10 — Footer
│   │
│   ├── ui/                                   # Reusable dumb components — zero data fetching
│   │   ├── Button.tsx                        # Button variants
│   │   ├── Card.tsx                          # Generic card wrapper
│   │   ├── Tag.tsx                           # Tech stack tag pill
│   │   ├── Badge.tsx                         # Status badge (Open to Work etc.)
│   │   ├── SectionHeading.tsx                # Consistent section title treatment
│   │   └── Marquee.tsx                       # Infinite scroll marquee strip
│   │
│   ├── animation/                            # ALL animation wrappers — isolated here only
│   │   ├── FadeUp.tsx                        # GSAP/Motion fade up reveal wrapper
│   │   ├── TextReveal.tsx                    # Character/word/line mask reveal
│   │   ├── ScrollReveal.tsx                  # ScrollTrigger-controlled reveal wrapper
│   │   └── PageTransition.tsx                # Route transition wrapper
│   │
│   ├── three/                                # ALL WebGL/3D — completely isolated
│   │   ├── HeroScene.tsx                     # Main hero 3D canvas scene
│   │   └── ParticleField.tsx                 # Particle field component
│   │
│   └── admin/                                # Admin panel UI components only
│       ├── AdminSidebar.tsx                  # Navigation sidebar for admin panel
│       ├── ContentEditor.tsx                 # Generic content editing form
│       ├── ImageUploader.tsx                 # ImageKit upload interface
│       └── DataTable.tsx                     # Data listing table with edit/delete
│
├── lib/
│   ├── db/
│   │   ├── client.ts                         # Drizzle ORM + D1 client initialization
│   │   ├── schema.ts                         # ALL Drizzle table definitions — source of truth
│   │   ├── meta.ts                           # CRUD — global site content (hero, about, links)
│   │   ├── expertise.ts                      # CRUD — expertise cards
│   │   ├── experience.ts                     # CRUD — work experience timeline
│   │   ├── skills.ts                         # CRUD — skills list
│   │   ├── projects.ts                       # CRUD — projects
│   │   ├── process.ts                        # CRUD — process steps
│   │   └── testimonials.ts                   # CRUD — testimonials
│   │
│   ├── imagekit/
│   │   └── client.ts                         # ImageKit server-side upload + signed URL logic
│   │
│   ├── email/
│   │   └── emailjs.ts                        # EmailJS send logic + template config
│   │
│   └── utils/
│       ├── cn.ts                             # Tailwind class merge utility (clsx + tailwind-merge)
│       ├── validators.ts                     # Zod schemas for all API inputs
│       ├── sanitize.ts                       # DOMPurify sanitization before D1 writes
│       └── rateLimit.ts                      # rate-limiter-flexible per-IP logic
│
├── hooks/
│   ├── useContent.ts                         # Universal content fetcher hook
│   ├── useLenis.ts                           # Lenis smooth scroll initialization
│   ├── useScrollAnimation.ts                 # GSAP ScrollTrigger hook
│   └── useAdmin.ts                           # Admin authentication state
│
├── types/
│   ├── content.ts                            # All D1 entity TypeScript interfaces
│   └── api.ts                                # API request and response types
│
├── constants/
│   └── index.ts                              # Section IDs, nav links, animation config values
│
├── styles/
│   ├── globals.css                           # Tailwind directives + CSS custom properties
│   └── animations.css                        # Custom keyframe animations
│
├── drizzle.config.ts                         # Drizzle Kit configuration for D1
├── next.config.ts                            # Next.js configuration
├── tailwind.config.ts                        # Tailwind configuration
├── tsconfig.json                             # TypeScript configuration
├── .eslintrc.json                            # ESLint configuration
├── .prettierrc                               # Prettier configuration
├── .env.local                                # Local environment variables — NEVER committed
├── .env.example                              # Example env file — committed to git
├── CONTEXT.md                                # Project context for AI agents
├── TRD.md                                    # This document
└── public/
    └── fonts/                                # Self-hosted fonts for performance
```

---

## 6. DATABASE ARCHITECTURE

### 6.1 ORM: Drizzle ORM with Cloudflare D1

All schema definitions live exclusively in `lib/db/schema.ts`.
All queries live exclusively in their respective `lib/db/*.ts` file.
No inline queries in API routes — ever.
No inline queries in components — ever.

### 6.2 Complete Schema Definition

```typescript
// lib/db/schema.ts
// This is the SINGLE SOURCE OF TRUTH for all database tables.
// Any change to the database structure MUST start here.

// ─── META ─────────────────────────────────────────────────────────────────────
// Single row table — controls ALL global site content
// Hero text, About text, contact info, social links, open-to-work status
// id is always 1 — only one row ever exists
// Fields:
//   id                  → always 1, primary key
//   name                → full name shown in hero and footer
//   title               → professional title (e.g. Full Stack Developer)
//   tagline             → one-line value statement shown in hero
//   location            → city/country shown in about section
//   about_text          → full about section paragraph
//   about_image_url     → ImageKit URL of developer photo
//   email               → contact email shown in contact section
//   resume_url          → ImageKit URL of PDF resume
//   is_open_to_work     → 1 = open, 0 = not open — controls badge visibility
//   github_url          → full GitHub profile URL
//   linkedin_url        → full LinkedIn profile URL
//   twitter_url         → full Twitter/X profile URL
//   footer_tagline      → short closing line shown in footer
//   created_at          → ISO timestamp
//   updated_at          → ISO timestamp — updated on every edit

// ─── EXPERTISE ────────────────────────────────────────────────────────────────
// Controls Section 03 — What I Do
// Each row is one expertise/service card
// Fields:
//   id                  → autoincrement primary key
//   title               → card title (e.g. Full Stack Development)
//   description         → 1-2 sentence description of the expertise
//   icon                → icon name or SVG string
//   display_order       → controls render order on the page (ascending)
//   created_at          → ISO timestamp
//   updated_at          → ISO timestamp

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
// Controls Section 04 — Work Experience Timeline
// Each row is one job/role
// Fields:
//   id                  → autoincrement primary key
//   company             → company name
//   role                → job title
//   start_date          → format: "Jan 2022"
//   end_date            → format: "Mar 2024" or "Present"
//   description         → brief overall description of the role
//   bullets             → JSON array of strings — impact bullet points
//   logo_url            → ImageKit URL of company logo
//   is_current          → 1 = current job, 0 = past
//   display_order       → controls render order (ascending = most recent first)
//   created_at          → ISO timestamp
//   updated_at          → ISO timestamp

// ─── SKILLS ───────────────────────────────────────────────────────────────────
// Controls Section 05 — Skills
// Each row is one skill
// Fields:
//   id                  → autoincrement primary key
//   name                → skill name (e.g. React, Node.js, PostgreSQL)
//   category            → one of: Frontend | Backend | Database | DevOps | Learning
//   proficiency         → integer 1-100 representing skill level
//   icon_url            → ImageKit URL of skill icon (optional)
//   is_currently_learning → 1 = in learning section, 0 = mastered section
//   display_order       → controls render order within category
//   created_at          → ISO timestamp
//   updated_at          → ISO timestamp

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
// Controls Section 06 — Selected Projects
// Each row is one project
// Fields:
//   id                  → autoincrement primary key
//   title               → project name
//   short_description   → 1-2 sentences for card preview
//   full_description    → full project description for expanded view
//   tags                → JSON array of strings — tech stack tags
//   image_url           → ImageKit URL of project thumbnail/screenshot
//   video_url           → ImageKit URL of project demo video (optional)
//   live_url            → deployed project URL (optional)
//   github_url          → GitHub repository URL (optional)
//   is_featured         → 1 = gets full-width hero treatment, 0 = standard card
//   display_order       → controls render order (ascending)
//   created_at          → ISO timestamp
//   updated_at          → ISO timestamp

// ─── PROCESS ──────────────────────────────────────────────────────────────────
// Controls Section 07 — How I Work
// Each row is one process step
// Fields:
//   id                  → autoincrement primary key
//   step_number         → display number (e.g. 01, 02, 03)
//   title               → step title (e.g. Understand, Plan, Build)
//   description         → 1-2 sentence description of this step
//   display_order       → controls render order (ascending)
//   created_at          → ISO timestamp
//   updated_at          → ISO timestamp

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
// Controls Section 08 — Testimonials
// Each row is one testimonial
// Fields:
//   id                  → autoincrement primary key
//   name                → person's full name
//   role                → their job title
//   company             → their company name
//   quote               → the testimonial text
//   avatar_url          → ImageKit URL of their photo (optional)
//   display_order       → controls render order (ascending)
//   created_at          → ISO timestamp
//   updated_at          → ISO timestamp
```

### 6.3 Data Flow — How Content Reaches the Page

```
Cloudflare D1 (source of truth)
        ↓
lib/db/schema.ts (table definitions)
        ↓
lib/db/*.ts (Drizzle query functions — all CRUD here)
        ↓
app/api/content/[...route]/route.ts (API layer)
  → Zod validation on input
  → Auth check for writes
  → DOMPurify sanitization for writes
  → Drizzle query execution
  → Typed response returned
        ↓
hooks/useContent.ts (data fetching hook)
  → Fetches from API
  → Caches response
  → Returns typed data to component
        ↓
components/sections/*.tsx (display only)
  → Receives data as props or from hook
  → Zero data fetching logic inside
  → Zero business logic inside
        ↓
components/ui/*.tsx (render only)
  → Receives data as props
  → Zero logic of any kind
```

### 6.4 Admin Write Flow

```
/admin/[section] (form submission)
        ↓
POST /api/content/[route]
        ↓
Zod schema validation → reject if invalid
        ↓
Admin auth verification → reject if unauthorized
        ↓
DOMPurify sanitization → strip all HTML/scripts
        ↓
Drizzle parameterized query → write to D1
        ↓
Return success response
        ↓
UI reflects update immediately
```

---

## 7. SECURITY ARCHITECTURE

### 7.1 Threat Map and Mitigations

**THREAT 01 — SQL Injection**
Attack: Malicious SQL in URL params or request body to corrupt/read D1 data.
Fix: Drizzle ORM uses parameterized queries by default. Zod validates all input
before it reaches any query. Never string-interpolate user input into queries.

**THREAT 02 — Admin Unauthorized Access**
Attack: Someone discovers /admin URL and gains full content control.
Fix: Middleware-level auth guard on entire /admin route. ADMIN_SECRET_KEY
verified server-side only. Auth also verified inside every admin API route
handler — never rely on middleware alone (see Threat 03).

**THREAT 03 — Next.js Middleware Bypass**
Attack: CVE-2025-29927 — attacker bypasses middleware auth with a single HTTP header.
Fix: Never rely on middleware alone for authentication. Every sensitive API route
verifies auth independently at the handler level.

**THREAT 04 — Contact Form Spam / Email Exhaustion**
Attack: Script hammers contact form to exhaust 200 email/month free quota.
Fix: rate-limiter-flexible — max 3 submissions per IP per hour. Honeypot
hidden field — bots fill it, humans do not, server rejects filled honeypot.
Timestamp check — reject submissions under 3 seconds (bot speed). Server-side
only — frontend rate limiting is decoration, not security.

**THREAT 05 — ImageKit Hotlinking / Bandwidth Theft**
Attack: Someone embeds ImageKit asset URLs on their site consuming your 20GB quota.
Fix: Enable URL signing in ImageKit dashboard. Set allowed domains to your exact
Vercel domain only. Never expose raw internal ImageKit bucket paths.

**THREAT 06 — API Route Flooding / D1 Quota Exhaustion**
Attack: Bot hammers /api/content/ to exhaust D1 free reads (5M/day).
Fix: rate-limiter-flexible on all public API routes. All GET responses cached —
D1 is only hit on cache miss, not every request.

**THREAT 07 — XSS via Admin Input**
Attack: Admin saves script tags into D1, frontend renders them, scripts run in visitor browsers.
Fix: DOMPurify sanitization on every admin write before Drizzle query executes.
Content Security Policy headers via next.config.ts. Never use dangerouslySetInnerHTML.

**THREAT 08 — Environment Variable Exposure**
Attack: .env.local accidentally committed to GitHub — full system compromise.
Fix: .env.local in .gitignore — verified present. NEXT_PUBLIC_ prefix only on
EmailJS keys (designed to be public). All DB and admin keys are server-side only.
GitHub secret scanning enabled on repository.

**THREAT 09 — CORS Abuse**
Attack: Another site makes API calls to your endpoints, scraping data or abusing quota.
Fix: Strict CORS policy — only exact Vercel domain in allowed origins. All
cross-origin POST/PUT/DELETE from unknown origins rejected at middleware level.

**THREAT 10 — Brute Force Admin Login**
Attack: Bot tries thousands of password combinations against /admin.
Fix: rate-limiter-flexible — 5 failed attempts per IP triggers 15 minute lockout.
ADMIN_SECRET_KEY minimum 32 character cryptographically random string.

### 7.2 Security Implementation Locations

| Security Measure | Lives In |
|---|---|
| Input validation (Zod) | `lib/utils/validators.ts` → used in every API route |
| XSS sanitization (DOMPurify) | `lib/utils/sanitize.ts` → used in every write operation |
| Rate limiting | `lib/utils/rateLimit.ts` → used in contact + public API routes |
| Admin auth guard | `app/admin/layout.tsx` (middleware) + every admin API route handler |
| CORS policy | `next.config.ts` + middleware |
| CSP headers | `next.config.ts` security headers config |

---

## 8. PACKAGE ROLES — WHAT EACH PACKAGE DOES

Understanding each package's role prevents misuse and import confusion.

### 8.1 Core Framework

**`next@15.5.18`**
The application framework. Provides App Router, server components, API routes,
image optimization, font optimization, and Vercel-native deployment.
All routing, layouts, and server-side logic flows through Next.js.
Config file: `next.config.ts`

**`react@19.1.4` + `react-dom@19.1.4`**
The UI rendering library. React 19 introduces the use() hook, improved
hydration, and better server component integration.
Never import directly from react-dom in application code — Next.js handles this.

**`typescript@5.8.3`**
The type system. Strict mode is enabled. Every function must have explicit
return types. The `any` type is forbidden without a documented comment explaining
exactly why it is necessary.
Config file: `tsconfig.json`

### 8.2 Styling

**`tailwindcss@3.4.17`**
Utility-first CSS framework. All visual styling uses Tailwind classes.
Design tokens (colors, spacing, typography) live in CSS custom properties in
`styles/globals.css` and are referenced in `tailwind.config.ts`.
Config file: `tailwind.config.ts`

**`clsx@2.1.1`**
Utility for constructing conditional className strings cleanly.
Never string-concatenate class names — always use cn() from lib/utils/cn.ts.
Import pattern: Used internally in cn() utility only.

**`tailwind-merge@2.4.0`**
Merges Tailwind classes without conflicts (e.g. merges p-4 and p-2 correctly).
Used internally in cn() utility only.
Import pattern: Used internally in cn() utility only.

**Usage (always import cn from lib/utils/cn.ts):**
```typescript
import { cn } from "@/lib/utils/cn";
className={cn("base-class", condition && "conditional-class")}
```

### 8.3 Animation Stack

**`gsap@3.12.5`**
The macro animation engine. Used for complex, timeline-based animations:
loading screen sequence, scroll-locked section reveals, cinematic text entrances,
staggered element animations. GSAP 3.12.5 includes ALL previously paid plugins
(ScrollTrigger, SplitText, etc.) for free.
Import pattern: `import gsap from "gsap"` and `import { ScrollTrigger } from "gsap/ScrollTrigger"`

**`@gsap/react@2.1.2`**
GSAP hooks for React. Provides useGSAP() hook which handles cleanup automatically —
always use useGSAP() instead of useEffect() for GSAP animations in React components.
Import pattern: `import { useGSAP } from "@gsap/react"`

**`motion@12.23.6`**
The micro animation library. Used for component-level animations: hover states,
route transitions, list item reveals, toggle animations.
This is the rebranded Framer Motion package. Import from `motion/react`.
NEVER import from `framer-motion` — that package is abandoned.
Import pattern: `import { motion, AnimatePresence } from "motion/react"`

**`lenis@1.1.9`**
Smooth scroll library. Creates the weighted, organic scroll feel.
Initialized once in app/layout.tsx and runs globally.
Integrates with GSAP ScrollTrigger — Lenis must notify ScrollTrigger on each scroll frame.
Import pattern: `import Lenis from "lenis"` and `import { ReactLenis } from "lenis/react"`

### 8.4 3D / WebGL Stack

**`three@0.177.0`**
The core 3D engine. WebGL rendering, geometries, materials, lights, cameras.
Never use Three.js directly in React components — always use through React Three Fiber.
Import pattern: `import * as THREE from "three"` (only in lib/three/ files if needed)

**`@react-three/fiber@9.7.0`**
React renderer for Three.js. Turns Three.js objects into JSX components.
All 3D scenes are built as R3F components inside components/three/.
R3F v9 is required for React 19 compatibility — v8 does not support React 19.
Import pattern: `import { Canvas, useFrame, useThree } from "@react-three/fiber"`

**`@react-three/drei@10.7.8`**
Helper components and hooks for React Three Fiber. Provides OrbitControls,
Text, Float, Sparkles, and many other pre-built 3D helpers.
Drei v10 is required for React 19 compatibility — v9 declared React 18 as peer dep.
Import pattern: `import { OrbitControls, Float } from "@react-three/drei"`

**`@types/three@0.177.0`**
TypeScript type definitions for Three.js. Must match the Three.js version exactly.
Dev dependency — not bundled into production.

### 8.5 Database Stack

**`drizzle-orm@0.44.2`**
The ORM. Provides type-safe database queries for Cloudflare D1.
Schema defined in lib/db/schema.ts. Query functions in lib/db/*.ts files.
All queries are parameterized — SQL injection prevented by default.
Import pattern: `import { drizzle } from "drizzle-orm/d1"`

**`drizzle-kit@0.31.1`**
CLI tool for Drizzle. Generates SQL migration files from schema changes.
Pushes migrations to Cloudflare D1.
Dev dependency — not bundled into production.
Commands:
```bash
npm run db:generate    # Generate migration files from schema changes
npm run db:migrate     # Apply migrations to D1
npm run db:studio      # Open Drizzle Studio (visual DB browser)
```

**`@cloudflare/workers-types@4.20251119.0`**
TypeScript types for Cloudflare Workers APIs including D1Database type.
Required for proper typing of D1 bindings in Next.js API routes.
Dev dependency — not bundled into production.

### 8.6 Asset Management

**`@imagekit/nodejs@7.3.0`**
Server-side ImageKit SDK. Used ONLY in API routes for:
- Uploading files to ImageKit from admin panel
- Generating signed URLs for time-limited asset access
- Deleting files from ImageKit
Never import this in client components — it is server-side only.
Import pattern: `import ImageKit from "@imagekit/nodejs"` (in lib/imagekit/client.ts only)

**`@imagekit/next@2.1.5`**
Next.js SDK for ImageKit. Used in client/server components for:
- Rendering optimized images via IKImage component
- Automatic format conversion, compression, and CDN delivery
Import pattern: `import { IKImage, IKVideo } from "@imagekit/next"`

### 8.7 Validation and Security

**`zod@3.23.8`**
Schema validation library. Every API route input is validated with a Zod schema
before any processing occurs. If validation fails, return 400 immediately.
All Zod schemas live in lib/utils/validators.ts.
Import pattern: `import { z } from "zod"`

**`dompurify@3.2.6`**
XSS sanitization. Every string value written to D1 from the admin panel
is sanitized with DOMPurify before the Drizzle query runs.
All sanitization logic lives in lib/utils/sanitize.ts.
Import pattern: `import DOMPurify from "dompurify"` (server-side via jsdom)

**`@types/dompurify@3.0.5`**
TypeScript types for DOMPurify.
Dev dependency — not bundled into production.

**`rate-limiter-flexible@7.1.1`**
Per-IP rate limiting. Used on:
- Contact form: max 3 submissions per IP per hour
- Public API routes: max 60 requests per IP per minute
- Admin login: max 5 failed attempts per IP, 15 minute lockout after
All rate limiting logic lives in lib/utils/rateLimit.ts.
Import pattern: `import { RateLimiterMemory } from "rate-limiter-flexible"`

### 8.8 Email

**`@emailjs/browser@4.4.1`**
EmailJS browser SDK. Sends emails directly from the client without a backend.
Initialized with public keys (NEXT_PUBLIC_ env vars).
Used ONLY in the contact form component.
No server-side usage — this is a client-side only package.
Import pattern: `import emailjs from "@emailjs/browser"`

### 8.9 Code Quality

**`eslint@9.30.1`**
JavaScript/TypeScript linter. Catches bugs and enforces code standards.
Configured via .eslintrc.json extending next/core-web-vitals and next/typescript.

**`eslint-config-next@15.5.18`**
Next.js ESLint configuration. MUST always match the Next.js version exactly.
Provides Next.js-specific rules including image optimization and link usage.

**`prettier@3.3.3`**
Code formatter. Enforces consistent formatting across all files.
Config file: .prettierrc

**`prettier-plugin-tailwindcss@0.6.5`**
Prettier plugin that auto-sorts Tailwind CSS classes into the official recommended order.
Configured in .prettierrc plugins array.

**`postcss@8.5.6`**
CSS post-processor. Required by Tailwind CSS for processing.
Config file: postcss.config.js (auto-generated by Next.js)

---

## 9. SECTIONS ARCHITECTURE

### 9.1 Narrative Flow
```
00 → Preloader          INTRIGUE   — Sets tone before anything loads
01 → Hero               DECLARE    — Who you are in 5 seconds
02 → About              CONNECT    — Build human connection
03 → Expertise          FRAME      — What problems you solve
04 → Experience         CREDIBILITY — Proof you have done this before
05 → Skills             DEPTH      — Technical breadth and depth
06 → Projects           PROOF      — The most critical section — evidence
07 → Process            DIFFER     — You think, not just code
08 → Testimonials       TRUST      — Let others say what you cannot
09 → Contact            CONVERT    — Make it effortless to reach you
10 → Footer             CLOSE      — Clean close, quick navigation
```

### 9.2 Section Component Rules

Every section component MUST follow these rules:
```
✅ Imports data from useContent() hook or receives as props only
✅ Contains zero data fetching logic internally
✅ Contains zero business logic internally
✅ Imports animations from components/animation/ only
✅ Never imports from another section component
✅ Has explicit TypeScript props interface
✅ Is fully responsive — mobile first
```

### 9.3 Section Data Sources

| Section | D1 Tables Used | Key Dynamic Fields |
|---|---|---|
| Loader | None | Static animation only |
| Hero | meta | name, title, tagline, is_open_to_work, github_url, linkedin_url |
| About | meta | about_text, about_image_url, location |
| Expertise | expertise | title, description, icon, display_order |
| Experience | experience | company, role, start_date, end_date, bullets, logo_url |
| Skills | skills | name, category, proficiency, is_currently_learning |
| Projects | projects | title, short_description, tags, image_url, video_url, live_url, github_url |
| Process | process | step_number, title, description |
| Testimonials | testimonials | name, role, company, quote, avatar_url |
| Contact | meta | email, is_open_to_work, github_url, linkedin_url, twitter_url, resume_url |
| Footer | meta | name, footer_tagline, github_url, linkedin_url, twitter_url |

---

## 10. ANIMATION ARCHITECTURE

### 10.1 Tool Responsibility Split

```
GSAP + ScrollTrigger    → macro animations
  - Loading screen timeline
  - Scroll-locked section sequences
  - Cinematic text reveals (line by line, word by word)
  - Staggered element entrances on scroll
  - Parallax layer effects
  - Hero text entry animation

Motion (motion/react)   → micro animations
  - Page route transitions
  - Component mount/unmount animations
  - Hover state animations
  - Button press effects
  - Modal open/close
  - List item stagger on data load

React Three Fiber       → 3D and WebGL
  - Hero scene canvas
  - Particle field
  - Cursor-reactive 3D elements

Lenis                   → scroll physics
  - Smooth scroll normalization across all browsers
  - Weighted, organic scroll feel
  - Notifies GSAP ScrollTrigger on every frame
```

### 10.2 GSAP Setup Rules
```
✅ Always use useGSAP() hook from @gsap/react — not useEffect
✅ Always register plugins at the top of the file that uses them
✅ Always use ScrollTrigger.refresh() after dynamic content loads
✅ Always clean up ScrollTrigger instances on component unmount
✅ Context: gsap.context() for scoped animations in components
```

### 10.3 Lenis + GSAP Integration
Lenis must notify ScrollTrigger of every scroll frame.
This integration is initialized once in app/layout.tsx.
Pattern:
```typescript
// Lenis RAF loop must call ScrollTrigger.update()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

### 10.4 Motion Import Rule
```typescript
// ✅ CORRECT — always import from motion/react
import { motion, AnimatePresence } from "motion/react"

// ❌ WRONG — this package is abandoned
import { motion } from "framer-motion"
```

---

## 11. ADMIN PANEL ARCHITECTURE

### 11.1 Routes
```
/admin                    Dashboard — content overview and quick stats
/admin/meta               Edit: hero text, about, links, open-to-work toggle, resume
/admin/projects           Add / Edit / Delete / Reorder projects + image upload
/admin/experience         Add / Edit / Delete / Reorder experience + logo upload
/admin/skills             Add / Edit / Delete skills + category management
/admin/expertise          Add / Edit / Delete expertise cards
/admin/process            Add / Edit / Delete process steps
/admin/testimonials       Add / Edit / Delete testimonials + avatar upload
```

### 11.2 Admin Authentication Flow
```
Request to /admin/*
        ↓
app/admin/layout.tsx middleware check
  → Reads ADMIN_SECRET_KEY from request (cookie or header)
  → If missing or wrong → redirect to /admin/login
  → If correct → allow through
        ↓
API route handler (for all write operations)
  → Independently verifies ADMIN_SECRET_KEY again
  → Never trusts middleware alone
  → If missing or wrong → return 401 immediately
```

### 11.3 Content Update Flow
```
Admin fills form in /admin/[section]
        ↓
Frontend validates with same Zod schema (UX feedback only)
        ↓
POST/PUT/DELETE to /api/content/[route]
        ↓
Server: Zod validation (hard enforcement)
Server: Auth verification (double check)
Server: DOMPurify sanitization
Server: Drizzle query to D1
        ↓
Success response → UI updates
        ↓
Site reflects change immediately — zero redeploy needed
```

---

## 12. API DESIGN

### 12.1 Route Structure
```
GET    /api/content/[table]           → fetch all records from table
GET    /api/content/[table]/[id]      → fetch one record by id
POST   /api/content/[table]           → create new record (auth required)
PUT    /api/content/[table]/[id]      → update record by id (auth required)
DELETE /api/content/[table]/[id]      → delete record by id (auth required)
POST   /api/contact                   → send contact form email (rate limited)
```

### 12.2 Response Format
All API responses use this consistent format:
```typescript
// Success
{ "data": T, "error": null }

// Error
{ "data": null, "error": "Description of what went wrong" }
```

### 12.3 HTTP Status Codes
```
200  → Success (GET, PUT)
201  → Created (POST)
400  → Bad Request (Zod validation failed)
401  → Unauthorized (missing or invalid admin key)
404  → Not Found (record does not exist)
429  → Too Many Requests (rate limit exceeded)
500  → Internal Server Error (unexpected failure)
```

### 12.4 API Route Template
Every API route must follow this structure:
```
1. Parse and validate input with Zod → return 400 if invalid
2. Check auth for write operations → return 401 if unauthorized
3. Sanitize string inputs with DOMPurify → for write operations
4. Execute Drizzle query → wrapped in try/catch
5. Return typed response in standard format
6. In catch block → log error server-side, return 500 with safe message
```

---

## 13. TYPESCRIPT STANDARDS

### 13.1 Configuration
```json
{
  "strict": true,
  "noEmit": true,
  "typeRoots": ["./node_modules/@types"]
}
```

### 13.2 Rules
```
✅ Explicit return types on all functions
✅ Explicit prop interfaces for all components
✅ No implicit any — ever
✅ Union types for constrained string values (e.g. category: "Frontend" | "Backend")
✅ Readonly arrays where mutation is not intended
✅ Type assertions (as Type) only when TypeScript cannot infer — add comment explaining why
✅ Generics for reusable utilities (ApiResponse<T>)
```

### 13.3 Type Organization
```
types/content.ts    → All D1 entity interfaces (Project, Experience, Skill, etc.)
types/api.ts        → API request and response types
Component files     → Props interfaces defined locally (only used in that file)
lib/ files          → Function parameter and return types defined locally
```

---

## 14. CODE STYLE STANDARDS

### 14.1 Naming Conventions
```
Variables and functions:    camelCase
React components:           PascalCase
TypeScript interfaces:      PascalCase (no I prefix)
TypeScript types:           PascalCase
Constants:                  SCREAMING_SNAKE_CASE
File names:                 kebab-case (except components which match export name)
CSS custom properties:      --kebab-case
Tailwind config keys:       camelCase
```

### 14.2 File Organization
```
External imports first (react, next, gsap, etc.)
Internal imports second (@/lib, @/components, @/hooks, @/types)
Type imports last (import type { ... })
Blank line between each group
```

### 14.3 Component Structure
```typescript
// 1. Imports
// 2. Types / Interfaces
// 3. Constants (if component-specific)
// 4. Component function
//    a. Hooks (useState, useRef, useGSAP, etc.)
//    b. Derived values
//    c. Handlers
//    d. Effects (useGSAP only — no useEffect for animations)
//    e. Return JSX
// 5. Default export
```

### 14.4 Comments Policy
```
✅ JSDoc comments on all exported functions and hooks
✅ Inline comments only for non-obvious WHY — never what the code does
✅ Section dividers in long files (// ─── SECTION NAME ─────)
❌ Never comment obvious code
❌ Never leave TODO comments in delivered code
❌ Never leave commented-out code
```

---

## 15. PERFORMANCE STANDARDS

### 15.1 Requirements
- Lighthouse Performance score: 90+ on desktop
- Lighthouse Performance score: 80+ on mobile
- First Contentful Paint: under 1.5 seconds
- Cumulative Layout Shift: under 0.1
- Scroll: 60fps maintained at all times during animations

### 15.2 Implementation Rules
```
✅ All section components lazy loaded with dynamic() import
✅ All images served through @imagekit/next IKImage component
✅ Fonts self-hosted in public/fonts/ and loaded via next/font
✅ All API GET responses cached — D1 never hit on every page load
✅ Three.js canvas renders on separate GPU thread — no main thread blocking
✅ GSAP animations use transform and opacity only — no layout-triggering properties
✅ Lenis prevents scroll jank across all browsers
✅ No layout shift — all image dimensions specified in advance
```

### 15.3 Bundle Rules
```
✅ Three.js and R3F loaded only on pages that use 3D (Hero section)
✅ Admin panel code completely separate from portfolio bundle
✅ Animation wrappers are thin — no heavy logic inside
❌ Never import entire icon libraries — import individual icons only
❌ Never import lodash — use native JavaScript equivalents
```

---

## 16. DEPLOYMENT ARCHITECTURE

### 16.1 Platform: Vercel (Free Tier)
- Domain: [projectname].vercel.app (no custom domain)
- Auto-deploy: Every push to main branch
- Preview deploys: Every pull request
- Environment variables: Set in Vercel Dashboard → Project → Settings → Environment Variables
- All .env.local variables must be mirrored in Vercel settings before deploying

### 16.2 Database: Cloudflare D1
- Never pauses on the free tier
- Free tier: 5M row reads/day, 100K writes/day, 5GB storage
- Accessed from Vercel via HTTP API using CLOUDFLARE_API_TOKEN
- Migrations run via: npm run db:migrate

### 16.3 Assets: ImageKit CDN
- Free tier: 20GB bandwidth/month, 3GB storage
- All assets served via ImageKit CDN — never directly from local
- Admin panel handles all uploads via /api/content/upload route
- Signed URLs used for any sensitive assets

### 16.4 Deploy Checklist
```
□ All environment variables set in Vercel dashboard
□ D1 database migrated to latest schema (npm run db:migrate)
□ Meta table seeded with at least one row
□ npm run build passes locally with zero errors
□ npm run lint passes with zero errors
□ TypeScript shows zero errors
□ All images loading via ImageKit
□ Contact form sends test email successfully
□ Admin panel accessible and functional
□ All 11 sections render without errors
□ Smooth scroll working on all sections
□ Mobile responsive on 375px, 768px, 1280px viewports
```

---

## 17. PACKAGE UPDATE PROTOCOL

When a new package version is available or a CVE is found:

```
STEP 1: Report to user — "Package X has a new version/CVE"
STEP 2: Research the update — breaking changes? API changes? peer dep changes?
STEP 3: Present findings — what changes, what breaks, what needs updating alongside
STEP 4: Wait for explicit user confirmation — "yes, update X to version Y"
STEP 5: Update package.json with exact version (no ^ caret on locked versions)
STEP 6: Run: Remove-Item -Recurse -Force node_modules
STEP 7: Run: Remove-Item package-lock.json
STEP 8: Run: npm install --legacy-peer-deps
STEP 9: Run: npm run build — verify zero errors
STEP 10: Update this TRD document — Section 3 Package Lock table
```

**NEVER auto-update. NEVER use npm update. NEVER use npm audit fix --force.**

---

## 18. TRD MAINTENANCE PROTOCOL

This document must be updated whenever:
```
→ A new package is installed (add to Section 3 and Section 8)
→ A package is updated (update version in Section 3)
→ A package is removed (remove from Section 3 and Section 8)
→ A new environment variable is added (add to Section 4)
→ A new API route is added (add to Section 12)
→ A new section is added to the portfolio (add to Section 9)
→ Any architectural decision changes
```

The agent making any of the above changes is responsible for updating
this document in the same task delivery. The TRD and the codebase
must always be in sync.

---

## 19. QUICK REFERENCE — MOST COMMON COMMANDS

```bash
# Development
npm run dev                    # Start dev server on localhost:3000

# Build and lint
npm run build                  # Production build — must pass before deploy
npm run lint                   # ESLint check — must pass before commit

# Database
npm run db:generate            # Generate migration from schema changes
npm run db:migrate             # Apply migration to D1
npm run db:studio              # Open visual database browser

# Package management (ALWAYS use this flag)
npm install --legacy-peer-deps
npm install [package]@[version] --legacy-peer-deps

# Clean install (use when node_modules is broken)
Remove-Item -Recurse -Force node_modules   # Windows PowerShell
Remove-Item package-lock.json              # Windows PowerShell
npm install --legacy-peer-deps
```

---

## 20. DEFINITION OF DONE

A feature is complete only when ALL of the following are true:
```
□ Works correctly on Chrome, Firefox, and Safari
□ Works correctly on 375px (mobile), 768px (tablet), 1280px (desktop) viewports
□ All TypeScript types are explicit and accurate — zero ts errors
□ All async operations have complete try/catch error handling
□ All user inputs validated with Zod server-side
□ All admin write inputs sanitized with DOMPurify
□ No console errors or warnings in browser
□ No ESLint errors or warnings
□ Content is fully dynamic — controlled from admin panel
□ Animations run at 60fps — verified in Chrome DevTools Performance tab
□ No layout shift during load or animation
□ Security rules in Section 7 are all satisfied
□ This TRD is updated if any architectural change was made
```

---

*This TRD is version controlled alongside the codebase.
Last verified package state: September 2026.
Next review trigger: Any package CVE, major framework release, or architectural change.*
