import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AssetDetail from "@/components/views/AssetDetail";
import { ASSETS, getAsset } from "@/data";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ASSETS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const asset = getAsset((await params).id);
  return asset ? { title: asset.title, description: asset.description } : {};
}

export default async function AssetPage({ params }: Props) {
  const { id } = await params;
  if (!getAsset(id)) notFound();
  return <AssetDetail key={id} id={id} />;
}
