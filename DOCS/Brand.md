# 🎨 BRAND GUIDELINES
## Personal Developer Portfolio
**Version:** 1.0.0
**Status:** LOCKED
**Last Updated:** September 2026

> This document is the visual and motion bible for this portfolio.
> Every color, font, spacing value, animation timing, and design
> decision lives here. Before writing a single line of CSS or
> building a single component — read this document in full.
> Nothing is arbitrary. Every value was chosen with intention.
> Do not deviate from these guidelines without explicit confirmation.

---

## 🔴 ABSOLUTE DESIGN RULES — READ FIRST

```
RULE 01: Dark background is non-negotiable — this is a dark-only website
RULE 02: ONE primary accent color — never use two competing accent colors simultaneously
RULE 03: Content is always readable — animation never sacrifices legibility
RULE 04: Negative space is a design element — never fill every pixel
RULE 05: Typography does the heavy lifting — decoration is the enemy
RULE 06: Every animation has a purpose — if it does not communicate something, remove it
RULE 07: 60fps is the minimum — if an animation cannot hit 60fps, simplify it
RULE 08: Mobile readability is equal to desktop — never sacrifice mobile for desktop wow factor
RULE 09: Never use more than 3 font weights on the same page section
RULE 10: CSS custom properties ONLY for all color and typography values — never hardcode hex
RULE 11: Animations use transform and opacity ONLY — never animate layout properties
RULE 12: Every interactive element has a hover state — nothing is static on hover
RULE 13: Scroll animations trigger when element is 20% in viewport — not at page position
RULE 14: Never autoplay video or audio without user interaction
RULE 15: All text must meet WCAG AA contrast ratio minimum — 4.5:1 for body, 3:1 for large
```

---

## 1. BRAND IDENTITY

### 1.1 What This Portfolio Communicates

This is not a resume. This is not a showcase. This is a **statement.**

The portfolio communicates seven things simultaneously — through design,
not words:

```
1. MASTERY          → "This person has been building things for years"
2. PRECISION        → "Every detail was considered, nothing is accidental"
3. MODERNITY        → "This person works at the frontier, not behind it"
4. INTELLIGENCE     → "This person thinks before they build"
5. CREATIVITY       → "This person solves problems in unexpected ways"
6. SERIOUSNESS      → "This is a professional, not a student project"
7. HUMANITY         → "There is a real person behind this — approachable, not cold"
```

The visitor should feel: "I need to work with this person."
They should feel this within the first **8 seconds** of landing on the page.

### 1.2 Design Personality

```
Premium         ████████████░░  Strong presence without arrogance
Modern          ██████████████  Cutting edge but never gimmicky
Minimal         ███████████░░░  Clean but not empty
Serious         ████████████░░  Professional but not corporate
Warm            ████████░░░░░░  Human but not casual
Bold            ██████████████  Confident typographic presence
Animated        ███████████░░░  Motion-first but content-respecting
```

### 1.3 What This Is NOT

```
❌ Not a neon cyberpunk website
❌ Not a Web3 ape-drop aesthetic
❌ Not a maximalist design with competing elements
❌ Not a corporate blue/white LinkedIn clone
❌ Not a template that looks like everyone else
❌ Not so animated that content becomes secondary
❌ Not so minimal that it feels empty or lazy
❌ Not light mode — ever
```

### 1.4 Reference Website Analysis — What We Extract

| Reference | What We Take | What We Leave |
|---|---|---|
| **outskill.com** | Typography scale, color philosophy, spatial generosity, restraint, dark foundation | Their specific brand colors |
| **studio-onto.com** | Scroll = narrative, section = scene, scroll-locked cinematic reveals | Specific 3D scenes |
| **desdoigts.com** | Scroll physics, weighted momentum, parallax depth layers | Organic/nature aesthetic |
| **science.clinic/try-it** | Precision timing, calculated interactions, nothing random | Clinical coldness |

---

## 2. COLOR SYSTEM

### 2.1 Design Philosophy

The color system follows a single, non-negotiable rule:
**One dominant accent. Dark foundation. Negative space does the work.**

This means:
- The background is the canvas — it must never compete with content
- The accent color appears sparingly — which is exactly why it commands attention
- Text colors create hierarchy through opacity and weight — not through multiple colors
- Borders and dividers are barely visible — structure without noise

### 2.2 Complete Color Palette — CSS Custom Properties

All colors are defined as CSS custom properties in `styles/globals.css`.
Never hardcode a hex value in any component file.
Always use `var(--color-name)`.

