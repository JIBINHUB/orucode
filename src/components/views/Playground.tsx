"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CodeView, { type CodeLang } from "../CodeView";
import LivePreview, { type PreviewMessage } from "../LivePreview";
import { CopyIcon, DownloadIcon, ExternalIcon, ReplayIcon, TrashIcon } from "../Icons";
import { ASSETS, getAsset } from "@/data";
import { buildHtmlDocument, buildHtmlPreview, buildReactPreview, downloadText, openInNewTab } from "@/lib/preview";
import { copyText, useStore } from "@/lib/store";
import type { FrameworkId } from "@/lib/types";
import { getReactVariant } from "@/lib/variants";

interface Draft {
  html: string;
  css: string;
  js: string;
  jsx: string;
  reactCss: string;
}

const BLANK: Draft = {
  html: `<main class="hello">\n  <h1>Hello, Oru ✦</h1>\n  <button class="pill">Get Started</button>\n</main>`,
  css: `body { margin: 0; background: #060708; color: #fff; font-family: system-ui, sans-serif; }\n.hello { min-height: 100vh; display: grid; place-content: center; justify-items: center; gap: 24px; }\n.hello h1 { margin: 0; font-size: 56px; }\n.pill { border: 0; height: 52px; padding: 0 36px; border-radius: 999px; background: #fff; font-weight: 600; box-shadow: 0 0 30px 8px rgba(255,255,255,.3); }`,
  js: `gsap.from(".hello > *", { y: 30, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" });`,
  jsx: `import { motion } from "framer-motion";\nimport "./styles.css";\n\nexport default function App() {\n  return (\n    <main className="hello">\n      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>Hello, Oru ✦</motion.h1>\n      <motion.button className="pill" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>Get Started</motion.button>\n    </main>\n  );\n}`,
  reactCss: "",
};
BLANK.reactCss = BLANK.css;

const KEY = "oru:playground";

