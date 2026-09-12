export type LibraryId = "gsap" | "anime" | "framer-motion" | "css";
export type FrameworkId = "html" | "react";
export type Complexity = "basic" | "intermediate" | "advanced";
export type Tone = "dark" | "light";
export type AssetKind = "animation" | "component" | "section" | "page";

export type CategoryId =
  | "loaders"
  | "logos"
  | "text"
  | "interactions"
  | "buttons"
  | "inputs"
  | "toggles"
  | "checkboxes"
  | "radios"
  | "tooltips"
  | "marquee"
  | "patterns"
  | "notifications"
  | "navbars"
  | "heroes"
  | "features"
  | "pricing"
  | "testimonials"
  | "stats"
  | "cta"
  | "faq"
  | "contact"
  | "cards"
  | "footers"
  | "pages";

export interface HtmlVariant {
  html: string;
  css: string;
  js?: string;
}

export interface ReactVariant {
  /** Contents of App.jsx. Must `export default` a component. */
  code: string;
  /** Contents of styles.css (imported by App.jsx as "./styles.css"). */
  css?: string;
}

export interface Asset {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  libraries: LibraryId[];
  tags: string[];
  complexity: Complexity;
  tone: Tone;
  /** ISO date the asset was added — drives "Newest" sorting. */
  added: string;
  featured?: boolean;
  html?: HtmlVariant;
  /** "auto" derives a React component from the HTML variant. */
  react?: ReactVariant | "auto";
  /** Natural height (px, at 1280px width) used to frame the card thumbnail. */
  height?: number;
  /** Website prompt this layout pairs with. */
  promptId?: string;
  /** Original author and license for designs imported from third-party libraries. */
  credit?: AssetCredit;
  /** Loads a Tailwind CSS engine into the preview so the React variant's utility classes resolve. */
  tailwind?: boolean;
}

export interface AssetCredit {
  author: string;
  /** Link to the original element. */
  url: string;
  source: string;
  license: string;
}

export interface WebsitePrompt {
  id: string;
  title: string;
  industry: string;
  tags: string[];
  complexity: Complexity;
  libraries: LibraryId[];
  sections: string[];
  prompt: string;
  relatedAssetIds?: string[];
  added: string;
}