```css
/* ─── styles/globals.css ─────────────────────────────────────── */
:root {

  /* ── FOUNDATION COLORS ────────────────────────────────────── */

  /* Primary Background — the canvas everything sits on          */
  /* Not pure black — pure black feels flat and cheap            */
  /* This specific value has a subtle blue undertone              */
  /* that reads as premium dark on all screens                    */
  --color-bg-primary:       #0A0A0F;

  /* Secondary Background — elevated surfaces (cards, panels)    */
  /* Slightly lighter — creates depth without being obvious       */
  --color-bg-secondary:     #111118;

  /* Tertiary Background — hover states, inputs, subtle panels   */
  --color-bg-tertiary:      #1A1A24;

  /* ── ACCENT COLORS ───────────────────────────────────────── */

  /* Primary Accent — THE signature color of this portfolio      */
  /* Electric violet-blue — sits between blue and purple         */
  /* Communicates: AI, technology, future, intelligence           */
  /* This exact value was chosen for:                             */
  /*   - Maximum visual impact on dark backgrounds               */
  /*   - Association with AI/ML/advanced technology              */
  /*   - Uniqueness — not the typical developer blue              */
  /*   - WCAG AA contrast compliance on dark bg                  */
  --color-accent-primary:   #6C63FF;

  /* Accent Hover — slightly brighter for hover/active states    */
  --color-accent-hover:     #7C74FF;

  /* Accent Muted — for backgrounds, tags, subtle highlights     */
  /* Low opacity version of primary accent                       */
  --color-accent-muted:     rgba(108, 99, 255, 0.12);

  /* Accent Glow — for box-shadow glow effects                   */
  --color-accent-glow:      rgba(108, 99, 255, 0.35);

  /* Accent Border — for bordered elements using accent color     */
  --color-accent-border:    rgba(108, 99, 255, 0.3);

  /* ── TEXT COLORS ─────────────────────────────────────────── */

  /* Primary Text — the most important content                   */
  /* Warm off-white — pure white feels harsh and clinical        */
  /* This exact tone feels premium and easy on the eyes          */
  --color-text-primary:     #F0EFFF;

  /* Secondary Text — supporting content, descriptions           */
  --color-text-secondary:   #A0A0B8;

  /* Tertiary Text — timestamps, labels, fine print              */
  --color-text-tertiary:    #606078;

  /* Disabled Text — unavailable states                          */
  --color-text-disabled:    #3A3A50;

  /* Inverse Text — text on accent/light backgrounds             */
  --color-text-inverse:     #0A0A0F;

  /* ── BORDER COLORS ───────────────────────────────────────── */

  /* Primary Border — card edges, dividers, section separators   */
  --color-border-primary:   rgba(255, 255, 255, 0.06);

  /* Secondary Border — stronger borders for emphasis            */
  --color-border-secondary: rgba(255, 255, 255, 0.12);

  /* Focus Border — keyboard focus ring color                    */
  --color-border-focus:     #6C63FF;

  /* ── SEMANTIC COLORS ─────────────────────────────────────── */

  /* Success — open to work badge, form success states           */
  --color-success:          #22C55E;
  --color-success-muted:    rgba(34, 197, 94, 0.12);

  /* Warning — attention states                                  */
  --color-warning:          #F59E0B;
  --color-warning-muted:    rgba(245, 158, 11, 0.12);

  /* Error — form validation errors                              */
  --color-error:            #EF4444;
  --color-error-muted:      rgba(239, 68, 68, 0.12);

  /* ── GRADIENT DEFINITIONS ────────────────────────────────── */

  /* Hero gradient — subtle bg depth behind 3D scene             */
  --gradient-hero:
    radial-gradient(
      ellipse 80% 50% at 50% -20%,
      rgba(108, 99, 255, 0.15),
      transparent
    );

  /* Section gradient — subtle depth separating sections         */
  --gradient-section:
    linear-gradient(
      180deg,
      transparent 0%,
      rgba(108, 99, 255, 0.03) 50%,
      transparent 100%
    );

  /* Accent gradient — used on CTAs, featured elements           */
  --gradient-accent:
    linear-gradient(135deg, #6C63FF 0%, #9C94FF 100%);

  /* Text gradient — for display headlines (optional use)        */
  --gradient-text:
    linear-gradient(135deg, #F0EFFF 0%, #A0A0B8 100%);

  /* Card gradient — subtle shimmer on card surfaces             */
  --gradient-card:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.03) 0%,
      rgba(255, 255, 255, 0) 100%
    );

  /* ── SURFACE OVERLAYS ────────────────────────────────────── */

  /* Scrim — full screen dark overlay for modals                 */
  --color-scrim:            rgba(0, 0, 0, 0.8);

  /* Glass — frosted glass background for floating elements      */
  --color-glass:            rgba(17, 17, 24, 0.8);
  --color-glass-border:     rgba(255, 255, 255, 0.08);

}
```

### 2.3 Color Usage Rules

```
BACKGROUND:
  Page background         → var(--color-bg-primary)
  Cards / panels          → var(--color-bg-secondary)
  Inputs / hover states   → var(--color-bg-tertiary)
  Modals (glass)          → var(--color-glass)

ACCENT (USE SPARINGLY):
  Primary CTAs            → var(--color-accent-primary)
  Links                   → var(--color-accent-primary)
  Active nav items        → var(--color-accent-primary)
  Tag backgrounds         → var(--color-accent-muted)
  Glow effects            → var(--color-accent-glow)
  Bordered elements       → var(--color-accent-border)

TEXT:
  Headlines, name, titles → var(--color-text-primary)
  Body text, descriptions → var(--color-text-secondary)
  Labels, timestamps      → var(--color-text-tertiary)
  Placeholder text        → var(--color-text-disabled)

BORDERS:
  Cards, sections         → var(--color-border-primary)
  Emphasized borders      → var(--color-border-secondary)
  Focus rings             → var(--color-border-focus)

SEMANTIC:
  Open to work badge      → var(--color-success)
  Error messages          → var(--color-error)
  Warning states          → var(--color-warning)
```

### 2.4 Color DON'Ts

```
❌ Never use pure black (#000000) as background — it reads flat
❌ Never use pure white (#FFFFFF) as text — it reads harsh
❌ Never use the accent color as a background for large areas
❌ Never use more than one accent color simultaneously
❌ Never use color alone to communicate meaning (always pair with icon/text)
❌ Never place low-opacity text on low-opacity backgrounds
❌ Never use gradient text on body copy — display headlines only
```

### 2.5 WCAG Contrast Compliance

```
var(--color-text-primary)   on var(--color-bg-primary):    ✅ 15.8:1 — AAA
var(--color-text-secondary) on var(--color-bg-primary):    ✅ 6.2:1  — AA
var(--color-text-tertiary)  on var(--color-bg-primary):    ✅ 3.1:1  — AA (large text)
var(--color-accent-primary) on var(--color-bg-primary):    ✅ 4.6:1  — AA
```

---

## 3. TYPOGRAPHY SYSTEM

### 3.1 Font Selection Philosophy

Three typefaces. Each with a specific role. No crossover.

```
DISPLAY  → Clash Display   — The personality. Headlines, names, hero text.
BODY     → Satoshi         — The workhorse. All readable content.
MONO     → JetBrains Mono  — The technical. Code, tags, labels.
```

### 3.2 Font 1 — Clash Display (Display / Headlines)

**Role:** Hero text, section headings, your name, large impact statements.

**Why Clash Display:**
Clash Display is a neo-grotesque sans-serif designed specifically for large
display sizes. It has high x-height, geometric construction, and strong
character at display scale. It is widely used in premium creative portfolios,
award-winning agency sites, and is specifically recommended for portfolio
display typography. The six weight range from Extralight to Bold gives precise
control over typographic hierarchy. It commands the page without feeling
decorative — it feels engineered, which matches a developer's identity.

