import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import AssetDetail from "@/components/views/AssetDetail";
import { ASSETS, getAsset } from "@/data";
import { IDS, SITE_URL, absoluteUrl, assetSeo, categorySeo, designsPath, pageMeta } from "@/lib/seo";
import { CATEGORY_MAP } from "@/lib/taxonomy";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ASSETS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const asset = getAsset((await params).id);
  if (!asset) return {};
  const seo = assetSeo(asset);
  return pageMeta({ title: seo.title, description: seo.description, path: `/asset/${asset.id}`, keywords: asset.tags });
}

export default async function AssetPage({ params }: Props) {
  const { id } = await params;
  const asset = getAsset(id);
  if (!asset) notFound();

  const seo = assetSeo(asset);
  const url = absoluteUrl(`/asset/${asset.id}`);
  const category = categorySeo(asset.category, ASSETS.filter((a) => a.category === asset.category));
  const credit = asset.credit;

  return (
    <>
      <AssetDetail key={id} id={id} />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            name: asset.title,
            description: seo.description,
            url,
            inLanguage: "en-IN",
            codeSampleType: "code snippet",
            programmingLanguage: [...(asset.html ? ["HTML", "CSS"] : []), ...(asset.react ? ["JavaScript", "React"] : [])],
            runtimePlatform: "Web browser",
            genre: CATEGORY_MAP[asset.category].label,
            keywords: asset.tags.join(", "),
            dateCreated: asset.added,
            isAccessibleForFree: true,
            isPartOf: { "@id": IDS.website },
            publisher: { "@id": IDS.organization },
            author: credit ? { "@type": "Person", name: credit.author, url: credit.url } : { "@id": IDS.person },
            ...(credit ? { isBasedOn: credit.url } : {}),
            ...(credit && /mit/i.test(credit.license) ? { license: "https://opensource.org/licenses/MIT" } : {}),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Designs", item: absoluteUrl("/designs") },
              { "@type": "ListItem", position: 3, name: category.h1, item: absoluteUrl(designsPath(asset.category)) },
              { "@type": "ListItem", position: 4, name: asset.title, item: url },
            ],
          },
        ]}
      />
    </>
  );
}
