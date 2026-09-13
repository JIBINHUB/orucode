import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { IDS, absoluteUrl, pageMeta } from "@/lib/seo";
import { SERVICES, servicePath, serviceSeo } from "@/lib/services";

const TITLE = "Free Website Designs for Every Business";
const DESCRIPTION =
  "Free website designs for restaurants, resorts and homestays, clinics, schools, real estate, salons, gyms, online stores and more — each with free section designs, copy-ready code and an AI prompt to build the site.";

export const metadata: Metadata = pageMeta({ title: TITLE, description: DESCRIPTION, path: "/free-website-design" });

export default function FreeWebsiteDesignPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="h1">{TITLE}</h1>
          <p className="lead">
            Pick your kind of business to get free section designs with HTML, CSS &amp; React code and a ready-made AI prompt for the whole website.
          </p>
        </div>
      </div>

      <div className="cat-grid">
        {SERVICES.map((s) => (
          <Link key={s.slug} href={servicePath(s.slug)} className="cat-tile">
            <span className="icon-tile">
              <span className="seo-glyph" aria-hidden="true">
                {s.icon}
              </span>
            </span>
            <span className="label">{s.name}</span>
            <span className="count">Designs, code &amp; AI prompt</span>
          </Link>
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESCRIPTION,
          url: absoluteUrl("/free-website-design"),
          inLanguage: "en-IN",
          isPartOf: { "@id": IDS.website },
          hasPart: SERVICES.map((s) => ({ "@type": "WebPage", name: serviceSeo(s).h1, url: absoluteUrl(servicePath(s.slug)) })),
        }}
      />
    </>
  );
}
