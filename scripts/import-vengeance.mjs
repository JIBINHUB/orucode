#!/usr/bin/env node
// Imports a curated, credited set of VengeanceUI React + Tailwind components
// (MIT License) into src/data/vengeance.ts.
//
// Usage: node scripts/import-vengeance.mjs <path-to-cloned-VengeanceUI-repo>
// Source: https://github.com/Ashutoshx7/VengeanceUI (site: vengenceui.com)
//
// Only components whose real imports resolve to {framer-motion, gsap,
// lucide-react, react, react-dom} (plus the trivial `cn` helper from
// "@/lib/utils", inlined below) are imported — no Radix, three.js, Next.js
// APIs, next-themes, or hard-coded image/audio/video assets. TypeScript types
// are stripped at import time so the stored code is a single runnable App.jsx,
// matching every other React asset in the library.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Babel from "@babel/standalone";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = process.argv[2];
if (!repo) {
  console.error("Usage: node scripts/import-vengeance.mjs <path-to-cloned-VengeanceUI-repo>");
  process.exit(1);
}

const indexPath = join(repo, "packages", "mcp", "data", "index.json");
const index = JSON.parse(readFileSync(indexPath, "utf8"));

const ALLOWED_PKGS = new Set(["framer-motion", "gsap", "lucide-react", "clsx", "tailwind-merge", "react", "react-dom"]);
const RISKY = /next\/(image|link|navigation|font)|next-themes|(?<!@gsap\/)\bthree\b|@react-three|\bogl\b|WebGLRenderer|useThree|getContext\(["']webgl|\/(public|assets)\//i;
const MAX_LINES = 850;

// VengeanceUI's site category -> ORU category, with per-slug overrides for the
// coarser buckets ("Tooltip & Marquee", "Collections") that mix content types.
const CATEGORY_DEFAULT = {
  Buttons: "buttons",
  "Text & Motion": "text",
  Interactive: "interactions",
  "Layout & Cards": "cards",
  "Tooltip & Marquee": "tooltips",
  Loaders: "loaders",
  "Navbar & Docs": "navbars",
  Collections: "interactions",
  Backgrounds: "patterns",
};
const CATEGORY_OVERRIDE = {
  "elastic-stack": "marquee",
  "logo-slider": "marquee",
  "stacked-logos": "marquee",
  "faq-accordion": "faq",
  "folder-preview": "cards",
  "animated-tooltip": "tooltips",
};

function readRegistry(slug) {
  const p = join(repo, "public", "r", `${slug}.json`);
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, "utf8"));
}

/** Strips TypeScript syntax while leaving JSX and runtime code untouched. */
function stripTypes(src) {
  return Babel.transform(src, {
    filename: "Component.tsx",
    presets: [["typescript", { isTSX: true, allExtensions: true }]],
    compact: false,
  }).code;
}

