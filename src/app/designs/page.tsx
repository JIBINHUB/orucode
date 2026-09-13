import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { ASSETS } from "@/data";
import {
  COLLECTIONS,
  IDS,
  KIND_LABELS,
  absoluteUrl,
  categorySeo,
  collectionPath,
  designsPath,
  pageMeta,
} from "@/lib/seo";
import { SERVICES, servicePath } from "@/lib/services";
import { CATEGORIES } from "@/lib/taxonomy";

const TITLE = "Website Section Designs, UI Components & Animations by Category";
const DESCRIPTION = `Browse ${ASSETS.length} free designs by category — hero sections, navbars, pricing, testimonials, footers, full pages, buttons, loading animations and React components, all with live previews and copy-ready code.`;

export const metadata: Metadata = pageMeta({ title: TITLE, description: DESCRIPTION, path: "/designs" });

const GROUPS = ["section", "page", "component", "animation"] as const;

export default function DesignsPage() {
  const present = CATEGORIES.map((c) => ({ c, assets: ASSETS.filter((a) => a.category === c.id) })).filter(
    (x) => x.assets.length,
  );
  const collections = COLLECTIONS.map((c) => ({ c, n: ASSETS.filter(c.filter).length })).filter((x) => x.n);

  const tile = (href: string, glyph: string, label: string, n: number) => (
    <Link key={href} href={href} className="cat-tile">
      <span className="icon-tile">
        <span className="seo-glyph" aria-hidden="true">
          {glyph}
        </span>
      </span>
      <span className="label">{label}</span>
      <span className="count">
        {n} {n === 1 ? "design" : "designs"}
      </span>
    </Link>
  );

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="h1">Website designs by category</h1>
          <p className="lead">
            Every section, component and animation in ORU CODE — pick a category to see live previews with copy-ready code.
          </p>
        </div>
      </div>

      {GROUPS.map((kind) => {
        const group = present.filter((x) => x.c.kind === kind);
        if (!group.length) return null;
        return (
          <section key={kind} className="section seo-group">
            <h2 className="seo-h2 cap">{KIND_LABELS[kind]}</h2>
            <div className="cat-grid">
              {group.map(({ c, assets }) => tile(designsPath(c.id), c.glyph, categorySeo(c.id, assets).h1, assets.length))}
            </div>
          </section>
        );
      })}

      <section className="section seo-group">
        <h2 className="seo-h2">By code &amp; library</h2>
        <div className="cat-grid">{collections.map(({ c, n }) => tile(collectionPath(c.slug), c.glyph, c.h1, n))}</div>
      </section>

      <section className="section seo-group">
        <div className="svc-cat-head">
          <h2 className="seo-h2">Free website designs by business</h2>
          <Link href="/free-website-design" className="seo-link">
            See all →
          </Link>
        </div>
        <div className="seo-links">
          {SERVICES.map((s) => (
            <Link key={s.slug} href={servicePath(s.slug)} className="chip">
              {s.icon} {s.name}
            </Link>
          ))}
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESCRIPTION,
          url: absoluteUrl("/designs"),
          inLanguage: "en-IN",
          isPartOf: { "@id": IDS.website },
          hasPart: [
            ...present.map(({ c, assets }) => ({
              "@type": "CollectionPage",
              name: categorySeo(c.id, assets).h1,
              url: absoluteUrl(designsPath(c.id)),
            })),
            ...collections.map(({ c }) => ({ "@type": "CollectionPage", name: c.h1, url: absoluteUrl(collectionPath(c.slug)) })),
          ],
        }}
      />
    </>
  );
}