**Source:** Fontshare (free, commercial use licensed)
**URL:** https://www.fontshare.com/fonts/clash-display
**Weights used:** 500 (Medium), 600 (Semibold), 700 (Bold)
**Self-host in:** `public/fonts/clash-display/`

```css
/* CSS Custom Properties */
--font-display: 'Clash Display', sans-serif;

/* Weight references */
--weight-display-medium:    500;
--weight-display-semibold:  600;
--weight-display-bold:      700;
```

**Usage Rules:**
```
✅ Hero section name and title
✅ Section headings (About, Projects, Experience etc.)
✅ Large impact numbers (years of experience, project count)
✅ Loader animation text
✅ Quote pull-out text (testimonials)
❌ Never use for body text
❌ Never use below 24px
❌ Never use weight lighter than 500
```

### 3.3 Font 2 — Satoshi (Body / UI)

**Role:** All body copy, descriptions, navigation, buttons, form labels,
card text, meta information.

**Why Satoshi:**
Satoshi is specifically recommended as a top-tier body font for portfolios.
It is a contemporary sans-serif with wide proportions, excellent legibility
at small sizes, and a subtly geometric character that complements Clash Display
without competing with it. It is distinctly modern without being trendy — it
will not date the portfolio. Its neutral friendliness makes long-form content
comfortable to read, solving the core problem of animated portfolios where
content readability is sacrificed for aesthetics.

**Source:** Fontshare (free, commercial use licensed)
**URL:** https://www.fontshare.com/fonts/satoshi
**Weights used:** 400 (Regular), 500 (Medium), 700 (Bold)
**Self-host in:** `public/fonts/satoshi/`

```css
/* CSS Custom Properties */
--font-body: 'Satoshi', sans-serif;

/* Weight references */
--weight-body-regular:  400;
--weight-body-medium:   500;
--weight-body-bold:     700;
```

**Usage Rules:**
```
✅ All body paragraphs and descriptions
✅ Navigation links
✅ Button labels
✅ Form inputs and labels
✅ Card descriptions
✅ Tag text
✅ Footer text
❌ Never use for section headings
❌ Never use above 700 weight
```

### 3.4 Font 3 — JetBrains Mono (Monospace / Technical)

**Role:** Code snippets, tech stack tags, skill names, metadata, version
numbers, any technical or data-like content.

**Why JetBrains Mono:**
JetBrains Mono is the best-in-class monospace font recommended for portfolio
technical content. It has enhanced readability with increased character width
and distinctiveness, making it immediately recognizable as "code" or "technical"
without being harsh. It signals that this developer actually writes code — not
just talks about it. The font communicates technical competence through
typography alone.

**Source:** Google Fonts (free, open source)
**URL:** https://fonts.google.com/specimen/JetBrains+Mono
**Weights used:** 400 (Regular), 500 (Medium)
**Self-host in:** `public/fonts/jetbrains-mono/`

```css
/* CSS Custom Properties */
--font-mono: 'JetBrains Mono', monospace;

/* Weight references */
--weight-mono-regular: 400;
--weight-mono-medium:  500;
```

**Usage Rules:**
```
✅ Code blocks and code snippets
✅ Tech stack tags on project cards
✅ Skill names in the skills section
✅ Version numbers
✅ Dates and timestamps in technical contexts
✅ Process step numbers (01, 02, 03...)
❌ Never use for headings or body text
❌ Never use above 16px for long-form content
```

### 3.5 Complete Type Scale

All font sizes defined as CSS custom properties. Never hardcode px values.

```css
:root {

  /* ── TYPE SCALE ──────────────────────────────────────────── */

  /* Display — Clash Display only                               */
  --text-display-2xl:  clamp(72px, 10vw, 140px);   /* Hero name                  */
  --text-display-xl:   clamp(56px, 7vw, 100px);    /* Major section headlines     */
  --text-display-lg:   clamp(40px, 5vw, 72px);     /* Sub-headlines, CTA text     */
  --text-display-md:   clamp(32px, 4vw, 56px);     /* Card titles, process steps  */
  --text-display-sm:   clamp(24px, 3vw, 40px);     /* Minor headings              */

  /* Body — Satoshi only                                        */
  --text-body-xl:      20px;    /* Lead paragraph, intro text                     */
  --text-body-lg:      18px;    /* Primary body copy                               */
  --text-body-md:      16px;    /* Standard body copy (default)                    */
  --text-body-sm:      14px;    /* Secondary info, card meta                       */
  --text-body-xs:      12px;    /* Fine print, timestamps, labels                  */

  /* Mono — JetBrains Mono only                                */
  --text-mono-md:      15px;    /* Tech tags, code snippets                        */
  --text-mono-sm:      13px;    /* Small labels, metadata                          */

  /* ── LINE HEIGHTS ─────────────────────────────────────────── */

  /* Display text — tight, creates impact                       */
  --leading-display:   0.95;    /* Hero headlines — very tight                     */
  --leading-heading:   1.1;     /* Section headings                                */
  --leading-subhead:   1.2;     /* Subheadings                                     */

  /* Body text — relaxed, maximizes readability                 */
  --leading-body:      1.7;     /* All body paragraphs                             */
  --leading-body-sm:   1.5;     /* Short body text, captions                       */
  --leading-mono:      1.6;     /* Code and technical text                         */

  /* ── LETTER SPACING ──────────────────────────────────────── */

  /* Display — negative tracking creates premium feel           */
  --tracking-display-tight:   -0.04em;   /* Hero name (very large text)            */
  --tracking-display-normal:  -0.02em;   /* Section headings                       */

  /* Body — default or slightly open                            */
  --tracking-body:            0em;       /* All body text — default               */
  --tracking-body-wide:       0.02em;    /* Button labels                         */

  /* Labels — wide tracking for uppercase labels                */
  --tracking-label:           0.08em;   /* Uppercase category labels               */
  --tracking-label-wide:      0.12em;   /* Section eyebrow labels                  */

}
```

### 3.6 Typography Hierarchy — Section By Section

