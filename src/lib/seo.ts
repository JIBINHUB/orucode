import type { Metadata } from "next";
import { CATEGORY_MAP, LIBRARY_MAP } from "./taxonomy";
import type { Asset, CategoryId } from "./types";

/** The one address search engines should index; every canonical URL, the sitemap and llms.txt follow it. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://orucode.online").replace(/\/+$/, "");
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
export const SITE_NAME = "ORU CODE";
export const SITE_TITLE = "ORU CODE — Free Website Designs, UI Components & Animations";
export const SITE_DESCRIPTION =
  "ORU CODE is a free website design library made in Kerala, India: hero sections, navbars, pricing, footers, loading animations and React components with copy-ready HTML, CSS and React code — plus free website designs and AI prompts for every kind of business.";

export const OWNER = {
  name: "Jibin Chacko",
  email: "jibinchackoarpookara@gmail.com",
  telegram: "https://t.me/jibinchacko",
};
export const STUDIO = { name: "Leaf Creationism", url: "https://leafcreationism.in" };

export const IDS = {
  website: `${SITE_URL}/#website`,
  organization: `${SITE_URL}/#organization`,
  person: `${SITE_URL}/#jibin`,
};

export const KEYWORDS = [
  "ORU CODE",
  "orucode",
  "free website design",
  "free website templates",
  "free landing page design",
  "free website design for small business",
  "free website design Kerala",
  "website section designs",
  "website design ideas",
  "hero section design",
  "navbar design",
  "pricing section design",
  "testimonial section design",
  "footer design",
  "landing page design",
  "full website templates",
  "UI components",
  "UI design library",
  "loading animations",
  "CSS animations",
  "React components",
  "React animation library",
  "Framer Motion examples",
  "GSAP animation examples",
  "Tailwind CSS components",
  "copy paste UI code",
  "free HTML CSS code",
  "vibe coding",
  "UI components for vibe coding",
  "website prompts for AI",
  "web design Kerala",
  "website design Kerala",
  "web design India",
  "UI UX design India",
  "Leaf Creationism",
];

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
export const designsPath = (id: CategoryId) => `/designs/${id}`;
export const collectionPath = (slug: string) => `/code/${slug}`;

/** The root opengraph-image; named here because a page's own openGraph drops the inherited one. */
export const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "ORU CODE — free website section designs, UI components and animations with code",
};

/** Per-page metadata with a canonical URL; openGraph is repeated because Next replaces it wholesale per page. */
export function pageMeta({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const full = `${title} · ${SITE_NAME}`;
  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN", url: path, title: full, description, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title: full, description, images: [SHARE_IMAGE.url] },
  };
}

export const listJoin = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/** Singular, search-style name per category — how people actually type it ("hero section designs"). */
const SEO_NAMES: Record<CategoryId, string> = {
  loaders: "Loading Animation",
  logos: "Logo Animation",
  text: "Text Animation",
  interactions: "Micro-interaction",
  buttons: "Button",
  inputs: "Input Field",
  toggles: "Toggle Switch",
  checkboxes: "Checkbox",
  radios: "Radio Button",
  tooltips: "Tooltip",
  marquee: "Marquee & Slider",
  patterns: "Background Pattern",
  notifications: "Notification",
  navbars: "Navbar",
  heroes: "Hero Section",
  features: "Features Section",
  pricing: "Pricing Section",
  testimonials: "Testimonial Section",
  stats: "Stats Section",
  cta: "Call to Action Section",
  faq: "FAQ Section",
  contact: "Contact Form",
  cards: "Card",
  footers: "Footer",
  pages: "Full Website Page",
};

export const categorySeoName = (id: CategoryId) => SEO_NAMES[id];

export const KIND_LABELS = {
  section: "website sections",
  page: "full pages",
  component: "UI components",
  animation: "animations",
} as const;

const codeLabel = (assets: Asset[]) => {
  const html = assets.some((a) => a.html);
  const react = assets.some((a) => a.react);
  return html && react ? "HTML, CSS & React" : react ? "React" : "HTML & CSS";
};

export function categorySeo(id: CategoryId, assets: Asset[]) {
  const name = SEO_NAMES[id];
  const code = codeLabel(assets);
  const n = assets.length;
  return {
    name,
    h1: `${name} Designs`,
    title: `${name} Designs — Free ${code} Code`,
    description: `${n} free ${name.toLowerCase()} ${n === 1 ? "design" : "designs"} for websites, each with a live preview and copy-ready ${code} code. ${CATEGORY_MAP[id].blurb}`,
  };
}

export function assetSeo(asset: Asset) {
  const name = SEO_NAMES[asset.category].toLowerCase();
  const fws = [asset.html && "HTML/CSS", asset.react && "React"].filter(Boolean).join(" & ");
  const libs = asset.libraries.map((l) => LIBRARY_MAP[l].label).join(", ");
  const credit = asset.credit
    ? ` Originally by ${asset.credit.author} on ${asset.credit.source} (${asset.credit.license} licence).`
    : "";
  return {
    title: `${asset.title} — Free ${fws} ${SEO_NAMES[asset.category]} Code`,
    description: `${asset.title} is a free ${name} design with a live preview and copy-ready ${fws} code built with ${libs}. ${asset.description}${credit}`,
  };
}

