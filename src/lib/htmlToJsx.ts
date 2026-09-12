import { detectScriptLibs } from "./preview";
import { indent, toPascalCase } from "./code";
import type { HtmlVariant, ReactVariant } from "./types";

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr",
]);
const INLINE_TAGS = new Set(["a", "b", "i", "em", "strong", "span", "code", "small", "kbd", "mark", "sup", "sub"]);
const BOOLEAN_ATTRS = new Set([
  "disabled", "required", "hidden", "open", "multiple", "loop", "muted", "controls", "novalidate", "readonly", "autofocus", "playsinline", "autoplay", "selected", "checked",
]);

const ATTR_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  colspan: "colSpan",
  rowspan: "rowSpan",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  contenteditable: "contentEditable",
  crossorigin: "crossOrigin",
  enctype: "encType",
  srcset: "srcSet",
  novalidate: "noValidate",
  viewbox: "viewBox",
  "xlink:href": "xlinkHref",
  "xml:space": "xmlSpace",
  allowfullscreen: "allowFullScreen",
  frameborder: "frameBorder",
  spellcheck: "spellCheck",
  datetime: "dateTime",
  inputmode: "inputMode",
  playsinline: "playsInline",
  preserveaspectratio: "preserveAspectRatio",
  gradientunits: "gradientUnits",
  gradienttransform: "gradientTransform",
  pathlength: "pathLength",
  patternunits: "patternUnits",
  stddeviation: "stdDeviation",
  "accept-charset": "acceptCharset",
  "http-equiv": "httpEquiv",
  value: "defaultValue",
  checked: "defaultChecked",
};

const camel = (s: string) => s.replace(/[-:]([a-z])/g, (_, c: string) => c.toUpperCase());

function attrName(name: string): string {
  const lower = name.toLowerCase();
  if (ATTR_MAP[lower]) return ATTR_MAP[lower];
  if (lower.startsWith("data-") || lower.startsWith("aria-")) return lower;
  if (name.includes("-") || name.includes(":")) return camel(lower);
  return name;
}

function styleToObject(style: string): string {
  const entries = style
    .split(";")
    .map((decl) => decl.trim())
    .filter(Boolean)
    .map((decl) => {
      const idx = decl.indexOf(":");
      const prop = decl.slice(0, idx).trim();
      const value = decl.slice(idx + 1).trim();
      const key = prop.startsWith("--") ? JSON.stringify(prop) : camel(prop);
      return `${key}: ${JSON.stringify(value)}`;
    });
  return `{{ ${entries.join(", ")} }}`;
}

const escapeText = (t: string) => t.replace(/[{}<>]/g, (ch) => `{"${ch}"}`);

function renderAttrs(el: Element, extra = ""): string {
  const parts: string[] = [];
  for (const attr of Array.from(el.attributes)) {
    const lower = attr.name.toLowerCase();
    if (lower.startsWith("on")) continue; // inline handlers are wired in effects instead
    const name = attrName(attr.name);
    if (lower === "style") {
      parts.push(`style=${styleToObject(attr.value)}`);
    } else if (BOOLEAN_ATTRS.has(lower) && (attr.value === "" || attr.value === lower)) {
      parts.push(name);
    } else {
      parts.push(`${name}=${JSON.stringify(attr.value)}`);
    }
  }
  if (extra) parts.unshift(extra);
  return parts.length ? " " + parts.join(" ") : "";
}

