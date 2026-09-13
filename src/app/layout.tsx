import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import AppShell from "@/components/AppShell";
import JsonLd from "@/components/JsonLd";
import { StoreProvider } from "@/lib/store";
import {
  IDS,
  KEYWORDS,
  OWNER,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  STUDIO,
  absoluteUrl,
} from "@/lib/seo";
import "./globals.css";

const sans = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-outfit", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s · ORU CODE" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: KEYWORDS,
  authors: [{ name: OWNER.name, url: absoluteUrl("/developer") }],
  creator: OWNER.name,
  publisher: STUDIO.name,
  category: "technology",
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN", title: SITE_TITLE, description: SITE_DESCRIPTION },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
  },
  other: { "geo.region": "IN-KL", "geo.placename": "Kerala, India" },
};

export const viewport: Viewport = { themeColor: "#ededee", colorScheme: "light" };

const SITE_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": IDS.website,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      alternateName: ["ORU Code", "ഒരു CODE"],
      description: SITE_DESCRIPTION,
      inLanguage: "en-IN",
      publisher: { "@id": IDS.organization },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/library?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": IDS.organization,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png"), width: 512, height: 512 },
      description: SITE_DESCRIPTION,
      email: OWNER.email,
      founder: { "@id": IDS.person },
      parentOrganization: { "@type": "Organization", name: STUDIO.name, url: STUDIO.url },
      address: { "@type": "PostalAddress", addressRegion: "Kerala", addressCountry: "IN" },
      areaServed: [
        { "@type": "State", name: "Kerala", containedInPlace: { "@type": "Country", name: "India" } },
        { "@type": "Country", name: "India" },
      ],
      knowsAbout: [
        "Website design",
        "UI and UX design",
        "Website development",
        "App development",
        "CSS animation",
        "React",
        "Tailwind CSS",
        "GSAP",
        "Framer Motion",
      ],
    },
    {
      "@type": "Person",
      "@id": IDS.person,
      name: OWNER.name,
      jobTitle: "Designer & Developer",
      url: absoluteUrl("/developer"),
      image: absoluteUrl("/photos/jibin.jpg"),
      email: OWNER.email,
      worksFor: { "@type": "Organization", name: STUDIO.name, url: STUDIO.url },
      homeLocation: { "@type": "Place", name: "Kerala, India" },
      sameAs: [OWNER.telegram],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${mono.variable}`}>
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
        <JsonLd data={SITE_GRAPH} />
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
