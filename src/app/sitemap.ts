import type { MetadataRoute } from "next";
import { ASSETS, CATEGORY_COUNTS } from "@/data";
import { COLLECTIONS, absoluteUrl, collectionPath, designsPath } from "@/lib/seo";
import { SERVICES, servicePath } from "@/lib/services";
import { CATEGORIES } from "@/lib/taxonomy";

type Freq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = ASSETS.reduce((max, a) => (a.added > max ? a.added : max), "2026-01-01");
  const page = (path: string, priority: number, changeFrequency: Freq, lastModified = latest) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/designs", 0.9, "weekly"),
    page("/free-website-design", 0.9, "weekly"),
    ...SERVICES.map((s) => page(servicePath(s.slug), 0.8, "monthly")),
    page("/library", 0.8, "weekly"),
    page("/prompts", 0.7, "monthly"),
    page("/playground", 0.4, "monthly"),
    page("/developer", 0.5, "monthly"),
    ...CATEGORIES.filter((c) => CATEGORY_COUNTS[c.id]).map((c) => page(designsPath(c.id), 0.9, "weekly")),
    ...COLLECTIONS.filter((c) => ASSETS.some(c.filter)).map((c) => page(collectionPath(c.slug), 0.9, "weekly")),
    ...ASSETS.map((a) => page(`/asset/${a.id}`, 0.7, "monthly", a.added)),
  ];
}
