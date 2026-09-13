import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DesignCollection from "@/components/DesignCollection";
import { ASSETS } from "@/data";
import { COLLECTIONS, collectionDescription, collectionPath, pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

const resolve = (slug: string) => {
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  return collection ? { collection, assets: ASSETS.filter(collection.filter) } : null;
};
const available = () => COLLECTIONS.filter((c) => ASSETS.some(c.filter));

export function generateStaticParams() {
  return available().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = resolve((await params).slug);
  if (!found?.assets.length) return {};
  return pageMeta({
    title: found.collection.title,
    description: collectionDescription(found.collection, found.assets),
    path: collectionPath(found.collection.slug),
  });
}

export default async function CollectionPage({ params }: Props) {
  const found = resolve((await params).slug);
  if (!found?.assets.length) notFound();
  const { collection, assets } = found;

  return (
    <DesignCollection
      path={collectionPath(collection.slug)}
      crumb={collection.h1}
      h1={collection.h1}
      title={collection.title}
      description={collectionDescription(collection, assets)}
      assets={assets}
      libraryHref="/library"
      relatedTitle="More by code & library"
      related={available()
        .filter((c) => c.slug !== collection.slug)
        .map((c) => ({ href: collectionPath(c.slug), label: c.h1 }))}
    />
  );
}