export default function Playground() {
  const params = useSearchParams();
  const { toast } = useStore();
  const [framework, setFramework] = useState<FrameworkId>("html");
  const [draft, setDraft] = useState<Draft>(BLANK);
  const [tab, setTab] = useState(0);
  const [debounced, setDebounced] = useState<Draft>(BLANK);
  const [logs, setLogs] = useState<PreviewMessage[]>([]);
  const [reload, setReload] = useState(0);
  const [source, setSource] = useState("blank");
  const [doc, setDoc] = useState("");

  const load = useCallback((id: string, fw?: FrameworkId) => {
    const asset = getAsset(id);
    if (!asset) {
      setDraft(BLANK);
      setSource("blank");
      return;
    }
    const rv = getReactVariant(asset);
    const next: Draft = {
      html: asset.html?.html ?? "",
      css: asset.html?.css ?? "",
      js: asset.html?.js ?? "",
      jsx: rv?.code ?? BLANK.jsx,
      reactCss: rv?.css ?? asset.html?.css ?? "",
    };
    setDraft(next);
    setDebounced(next);
    setSource(id);
    setFramework(fw ?? (asset.html ? "html" : "react"));
    setLogs([]);
  }, []);

  useEffect(() => {
    const id = params.get("id");
    const fw = params.get("fw") === "react" ? "react" : params.get("fw") === "html" ? "html" : undefined;
    if (id) return load(id, fw);
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { draft: Draft; framework: FrameworkId };
        setDraft(parsed.draft);
        setDebounced(parsed.draft);
        setFramework(parsed.framework);
      }
    } catch {
      /* ignore */
    }
  }, [params, load]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(draft);
      try {
        localStorage.setItem(KEY, JSON.stringify({ draft, framework }));
      } catch {
        /* ignore */
      }
    }, 450);
    return () => clearTimeout(t);
  }, [draft, framework]);

  useEffect(() => setTab(0), [framework]);

  const tabs: { name: string; key: keyof Draft; lang: CodeLang }[] =
    framework === "html"
      ? [
          { name: "index.html", key: "html", lang: "html" },
          { name: "styles.css", key: "css", lang: "css" },
          { name: "script.js", key: "js", lang: "js" },
        ]
      : [
          { name: "App.jsx", key: "jsx", lang: "jsx" },
          { name: "styles.css", key: "reactCss", lang: "css" },
        ];
  const current = tabs[Math.min(tab, tabs.length - 1)];

  useEffect(() => {
    let cancelled = false;
    const pending =
      framework === "html"
        ? buildHtmlPreview({ html: debounced.html, css: debounced.css, js: debounced.js }, "Playground")
        : buildReactPreview({ code: debounced.jsx, css: debounced.reactCss }, "Playground");
    pending
      .then((built) => {
        if (cancelled) return;
        setLogs([]);
        setDoc(built);
      })
      .catch((err) => !cancelled && setLogs([{ level: "error", message: String(err) }]));
    return () => {
      cancelled = true;
    };
  }, [debounced, framework]);

  const onMessage = useCallback((m: PreviewMessage) => setLogs((l) => [...l.slice(-80), m]), []);

  const exportDoc = () => buildHtmlDocument({ html: draft.html, css: draft.css, js: draft.js }, { mode: "export", title: "Oru playground" });

  return (
    <>
      <div className="page-head" style={{ margin: "6px 0 14px" }}>
        <div>
          <h1 className="h1" style={{ fontSize: "clamp(28px,3vw,40px)" }}>
            Live <span className="muted">Playground</span>
          </h1>
        </div>
        <div className="row wrap">
          <select className="select" value={source} onChange={(e) => load(e.target.value)} aria-label="Start from a design">
            <option value="blank">Blank starter</option>
            {ASSETS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
          <div className="seg">
            <button className={`seg-btn ${framework === "html" ? "active" : ""}`} onClick={() => setFramework("html")}>
              HTML / CSS / JS
            </button>
            <button className={`seg-btn ${framework === "react" ? "active" : ""}`} onClick={() => setFramework("react")}>
              React
            </button>
          </div>
        </div>
      </div>

      <div className="pg">
        <div className="panel">
          <div className="pg-bar">
            <div className="text-tabs">
              {tabs.map((t, i) => (
                <button key={t.name} className={`text-tab ${i === tab ? "active" : ""}`} onClick={() => setTab(i)}>
                  {t.name}
                </button>
              ))}
            </div>
            <div className="row">
              <button className="icon-btn sm" onClick={() => copyText(draft[current.key]).then(() => toast(`${current.name} copied`))} aria-label="Copy file">
                <CopyIcon size={14} />
              </button>
              <button
                className="icon-btn sm"
                onClick={() => (framework === "html" ? downloadText("index.html", exportDoc(), "text/html") : downloadText("App.jsx", draft.jsx))}
                aria-label="Download"
              >
                <DownloadIcon size={14} />
              </button>
              <button className="icon-btn sm" onClick={() => source === "blank" ? setDraft(BLANK) : load(source, framework)} aria-label="Reset">
                <TrashIcon size={14} />
              </button>
            </div>
          </div>
          <div className="pg-editor">
            <CodeView
              key={`${framework}-${current.key}`}
              value={draft[current.key]}
              lang={current.lang}
              editable
              height="100%"
              onChange={(value) => setDraft((d) => ({ ...d, [current.key]: value }))}
            />
          </div>
        </div>

        <div className="panel">
          <div className="pg-bar">
            <span className="muted" style={{ fontSize: 13 }}>
              Preview updates as you type
            </span>
            <div className="row">
              {framework === "html" && (
                <button className="icon-btn sm" onClick={() => openInNewTab(exportDoc())} aria-label="Open in new tab">
                  <ExternalIcon size={14} />
                </button>
              )}
              <button className="icon-btn sm" onClick={() => { setLogs([]); setReload((r) => r + 1); }} aria-label="Rerun">
                <ReplayIcon size={14} />
              </button>
            </div>
          </div>
          <div className="pg-preview">
            <LivePreview doc={doc} title="Playground preview" reloadKey={reload} onMessage={onMessage} />
          </div>
          <div className="console">
            <div className="console-head">
              <span>Console {logs.length > 0 && `(${logs.length})`}</span>
              {logs.length > 0 && (
                <button onClick={() => setLogs([])} style={{ fontSize: 12 }}>
                  Clear
                </button>
              )}
            </div>
            {logs.length === 0 ? (
              <div className="console-row">No output. console.log() and errors from the preview appear here.</div>
            ) : (
              logs.map((l, i) => (
                <div key={i} className={`console-row ${l.level}`}>
                  {l.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