const stripUseClient = (src) => src.replace(/^\s*["']use client["'];?\s*\n/, "");

/**
 * Removes a trailing `export default X;` line so the file's only default
 * export ends up being the demo appended after it (a bare `export function X`
 * / `export const X` with no separate default line needs no change here —
 * named exports and the final default export coexist fine after CommonJS
 * transform). Returns the code either way.
 */
function detachDefaultExport(src) {
  let m = src.match(/export default function\s+([A-Za-z_$][\w$]*)/);
  if (m) return src.replace(/export default function/, "function");
  // Matches `export default Identifier;` as its own line, anywhere in the
  // file (trailing comments like "// trigger vercel build" may follow it).
  m = src.match(/^[ \t]*export default\s+([A-Za-z_$][\w$]*)\s*;?[ \t]*$/m);
  if (m) return src.slice(0, m.index) + src.slice(m.index + m[0].length);
  m = src.match(/export default\s*\(/);
  if (m) return src.replace(/export default/, "const __Component =");
  return src;
}

/** Renames the demo's `export function Name(` / `export const Name = (` to the file's single default export. */
function renameDemoToDefault(src) {
  if (/export default\s+function|export default\s*\(/.test(src)) return src; // already a single default export
  if (/export function\s+[A-Za-z_$][\w$]*\s*\(/.test(src)) {
    return src.replace(/export function\s+[A-Za-z_$][\w$]*\s*\(/, "export default function Demo(");
  }
  if (/export const\s+[A-Za-z_$][\w$]*\s*=/.test(src)) {
    return src.replace(/export const\s+[A-Za-z_$][\w$]*\s*=/, "const Demo =").trimEnd() + "\n\nexport default Demo;\n";
  }
  return null;
}

// Any leftover "@/components/ui/*" import is guaranteed to be a self-reference
// at this point — cross-component deps were already excluded during analysis
// — but the registry's own demo occasionally spells the path differently from
// the componentName (e.g. camelCase vs kebab-case), so match by prefix only.
const removeSelfImport = (src) => src.replace(/^import[\s\S]*?["']@\/components\/ui\/[^"']+["'];?\n/gm, "");

function inlineCnHelper(src) {
  const usesCn = /\bcn\(/.test(src);
  const withoutImport = src.replace(/^import\s*\{\s*cn\s*\}\s*from\s*["']@\/lib\/utils["'];?\n/gm, "");
  if (!usesCn) return withoutImport;
  const helper = [
    "// Simplified stand-in for the original `cn()` (clsx + tailwind-merge): joins",
    "// class names without tailwind-merge's conflicting-utility dedupe.",
    "function cn(...inputs) {",
    "  return inputs.flat(Infinity).filter(Boolean).join(\" \");",
    "}",
    "",
  ].join("\n");
  return helper + withoutImport;
}

// Small, original placeholder graphics (no photos) for demo image/avatar/audio
// props that hard-code paths like "/logos/acme.svg" that don't exist for us.
const PLACEHOLDER_COLORS = ["#c9c9ce", "#b9c4d0", "#c7cfc2", "#d4c7c2", "#c2c7d4", "#cdbfd6"];
let placeholderSeq = 0;
const placeholderImage = () => {
  const c = PLACEHOLDER_COLORS[placeholderSeq++ % PLACEHOLDER_COLORS.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='160' height='160' rx='18' fill='${c}'/><circle cx='80' cy='68' r='26' fill='#fff' fill-opacity='.55'/><rect x='34' y='104' width='92' height='14' rx='7' fill='#fff' fill-opacity='.55'/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
function replacePlaceholderAssets(src) {
  placeholderSeq = 0;
  let out = src.replace(/(["'])((?:\/|https?:\/\/)[^"']*?\.(?:jpe?g|png|webp|gif|svg))\1/g, () => `"${placeholderImage()}"`);
  out = out.replace(/(["'])https:\/\/api\.dicebear\.com\/[^"']*\1/g, () => `"${placeholderImage()}"`);
  out = out.replace(/(["'])(?:\/|https?:\/\/)[^"']*?\.(?:mp3|wav|mp4|ogg)\1/g, `""`);
  return out;
}

const extractImports = (code) => [...code.matchAll(/^import\s.+?;?\s*$/gm)].map((m) => m[0]);
const extractJsxTags = (code) => new Set([...code.matchAll(/<([A-Z][\w.]*)/g)].map((m) => m[1].split(".")[0]));
const extractBoundNames = (code) => {
  const names = new Set(["Fragment", "React"]);
  for (const m of code.matchAll(/^\s*(?:export\s+(?:default\s+)?)?(?:async\s+)?(?:function\*?|class|const|let|var)\s+([A-Za-z_$][\w$]*)/gm))
    names.add(m[1]);
  for (const imp of extractImports(code)) {
    for (const m of imp.matchAll(/\b([A-Z][\w$]*)\b/g)) names.add(m[1]);
    const def = imp.match(/^import\s+([A-Za-z_$][\w$]*)\s*(?:,|from)/);
    if (def) names.add(def[1]);
  }
  return names;
};

function buildComponent(meta) {
  try {
    return buildComponentUnsafe(meta);
  } catch (err) {
    return { skip: `threw: ${String(err.message || err).split("\n")[0]}` };
  }
}

function buildComponentUnsafe(meta) {
  const reg = readRegistry(meta.componentName);
  if (!reg?.files?.length) return { skip: "no-registry-file" };
  const raw = reg.files.map((f) => f.content).join("\n\n");

  const imports = [...raw.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
  const internalUi = imports.filter(
    (i) => i.startsWith("@/components/ui/") && !reg.files.some((f) => f.path.endsWith(i.replace("@/components/ui/", "components/ui/") + ".tsx")),
  );
  const externalPkgs = [...new Set(imports.filter((i) => !i.startsWith(".") && !i.startsWith("@/")))];
  const badPkgs = externalPkgs.filter((p) => !ALLOWED_PKGS.has(p));
  if (internalUi.length) return { skip: `internal ui refs: ${internalUi.join(",")}` };
  if (badPkgs.length) return { skip: `disallowed packages: ${badPkgs.join(",")}` };
  if (RISKY.test(raw)) return { skip: "risky pattern (next/three/webgl/public asset)" };
  if (raw.split("\n").length > MAX_LINES) return { skip: "too long" };

  let componentSrc = stripTypes(stripUseClient(raw));
  componentSrc = inlineCnHelper(detachDefaultExport(componentSrc));

  if (!meta.usageCode) return { skip: "no usage demo" };
  let demoSrc = stripTypes(stripUseClient(meta.usageCode));
  demoSrc = removeSelfImport(demoSrc);
  demoSrc = renameDemoToDefault(demoSrc);
  if (!demoSrc) return { skip: "could not rename demo export" };
  demoSrc = replacePlaceholderAssets(demoSrc);

  const merged = `${componentSrc.trimEnd()}\n\n${demoSrc.trimEnd()}\n`;
  const bound = extractBoundNames(merged);
  const unresolved = [...extractJsxTags(merged)].filter((t) => !bound.has(t));
  if (unresolved.length) return { skip: `unresolved JSX tags: ${unresolved.join(",")}` };

  try {
    Babel.transform(merged, { filename: "App.jsx", presets: [["react", { runtime: "automatic" }]], plugins: ["transform-modules-commonjs"] });
  } catch (err) {
    return { skip: `compile error: ${String(err.message).split("\n")[0]}` };
  }

  const banner = `// ${meta.name} — via VengeanceUI (${meta.slug}) by Ashutoshx7, MIT License.\n// https://www.vengenceui.com/components/${meta.slug}\n\n`;
  const code = banner + merged;

  const libraries = [];
  if (/from ["']framer-motion["']/.test(merged)) libraries.push("framer-motion");
  if (/from ["']gsap["']/.test(merged)) libraries.push("gsap");
  if (!libraries.length) libraries.push("css");

  const lines = merged.split("\n").length;
  const category = CATEGORY_OVERRIDE[meta.componentName] ?? CATEGORY_DEFAULT[meta.category] ?? "cards";
  const words = [meta.category, ...meta.description.split(/\s+/)]
    .map((w) => w.toLowerCase().replace(/[^a-z0-9-]/g, ""))
    .filter((w) => w.length > 2 && !["and", "the", "with", "for", "your"].includes(w));

  return {
    asset: {
      id: `vg-${meta.componentName}`,
      title: meta.name,
      description: `${meta.description}.`,
      category,
      libraries,
      tags: [...new Set([...words.slice(0, 5), "tailwind"])],
      complexity: lines < 100 ? "basic" : lines < 260 ? "intermediate" : "advanced",
      tone: "dark",
      added: "2026-09-11",
      tailwind: true,
      react: { code, css: PREVIEW_CSS },
      credit: { author: "Ashutoshx7", url: `https://www.vengenceui.com/components/${meta.slug}`, source: "VengeanceUI", license: "MIT" },
    },
  };
}

// Same dot-grid "spotlight platform" backdrop used for the Uiverse import, so
// every imported component reads as staged rather than dropped on a flat box.
const PREVIEW_CSS = [
  "body {",
  "  margin: 0;",
  "  min-height: 100vh;",
  "  display: grid;",
  "  place-items: center;",
  "  padding: 8%;",
  "  box-sizing: border-box;",
  "}",
].join("\n");

const assets = [];
const skipped = [];
for (const meta of index.components) {
  const result = buildComponent(meta);
  if (result.asset) assets.push(result.asset);
  else skipped.push([meta.componentName, result.skip]);
}

const banner = [
  "// Generated by scripts/import-vengeance.mjs — do not edit by hand.",
  '// Curated components from VengeanceUI (https://github.com/Ashutoshx7/VengeanceUI,',
  "// site: vengenceui.com), MIT License, Copyright (c) 2025-2026 Ashutoshx7. Each",
  "// asset credits its original author; see THIRD_PARTY_NOTICES.md.",
].join("\n");
const out = `${banner}\nimport type { Asset } from "@/lib/types";\n\nexport const VENGEANCE_ASSETS: Asset[] = ${JSON.stringify(assets, null, 2)};\n`;
writeFileSync(join(root, "src", "data", "vengeance.ts"), out);

// Re-export only the lucide-react icons actually used, so the shared preview
// runtime tree-shakes out the other ~1000 icons instead of bundling all of them.
const iconNames = new Set();
for (const a of assets) {
  for (const m of a.react.code.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g)) {
    for (const part of m[1].split(",")) {
      const name = part.replace(/\btype\b/, "").replace(/\bas\b.*$/, "").trim();
      if (name) iconNames.add(name);
    }
  }
}
const iconsOut = [
  "// Generated by scripts/import-vengeance.mjs — the exact lucide-react icons",
  "// used by imported assets, so the preview runtime only bundles these instead",
  "// of the full ~1000-icon library. Rerun the importer to refresh this list.",
  `export { ${[...iconNames].sort().join(", ")} } from "lucide-react";`,
  "",
].join("\n");
writeFileSync(join(root, "runtime", "lucide-icons.generated.js"), iconsOut);

const byCat = {};
for (const a of assets) byCat[a.category] = (byCat[a.category] ?? 0) + 1;
console.log("imported:", assets.length, "of", index.components.length);
console.log(byCat);
console.log("--- skipped ---");
for (const [name, reason] of skipped) console.log(name.padEnd(30), reason);
