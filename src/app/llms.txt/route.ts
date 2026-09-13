import { ASSETS } from "@/data";
import {
  COLLECTIONS,
  OWNER,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  STUDIO,
  absoluteUrl,
  categorySeo,
  collectionDescription,
  collectionPath,
  designsPath,
} from "@/lib/seo";
import { SERVICES, servicePath, serviceSeo } from "@/lib/services";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/taxonomy";

export const dynamic = "force-static";

/** A plain-text map of the site for AI assistants and answer engines (llmstxt.org). */
export function GET() {
  const categories = CATEGORIES.map((c) => ({ c, assets: ASSETS.filter((a) => a.category === c.id) })).filter(
    (x) => x.assets.length,
  );
  const collections = COLLECTIONS.map((c) => ({ c, assets: ASSETS.filter(c.filter) })).filter((x) => x.assets.length);

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${SITE_NAME} is made by ${OWNER.name}, a designer and developer in Kerala, India, and is part of ${STUDIO.name} (${STUDIO.url}), a studio that designs and builds websites and apps for businesses in Kerala and across India. Every design has a live preview and copy-ready code that people and AI coding tools (Cursor, Claude Code, Lovable, v0) can adapt. Designs imported from open-source libraries keep their original MIT licence and credit.`,
    "",
    "## Design categories",
    ...categories.map(({ c, assets }) => {
      const seo = categorySeo(c.id, assets);
      return `- [${seo.h1}](${absoluteUrl(designsPath(c.id))}): ${seo.description}`;
    }),
    "",
    "## By code and animation library",
    ...collections.map(({ c, assets }) => `- [${c.h1}](${absoluteUrl(collectionPath(c.slug))}): ${collectionDescription(c, assets)}`),
    "",
    "## Free website designs by business type",
    ...SERVICES.map((s) => `- [${serviceSeo(s).h1}](${absoluteUrl(servicePath(s.slug))}): ${serviceSeo(s).description}`),
    "",
    "## Key pages",
    `- [Home](${SITE_URL}/): overview, featured designs and FAQ`,
    `- [All designs by category](${absoluteUrl("/designs")})`,
    `- [Library with search and filters](${absoluteUrl("/library")})`,
    `- [Website prompts](${absoluteUrl("/prompts")}): detailed website briefs for AI coding tools`,
    `- [About the developer](${absoluteUrl("/developer")})`,
    "",
    "## Designs",
    ...ASSETS.map((a) => `- [${a.title}](${absoluteUrl(`/asset/${a.id}`)}): ${CATEGORY_MAP[a.category].label}. ${a.description}`),
    "",
    "## Contact",
    `- Email: ${OWNER.email}`,
    `- Website and app projects in Kerala and India: ${STUDIO.url}`,
    "",
  ];

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
