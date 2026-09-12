import { indent } from "./code";
import type { HtmlVariant, LibraryId, ReactVariant } from "./types";

export const VERSIONS = { gsap: "3.13.0", animejs: "3.2.2" };

const CDN = {
  gsap: `https://cdn.jsdelivr.net/npm/gsap@${VERSIONS.gsap}/dist/gsap.min.js`,
  scrollTrigger: `https://cdn.jsdelivr.net/npm/gsap@${VERSIONS.gsap}/dist/ScrollTrigger.min.js`,
  anime: `https://cdn.jsdelivr.net/npm/animejs@${VERSIONS.animejs}/lib/anime.min.js`,
};

/** Detects which standalone libraries an HTML variant's script relies on. */
export function detectScriptLibs(js = "") {
  return {
    gsap: /\bgsap\b/.test(js),
    scrollTrigger: /\bScrollTrigger\b/.test(js),
    anime: /\banime\s*[.(]/.test(js),
  };
}

/** Detects which npm packages a React snippet imports. */
export function detectReactImports(source = ""): string[] {
  const found = new Set<string>();
  const re = /import\s+(?:[^'"]+\s+from\s+)?["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    const name = m[1];
    if (name.startsWith(".")) continue;
    const pkg = name.startsWith("@") ? name.split("/").slice(0, 2).join("/") : name.split("/")[0];
    if (pkg !== "react" && pkg !== "react-dom") found.add(pkg);
  }
  return [...found];
}

export function installCommand(pkgs: string[]): string | null {
  if (!pkgs.length) return null;
  return "npm install " + pkgs.map((p) => (p === "animejs" ? "animejs@3" : p)).join(" ");
}

const escapeScript = (s: string) => s.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");
const escapeStyle = (s: string) => s.replace(/<\/style/gi, "<\\/style");

/**
 * Injected into preview iframes only: forwards console output and errors to
 * the parent window and keeps in-page links from navigating the frame away.
 */
const BRIDGE = `(function(){
  var fmt=function(a){try{return typeof a==="object"&&a!==null?JSON.stringify(a):String(a)}catch(e){return String(a)}};
  var send=function(level,args){try{parent.postMessage({__oru:1,level:level,message:Array.prototype.map.call(args,fmt).join(" ")},"*")}catch(e){}};
  ["log","info","warn","error"].forEach(function(l){var o=console[l];console[l]=function(){send(l,arguments);o.apply(console,arguments)}});
  addEventListener("error",function(e){send("error",[e.message+(e.lineno?" (line "+e.lineno+")":"")])});
  addEventListener("unhandledrejection",function(e){send("error",["Unhandled promise rejection: "+fmt(e.reason)])});
  document.addEventListener("click",function(e){
    var a=e.target&&e.target.closest?e.target.closest("a[href]"):null;if(!a)return;
    var href=a.getAttribute("href")||"";e.preventDefault();
    if(href.length>1&&href.charAt(0)==="#"){var t=document.querySelector(href);if(t)t.scrollIntoView({behavior:"smooth"})}
  },true);
  document.addEventListener("submit",function(e){e.preventDefault()},true);
})();`;

interface DocOptions {
  mode: "preview" | "export";
  /**
   * Preview mode only: library sources inlined into the document. Sandboxed
   * (null-origin) frames are blocked from fetching scripts from localhost, so
   * the parent fetches them once and inlines them (see buildHtmlPreview).
   */
  inline?: string[];
  title?: string;
}

export function buildHtmlDocument(v: HtmlVariant, opts: DocOptions): string {
  const libs = detectScriptLibs(v.js);
  const preview = opts.mode === "preview";
  const srcs: string[] = [];
  if (!preview) {
    if (libs.gsap) srcs.push(CDN.gsap);
    if (libs.scrollTrigger) srcs.push(CDN.scrollTrigger);
    if (libs.anime) srcs.push(CDN.anime);
  }

  const head = [
    `  <meta charset="UTF-8" />`,
    `  <meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
    `  <title>${opts.title ?? "Oru UI snippet"}</title>`,
    preview ? `  <script>${BRIDGE}</script>` : "",
    `  <style>\n${indent(escapeStyle(v.css), 4)}\n  </style>`,
  ]
    .filter(Boolean)
    .join("\n");

  const scripts = [
    ...(preview
      ? (opts.inline ?? []).map((source) => `  <script>${escapeScript(source)}</script>`)
      : srcs.map((s) => `  <script src="${s}"></script>`)),
    v.js?.trim() ? `  <script>\n${indent(escapeScript(v.js), 4)}\n  </script>` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `<!doctype html>\n<html lang="en">\n<head>\n${head}\n</head>\n<body>\n${indent(v.html, 2)}\n${scripts}\n</body>\n</html>\n`;
}

const REACT_RUNNER = `(function(){
  var show=function(err){
    var msg=String(err&&err.message||err);
    console.error(msg);
    var el=document.getElementById("__oru_err")||document.createElement("pre");
    el.id="__oru_err";
    el.style.cssText="position:fixed;left:12px;right:12px;bottom:12px;margin:0;padding:12px 14px;background:#2a0f14;color:#ffb4bf;font:12px/1.55 ui-monospace,Menlo,monospace;border:1px solid #6b1d2a;border-radius:10px;white-space:pre-wrap;z-index:2147483647;max-height:45vh;overflow:auto";
    el.textContent=msg;document.body.appendChild(el);
  };
  try{
    var compiled=Babel.transform(window.__ORU_SOURCE__,{filename:"App.jsx",presets:[["react",{runtime:"automatic"}]],plugins:["transform-modules-commonjs"]}).code;
    var mod={exports:{}};
    var req=function(name){
      if(/\\.(css|scss|sass|less)$/.test(name))return {};
      var m=window.OruModules[name];
      if(!m)throw new Error('Module "'+name+'" is not available in the live preview. Available: '+Object.keys(window.OruModules).join(", "));
      return m;
    };
    new Function("require","module","exports",compiled)(req,mod,mod.exports);
    var App=mod.exports.default||mod.exports.App;
    if(typeof App!=="function")throw new Error("App.jsx must export a React component as its default export.");
    var React=window.OruModules.react;
    window.OruModules["react-dom/client"].createRoot(document.getElementById("root"),{onUncaughtError:show}).render(React.createElement(App));
  }catch(err){show(err)}
})();`;

const vendorCache = new Map<string, Promise<string>>();

/** Fetches a file from public/vendor once per session (same-origin, then cached). */
export function fetchVendor(file: string): Promise<string> {
  let pending = vendorCache.get(file);
  if (!pending) {
    pending = fetch(`/vendor/${file}`).then((r) => {
      if (!r.ok) throw new Error(`Failed to load preview library ${file} (${r.status})`);
      return r.text();
    });
    pending.catch(() => vendorCache.delete(file));
    vendorCache.set(file, pending);
  }
  return pending;
}

/** Preview document for an HTML variant with its libraries inlined. */
export async function buildHtmlPreview(v: HtmlVariant, title?: string): Promise<string> {
  const libs = detectScriptLibs(v.js);
  const files = [
    libs.gsap && "gsap.min.js",
    libs.scrollTrigger && "ScrollTrigger.min.js",
    libs.anime && "anime.min.js",
  ].filter(Boolean) as string[];
  const inline = await Promise.all(files.map(fetchVendor));
  return buildHtmlDocument(v, { mode: "preview", inline, title });
}

/**
 * Preview document for a React variant with the runtime and Babel inlined.
 * Pass `tailwind: true` for snippets whose classes are Tailwind utilities
 * (e.g. imported components) — a Tailwind JIT engine is inlined so those
 * classes actually resolve to styles, matching their original build setup.
 */
export async function buildReactPreview(v: ReactVariant, title?: string, tailwind?: boolean): Promise<string> {
  const files = ["oru-runtime.js", "babel.min.js", ...(tailwind ? ["tailwind-browser.js"] : [])];
  const [runtime, babel, tailwindEngine] = await Promise.all(files.map(fetchVendor));
  return buildReactDocument(v, { inline: [runtime, babel], tailwind: tailwindEngine, title });
}

export function buildReactDocument(
  v: ReactVariant,
  opts: { inline: [string, string]; tailwind?: string; title?: string },
): string {
  const source = JSON.stringify(v.code).replace(/</g, "\\u003c");
  // Tailwind-based snippets are authored dark-first (dark: variants carry their
  // real look), so the preview's <html> opts into dark mode to match.
  return `<!doctype html>
<html lang="en"${opts.tailwind ? ` class="dark"` : ""}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${opts.title ?? "Oru UI snippet"}</title>
  <script>${BRIDGE}</script>
  <style>body{margin:0}</style>
  <style>
${indent(escapeStyle(v.css ?? ""), 4)}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>${escapeScript(opts.inline[0])}</script>
  <script>${escapeScript(opts.inline[1])}</script>
  ${opts.tailwind ? `<script>${escapeScript(opts.tailwind)}</script>` : ""}
  <script>window.__ORU_SOURCE__=${source};</script>
  <script>${REACT_RUNNER}</script>
</body>
</html>`;
}

export const LIBRARY_PACKAGES: Record<LibraryId, string | null> = {
  gsap: "gsap",
  anime: "animejs",
  "framer-motion": "framer-motion",
  css: null,
};

export function downloadText(filename: string, text: string, type = "text/plain") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function openInNewTab(html: string) {
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
