import type { AssetKind, CategoryId, Complexity, FrameworkId, LibraryId, Tone } from "./types";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  kind: AssetKind;
  blurb: string;
  glyph: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: "loaders", label: "Loading Screens", kind: "animation", glyph: "◌", blurb: "Preloaders, progress counters and curtain reveals." },
  { id: "logos", label: "Logo Animations", kind: "animation", glyph: "✦", blurb: "SVG line-draws, morphs and staggered wordmarks." },
  { id: "text", label: "Text Animations", kind: "animation", glyph: "𝐀", blurb: "Flip, stagger, morph and glitch text effects." },
  { id: "interactions", label: "Micro-interactions", kind: "animation", glyph: "⌖", blurb: "Magnetic buttons, cursors, toggles and hover states." },
  { id: "buttons", label: "Buttons", kind: "component", glyph: "▭", blurb: "Hover, glow, 3D and animated button styles." },
  { id: "inputs", label: "Inputs", kind: "component", glyph: "⌨", blurb: "Text fields, search bars and floating labels." },
  { id: "toggles", label: "Toggle Switches", kind: "component", glyph: "◐", blurb: "On/off switches with playful transitions." },
  { id: "checkboxes", label: "Checkboxes", kind: "component", glyph: "☑", blurb: "Animated ticks, crosses and custom boxes." },
  { id: "radios", label: "Radio Buttons", kind: "component", glyph: "◉", blurb: "Single-choice groups and segmented pickers." },
  { id: "tooltips", label: "Tooltips", kind: "component", glyph: "💬", blurb: "Hover hints, popovers and labels." },
  { id: "marquee", label: "Marquees & Sliders", kind: "component", glyph: "≋", blurb: "Infinite logo strips, stacked avatars and content marquees." },
  { id: "patterns", label: "Patterns", kind: "component", glyph: "▦", blurb: "Pure-CSS background textures and grids." },
  { id: "notifications", label: "Notifications", kind: "component", glyph: "🔔", blurb: "Toasts, alerts and status banners." },
  { id: "navbars", label: "Navigation", kind: "section", glyph: "☰", blurb: "Headers, floating docks and full-screen menus." },
  { id: "heroes", label: "Hero Sections", kind: "section", glyph: "◧", blurb: "First impressions: split, centered, kinetic and 3D." },
  { id: "features", label: "Features", kind: "section", glyph: "▦", blurb: "Bento grids, icon lists and alternating rows." },
  { id: "pricing", label: "Pricing", kind: "section", glyph: "$", blurb: "Tiers, toggles and comparison tables." },
  { id: "testimonials", label: "Testimonials", kind: "section", glyph: "❝", blurb: "Marquees, carousels and quote walls." },
  { id: "stats", label: "Stats & Counters", kind: "section", glyph: "#", blurb: "Animated numbers and KPI strips." },
  { id: "cta", label: "Call to Action", kind: "section", glyph: "→", blurb: "Conversion banners and newsletter blocks." },
  { id: "faq", label: "FAQ", kind: "section", glyph: "?", blurb: "Accordions and two-column Q&A layouts." },
  { id: "contact", label: "Contact & Forms", kind: "section", glyph: "✉", blurb: "Contact forms, floating labels and sign-ups." },
  { id: "cards", label: "Cards", kind: "section", glyph: "▢", blurb: "Tilt, flip, spotlight and product cards." },
  { id: "footers", label: "Footers", kind: "section", glyph: "▁", blurb: "Curtain reveals, magnetic links and giant wordmarks." },
  { id: "pages", label: "Full Pages", kind: "page", glyph: "▤", blurb: "Complete, responsive website layouts." },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  CategoryMeta
>;

export interface LibraryMeta {
  id: LibraryId;
  label: string;
  color: string;
  blurb: string;
  install: string;
  docs: string;
}

export const LIBRARIES: LibraryMeta[] = [
  {
    id: "gsap",
    label: "GSAP",
    color: "#ff3131",
    blurb: "Timeline-driven motion, ScrollTrigger and buttery easing for loaders and page reveals.",
    install: "npm install gsap",
    docs: "https://gsap.com/docs/v3/",
  },
  {
    id: "anime",
    label: "anime.js",
    color: "#ff8a3d",
    blurb: "Lightweight SVG line-drawing, staggering and morphing — ideal for logo animations.",
    install: "npm install animejs@3",
    docs: "https://animejs.com/documentation/",
  },
  {
    id: "framer-motion",
    label: "Framer Motion",
    color: "#1c1c1e",
    blurb: "Declarative React motion: layout animations, gestures, scroll-linked values and exit transitions.",
    install: "npm install framer-motion",
    docs: "https://motion.dev/docs/react",
  },
  {
    id: "css",
    label: "Pure CSS",
    color: "#a1a1aa",
    blurb: "Keyframes, transitions and custom properties. Zero dependencies, maximum portability.",
    install: "No install needed",
    docs: "https://developer.mozilla.org/docs/Web/CSS/CSS_animations",
  },
];

export const LIBRARY_MAP = Object.fromEntries(LIBRARIES.map((l) => [l.id, l])) as Record<
  LibraryId,
  LibraryMeta
>;

export const FRAMEWORKS: { id: FrameworkId; label: string }[] = [
  { id: "html", label: "HTML / CSS" },
  { id: "react", label: "React" },
];

export const COMPLEXITIES: { id: Complexity; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export const TONES: { id: Tone; label: string }[] = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
];

export const KINDS: { id: AssetKind; label: string }[] = [
  { id: "animation", label: "Animations" },
  { id: "component", label: "Components" },
  { id: "section", label: "Sections" },
  { id: "page", label: "Full pages" },
];
