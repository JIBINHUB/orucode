import Link from "next/link";
import AssetCard from "./AssetCard";
import JsonLd from "./JsonLd";
import { IDS, SITE_URL, absoluteUrl } from "@/lib/seo";
import type { Asset } from "@/lib/types";

type LinkItem = { href: string; label: string };

/** Server-rendered landing page for a group of designs: crawlable heading, copy, cards and structured data. */
export default function DesignCollection({
  path,
  crumb,
  h1,
  title,
  description,
  assets,
  libraryHref,
  relatedTitle,
  related,
}: {
  path: string;
  crumb: string;
  h1: string;
  title: string;
  description: string;
  assets: Asset[];
  libraryHref: string;
  relatedTitle: string;
  related: LinkItem[];
}) {
  const url = absoluteUrl(path);
  const sorted = [...assets].sort(
    (a, b) => Number(!!b.featured) - Number(!!a.featured) || b.added.localeCompare(a.added),
  );

  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/designs">Designs</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{crumb}</span>
      </nav>

      <div className="page-head">
        <div>
          <h1 className="h1">{h1}</h1>
          <p className="lead">{description}</p>
        </div>
      </div>

      <div className="result-line seo-bar">
        <span>
          {assets.length} {assets.length === 1 ? "design" : "designs"}
        </span>
        <Link href={libraryHref} className="seo-link">
          Search &amp; filter in the library →
        </Link>
      </div>

      <div className="grid-cards">
        {sorted.map((a) => (
          <AssetCard key={a.id} asset={a} />
        ))}
      </div>

      {related.length > 0 && (
        <section className="section seo-group">
          <h2 className="seo-h2 cap">{relatedTitle}</h2>
          <div className="seo-links">
            {related.map((r) => (
              <Link key={r.href} href={r.href} className="chip">
                {r.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url,
            inLanguage: "en-IN",
            isPartOf: { "@id": IDS.website },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: sorted.length,
              itemListElement: sorted.map((a, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: a.title,
                url: absoluteUrl(`/asset/${a.id}`),
              })),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Designs", item: absoluteUrl("/designs") },
              { "@type": "ListItem", position: 3, name: h1, item: url },
            ],
          },
        ]}
      />
    </>
  );
}
