// Builds the sandboxed preview runtime and copies standalone library builds
// into public/vendor so previews work offline and without a CDN.
import { build } from "esbuild";
import { copyFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "vendor");
mkdirSync(out, { recursive: true });

const copies = [
  ["node_modules/gsap/dist/gsap.min.js", "gsap.min.js"],
  ["node_modules/gsap/dist/ScrollTrigger.min.js", "ScrollTrigger.min.js"],
  ["node_modules/animejs/lib/anime.min.js", "anime.min.js"],
  ["node_modules/@babel/standalone/babel.min.js", "babel.min.js"],
  ["node_modules/@tailwindcss/browser/dist/index.global.js", "tailwind-browser.js"],
];

for (const [from, to] of copies) {
  const src = join(root, from);
  if (!existsSync(src)) throw new Error(`Missing vendor file: ${from}`);
  copyFileSync(src, join(out, to));
}

const runtimeOut = join(out, "oru-runtime.js");
const entry = join(root, "runtime", "entry.js");
const fresh =
  existsSync(runtimeOut) && statSync(runtimeOut).mtimeMs > statSync(entry).mtimeMs;

if (!fresh || process.argv.includes("--force")) {
  await build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    format: "iife",
    target: "es2020",
    outfile: runtimeOut,
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "warning",
  });
}

console.log("✓ preview runtime + vendor libraries ready in public/vendor");