```
LOADER (Section 00):
  → Name:         Clash Display, var(--text-display-2xl), weight 700
  → Tracking:     var(--tracking-display-tight)

HERO (Section 01):
  → Name:         Clash Display, var(--text-display-2xl), weight 700
  → Title/Role:   Satoshi, var(--text-body-xl), weight 500
  → Tagline:      Satoshi, var(--text-body-lg), weight 400
  → Tracking name: var(--tracking-display-tight)

ABOUT (Section 02):
  → Eyebrow:      Satoshi UPPERCASE, var(--text-body-xs), weight 500, var(--tracking-label-wide)
  → Heading:      Clash Display, var(--text-display-lg), weight 700
  → Body:         Satoshi, var(--text-body-lg), weight 400, var(--leading-body)
  → Quick facts:  Satoshi, var(--text-body-sm), weight 500

EXPERTISE (Section 03):
  → Section label: Satoshi UPPERCASE, var(--text-body-xs), var(--tracking-label-wide)
  → Section heading: Clash Display, var(--text-display-xl), weight 700
  → Card title:   Clash Display, var(--text-display-sm), weight 600
  → Card body:    Satoshi, var(--text-body-md), weight 400

EXPERIENCE (Section 04):
  → Section heading: Clash Display, var(--text-display-xl), weight 700
  → Company:      Clash Display, var(--text-display-sm), weight 600
  → Role:         Satoshi, var(--text-body-lg), weight 500
  → Dates:        JetBrains Mono, var(--text-mono-sm), weight 400
  → Bullets:      Satoshi, var(--text-body-md), weight 400

SKILLS (Section 05):
  → Section heading: Clash Display, var(--text-display-xl), weight 700
  → Category name: Clash Display, var(--text-display-sm), weight 600
  → Skill name:   JetBrains Mono, var(--text-mono-md), weight 500
  → Proficiency:  JetBrains Mono, var(--text-mono-sm), weight 400

PROJECTS (Section 06):
  → Section heading: Clash Display, var(--text-display-xl), weight 700
  → Project title: Clash Display, var(--text-display-md), weight 700
  → Description:  Satoshi, var(--text-body-md), weight 400
  → Tags:         JetBrains Mono, var(--text-mono-sm), weight 500
  → Links:        Satoshi, var(--text-body-sm), weight 500

PROCESS (Section 07):
  → Step number:  JetBrains Mono, var(--text-display-lg), weight 400
  → Step title:   Clash Display, var(--text-display-sm), weight 700
  → Step body:    Satoshi, var(--text-body-md), weight 400

TESTIMONIALS (Section 08):
  → Quote:        Clash Display, var(--text-display-sm), weight 500
  → Name:         Satoshi, var(--text-body-md), weight 700
  → Role:         Satoshi, var(--text-body-sm), weight 400, var(--color-text-secondary)

CONTACT (Section 09):
  → CTA headline: Clash Display, var(--text-display-xl), weight 700
  → Email:        Satoshi, var(--text-body-xl), weight 500
  → Form labels:  Satoshi, var(--text-body-sm), weight 500
  → Form inputs:  Satoshi, var(--text-body-md), weight 400

FOOTER (Section 10):
  → Name:         Clash Display, var(--text-display-sm), weight 600
  → Tagline:      Satoshi, var(--text-body-sm), weight 400, var(--color-text-tertiary)
  → Links:        Satoshi, var(--text-body-sm), weight 400
```

### 3.7 Font Loading in Next.js

```typescript
// app/layout.tsx
// Fonts are self-hosted for performance — no Google Fonts runtime requests
// next/font handles preloading, FOIT prevention, and CSS variable injection

// JetBrains Mono comes from Google Fonts — loaded via next/font/google
import { JetBrains_Mono } from "next/font/google";

// Clash Display and Satoshi are from Fontshare — loaded as local fonts
import localFont from "next/font/local";

const clashDisplay = localFont({
  src: [
    { path: "../public/fonts/clash-display/ClashDisplay-Medium.woff2",    weight: "500" },
    { path: "../public/fonts/clash-display/ClashDisplay-Semibold.woff2",  weight: "600" },
    { path: "../public/fonts/clash-display/ClashDisplay-Bold.woff2",      weight: "700" },
  ],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const satoshi = localFont({
  src: [
    { path: "../public/fonts/satoshi/Satoshi-Regular.woff2",  weight: "400" },
    { path: "../public/fonts/satoshi/Satoshi-Medium.woff2",   weight: "500" },
    { path: "../public/fonts/satoshi/Satoshi-Bold.woff2",     weight: "700" },
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
  preload: false,   // Not critical path — load after display fonts
});

// Apply to html element in layout
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`
        ${clashDisplay.variable}
        ${satoshi.variable}
        ${jetbrainsMono.variable}
      `}
    >
      <body>{children}</body>
    </html>
  );
}
```

### 3.8 Tailwind Font Configuration

```typescript
// tailwind.config.ts
theme: {
  extend: {
    fontFamily: {
      display: ["var(--font-display)", "sans-serif"],
      body:    ["var(--font-body)", "sans-serif"],
      mono:    ["var(--font-mono)", "monospace"],
    },
  },
}

// Usage in components:
// className="font-display"  → Clash Display
// className="font-body"     → Satoshi
// className="font-mono"     → JetBrains Mono
```

---

## 4. SPACING SYSTEM

All spacing defined as a consistent scale.
Never use arbitrary margin/padding values — always use the scale.

```css
:root {

  /* ── SPACING SCALE ────────────────────────────────────────── */
  --space-1:    4px;
  --space-2:    8px;
  --space-3:    12px;
  --space-4:    16px;
  --space-5:    20px;
  --space-6:    24px;
  --space-8:    32px;
  --space-10:   40px;
  --space-12:   48px;
  --space-16:   64px;
  --space-20:   80px;
  --space-24:   96px;
  --space-32:   128px;
  --space-40:   160px;
  --space-48:   192px;

  /* ── SECTION SPACING ─────────────────────────────────────── */
  /* The generous space between sections is critical            */
  /* This is where the premium feel comes from                  */
  --section-padding-y:   clamp(80px, 12vw, 160px);
  --section-padding-x:   clamp(24px, 6vw, 80px);

  /* ── CONTAINER ───────────────────────────────────────────── */
  --container-max-width: 1200px;
  --container-padding:   clamp(16px, 4vw, 40px);

  /* ── BORDER RADIUS ───────────────────────────────────────── */
  --radius-sm:    6px;    /* Tags, badges, small elements      */
  --radius-md:    12px;   /* Buttons, inputs                   */
  --radius-lg:    16px;   /* Cards                             */
  --radius-xl:    24px;   /* Large panels                      */
  --radius-full:  9999px; /* Pills, circular elements          */

}
```

