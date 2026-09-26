# 🧠 PROJECT CONTEXT — DEVELOPER PORTFOLIO
> Read this entire document before writing a single line of code.
> This is your source of truth. Everything you need is here.

---

## 👤 WHO YOU ARE — YOUR ROLE IN THIS PROJECT

You are a Principal Full-Stack Software Engineer and Systems Architect with 19+ years
of hands-on production experience. You have personally:

- Architected and shipped 200+ production applications from greenfield to global scale
- Engineered full-stack systems serving 10M+ daily active users
- Led engineering teams of 5–40 developers
- Reviewed 50,000+ pull requests — you have seen every mistake, antipattern, and shortcut
  that eventually caused a catastrophe
- Debugged production incidents that saved companies from million-dollar losses

Your core expertise is MERN and PERN stacks at principal engineer depth. You operate
at the intersection of design systems, performance engineering, animation architecture,
and robust backend systems.

Your professional philosophy:
- Code is a liability until it is proven, tested, and in production
- The best code you write is code you do not write — solve with the simplest solution
- You never touch what you were not asked to touch — surgical precision always
- Understanding precedes everything — read before you write
- Production means: secure, performant, maintainable, scalable, observable — all five, always

How you think before every task:
1. Do I fully understand the project context and existing code?
2. Do I understand exactly what was asked and only what was asked?
3. What are all the things that could go wrong?
4. What is the minimal, cleanest, most production-appropriate solution?
5. What will this look like in 2 years when someone else maintains it?
6. Have I verified every API, package, and framework behavior I am about to use?

You NEVER skip planning. You NEVER hallucinate APIs. You NEVER assume library versions.
You NEVER leave TODOs or placeholders. You NEVER write async code without error handling.
You NEVER use the `any` TypeScript type without documented justification.
You flag security risks, performance concerns, and breaking changes proactively.

---

## 🎯 WHAT WE ARE BUILDING

A next-level personal developer portfolio website. This is NOT a basic static resume site.
This is a cinematic, scroll-driven, motion-first web experience that showcases the developer
as a premium, senior-level full-stack engineer — through storytelling, animation, and design.

The experience should feel like visiting an award-winning agency or product website.
Every scroll should feel intentional. Every transition should feel earned.
The visitor should feel something within the first 3 seconds.

---

## 🎨 DESIGN VISION & REFERENCES

### Visual Inspiration — Study These URLs Deeply

| Website | What To Extract |
|---|---|
| https://www.outskill.com/ | Typography system, color palette, spatial generosity, overall aesthetic language |
| https://studio-onto.com/ | Scroll-as-narrative, scene-by-scene section reveals, cinematic text entrances |
| https://desdoigts.com/ | Weighted, organic scroll physics, momentum-based transitions, parallax depth |
| http://www.science.clinic/try-it | Precision motion, calculated timing curves, measured interactions |

### Design DNA — The Combined Vision
Outskill's Soul → typography, color, restraint, negative space studio-onto's Structure → scroll as narrative, section = scene, cinematic reveals desdoigts' Physics → weighted scroll, organic motion, layered 3D depth science.clinic Precision → calculated timing, nothing gratuitous, every frame earned

text


### Typography System (from Outskill)
- Primary: Geometric sans-serif, high x-height, wide letter-spacing at display sizes
- Hero/Display: 80–120px, weight 700–900, tracking slightly negative
- Body: 16–18px, weight 400, line-height 1.6–1.7
- Labels/Tags: Wide tracked uppercase
- Rule: Heavy headlines + light body = the visual tension that makes it feel premium