function renderNode(node: Node, depth: number, extraAttr = ""): string[] {
  const pad = "  ".repeat(depth);
  if (node.nodeType === Node.COMMENT_NODE) {
    const text = (node.textContent ?? "").trim().replace(/\*\//g, "* /");
    return text ? [`${pad}{/* ${text} */}`] : [];
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return [];

  const el = node as Element;
  const tag = el.tagName.toLowerCase() === el.tagName ? el.tagName : el.tagName.toLowerCase();
  const attrs = renderAttrs(el, extraAttr);

  if (VOID_TAGS.has(tag)) return [`${pad}<${tag}${attrs} />`];

  const children = Array.from(el.childNodes);
  if (tag === "textarea") {
    const val = el.textContent ?? "";
    return [`${pad}<textarea${attrs}${val ? ` defaultValue=${JSON.stringify(val)}` : ""} />`];
  }
  if (!children.length) return [`${pad}<${tag}${attrs}></${tag}>`];

  const onlyText = children.every((c) => c.nodeType === Node.TEXT_NODE);
  if (onlyText) {
    const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!text) return [`${pad}<${tag}${attrs}></${tag}>`];
    const line = `${pad}<${tag}${attrs}>${escapeText(text)}</${tag}>`;
    if (line.length <= 110) return [line];
    return [`${pad}<${tag}${attrs}>`, `${pad}  ${escapeText(text)}`, `${pad}</${tag}>`];
  }

  const lines = [`${pad}<${tag}${attrs}>`];
  children.forEach((child, i) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const collapsed = (child.textContent ?? "").replace(/\s+/g, " ");
      const prev = children[i - 1];
      const next = children[i + 1];
      const isInline = (n?: Node) =>
        !!n && n.nodeType === Node.ELEMENT_NODE && INLINE_TAGS.has((n as Element).tagName.toLowerCase());
      if (!collapsed.trim()) {
        if (collapsed && isInline(prev) && isInline(next)) lines.push(`${pad}  {" "}`);
        return;
      }
      let t = escapeText(collapsed.trim());
      if (/^\s/.test(collapsed) && isInline(prev)) t = `{" "}${t}`;
      if (/\s$/.test(collapsed) && isInline(next)) t = `${t}{" "}`;
      lines.push(`${pad}  ${t}`);
    } else {
      lines.push(...renderNode(child, depth + 1));
    }
  });
  lines.push(`${pad}</${tag}>`);
  return lines;
}

/** Converts an HTML variant into an equivalent React component (browser only). */
export function htmlToReact(v: HtmlVariant, title: string): ReactVariant {
  const doc = new DOMParser().parseFromString(`<body>${v.html}</body>`, "text/html");
  const roots = Array.from(doc.body.childNodes).filter(
    (n) => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.COMMENT_NODE && n.textContent?.trim()),
  );
  const elementRoots = roots.filter((n) => n.nodeType === Node.ELEMENT_NODE);
  const js = v.js?.trim() ?? "";
  const libs = detectScriptLibs(js);
  const needsRef = Boolean(js);
  const name = toPascalCase(title);

  let jsx: string[];
  if (roots.length === 1 && elementRoots.length === 1) {
    jsx = renderNode(roots[0], 3, needsRef ? "ref={root}" : "");
  } else if (needsRef) {
    jsx = [
      `      <div ref={root} style={{ display: "contents" }}>`,
      ...roots.flatMap((n) => renderNode(n, 4)),
      `      </div>`,
    ];
  } else {
    jsx = [`      <>`, ...roots.flatMap((n) => renderNode(n, 4)), `      </>`];
  }

  const imports: string[] = [];
  let effect = "";
  if (js && libs.gsap) {
    imports.push(`import { useLayoutEffect, useRef } from "react";`, `import gsap from "gsap";`);
    if (libs.scrollTrigger) imports.push(`import { ScrollTrigger } from "gsap/ScrollTrigger";`);
    effect = [
      `  const root = useRef(null);`,
      ``,
      `  useLayoutEffect(() => {`,
      `    // gsap.context scopes selector text to this component and reverts on unmount`,
      `    const ctx = gsap.context(() => {`,
      indent(js, 6),
      `    }, root);`,
      `    return () => ctx.revert();`,
      `  }, []);`,
      ``,
    ].join("\n");
  } else if (js && libs.anime) {
    imports.push(`import { useEffect, useRef } from "react";`, `import anime from "animejs";`);
    effect = [
      `  const root = useRef(null);`,
      ``,
      `  useEffect(() => {`,
      indent(js, 4),
      `    const node = root.current;`,
      `    return () => anime.remove(node.querySelectorAll("*"));`,
      `  }, []);`,
      ``,
    ].join("\n");
  } else if (js) {
    imports.push(`import { useEffect, useRef } from "react";`);
    effect = [`  const root = useRef(null);`, ``, `  useEffect(() => {`, indent(js, 4), `  }, []);`, ``].join("\n");
  }
  imports.push(`import "./styles.css";`);

  const codeText = [
    imports.join("\n"),
    ``,
    `export default function ${name}() {`,
    effect ? effect : null,
    `  return (`,
    jsx.join("\n"),
    `  );`,
    `}`,
    ``,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { code: codeText, css: v.css };
}
