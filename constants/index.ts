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