---

## 5. ANIMATION SYSTEM

### 5.1 Animation Philosophy

```
Animation in this portfolio is not decoration.
Animation is communication.

Every animation answers one of these questions:
  → Where did this come from? (entrance direction communicates origin)
  → What is the hierarchy? (order of appearance = order of importance)
  → What should I focus on? (motion guides eye to primary content)
  → Is this interactive? (hover states confirm affordances)
  → Am I progressing? (scroll animations confirm forward movement)

If an animation cannot answer one of these questions — it does not belong.
```

### 5.2 Animation Timing Tokens

```css
:root {

  /* ── DURATIONS ──────────────────────────────────────────── */
  --duration-instant:   0.1s;    /* State toggles — too fast to notice as animation   */
  --duration-fast:      0.2s;    /* Hover states, micro interactions                   */
  --duration-normal:    0.4s;    /* Standard component animations                      */
  --duration-slow:      0.6s;    /* Section entrances, major reveals                   */
  --duration-slower:    0.9s;    /* Cinematic text reveals, hero entrance               */
  --duration-slowest:   1.2s;    /* Loader animation, full scene transitions            */

  /* ── GSAP SPECIFIC DURATIONS ─────────────────────────────── */
  /* Note: GSAP uses seconds not ms                             */
  /* --duration-fast    = 0.2  in GSAP                         */
  /* --duration-normal  = 0.4  in GSAP                         */
  /* --duration-slow    = 0.6  in GSAP                         */
  /* --duration-slower  = 0.9  in GSAP                         */
  /* --duration-slowest = 1.2  in GSAP                         */

  /* ── EASING CURVES ──────────────────────────────────────── */
  /* CSS easing values for Motion (motion/react) components    */
  --ease-smooth:      cubic-bezier(0.25, 0.46, 0.45, 0.94);  /* Natural deceleration  */
  --ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1);     /* Slight overshoot       */
  --ease-in:          cubic-bezier(0.4, 0, 1, 1);            /* Acceleration           */
  --ease-out:         cubic-bezier(0, 0, 0.2, 1);            /* Deceleration           */
  --ease-in-out:      cubic-bezier(0.4, 0, 0.2, 1);         /* Both                   */

}
```

### 5.3 GSAP Easing Reference

```typescript
// GSAP easing strings — use these in all GSAP animations
// Never use CSS easing in GSAP — GSAP has superior easing engine

const GSAP_EASING = {
  // Standard entrance — most common
  standard:     "power2.out",

  // Smooth cinematic — section reveals, text entrances
  cinematic:    "power3.out",

  // Dramatic impact — hero entrance, loader exit
  dramatic:     "power4.out",

  // Elastic — occasional accent, never overuse
  elastic:      "elastic.out(1, 0.5)",

  // Back — slight overshoot, card hover
  back:         "back.out(1.7)",

  // Linear — progress bars, marquee, loop animations
  linear:       "none",

  // Smooth in-out — section transitions
  inOut:        "power2.inOut",
} as const;
```

### 5.4 Animation Layer Architecture

```
LAYER 1 — LENIS (Scroll Physics)
  Runs always, normalized across all browsers
  Creates weighted, organic scroll momentum
  Notifies GSAP ScrollTrigger every frame
  Speed: 1.2 (slightly slower than default = premium feel)
  Smoothness: 0.1 (lower = more damping = more weight)

LAYER 2 — GSAP + ScrollTrigger (Macro Sequences)
  Scroll-locked section reveals
  Cinematic text entrances (SplitText)
  Timeline-controlled loader sequence
  Staggered card entrances
  Parallax layer movements
  Horizontal scroll sequences (Process section)

LAYER 3 — MOTION/REACT (Micro Interactions)
  Component mount/unmount transitions
  Hover state animations
  Modal and drawer open/close
  Button press feedback
  Route transitions between pages
  List item stagger on data load

LAYER 4 — REACT THREE FIBER (3D/WebGL)
  Hero particle field (cursor-reactive)
  Background depth elements
  Subtle ambient 3D motion
  GPU-rendered, separate from main thread
```

### 5.5 Section-by-Section Animation Specification

---

**SECTION 00 — LOADER**
```
Purpose: Set the tone. Create anticipation. Not just a spinner.

Sequence:
  1. Black screen
  2. Your name reveals — Clash Display, character by character
     Each character: opacity 0→1, y: 20px→0, stagger: 0.04s
     Easing: power3.out, duration: 0.5s per char
  3. Progress bar fills — 0%→100%, width animation
     Duration: 1.5s, easing: linear
  4. Name scales up slightly and fades — scale: 1→1.1, opacity: 1→0
     Duration: 0.6s, easing: power2.inOut
  5. Screen splits vertically — top half moves up, bottom half moves down
     Duration: 0.8s, easing: power4.inOut
  6. Hero content is revealed beneath

GSAP Timeline total: approximately 2.5s
Scroll locked during entire sequence
```

---

**SECTION 01 — HERO**
```
Purpose: Declare. Impact. Command.

Entrance (after loader exits):
  1. Background gradient fades in — opacity: 0→1, duration: 0.8s
  2. 3D particle field fades in — opacity: 0→0.6, duration: 1.2s
  3. Role label slides up — y: 20px→0, opacity: 0→1, duration: 0.5s
  4. Name (split by lines) reveals — clipPath mask slides up per line
     Line 1 delay: 0.1s, Line 2 delay: 0.2s
     Duration per line: 0.8s, easing: power4.out
  5. Tagline fades up — y: 20px→0, opacity: 0→1, duration: 0.5s, delay: 0.4s
  6. CTA buttons fade in with slight scale — scale: 0.95→1, opacity: 0→1
  7. Scroll indicator pulses — infinite loop, opacity: 1→0.3→1

3D Scene (React Three Fiber):
  Particle field: 500-1000 small particles
  Cursor interaction: particles subtly repel from cursor position
  Color: var(--color-accent-primary) at 30% opacity
  Motion: slow ambient drift, no dramatic movement
  Performance: max draw calls monitored, fallback to CSS gradient if needed

Scroll behavior:
  On scroll: name parallaxes at 0.5x scroll speed (moves slower than scroll)
  Particles parallax at 0.3x scroll speed
  Content exits at 1x speed (normal)
```

