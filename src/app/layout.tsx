import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const sans = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-outfit", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });
export const metadata: Metadata = {
  title: { default: "ORU CODE — Code Library & Animation Showcase", template: "%s · ORU CODE" },
  description:
    "Interactive UI/UX library: website sections, full-page layouts and animations with HTML/CSS and React code, live previews and full website prompts.",
};

export const viewport: Viewport = { themeColor: "#ededee", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body
        style={
          {
            "--font-display": "var(--font-outfit), ui-sans-serif, system-ui, sans-serif",
            "--font-sans": "var(--font-outfit), ui-sans-serif, system-ui, sans-serif",
            "--font-mono": "var(--font-jetbrains), ui-monospace, Menlo, monospace",
          } as React.CSSProperties
        }
      >
        <div className="ambient" aria-hidden="true" />
        {/* In the server HTML so the page can't flash before the intro overlay mounts. */}
        <div id="oru-boot" className="intro-boot" aria-hidden="true" />
        <StoreProvider>
          <Suspense fallback={null}>
            <AppShell>{children}</AppShell>
          </Suspense>
        </StoreProvider>
      </body>
    </html>
  );
}
