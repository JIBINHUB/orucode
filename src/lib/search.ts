import Fuse from "fuse.js";
import { CATEGORY_MAP, LIBRARY_MAP } from "./taxonomy";
import type {
  Asset,
  AssetKind,
  CategoryId,
  Complexity,
  FrameworkId,
  LibraryId,
  Tone,
  WebsitePrompt,
} from "./types";

export type SortId = "featured" | "newest" | "az";

export interface FilterState {
  q: string;
  cats: CategoryId[];
  libs: LibraryId[];
  fws: FrameworkId[];
  levels: Complexity[];
  tones: Tone[];
  kind: AssetKind | "all";
  sort: SortId;
}

export type Facet = "cats" | "libs" | "fws" | "levels" | "tones" | "kind";

export const DEFAULT_FILTERS: FilterState = {
  q: "",
  cats: [],
  libs: [],
  fws: [],
  levels: [],
  tones: [],
  kind: "all",
  sort: "featured",
};

const list = <T extends string>(v: string | null): T[] =>
  v ? (v.split(",").filter(Boolean) as T[]) : [];

export function parseFilters(params: { get(name: string): string | null }): FilterState {
  const kind = params.get("kind");
  const sort = params.get("sort");
  return {
    q: params.get("q") ?? "",
    cats: list<CategoryId>(params.get("cat")),
    libs: list<LibraryId>(params.get("lib")),
    fws: list<FrameworkId>(params.get("fw")),
    levels: list<Complexity>(params.get("level")),
    tones: list<Tone>(params.get("tone")),
    kind: kind === "animation" || kind === "component" || kind === "section" || kind === "page" ? kind : "all",
    sort: sort === "newest" || sort === "az" ? sort : "featured",
  };
}

export function filtersToQuery(s: FilterState): string {
  const p = new URLSearchParams();
  if (s.q) p.set("q", s.q);
  if (s.cats.length) p.set("cat", s.cats.join(","));
  if (s.libs.length) p.set("lib", s.libs.join(","));
  if (s.fws.length) p.set("fw", s.fws.join(","));
  if (s.levels.length) p.set("level", s.levels.join(","));
  if (s.tones.length) p.set("tone", s.tones.join(","));
  if (s.kind !== "all") p.set("kind", s.kind);
  if (s.sort !== "featured") p.set("sort", s.sort);
  return p.toString();
}

export const activeFilterCount = (s: FilterState) =>
  s.cats.length + s.libs.length + s.fws.length + s.levels.length + s.tones.length + (s.kind !== "all" ? 1 : 0);

export const assetFrameworks = (a: Asset): FrameworkId[] => {
  const out: FrameworkId[] = [];
  if (a.html) out.push("html");
  if (a.react) out.push("react");
  return out;
};

const fuseCache = new WeakMap<object, Fuse<Record<string, unknown>>>();

function fuseFor<T extends object>(items: T[], toDoc: (item: T) => Record<string, unknown>, keys: { name: string; weight: number }[]) {
  let fuse = fuseCache.get(items);
  if (!fuse) {
    fuse = new Fuse(items.map(toDoc), { keys, threshold: 0.36, ignoreLocation: true, includeScore: true, minMatchCharLength: 2 });
    fuseCache.set(items, fuse);
  }
  return fuse;
}

/** Fuzzy search. Returns id → score (lower is better), or null for an empty query. */
export function searchAssets(assets: Asset[], q: string): Map<string, number> | null {
  const query = q.trim();
  if (!query) return null;
  const fuse = fuseFor(
    assets,
    (a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      tags: a.tags,
      category: CATEGORY_MAP[a.category].label,
      libraries: a.libraries.map((l) => LIBRARY_MAP[l].label),
      frameworks: [a.html ? "html css" : "", a.react ? "react jsx" : ""].join(" "),
    }),
    [
      { name: "title", weight: 3 },
      { name: "tags", weight: 2 },
      { name: "category", weight: 1.6 },
      { name: "libraries", weight: 1.4 },
      { name: "frameworks", weight: 1 },
      { name: "description", weight: 0.8 },
    ],
  );
  return new Map(fuse.search(query).map((r) => [r.item.id as string, r.score ?? 0]));
}

export function searchPrompts(prompts: WebsitePrompt[], q: string): Map<string, number> | null {
  const query = q.trim();
  if (!query) return null;
  const fuse = fuseFor(
    prompts,
    (p) => ({ id: p.id, title: p.title, industry: p.industry, tags: p.tags, sections: p.sections, prompt: p.prompt }),
    [
      { name: "title", weight: 3 },
      { name: "industry", weight: 2 },
      { name: "tags", weight: 2 },
      { name: "sections", weight: 1 },
      { name: "prompt", weight: 0.4 },
    ],
  );
  return new Map(fuse.search(query).map((r) => [r.item.id as string, r.score ?? 0]));
}

function matches(a: Asset, s: FilterState, skip?: Facet): boolean {
  if (skip !== "cats" && s.cats.length && !s.cats.includes(a.category)) return false;
  if (skip !== "libs" && s.libs.length && !a.libraries.some((l) => s.libs.includes(l))) return false;
  if (skip !== "fws" && s.fws.length && !assetFrameworks(a).some((f) => s.fws.includes(f))) return false;
  if (skip !== "levels" && s.levels.length && !s.levels.includes(a.complexity)) return false;
  if (skip !== "tones" && s.tones.length && !s.tones.includes(a.tone)) return false;
  if (skip !== "kind" && s.kind !== "all" && CATEGORY_MAP[a.category].kind !== s.kind) return false;
  return true;
}

export function runQuery(assets: Asset[], s: FilterState): Asset[] {
  const hits = searchAssets(assets, s.q);
  const out = assets.filter((a) => (!hits || hits.has(a.id)) && matches(a, s));
  return out.sort((a, b) => {
    if (s.sort === "az") return a.title.localeCompare(b.title);
    if (s.sort === "newest") return b.added.localeCompare(a.added) || a.title.localeCompare(b.title);
    if (hits) return (hits.get(a.id) ?? 1) - (hits.get(b.id) ?? 1);
    return Number(!!b.featured) - Number(!!a.featured) || b.added.localeCompare(a.added);
  });
}

/** Faceted counts: each facet is counted with every *other* active filter applied. */
export function facetCounts(assets: Asset[], s: FilterState) {
  const hits = searchAssets(assets, s.q);
  const base = hits ? assets.filter((a) => hits.has(a.id)) : assets;
  const count = (facet: Facet, keys: (a: Asset) => string[]) => {
    const m: Record<string, number> = {};
    for (const a of base) if (matches(a, s, facet)) for (const k of keys(a)) m[k] = (m[k] ?? 0) + 1;
    return m;
  };
  return {
    cats: count("cats", (a) => [a.category]),
    libs: count("libs", (a) => a.libraries),
    fws: count("fws", assetFrameworks),
    levels: count("levels", (a) => [a.complexity]),
    tones: count("tones", (a) => [a.tone]),
    kind: count("kind", (a) => [CATEGORY_MAP[a.category].kind]),
  };
}
