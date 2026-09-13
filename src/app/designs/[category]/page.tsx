import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DesignCollection from "@/components/DesignCollection";
import { ASSETS } from "@/data";
import { KIND_LABELS, categorySeo, designsPath, pageMeta } from "@/lib/seo";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/taxonomy";
import type { CategoryId } from "@/lib/types";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

const inCategory = (id: string) => ASSETS.filter((a) => a.category === id);

export function generateStaticParams() {
  return CATEGORIES.filter((c) => inCategory(c.id).length).map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const assets = inCategory(category);
  if (!assets.length) return {};
  const id = category as CategoryId;
  const seo = categorySeo(id, assets);
  return pageMeta({ title: seo.title, description: seo.description, path: designsPath(id) });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const assets = inCategory(category);
  if (!assets.length) notFound();

  const id = category as CategoryId;
  const meta = CATEGORY_MAP[id];
  const seo = categorySeo(id, assets);

  return (
    <DesignCollection
      path={designsPath(id)}
      crumb={meta.label}
      h1={seo.h1}
      title={seo.title}
      description={seo.description}
      assets={assets}
      libraryHref={`/library?cat=${id}`}
      relatedTitle={`More ${KIND_LABELS[meta.kind]}`}
      related={CATEGORIES.filter((c) => c.id !== id && c.kind === meta.kind && inCategory(c.id).length).map((c) => ({
        href: designsPath(c.id),
        label: categorySeo(c.id, inCategory(c.id)).h1,
      }))}
    />
  );
}
