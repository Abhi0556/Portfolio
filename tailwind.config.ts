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
