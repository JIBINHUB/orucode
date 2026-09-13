import { indent } from "./code";
import type { HtmlVariant, LibraryId, ReactVariant } from "./types";

export const VERSIONS = { gsap: "3.13.0", animejs: "3.2.2" };

/** How a library preview picks its polarity on the dark ground: detect it, or use a known tone. */
export type GroundMode = "auto" | "light" | "dark";

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

/**
 * Library previews sit on a dark ground. A design that paints a light
 * full-bleed background is flipped with invert + hue-rotate (darker, same
 * hues; photos flipped back), and one that paints a dark ground is left alone.
 * With no painted ground the content decides: mostly-dark ink is flipped so it
 * stays readable, light ink is kept. Only mostly-opaque colours count, so a
 * faint glow over a dark body isn't read as a light ground.
 */
const GROUND_STYLE =
  "html.__oru-inv{filter:invert(1) hue-rotate(180deg)}html.__oru-inv img,html.__oru-inv video{filter:invert(1) hue-rotate(180deg)}";

const groundScript = (waitForRoot: boolean, tone: GroundMode = "auto") => `(function(){
  var root=document.documentElement;
  var parse=function(c){var m=c&&c.match(/rgba?\\(([^)]+)\\)/);if(!m)return null;var p=m[1].split(",").map(parseFloat);return {l:(0.2126*p[0]+0.7152*p[1]+0.0722*p[2])/255,a:p.length>3?p[3]:1}};
  var paint=function(el){
    var cs=getComputedStyle(el),img=cs.backgroundImage;
    if(img&&img!=="none"){
      var cols=img.match(/rgba?\\([^)]+\\)/g);
      if(!cols)return 0.3;
      var s=0,w=0;cols.forEach(function(c){var v=parse(c);if(v&&v.a>=0.5){s+=v.l;w++}});
      if(w)return s/w;
    }
    var bg=parse(cs.backgroundColor);
    return bg&&bg.a>=0.5?bg.l:null;
  };
  var ink=function(){
    var area=innerWidth*innerHeight,dark=0,light=0,nodes=document.body?document.body.getElementsByTagName("*"):[];
    var add=function(c,a){var v=parse(c);if(!v||v.a<0.5||!(a>0))return;if(v.l<0.45)dark+=a;else if(v.l>0.55)light+=a};
    var solid=function(list,a){(String(list).match(/rgba?\\([^)]+\\)/g)||[]).forEach(function(c){add(c,a)})};
    var box=function(cs,wd,ht){
      if(wd*ht<area*0.85){add(cs.backgroundColor,wd*ht);if(cs.backgroundImage&&cs.backgroundImage!=="none")solid(cs.backgroundImage,wd*ht)}
      ["Top","Right","Bottom","Left"].forEach(function(side,k){var bw=parseFloat(cs["border"+side+"Width"])||0;if(bw&&cs["border"+side+"Style"]!=="none")add(cs["border"+side+"Color"],bw*(k%2?ht:wd))});
      if(cs.boxShadow&&cs.boxShadow!=="none")solid(cs.boxShadow,wd*ht);
    };
    for(var i=0;i<nodes.length&&i<700;i++){
      var n=nodes[i],b0=n.getBoundingClientRect(),r={width:n.offsetWidth||b0.width,height:n.offsetHeight||b0.height};
      if(n instanceof SVGElement&&n.getBBox){try{var bb=n.getBBox();r={width:bb.width||b0.width,height:bb.height||b0.height}}catch(e){}}
      if(!r.width||!r.height)continue;
      var cs=getComputedStyle(n);if(cs.display==="none")continue;
      var fs=parseFloat(cs.fontSize)||16,t=0;
      for(var c=n.firstChild;c;c=c.nextSibling)if(c.nodeType===3)t+=c.nodeValue.trim().length;
      if(t)add(cs.color,t*fs*fs*0.25);
      if(n instanceof SVGElement){if(n.tagName!=="svg"&&n.tagName!=="g"){add(cs.fill,r.width*r.height*0.5);add(cs.stroke,(r.width+r.height)*2*(parseFloat(cs.strokeWidth)||1))}continue}
      box(cs,r.width,r.height);
      ["::before","::after"].forEach(function(p){
        var ps=getComputedStyle(n,p);if(!ps.content||ps.content==="none"||ps.content==="normal")return;
        var pw=parseFloat(ps.width),ph=parseFloat(ps.height);if(!(pw>0))pw=r.width;if(!(ph>0))ph=r.height;
        box(ps,pw,ph);
        var txt=ps.content.charAt(0)==='"'?ps.content.slice(1,-1):"";if(txt)add(ps.color,txt.length*fs*fs*0.25);
      });
    }
    return dark||light?dark>=light*0.8:null;
  };
  var decide=function(){
    // Imported designs sit in ORU's own light preview frame; that backdrop isn't the
    // author's design, so drop it and use the tone read from the design's own CSS.
    var framed=[].some.call(document.querySelectorAll("style"),function(s){return s.textContent.indexOf("ORU preview frame")>=0});
    if(framed&&document.body)document.body.style.background="transparent";
    var l=${tone === "light" ? "1" : tone === "dark" ? "0" : "null"};
    if(l===null){
      var area=innerWidth*innerHeight,el=document.elementFromPoint(innerWidth/2,innerHeight/2);
      for(;el&&el!==document.body&&el!==root;el=el.parentElement){var r=el.getBoundingClientRect();if(r.width*r.height>=area*0.85){l=paint(el);if(l!==null)break}}
      if(l===null&&document.body)l=paint(document.body);
      if(l===null)l=paint(root);
      if(l===null){var k=ink();l=k===false?0:1}
    }
    if(l>0.55){root.style.background="#f1f1f2";root.classList.add("__oru-inv")}
    else if(paint(root)===null)root.style.background="#0e0e11";
  };
  var start=function(){${
    waitForRoot
      ? `var tries=0,tick=function(){var r=document.getElementById("root");if((r&&r.firstElementChild)||tries++>30)decide();else requestAnimationFrame(tick)};requestAnimationFrame(tick)`
      : "decide()"
  }};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
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
  /** Preview mode only: put the design on the dark library ground (see GROUND_STYLE). */
  ground?: GroundMode;
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
    `  <title>${opts.title ?? "ORU CODE snippet"}</title>`,
    preview ? `  <script>${BRIDGE}</script>` : "",
    preview && opts.ground ? `  <style>${GROUND_STYLE}</style>\n  <script>${groundScript(false, opts.ground)}</script>` : "",
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
export async function buildHtmlPreview(v: HtmlVariant, title?: string, ground?: GroundMode): Promise<string> {
  const libs = detectScriptLibs(v.js);
  const files = [
    libs.gsap && "gsap.min.js",
    libs.scrollTrigger && "ScrollTrigger.min.js",
    libs.anime && "anime.min.js",
  ].filter(Boolean) as string[];
  const inline = await Promise.all(files.map(fetchVendor));
  return buildHtmlDocument(v, { mode: "preview", inline, title, ground });
}

/**
 * Preview document for a React variant with the runtime and Babel inlined.
 * Pass `tailwind: true` for snippets whose classes are Tailwind utilities
 * (e.g. imported components) — a Tailwind JIT engine is inlined so those
 * classes actually resolve to styles, matching their original build setup.
 */
export async function buildReactPreview(
  v: ReactVariant,
  title?: string,
  tailwind?: boolean,
  ground?: GroundMode,
): Promise<string> {
  const files = ["oru-runtime.js", "babel.min.js", ...(tailwind ? ["tailwind-browser.js"] : [])];
  const [runtime, babel, tailwindEngine] = await Promise.all(files.map(fetchVendor));
  return buildReactDocument(v, { inline: [runtime, babel], tailwind: tailwindEngine, title, ground });
}

export function buildReactDocument(
  v: ReactVariant,
  opts: { inline: [string, string]; tailwind?: string; title?: string; ground?: GroundMode },
): string {
  // React renders after load, so the ground is measured once the first render lands.
  const ground = opts.ground ? `\n  <style>${GROUND_STYLE}</style>\n  <script>${groundScript(true, opts.ground)}</script>` : "";
  const source = JSON.stringify(v.code).replace(/</g, "\\u003c");
  // Tailwind-based snippets are authored dark-first (dark: variants carry their
  // real look), so the preview's <html> opts into dark mode to match.
  return `<!doctype html>
<html lang="en"${opts.tailwind ? ` class="dark"` : ""}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${opts.title ?? "ORU CODE snippet"}</title>
  <script>${BRIDGE}</script>
  <style>body{margin:0}</style>${ground}
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