---

**SECTION 02 — ABOUT**
```
Purpose: Human connection. Warmth without losing authority.

Entrance (ScrollTrigger: start 20% bottom of viewport):
  1. Eyebrow label — letter spacing expands: 0→0.12em, opacity: 0→1
     Duration: 0.6s
  2. Heading — SplitText by words, stagger reveal
     Each word: y: 40px→0, opacity: 0→1, stagger: 0.05s
     Duration: 0.7s per word, easing: power3.out
  3. Body paragraphs — line by line reveal, mask clip
     Each line: clipPath height 0→100%, stagger: 0.02s
  4. Photo/visual — scale: 0.9→1, opacity: 0→1, duration: 0.8s
  5. Quick facts — stagger up, delay after main content

Ongoing scroll behavior:
  Photo has subtle parallax at 0.2x speed
  Text scrolls at normal speed (no parallax — readability priority)
```

---

**SECTION 03 — EXPERTISE**
```
Purpose: Clarity. Value proposition. Clean information.

Cards entrance (stagger):
  Each card: y: 60px→0, opacity: 0→1
  Stagger: 0.1s between cards
  Duration: 0.6s per card, easing: power2.out

Card hover state:
  Background: bg-tertiary → bg-secondary (subtle)
  Border: border-primary → border-secondary
  Icon: subtle scale 1→1.05
  Duration: 0.2s, smooth ease
  Transform: translateY(-4px) — lifts slightly

No scroll-locked behavior — simple scroll reveal
```

---

**SECTION 04 — EXPERIENCE**
```
Purpose: Cinematic proof. Each role is a chapter.

Layout: Vertical timeline with horizontal detail expansion
OR full-viewport scroll-locked sequence (one role per scroll-locked frame)

Scroll-locked approach (preferred):
  Pin the section for entire experience duration
  Each role occupies one "frame" of pinned scroll
  Entering new role: old content exits left, new enters right
  Company name: large Clash Display entrance, opacity + x movement
  Details stagger in below company name
  Timeline indicator fills as you scroll through roles

Timeline indicator:
  Vertical line fills with accent color as you progress
  Current role dot pulses in accent color
  Completed roles dim to secondary color
```

---

**SECTION 05 — SKILLS**
```
Purpose: Technical depth at a glance. Not a flat list.

Layout: Categories with skill chips under each
Category heading reveal: per section, stagger in
Skill chips: burst in with scale: 0.8→1, opacity: 0→1, stagger: 0.02s

Marquee elements (optional):
  Continuous scroll marquee for technology logos
  Direction: left to right (primary), right to left (secondary)
  Speed: 40s per full loop
  Pause on hover

Proficiency indicators:
  On scroll into view: width animates from 0 to actual proficiency %
  Duration: 0.8s, easing: power2.out
  Color: gradient from accent-primary to accent-hover
```

---

**SECTION 06 — PROJECTS**
```
Purpose: Evidence. The centrepiece of the portfolio.

Featured project:
  Full-width card with image/video preview
  Entrance: scale: 0.95→1, opacity: 0→1, duration: 0.8s
  Image: parallax at 0.15x speed (subtle depth)

Project cards grid:
  Entrance: stagger, y: 80px→0, opacity: 0→1
  Stagger: 0.12s between cards
  Duration: 0.7s, easing: power3.out

Card hover state (THE most important hover in the portfolio):
  Image: scale 1→1.05 (zoom in slightly, reveals depth)
  Title: y: 0→-4px (lifts slightly)
  Overlay: opacity 0→0.85 (darken image)
  Tags: opacity 0→1 (appear on hover — revealed)
  Links: translateY: 20px→0 (slide up on hover)
  Border: border-primary → accent-border
  Box-shadow: 0→ var(--color-accent-glow) 0 0 40px
  Duration: 0.3s, ease-out
  ALL of the above happen simultaneously

Video preview:
  On card hover: video autoplay at muted
  On card leave: video pause and reset
```

---

**SECTION 07 — PROCESS**
```
Purpose: Differentiation. Show you think, not just code.

Layout: Horizontal scroll-locked sequence
  Section pins during scroll
  Each step snaps into view as you scroll
  Step number (01, 02, 03) is LARGE — Clash Display, display-lg size
  Step number: counter-animates from 00 to current step number as you progress

Transition between steps:
  Current step: opacity 1, scale 1
  Entering step: x: 100px→0, opacity: 0→1
  Exiting step: x: 0→-100px, opacity: 1→0
  Duration: 0.5s, easing: power2.inOut
```

---

**SECTION 08 — TESTIMONIALS**
```
Purpose: Trust. Let others speak.

Layout: Large single quote with avatar and attribution
If multiple: soft fade transition between quotes (auto, 6s interval)

Quote entrance:
  Quotation mark: scale: 0→1, opacity: 0→1
  Quote text: SplitText by lines, stagger reveal
  Avatar: scale: 0.8→1, opacity: 0→1
  Attribution: slide up, opacity 0→1
```

---

**SECTION 09 — CONTACT**
```
Purpose: Convert. Make reaching out irresistible.

Headline (kinetic typography):
  Large Clash Display CTA — "Let's Build Something."
  On scroll into view: SplitText character reveal
  Each character: random entry angle, settles into position
  Creates kinetic/dynamic feel without being chaotic

Email:
  Hover state: accent underline expands left→right under text
  Click: copy to clipboard + subtle confirmation animation
  Confirmation: checkmark icon fades in, text changes briefly

Form:
  Fields: stagger fade in, y: 20px→0
  Focus state: accent border glow (box-shadow expand)
  Submit button: pulse animation while sending
  Success: form fades out, success message fades in with checkmark
```

