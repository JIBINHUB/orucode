import type { Asset } from "./types";

export type NativeTone = "light" | "dark";

/**
 * The backdrop an imported Uiverse design was drawn for, read from its own CSS.
 * Mostly-light colours mean it was made for a dark page (keep its colours on the
 * dark preview); mostly-dark colours mean a light page (flip it). ORU's added
 * preview frame is ignored. Anything else returns undefined and falls back to
 * runtime detection in the preview.
 */

const NAMED: Record<string, number> = { white: 1, black: 0, gray: 0.5, grey: 0.5, silver: 0.75 };

const alpha = (s: string | undefined) => (s === undefined ? 1 : s.endsWith("%") ? parseFloat(s) / 100 : parseFloat(s));

function luminance(token: string): number | null {
  const t = token.trim().toLowerCase();
  if (t in NAMED) return NAMED[t];
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 1;
  let m = t.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length <= 4) h = h.split("").map((c) => c + c).join("");
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
    if (h.length === 8) a = parseInt(h.slice(6, 8), 16) / 255;
  } else if ((m = t.match(/^rgba?\(([^)]*)\)$/))) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean);
    [r, g, b] = p.map(parseFloat);
    a = alpha(p[3]);
  } else if ((m = t.match(/^hsla?\(([^)]*)\)$/))) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean);
    return alpha(p[3]) < 0.35 ? null : parseFloat(p[2]) / 100;
  } else {
    return null;
  }
  if (a < 0.35 || [r, g, b].some(Number.isNaN)) return null;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

const PROP =
  /(?:^|[;{\s])(color|background(?:-color|-image)?|border(?:-(?:top|right|bottom|left))?(?:-color)?|outline(?:-color)?|box-shadow|fill|stroke|--[\w-]+)\s*:\s*([^;}]+)/gi;
const COLOR = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|\b(?:white|black|gr[ae]y|silver)\b/gi;
const WEIGHT: Record<string, number> = { color: 1, background: 1.5, border: 1, outline: 0.5, "box-shadow": 0.5, fill: 1.2, stroke: 1.2, var: 1 };

export function nativeTone(asset: Asset): NativeTone | undefined {
  const css = asset.html?.css;
  if (!css || !css.includes("ORU preview frame") || asset.category === "patterns") return undefined;
  const at = css.indexOf("/* From Uiverse.io");
  const authored = at >= 0 ? css.slice(at) : css;

  let light = 0;
  let dark = 0;
  for (const [, prop, value] of authored.matchAll(PROP)) {
    const p = prop.toLowerCase();
    const key = p.startsWith("--")
      ? "var"
      : p.startsWith("background")
        ? "background"
        : p.startsWith("border")
          ? "border"
          : p.startsWith("outline")
            ? "outline"
            : p;
    for (const token of value.match(COLOR) ?? []) {
      const l = luminance(token);
      if (l === null) continue;
      if (l > 0.6) light += WEIGHT[key] ?? 1;
      else if (l < 0.4) dark += WEIGHT[key] ?? 1;
    }
  }
  const tags = authored.match(/Tags:\s*([^*]*)\*\//)?.[1].toLowerCase() ?? "";
  if (/\bdark\b/.test(tags) && !/\blight\b/.test(tags)) light += 2;
  return light > dark * 1.2 ? "dark" : "light";
}