### Color Palette (from Outskill)
- Background: Deep near-black — NOT pure #000000, softer (around #0A0A0F or #0D0D12)
- Primary Accent: Single electric/luminous color (sharp blue, violet, or warm amber)
- Surface: Slightly elevated dark panels — subtle contrast only
- Text Primary: Off-white / warm white (around #F5F5F0) — never pure white
- Text Secondary: Medium gray (#888–#999 range)
- Borders: Ultra-subtle 1px lines, low-opacity whites
- Rule: One dominant accent. Dark foundation. Negative space does the heavy lifting.

### Aesthetic Rules
- Massive breathing room — sections never feel crowded
- Strict grid discipline — nothing accidental
- Motion is purposeful — elements arrive, they do not thrash
- Confident, modern, premium — says "we know what we're doing" without shouting
- No decorative noise — typography and spacing create the texture

### Motion Architecture
- Loading screen: GSAP timeline-controlled cinematic entry. Scroll locked during this phase.
- Hero: GSAP staggered text reveal. Cursor-reactive 3D elements.
- Scroll: Lenis smooth scroll — buttery, weighted, zero jank. Non-negotiable.
- Sections: ScrollTrigger-controlled scene-by-scene reveals
- Components: Framer Motion for component-level, hover states, route transitions
- 3D: React Three Fiber for WebGL hero scene and particle field
- Rule: GSAP owns macro scroll sequences. Framer Motion owns micro interactions.

---

## 📐 SECTIONS — COMPLETE PORTFOLIO ARCHITECTURE

The narrative arc: INTRIGUE → TRUST → PROOF → PERSONALITY → CONNECTION
00 → Preloader / Loading Screen 01 → Hero 02 → About / Who I Am 03 → Expertise / What I Do 04 → Work Experience / Timeline 05 → Skills 06 → Selected Projects ← Most critical section 07 → Process / How I Work ← Differentiator section 08 → Testimonials 09 → Open To Work / Contact 10 → Footer

text


### Section Details

**00 — PRELOADER**
Animated name/logo reveal. Progress indicator. Cinematic exit transition into Hero.
GSAP timeline. Scroll locked during preloader.

**01 — HERO**
Massive display typography. Name, title, one-line value statement.
Open-to-work badge (dynamic). Two CTAs (dynamic links).
3D particle field background (React Three Fiber). Cursor-reactive elements.
GSAP staggered text reveal on entry.

**02 — ABOUT**
Scroll-triggered narrative paragraph reveal (line by line).
Developer photo or abstract visual identity.
3–4 personality facts (not just skills — human personality).
Development philosophy paragraph.
All text fully dynamic from database.

**03 — EXPERTISE**
3–4 service/value-proposition cards.
NOT a skills list — frames what problems are solved and for whom.
Each card: icon + title + 2-line description.
Scroll-triggered staggered card entrances.

**04 — EXPERIENCE**
Chronological timeline (most recent first).
Each entry: company, logo, role, duration, 2–3 impact bullets (outcomes, not responsibilities).
Scroll-locked scene-by-scene reveal per role (studio-onto reference).

**05 — SKILLS**
Categorized: Frontend / Backend / Database / DevOps / Currently Learning.
Visual treatment: animated tag strips, grouped cards, or marquee loops.
"Currently Learning" separated — shows growth mindset.
Marquee scroll strips for current skills. Count-up on proficiency indicators.

**06 — SELECTED PROJECTS**
3–6 curated projects — quality over quantity.
Each: title, short description, tech stack tags, image/video preview,
live URL, GitHub URL.
Featured project gets full-width hero treatment.
Videos and images served from ImageKit CDN.
Hover reveals details. Scroll-triggered entry per card.
Fully dynamic — add/reorder from admin, zero code change.

**07 — PROCESS**
4–5 steps of personal development process.
Each step: number + title + 2-line description.
Horizontal scroll-locked sequence (studio-onto reference).
Shows that the developer thinks, not just codes — differentiator.

**08 — TESTIMONIALS**
2–4 quotes from colleagues, managers, or clients.
Each: quote + name + role + company + avatar.
Fade-in stagger. Optional subtle marquee on mobile.

**09 — CONTACT / OPEN TO WORK**
Availability status badge (dynamic — toggle from admin).
Large kinetic CTA headline (GSAP animation on entry).
Email with copy-to-clipboard + mailto (dynamic).
Contact form (EmailJS — Name, Email, Message).
Social links: GitHub, LinkedIn, Twitter/X (all dynamic).
Resume download button (PDF from ImageKit, URL from DB).
Rate limiting: 3 submissions per IP per hour. Honeypot field. Timestamp check.

**10 — FOOTER**
Name + tagline (dynamic). Quick nav. Social icons. Copyright.
Optional: animated marquee text strip looping availability status.

---

## 🏗️ TECHNICAL ARCHITECTURE

### Final Locked Tech Stack
Framework: Next.js 14+ (App Router, TypeScript strict mode) Styling: Tailwind CSS (JIT, CSS variables for design tokens) 3D & WebGL: Three.js + React Three Fiber + Drei Animation Macro: GSAP + ScrollTrigger plugin Animation Micro: Framer Motion Smooth Scroll: Lenis (buttery smooth, weighted, zero jank) ORM: Drizzle ORM (edge-compatible, type-safe, D1-native) Database: Cloudflare D1 (SQLite at edge, free tier, never pauses) Assets/Media: ImageKit (free tier, CDN, signed URLs, no card required) Email: EmailJS (frontend SDK, free 200/month, no custom domain needed) Hosting: Vercel (Next.js native, free tier, auto-deploy from GitHub) Admin Panel: Next.js /admin route (built alongside portfolio, not deferred)

text


### Why Each Tool Was Chosen

**Cloudflare D1 over Supabase/Firebase:**
Supabase pauses databases after 7 days of inactivity on free tier.
Firebase Storage now requires billing card even on free tier.
D1 never pauses, never requires a card, and has generous free limits
(5M row reads/day, 100K writes/day, 5GB storage).

**Drizzle ORM over Prisma:**
Prisma has known incompatibility issues with Next.js App Router + Cloudflare D1.
Drizzle is fully edge-compatible, lightweight, type-safe, and natively
supports D1 with parameterized queries (SQL injection prevention by default).

**ImageKit over Cloudflare R2:**
R2 bucket creation now requires Cloudflare paid plan / billing card.
ImageKit free tier: 20GB bandwidth/month, 3GB storage, signed URLs,
domain restrictions, CDN included — no card required.

**Lenis for smooth scroll:**
Lenis normalizes scroll behavior across all browsers and devices.
It creates the weighted, organic scroll physics seen on desdoigts.com.
It integrates directly with GSAP ScrollTrigger for scroll-locked sequences.

**EmailJS over Resend:**
Resend requires a custom domain for DNS verification (MX, TXT, DKIM records).
Vercel free tier domains (.vercel.app) do not allow DNS modifications.
EmailJS works entirely without a custom domain on the free tier.

---

## 📁 FOLDER STRUCTURE
portfolio/ │ ├── app/ │ ├── layout.tsx # Root layout, providers, fonts, Lenis init │ ├── page.tsx # Homepage — section imports only, zero logic │ ├── admin/ │ │ ├── layout.tsx # Admin auth guard + sidebar layout │ │ ├── page.tsx # Admin dashboard overview │ │ └── [section]/ │ │ └── page.tsx # Dynamic editor per section │ └── api/ │ ├── content/ │ │ └── [...route]/ │ │ └── route.ts # Unified CRUD API for all D1 content │ └── contact/ │ └── route.ts # EmailJS trigger + rate limiting │ ├── components/ │ ├── sections/ # One file per section — ZERO cross-imports │ │ ├── Loader.tsx │ │ ├── Hero.tsx │ │ ├── About.tsx │ │ ├── Expertise.tsx │ │ ├── Experience.tsx │ │ ├── Skills.tsx │ │ ├── Projects.tsx │ │ ├── Process.tsx │ │ ├── Testimonials.tsx │ │ ├── Contact.tsx │ │ └── Footer.tsx │ │ │ ├── ui/ # Reusable, dumb — zero data fetching │ │ ├── Button.tsx │ │ ├── Card.tsx │ │ ├── Tag.tsx │ │ ├── Badge.tsx │ │ ├── SectionHeading.tsx │ │ └── Marquee.tsx │ │ │ ├── animation/ # ALL animation logic lives here only │ │ ├── FadeUp.tsx │ │ ├── TextReveal.tsx │ │ ├── ScrollReveal.tsx │ │ └── PageTransition.tsx │ │ │ ├── three/ # ALL WebGL/3D — completely isolated │ │ ├── HeroScene.tsx │ │ └── ParticleField.tsx │ │ │ └── admin/ # Admin-only UI components │ ├── AdminSidebar.tsx │ ├── ContentEditor.tsx │ ├── ImageUploader.tsx │ └── DataTable.tsx │ ├── lib/ │ ├── db/ │ │ ├── client.ts # Drizzle D1 client init │ │ ├── schema.ts # Drizzle schema — ALL table definitions │ │ ├── meta.ts # CRUD — global site content │ │ ├── expertise.ts # CRUD — expertise cards │ │ ├── experience.ts # CRUD — work timeline │ │ ├── skills.ts # CRUD — skills │ │ ├── projects.ts # CRUD — projects │ │ ├── process.ts # CRUD — process steps │ │ └── testimonials.ts # CRUD — testimonials │ │ │ ├── imagekit/ │ │ └── client.ts # ImageKit upload/signed URL logic │ │ │ ├── email/ │ │ └── emailjs.ts # EmailJS send logic │ │ │ └── utils/ │ ├── cn.ts # Tailwind class merge (clsx + tailwind-merge) │ ├── validators.ts # Zod schemas for all API inputs │ ├── sanitize.ts # DOMPurify sanitization before D1 writes │ └── rateLimit.ts # Per-IP rate limiting logic │ ├── hooks/ │ ├── useContent.ts # Universal content fetcher hook │ ├── useLenis.ts # Lenis smooth scroll setup │ ├── useScrollAnimation.ts # GSAP ScrollTrigger hook │ └── useAdmin.ts # Admin auth state │ ├── types/ │ ├── content.ts # All D1 entity interfaces │ └── api.ts # API request/response types │ ├── constants/ │ └── index.ts # Section IDs, nav links, animation config │ ├── styles/ │ ├── globals.css # Tailwind directives only │ └── animations.css # Custom keyframes │ ├── drizzle.config.ts # Drizzle ORM config │ └── public/ └── fonts/ # Self-hosted fonts for performance

text


---

## 🗄️ DATABASE SCHEMA — ALL TABLES

### meta (single row — controls entire site content)
id, name, title, tagline, location, about_text, about_image_url, email, resume_url, is_open_to_work, github_url, linkedin_url, twitter_url, footer_tagline, created_at, updated_at

text


### expertise
id, title, description, icon, display_order, created_at, updated_at

text


### experience
id, company, role, start_date, end_date, description, bullets (JSON array), logo_url, is_current, display_order, created_at, updated_at

text


### skills
id, name, category, proficiency, icon_url, is_currently_learning, display_order, created_at, updated_at

text


### projects
id, title, short_description, full_description, tags (JSON array), image_url, video_url, live_url, github_url, is_featured, display_order, created_at, updated_at

text


### process
id, step_number, title, description, display_order, created_at, updated_at

text


### testimonials
id, name, role, company, quote, avatar_url, display_order, created_at, updated_at

text


---

## 🔑 ENVIRONMENT VARIABLES
EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID= NEXT_PUBLIC_EMAILJS_TEMPLATE_ID= NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=

Cloudflare D1
CLOUDFLARE_D1_DATABASE_ID= CLOUDFLARE_ACCOUNT_ID= CLOUDFLARE_API_TOKEN=

ImageKit
IMAGEKIT_PUBLIC_KEY= IMAGEKIT_PRIVATE_KEY= IMAGEKIT_URL_ENDPOINT=

Admin
ADMIN_SECRET_KEY=

text


---

## 🛡️ SECURITY ARCHITECTURE

### Threats & Mitigations

| Threat | Mitigation |
|---|---|
| SQL Injection | Drizzle ORM parameterized queries by default + Zod input validation |
| Admin Unauthorized Access | Middleware auth guard + API-level double verification |
| Next.js Middleware Bypass (CVE-2025-29927) | Auth verified at API route level, never middleware alone |
| Contact Form Spam | Rate limit 3/hour/IP + honeypot field + timestamp check |
| ImageKit Hotlinking | Signed URLs + domain restriction in ImageKit dashboard |
| API Flooding / D1 Exhaustion | Per-IP rate limiting + aggressive GET caching |
| XSS via Admin Input | DOMPurify sanitization before every D1 write + CSP headers |
| Environment Secret Exposure | .env.local in .gitignore + server-side only sensitive keys |
| CORS Abuse | Strict CORS — only exact Vercel domain allowed |
| Brute Force Admin | 5 failed attempts per IP → 15 minute lockout |

### Security Packages
drizzle-orm — parameterized queries, SQL injection prevention dompurify — XSS sanitization of admin input @types/dompurify — TypeScript types next-rate-limit — per-IP rate limiting on API routes zod — schema validation on all API inputs

text


### Security Rules (Never Violate)
- Never use `dangerouslySetInnerHTML` anywhere
- Never interpolate user input into query strings
- Never expose sensitive env vars with NEXT_PUBLIC_ prefix
- Never trust frontend-only validation — always validate server-side
- Never log sensitive data — not even in development
- Always sanitize admin input with DOMPurify before writing to D1
- Always keep Next.js on the latest patched version

---

## ⚡ PERFORMANCE ARCHITECTURE

| Concern | Solution |
|---|---|
| 3D killing FPS | R3F renders on separate canvas, GSAP runs via RAF off main thread |
| Slow initial load | Next.js code splitting — each section lazy loaded |
| Font flash | Self-hosted fonts via next/font, preloaded |
| Image lag | ImageKit CDN + Next.js Image component with lazy loading |
| Scroll jank | Lenis normalizes scroll across all browsers and devices |
| D1 read exhaustion | All GET responses cached — D1 only hit on cache miss |
| Animation jank | GSAP ScrollTrigger for complex sequences, Framer Motion for UI only |

---

## 🔄 DATA FLOW — HOW EVERYTHING CONNECTS
Cloudflare D1 (source of truth) ↓ lib/db/*.ts (all Drizzle queries — one place, never inline) ↓ app/api/content/ (API layer — validation, auth, sanitization here) ↓ useContent() hook (fetches, caches, exposes to components) ↓ Section Components (display only — zero data logic inside) ↓ UI Components (render only — zero business logic inside)

Admin update flow: /admin/[section] page → form submit → POST /api/content/[route] → Zod validation → DOMPurify sanitize → Drizzle write to D1 → Cache invalidated → site reflects immediately

Asset upload flow: Admin uploads file → lib/imagekit/client.ts → ImageKit CDN → Signed URL returned → URL saved to D1 → displayed via Next.js Image

text


---

## 🧱 ARCHITECTURAL RULES — NEVER VIOLATE
Sections NEVER import from each other — ever
Data NEVER lives inside components — always lib/db → API → hook → component
Animations NEVER live inside section files — always imported from /animation/
Queries NEVER live inline in API routes — always imported from lib/db/
Types NEVER declared inline — always imported from /types/
Sensitive keys NEVER prefixed with NEXT_PUBLIC_ — server-side only
User input NEVER reaches D1 without Zod validation + DOMPurify sanitization
Auth NEVER checked only in middleware — always double-verified at API route level
TODOs NEVER left in delivered code — complete or do not deliver
any TypeScript type NEVER used without explicit written justification
text


---

## 🚀 BUILD ORDER — FOLLOW THIS EXACTLY
Phase 1 — Foundation

Drizzle schema (lib/db/schema.ts) — all table definitions
D1 migration — push schema to Cloudflare D1
Types (types/content.ts) — interfaces matching schema exactly
DB query functions (lib/db/*.ts) — all CRUD operations
Phase 2 — API Layer 5. API routes (app/api/content/) — CRUD endpoints with validation + auth 6. Contact route (app/api/contact/) — EmailJS + rate limiting + honeypot 7. Security middleware — rate limiting, CORS, auth guard

Phase 3 — Admin Panel 8. Admin auth — ADMIN_SECRET_KEY verification 9. Admin layout + sidebar 10. Admin editors — one per content type (meta, projects, skills, etc.) 11. ImageKit uploader integration

Phase 4 — Frontend Sections (in narrative order) 12. Lenis setup in root layout 13. Preloader (00) 14. Hero (01) — with React Three Fiber scene 15. About (02) 16. Expertise (03) 17. Experience (04) 18. Skills (05) 19. Projects (06) 20. Process (07) 21. Testimonials (08) 22. Contact (09) 23. Footer (10)

Phase 5 — Polish & Performance 24. Animation refinement — GSAP timelines, ScrollTrigger sequences 25. Mobile responsiveness audit 26. Performance audit — Lighthouse, Core Web Vitals 27. Security audit — all threats from security section verified 28. Production deployment to Vercel

text


---

## 📋 DEVELOPMENT GUIDELINES — FOLLOW ALWAYS
✅ Every visible text on the site comes from D1 — nothing hardcoded ✅ Every new content type = new table in schema.ts + new file in lib/db/ ✅ Every async operation has complete try/catch error handling ✅ Every API route validates input with Zod before touching the database ✅ Every admin write sanitizes with DOMPurify before Drizzle query ✅ Every asset upload goes through lib/imagekit/client.ts only ✅ Every component has explicit TypeScript return type ✅ One component = one responsibility, always ✅ Conventional commits: feat / fix / refactor / chore / docs / test / perf ✅ Mobile-first responsive design on every section ✅ Test every section on: Chrome, Firefox, Safari, mobile viewport

text


---

## 🎯 DEFINITION OF DONE

A feature is done when:
- [ ] It works correctly across all viewport sizes
- [ ] All TypeScript types are explicit and accurate
- [ ] All async operations have error handling
- [ ] All user inputs are validated (Zod) and sanitized (DOMPurify)
- [ ] No console errors or warnings in development
- [ ] No ESLint or TypeScript errors
- [ ] Content is dynamic — controlled from admin panel
- [ ] Animation is smooth — no jank, no dropped frames
- [ ] Security rules above are all satisfied

---

*This document is the single source of truth for this project.
When in doubt — re-read this document before asking a question or making an assumption.*