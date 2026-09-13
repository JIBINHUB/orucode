#!/usr/bin/env node
// Imports a curated, credited set of Uiverse.io "galaxy" elements (MIT License)
// into src/data/uiverse.ts.
//
// Usage: node scripts/import-uiverse.mjs <path-to-unzipped-galaxy-main>
// Source: https://github.com/uiverse-io/galaxy
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const galaxy = process.argv[2];
if (!galaxy) {
  console.error("Usage: node scripts/import-uiverse.mjs <path-to-galaxy-main>");
  process.exit(1);
}

// [galaxy folder, ORU category, noun used in titles, how many to import]
const FOLDERS = [
  ["Buttons", "buttons", "Button", 24],
  ["loaders", "loaders", "Loader", 22],
  ["Cards", "cards", "Card", 16],
  ["Toggle-switches", "toggles", "Toggle", 16],
  ["Inputs", "inputs", "Input", 14],
  ["Checkboxes", "checkboxes", "Checkbox", 12],
  ["Patterns", "patterns", "Pattern", 12],
  ["Radio-buttons", "radios", "Radio Group", 10],
  ["Forms", "contact", "Form", 10],
  ["Tooltips", "tooltips", "Tooltip", 8],
  ["Notifications", "notifications", "Notification", 6],
];

const MAX_LINES = 180;
const LIVELY = /\b(animated|animation|hover|3d|glow|gradient|neon|glass|glassmorphism|morph|ripple|shine|liquid|particles?)\b/i;
const GENERIC = new Set([
  "simple", "cool", "css", "html", "uiverse", "light", "dark", "black", "white", "blue", "red", "green",
  "yellow", "purple", "pink", "orange", "gray", "grey", "cyan", "violet", "modern", "minimal", "clean",
]);

const titleCase = (s) =>
  s.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());

/** Small deterministic hash so ties don't favour authors whose names sort first. */
const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

function parse(folder, file) {
  const m = file.match(/^(.+)_([a-z]+-[a-z]+-\d+)\.html$/);
  if (!m) return null;
  const slug = m[2];
  const src = readFileSync(join(galaxy, folder, file), "utf8");
  if (src.split("\n").length > MAX_LINES) return null;
  // Self-contained only: no scripts, remote assets or url() references.
  if (/<script/i.test(src) || /https?:\/\/|url\(/i.test(src)) return null;
  const style = src.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (!style) return null;
  const header = src.match(/From Uiverse\.io by\s+(\S+)\s*-\s*Tags:\s*([^*\n]*?)\s*(\*\/|-->)/);
  if (!header) return null;

  const author = header[1];
  const tags = header[2]
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const html = src
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<!--\s*From Uiverse\.io[\s\S]*?-->/i, "")
    .trim();
  if (!html) return null;

  let css = style[1].trim();
  if (!css.includes("From Uiverse.io by")) {
    css = `/* From Uiverse.io by ${author} - Tags: ${tags.join(", ")} */\n${css}`;
  }

  let score = 0;
  if (LIVELY.test(tags.join(" "))) score += 2;
  if (/@keyframes|transition/.test(css)) score += 1;
  const cssLines = css.split("\n").length;
  if (cssLines >= 25 && cssLines <= 140) score += 1;

  return { file, author, slug, html, css, cssLines, tags, score };
}

function pickTitle(item, noun, used) {
  const nounRe = new RegExp(`\\b${noun.split(" ")[0]}s?\\b`, "i");
  for (const tag of item.tags) {
    if (GENERIC.has(tag) || tag.length > 18 || !/^[a-z0-9 -]+$/.test(tag)) continue;
    const word = tag.replace(nounRe, "").trim();
    if (!word || GENERIC.has(word)) continue;
    const title = `${titleCase(word)} ${noun}`;
    if (!used.has(title)) {
      used.add(title);
      return title;
    }
  }
  const base = `${titleCase(item.slug.split("-").slice(0, 2).join(" "))} ${noun}`;
  let title = base;
  for (let n = 2; used.has(title); n++) title = `${base} ${n}`;
  used.add(title);
  return title;
}

// Dot-grid "spotlight platform" backdrop — matches the app's stage-canvas/empty-state
// canvas elsewhere, so a component reads as staged rather than dropped on a flat box.
const previewCss = (category) =>
  category === "patterns"
    ? "/* ORU preview frame */\nhtml, body { height: 100%; margin: 0; }\nbody > * { width: 100%; height: 100%; }"
    : [
        "/* ORU preview frame */",
        "body {",
        "  margin: 0;",
        "  min-height: 100vh;",
        "  display: grid;",
        "  place-items: center;",
        "  padding: 9%;",
        "  box-sizing: border-box;",
        "  font-family: system-ui, sans-serif;",
        "  background:",
        "    radial-gradient(38% 34% at 50% 42%, rgba(255,255,255,.95), rgba(255,255,255,0) 72%),",
        "    radial-gradient(rgba(10,10,10,.08) 1.1px, transparent 1.4px) 0 0/20px 20px,",
        "    #f2f1f0;",
        "}",
      ].join("\n");

const assets = [];
const summary = [];

for (const [folder, category, noun, quota] of FOLDERS) {
  const items = readdirSync(join(galaxy, folder))
    .filter((f) => f.endsWith(".html"))
    .map((f) => parse(folder, f))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || hash(a.file) - hash(b.file));

  const authors = new Set();
  const titles = new Set();
  let taken = 0;

  for (const item of items) {
    if (taken >= quota) break;
    const authorKey = item.author.toLowerCase();
    if (authors.has(authorKey)) continue;
    authors.add(authorKey);
    taken++;

    const title = pickTitle(item, noun, titles);
    const shownTags = item.tags.filter((t) => !GENERIC.has(t)).slice(0, 4);
    assets.push({
      id: `uv-${authorKey.replace(/[^a-z0-9]+/g, "-")}-${item.slug}`,
      title,
      description: `${noun}${shownTags.length ? ` — ${shownTags.join(", ")}` : ""}.`,
      category,
      libraries: ["css"],
      tags: [...new Set(item.tags.slice(0, 6))],
      complexity: item.cssLines < 50 ? "basic" : item.cssLines < 110 ? "intermediate" : "advanced",
      tone: "light",
      added: "2026-09-11",
      react: "auto",
      html: { html: item.html, css: `${previewCss(category)}\n\n${item.css}` },
      credit: {
        author: item.author,
        url: `https://uiverse.io/${item.author}/${item.slug}`,
        source: "Uiverse.io",
        license: "MIT",
      },
    });
  }
  summary.push([category, taken, items.length]);
}

const banner = [
  "// Generated by scripts/import-uiverse.mjs — do not edit by hand.",
  '// Curated elements from Uiverse.io "galaxy" (https://github.com/uiverse-io/galaxy),',
  "// MIT License, Copyright (c) 2023 Uiverse.io. Each element credits its original author;",
  "// see THIRD_PARTY_NOTICES.md.",
].join("\n");

const out = `${banner}\nimport type { Asset } from "@/lib/types";\n\nexport const UIVERSE_ASSETS: Asset[] = ${JSON.stringify(assets, null, 2)};\n`;
writeFileSync(join(root, "src", "data", "uiverse.ts"), out);

for (const [category, taken, eligible] of summary) {
  console.log(`${category.padEnd(14)} imported ${String(taken).padStart(3)} of ${eligible} eligible`);
}
console.log(`total ${assets.length} designs → src/data/uiverse.ts (${(out.length / 1024).toFixed(0)} KB)`);
