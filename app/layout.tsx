import type { Metadata } from "next";
import { Fraunces, Figtree, JetBrains_Mono } from "next/font/google";

import "@/styles/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${fraunces.variable} ${figtree.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla)
          inject attributes like cz-shortcut-listen onto <body> before React
          hydrates — a benign external mutation, not a code mismatch */}
      <body
        className="bg-bg-primary text-text-primary font-body antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