/** Landing pages for how people search by technology ("framer motion examples", "tailwind components"). */
export interface Collection {
  slug: string;
  glyph: string;
  h1: string;
  title: string;
  noun: string;
  filter: (a: Asset) => boolean;
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "react-components",
    glyph: "⚛",
    h1: "React Components & Animations",
    title: "Free React Components & Animations — Copy-Paste Code",
    noun: "React components and animations",
    filter: (a) => !!a.react && a.react !== "auto",
  },
  {
    slug: "tailwind-components",
    glyph: "≈",
    h1: "Tailwind CSS Components",
    title: "Free Tailwind CSS Components — React Code with Live Previews",
    noun: "Tailwind CSS components",
    filter: (a) => !!a.tailwind,
  },
  {
    slug: "gsap-animations",
    glyph: "G",
    h1: "GSAP Animation Examples",
    title: "GSAP Animation Examples — Free Code for Websites",
    noun: "GSAP animations",
    filter: (a) => a.libraries.includes("gsap"),
  },
  {
    slug: "framer-motion-animations",
    glyph: "M",
    h1: "Framer Motion Animation Examples",
    title: "Framer Motion Examples — Free React Animation Code",
    noun: "Framer Motion animations",
    filter: (a) => a.libraries.includes("framer-motion"),
  },
  {
    slug: "anime-js-animations",
    glyph: "A",
    h1: "anime.js Animation Examples",
    title: "anime.js Animation Examples — Free JavaScript Code",
    noun: "anime.js animations",
    filter: (a) => a.libraries.includes("anime"),
  },
  {
    slug: "css-animations",
    glyph: "#",
    h1: "Pure CSS Animations & UI Designs",
    title: "Pure CSS Animations & UI Designs — Free HTML & CSS Code",
    noun: "pure CSS animations and UI designs",
    filter: (a) => a.libraries.includes("css"),
  },
];

export function collectionDescription(c: Collection, assets: Asset[]) {
  const counts = new Map<CategoryId, number>();
  for (const a of assets) counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => CATEGORY_MAP[id].label.toLowerCase());
  return `${assets.length} free ${c.noun} with live previews and copy-ready code${top.length ? `, including ${listJoin(top)}` : ""}. Paste them into your project or hand them to an AI coding tool like Cursor, Claude Code, Lovable or v0.`;
}

/** Shown on the home page and mirrored in FAQPage structured data — keep both identical. */
export const FAQS: { q: string; a: string }[] = [
  {
    q: "What is ORU CODE?",
    a: "ORU CODE is a free website design library. It collects website section designs — hero sections, navbars, pricing tables, testimonials, FAQs, footers and full pages — plus UI components like buttons, inputs, toggles and cards, and animations such as loading animations, text and logo animations. Every design has a live preview and copy-ready code.",
  },
  {
    q: "Is ORU CODE free to use?",
    a: "Yes. Browsing, previewing and copying code is free, with no sign-up. Designs imported from open-source libraries keep their original MIT licence and credit, which is shown on each design page.",
  },
  {
    q: "What code do the designs come with?",
    a: "Each design comes with HTML and CSS or React code, and many React components use Tailwind CSS. Animations are built with GSAP, anime.js, Framer Motion or pure CSS, so you can paste them straight into your own website.",
  },
  {
    q: "Can I use ORU CODE with AI coding tools like Cursor, Claude Code, Lovable or v0?",
    a: "Yes. Copy any design’s HTML, CSS or React code — or a full website brief from the Prompts page — and paste it into your AI coding tool as a starting point or reference. The code is readable and framework-light, so it’s easy for you or your AI tool to adapt it to your project.",
  },
  {
    q: "Can I get a free website design for my business?",
    a: "Yes. ORU CODE has free website design pages for restaurants, resorts and homestays, Ayurveda centres, clinics, schools, real estate, salons, gyms, online stores and many more businesses — each with recommended free section designs, copy-ready code and an AI prompt to build the whole site. If you’d rather have it built for you, Leaf Creationism builds websites for businesses in Kerala and across India.",
  },
  {
    q: "Who made ORU CODE?",
    a: "ORU CODE was made by Jibin Chacko, a designer and developer from Kerala, India, and is part of Leaf Creationism, a studio that designs and builds websites and apps. “Oru” (ഒരു) is the Malayalam word for “one”.",
  },
  {
    q: "Can I use these designs in client or commercial projects?",
    a: "Designs made for ORU CODE are free to copy, remix and ship. Imported designs are MIT-licensed, which allows commercial use as long as the licence comment stays in the code — each design page shows its source and licence.",
  },
  {
    q: "I need a website or app built in Kerala or India. Who can help?",
    a: "Leaf Creationism, the studio behind ORU CODE, designs and builds websites and apps for businesses in Kerala and across India. Visit leafcreationism.in or email jibinchackoarpookara@gmail.com.",
  },
];
