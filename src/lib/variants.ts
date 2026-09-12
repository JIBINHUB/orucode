import { htmlToReact } from "./htmlToJsx";
import { buildHtmlPreview, buildReactPreview } from "./preview";
import type { Asset, FrameworkId, ReactVariant } from "./types";

const cache = new Map<string, ReactVariant>();

/** Resolves an asset's React variant, deriving it from HTML when marked "auto". Browser only for "auto". */
export function getReactVariant(asset: Asset): ReactVariant | null {
  if (!asset.react) return null;
  if (asset.react !== "auto") return asset.react;
  if (!asset.html || typeof window === "undefined") return null;
  let v = cache.get(asset.id);
  if (!v) {
    v = htmlToReact(asset.html, asset.title);
    cache.set(asset.id, v);
  }
  return v;
}

export const defaultFramework = (asset: Asset): FrameworkId => (asset.html ? "html" : "react");

/** Builds the sandboxed preview document for an asset in the requested framework. */
export async function buildAssetDocument(asset: Asset, framework: FrameworkId): Promise<string> {
  if (framework === "react" || !asset.html) {
    const rv = getReactVariant(asset);
    if (rv) return buildReactPreview(rv, asset.title, asset.tailwind);
  }
  return asset.html ? buildHtmlPreview(asset.html, asset.title) : "";
}
