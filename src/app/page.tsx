import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import HomeView from "@/components/views/HomeView";
import { FAQS, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN", url: "/", title: SITE_TITLE, description: SITE_DESCRIPTION },
};

export default function HomePage() {
  return (
    <>
      <HomeView />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </>
  );
}