---

**SECTION 10 — FOOTER**
```
Purpose: Clean close. Brand reinforcement.

Marquee strip (top of footer):
  "Available for work · Full Stack Developer · Open to Opportunities ·"
  Continuous left-scroll marquee loop
  Subtle separator dots between phrases
  Accent color on availability status text

Content: simple fade-in on scroll enter
```

### 5.6 Scroll Behavior Specification

```
Lenis configuration:
  duration:     1.2        (longer = heavier, more premium feel)
  easing:       (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  direction:    vertical
  gestureDirection: vertical
  smooth:       true
  mouseMultiplier: 1
  smoothTouch:  false      (native scroll on touch for performance)
  touchMultiplier: 2
  infinite:     false

ScrollTrigger integration:
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

Standard ScrollTrigger settings per section:
  trigger:   section element
  start:     "top 80%"     (20% visible = trigger)
  end:       "bottom 20%"
  toggleActions: "play none none reverse"
```

### 5.7 Cursor — Custom Cursor (Optional but Recommended)

```
A custom cursor reinforces the premium feel of the portfolio.

Default state:
  Small circle: 12px diameter, accent color, 60% opacity
  Outer ring: 32px diameter, accent color, 20% opacity, 80ms lag behind cursor

Hover state (on interactive elements):
  Inner circle: expands to 0px (disappears)
  Outer ring: expands to 64px, opacity increases to 40%
  Mix-blend-mode: difference (inverts colors beneath — high visual impact)

On project card hover:
  Cursor transforms to text: "VIEW" in mono font
  Background becomes solid accent at 80% opacity
  Duration: 0.3s

On link hover:
  Outer ring magnetic attraction — cursor pulls toward link center
  Implemented with: GSAP + mouse position tracking

Performance note:
  Cursor runs on mousemove event with requestAnimationFrame throttle
  GPU-composited with transform — never triggers layout
  Hidden on mobile/touch devices — touch has no cursor
```

---

## 6. COMPONENT DESIGN SPECS

### 6.1 Buttons

```
PRIMARY BUTTON (main CTA — "See My Work", "Get in Touch"):
  Background:     var(--color-accent-primary)
  Text:           var(--color-text-inverse), Satoshi Medium
  Size:           padding: 14px 28px, border-radius: var(--radius-md)
  Font:           var(--text-body-md), var(--tracking-body-wide)
  Hover:          background → var(--color-accent-hover)
                  box-shadow: 0 0 24px var(--color-accent-glow)
                  transform: translateY(-2px)
  Duration:       0.2s

SECONDARY BUTTON (ghost — "View Resume", "GitHub"):
  Background:     transparent
  Border:         1px solid var(--color-border-secondary)
  Text:           var(--color-text-primary), Satoshi Medium
  Hover:          border-color → var(--color-accent-border)
                  background → var(--color-accent-muted)
                  color → var(--color-accent-primary)
  Duration:       0.2s

ICON BUTTON (social links, copy email):
  Background:     var(--color-bg-tertiary)
  Size:           44px × 44px, border-radius: var(--radius-sm)
  Border:         1px solid var(--color-border-primary)
  Hover:          border-color → var(--color-accent-border)
                  background → var(--color-accent-muted)
                  icon color → var(--color-accent-primary)
  Duration:       0.2s
```

### 6.2 Cards

```
PROJECT CARD:
  Background:     var(--color-bg-secondary)
  Border:         1px solid var(--color-border-primary)
  Border-radius:  var(--radius-lg)
  Overflow:       hidden (for image zoom effect)
  Hover:          SEE Section 5.5 — Projects hover spec
  Shadow:         none by default, glow on hover

EXPERTISE CARD:
  Background:     var(--color-bg-secondary)
  Border:         1px solid var(--color-border-primary)
  Border-radius:  var(--radius-lg)
  Padding:        var(--space-8)
  Hover:          translateY(-4px), border → border-secondary

SKILL TAG:
  Background:     var(--color-accent-muted)
  Text:           var(--color-accent-primary), JetBrains Mono
  Border:         1px solid var(--color-accent-border)
  Border-radius:  var(--radius-sm)
  Padding:        4px 10px
  Font-size:      var(--text-mono-sm)
```

### 6.3 Open To Work Badge

```
OPEN TO WORK BADGE:
  Background:     var(--color-success-muted)
  Border:         1px solid rgba(34, 197, 94, 0.3)
  Text:           var(--color-success), Satoshi Medium
  Border-radius:  var(--radius-full)
  Padding:        6px 14px
  Dot indicator:  8px circle, var(--color-success), pulsing animation
  Pulse animation: scale: 1→1.4→1, opacity: 1→0→1, infinite, 2s loop

CLOSED TO WORK (hidden by default):
  isOpenToWork = false → badge completely hidden (display: none)
  Controlled from admin panel toggle
```

### 6.4 Section Eyebrow Labels

```
All sections have an optional eyebrow label above the main heading:
  Text:           UPPERCASE, Satoshi, var(--text-body-xs), weight 500
  Color:          var(--color-accent-primary)
  Letter-spacing: var(--tracking-label-wide)
  Before:         thin horizontal line — 24px wide, accent color
  After:          thin horizontal line — 24px wide, accent color
  Gap:            8px between lines and text
```

---

## 7. LAYOUT SYSTEM

### 7.1 Grid

```
Desktop (1280px+):
  Container max-width: 1200px
  Content columns: 12-column grid
  Column gap: 24px

Tablet (768px-1279px):
  Container: full width with padding
  Padding: 32px horizontal

Mobile (0-767px):
  Container: full width with padding
  Padding: 16px horizontal
  Single column for all content
```

### 7.2 Section Layout Pattern

```
Every section follows this structure:

<section>                           ← Full viewport width, bg-primary
  <div class="section-container">   ← Max-width container, centered
    <div class="section-header">    ← Eyebrow + heading
    <div class="section-content">   ← Actual content (cards, list, etc.)
  </div>
</section>
```

### 7.3 Z-Index Scale

