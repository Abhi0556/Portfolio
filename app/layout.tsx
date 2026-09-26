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
