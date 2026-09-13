import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AssetCard from "@/components/AssetCard";
import CopyPrompt from "@/components/CopyPrompt";
import JsonLd from "@/components/JsonLd";
import { ASSETS } from "@/data";
import { IDS, SITE_URL, STUDIO, absoluteUrl, categorySeo, designsPath, pageMeta } from "@/lib/seo";
import { SERVICES, servicePath, servicePrompt, serviceSeo } from "@/lib/services";
import type { Asset } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

const find = (slug: string) => SERVICES.find((s) => s.slug === slug);
const best = (assets: Asset[]) =>
  [...assets].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.added.localeCompare(a.added));

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = find((await params).slug);
  if (!s) return {};
  const seo = serviceSeo(s);
  return pageMeta({ title: seo.title, description: seo.description, path: servicePath(s.slug) });
}

export default async function ServicePage({ params }: Props) {
  const s = find((await params).slug);
  if (!s) notFound();

  const seo = serviceSeo(s);
  const lower = s.name.toLowerCase();
  const url = absoluteUrl(servicePath(s.slug));
  const groups = s.picks
    .map((id) => ({ id, all: ASSETS.filter((a) => a.category === id) }))
    .filter((g) => g.all.length);

  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/free-website-design">Free website designs</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{s.name}</span>
      </nav>

      <div className="page-head">
        <div>
          <h1 className="h1">{seo.h1}</h1>
          <p className="lead">{seo.description}</p>
        </div>
      </div>

      <section className="section seo-group">
        <h2 className="seo-h2">What a {lower} website needs</h2>
        <ul className="svc-needs">
          {s.needs.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>

      <section className="section seo-group">
        <h2 className="seo-h2">Free AI prompt for your {lower} website</h2>
        <p className="svc-note">
          Paste it into Cursor, Claude Code, Lovable, v0 or any AI website builder, then swap in your business name, city and details.
        </p>
        <CopyPrompt text={servicePrompt(s)} />
      </section>

      {groups.map((g) => {
        const cs = categorySeo(g.id, g.all);
        return (
          <section key={g.id} className="section seo-group">
            <div className="svc-cat-head">
              <h2 className="seo-h2">Free {cs.h1.toLowerCase()}</h2>
              <Link href={designsPath(g.id)} className="seo-link">
                All {g.all.length} →
              </Link>
            </div>
            <div className="grid-cards">
              {best(g.all)
                .slice(0, 3)
                .map((a) => (
                  <AssetCard key={a.id} asset={a} />
                ))}
            </div>
          </section>
        );
      })}

      <section className="section seo-group svc-cta">
        <h2 className="seo-h2">Want your {lower} website built for you?</h2>
        <p>
          Leaf Creationism, the studio behind ORU CODE, designs and builds websites for businesses in Kerala and across India.
        </p>
        <a href={STUDIO.url} target="_blank" rel="noreferrer" className="btn btn-primary">
          Talk to Leaf Creationism
        </a>
      </section>

      <section className="section seo-group">
        <h2 className="seo-h2">Free website designs for other businesses</h2>
        <div className="seo-links">
          {SERVICES.filter((o) => o.slug !== s.slug).map((o) => (
            <Link key={o.slug} href={servicePath(o.slug)} className="chip">
              {o.icon} {o.name}
            </Link>
          ))}
        </div>
      </section>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: seo.title,
            description: seo.description,
            url,
            inLanguage: "en-IN",
            isPartOf: { "@id": IDS.website },
            about: `${s.name} website design`,
            isAccessibleForFree: true,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Free website designs", item: absoluteUrl("/free-website-design") },
              { "@type": "ListItem", position: 3, name: seo.h1, item: url },
            ],
          },
        ]}
      />
    </>
  );
}