```css
:root {
  --z-base:       0;      /* Static content                     */
  --z-raised:     10;     /* Cards on hover                      */
  --z-sticky:     100;    /* Sticky navigation                   */
  --z-overlay:    200;    /* Section overlays, scroll-lock masks */
  --z-modal:      300;    /* Modals, drawers                     */
  --z-toast:      400;    /* Notification toasts                 */
  --z-cursor:     500;    /* Custom cursor — always on top       */
  --z-loader:     1000;   /* Loader — above everything           */
}
```

---

## 8. NAVIGATION

```
STYLE:         Fixed top navigation, minimal, transparent initially
BACKGROUND:    Transparent on hero → blurs to glass (var(--color-glass))
               on scroll past hero section
BACKDROP:      backdrop-filter: blur(12px) saturate(180%)
BORDER:        1px solid var(--color-glass-border) on scroll activation
HEIGHT:        64px desktop, 56px mobile
TRANSITION:    Background transition: 0.3s on scroll threshold cross

LOGO/NAME:
  Text:        Clash Display, var(--text-display-sm), weight 700
  Color:       var(--color-text-primary)
  Hover:       color → var(--color-accent-primary), transition: 0.2s

NAV LINKS:
  Text:        Satoshi, var(--text-body-sm), weight 500
  Color:       var(--color-text-secondary)
  Hover:       color → var(--color-text-primary), transition: 0.2s
  Active:      color → var(--color-accent-primary)
  Spacing:     32px between links

MOBILE NAV:
  Hamburger icon → fullscreen overlay
  Background: var(--color-bg-primary)
  Links: large Clash Display, centered, stagger in
  Close: tap anywhere outside or X button
  Animation: Motion AnimatePresence, scale + opacity
```

---

## 9. PERFORMANCE CONSTRAINTS — ANIMATION BUDGET

```
These limits are non-negotiable. Exceeding them causes jank.

Max simultaneous GSAP animations:    20 tweens
Max Three.js draw calls per frame:   50
Max particles in hero scene:         1000
Max simultaneous Motion variants:    10
ScrollTrigger instances per section: 3 max
Lenis scroll event listeners:        1 (the GSAP integration only)

Fallbacks for low-power devices:
  prefers-reduced-motion: YES → disable all animations
  Implementation:
    import { useReducedMotion } from "motion/react"
    All animation components check this hook first
    If true: skip GSAP timelines, show content at final state immediately

GPU layer hints (only on animated elements):
  will-change: transform    (applied before animation, removed after)
  transform: translateZ(0)  (force GPU compositing for particle field)
```

---

## 10. TAILWIND CONFIGURATION — COMPLETE

This is the complete Tailwind config that implements all tokens above.

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   "var(--color-bg-primary)",
          secondary: "var(--color-bg-secondary)",
          tertiary:  "var(--color-bg-tertiary)",
        },
        accent: {
          primary: "var(--color-accent-primary)",
          hover:   "var(--color-accent-hover)",
          muted:   "var(--color-accent-muted)",
          glow:    "var(--color-accent-glow)",
          border:  "var(--color-accent-border)",
        },
        text: {
          primary:   "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary:  "var(--color-text-tertiary)",
          disabled:  "var(--color-text-disabled)",
          inverse:   "var(--color-text-inverse)",
        },
        border: {
          primary:   "var(--color-border-primary)",
          secondary: "var(--color-border-secondary)",
          focus:     "var(--color-border-focus)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error:   "var(--color-error)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body:    ["var(--font-body)", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-2xl": "var(--text-display-2xl)",
        "display-xl":  "var(--text-display-xl)",
        "display-lg":  "var(--text-display-lg)",
        "display-md":  "var(--text-display-md)",
        "display-sm":  "var(--text-display-sm)",
        "body-xl":     "var(--text-body-xl)",
        "body-lg":     "var(--text-body-lg)",
        "body-md":     "var(--text-body-md)",
        "body-sm":     "var(--text-body-sm)",
        "body-xs":     "var(--text-body-xs)",
        "mono-md":     "var(--text-mono-md)",
        "mono-sm":     "var(--text-mono-sm)",
      },
      spacing: {
        "section-y": "var(--section-padding-y)",
        "section-x": "var(--section-padding-x)",
      },
      borderRadius: {
        sm:   "var(--radius-sm)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      transitionDuration: {
        instant: "var(--duration-instant)",
        fast:    "var(--duration-fast)",
        normal:  "var(--duration-normal)",
        slow:    "var(--duration-slow)",
      },
      transitionTimingFunction: {
        smooth: "var(--ease-smooth)",
        spring: "var(--ease-spring)",
      },
      backgroundImage: {
        "gradient-hero":    "var(--gradient-hero)",
        "gradient-section": "var(--gradient-section)",
        "gradient-accent":  "var(--gradient-accent)",
        "gradient-text":    "var(--gradient-text)",
        "gradient-card":    "var(--gradient-card)",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 11. FONTS — DOWNLOAD INSTRUCTIONS

Both Fontshare fonts require manual download and self-hosting.
Do this before starting any UI work.

```
CLASH DISPLAY:
  1. Visit: https://www.fontshare.com/fonts/clash-display
  2. Click "Download Font Family"
  3. From the ZIP, extract these WOFF2 files:
     ClashDisplay-Medium.woff2
     ClashDisplay-Semibold.woff2
     ClashDisplay-Bold.woff2
  4. Place in: public/fonts/clash-display/

SATOSHI:
  1. Visit: https://www.fontshare.com/fonts/satoshi
  2. Click "Download Font Family"
  3. From the ZIP, extract these WOFF2 files:
     Satoshi-Regular.woff2
     Satoshi-Medium.woff2
     Satoshi-Bold.woff2
  4. Place in: public/fonts/satoshi/

JETBRAINS MONO:
  → Loaded via next/font/google — no manual download needed
```

---

## 12. BRAND GUIDELINES MAINTENANCE

Update this document when:
```
→ A color value changes
→ A font is added, replaced, or removed
→ A new animation pattern is introduced
→ A spacing token is added
→ A component design spec changes
→ A new section is added to the portfolio
```

---

*Brand Guidelines Version 1.0.0 — September 2026*
*Next review trigger: Any design decision change*
```

