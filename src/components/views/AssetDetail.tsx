"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AssetCard from "../AssetCard";
import CodeView, { type CodeLang } from "../CodeView";
import { BrowserFrame, PhoneFrame, TabletFrame } from "../Devices";
import LivePreview from "../LivePreview";
import {
  CheckIcon,
  ChevronLeft,
  CopyIcon,
  DownloadIcon,
  ExternalIcon,
  HeartFilled,
  HeartIcon,
  MonitorIcon,
  PhoneIcon,
  ReplayIcon,
  TabletIcon,
} from "../Icons";
import { ASSETS, getAsset, getPrompt } from "@/data";
import { buildHtmlDocument, detectReactImports, downloadText, installCommand, openInNewTab } from "@/lib/preview";
import { copyText, useStore } from "@/lib/store";
import { CATEGORY_MAP, COMPLEXITIES, LIBRARY_MAP } from "@/lib/taxonomy";
import type { FrameworkId } from "@/lib/types";
import { defaultFramework, getReactVariant } from "@/lib/variants";

type Device = "desktop" | "tablet" | "mobile";

export default function AssetDetail({ id }: { id: string }) {
  const asset = getAsset(id)!;
  const { isFavorite, toggleFavorite, pushRecent, toast } = useStore();
  const [framework, setFramework] = useState<FrameworkId>(defaultFramework(asset));
  const [device, setDevice] = useState<Device>(CATEGORY_MAP[asset.category].kind === "page" ? "desktop" : "desktop");
  const [reload, setReload] = useState(0);
  const [file, setFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [reactVariant, setReactVariant] = useState(() => (asset.react && asset.react !== "auto" ? asset.react : null));

  useEffect(() => {
    pushRecent(asset.id);
    setReactVariant(getReactVariant(asset));
  }, [asset, pushRecent]);

  useEffect(() => setFile(0), [framework]);

  const files = useMemo<{ name: string; lang: CodeLang; code: string }[]>(() => {
    if (framework === "react" && reactVariant) {
      return [
        { name: "App.jsx", lang: "jsx", code: reactVariant.code },
        ...(reactVariant.css ? [{ name: "styles.css", lang: "css" as const, code: reactVariant.css }] : []),
      ];
    }
    if (!asset.html) return [];
    return [
      { name: "index.html", lang: "html", code: asset.html.html },
      { name: "styles.css", lang: "css", code: asset.html.css },
      ...(asset.html.js ? [{ name: "script.js", lang: "js" as const, code: asset.html.js }] : []),
      { name: "Full document", lang: "html", code: buildHtmlDocument(asset.html, { mode: "export", title: asset.title }) },
    ];
  }, [framework, reactVariant, asset]);

  const current = files[Math.min(file, files.length - 1)];
  const install =
    framework === "react" && reactVariant
      ? installCommand(detectReactImports(reactVariant.code))
      : asset.html?.js && /gsap|anime/.test(asset.html.js)
        ? "Loaded via CDN <script> tags — see “Full document”"
        : null;

  const fav = isFavorite(asset.id);
  const siblings = ASSETS.filter((a) => a.category === asset.category);
  const idx = siblings.findIndex((a) => a.id === asset.id);
  const prev = siblings[idx - 1];
  const next = siblings[idx + 1];
  const related = ASSETS.filter(
    (a) => a.id !== asset.id && (a.category === asset.category || a.libraries.some((l) => asset.libraries.includes(l))),
  ).slice(0, 4);
  const prompt = asset.promptId ? getPrompt(asset.promptId) : undefined;

  const copy = async () => {
    if (!current) return;
    await copyText(current.code);
    setCopied(true);
    toast(`${current.name} copied`);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    if (framework === "react" && reactVariant) {
      downloadText("App.jsx", reactVariant.code);
      if (reactVariant.css) downloadText("styles.css", reactVariant.css);
    } else if (asset.html) {
      downloadText(`${asset.id}.html`, buildHtmlDocument(asset.html, { mode: "export", title: asset.title }), "text/html");
    }
  };

  const preview = (width?: number) => (
    <LivePreview asset={asset} framework={framework} title={asset.title} reloadKey={reload} virtualWidth={width} />
  );

  return (
    <>
      <div className="row" style={{ marginTop: 6 }}>
        <Link href={`/library?cat=${asset.category}`} className="icon-btn sm" aria-label="Back">
          <ChevronLeft size={16} />
        </Link>
        <div className="breadcrumb">
          <Link href="/library">Library</Link> / <Link href={`/library?cat=${asset.category}`}>{CATEGORY_MAP[asset.category].label}</Link>
        </div>
      </div>

      <div className="detail-head">
        <div>
          <div className="row wrap">
            {asset.libraries.map((l) => (
              <span key={l} className="pill ghost">
                <span className="orb" style={{ color: LIBRARY_MAP[l].color }} /> {LIBRARY_MAP[l].label}
              </span>
            ))}
            <span className="pill ghost">{COMPLEXITIES.find((c) => c.id === asset.complexity)?.label}</span>
          </div>
          <h1 className="h1">{asset.title}</h1>
          <p className="lead" style={{ marginTop: 10 }}>
            {asset.description}
          </p>
        </div>
        <div className="detail-actions">
          <button className={`icon-btn ${fav ? "on" : ""}`} onClick={() => toggleFavorite(asset.id)} aria-label="Favorite">
            {fav ? <HeartFilled /> : <HeartIcon />}
          </button>
          {asset.html && (
            <button
              className="icon-btn"
              onClick={() => openInNewTab(buildHtmlDocument(asset.html!, { mode: "export", title: asset.title }))}
              aria-label="Open in new tab"
            >
              <ExternalIcon />
            </button>
          )}
          <button className="icon-btn" onClick={download} aria-label="Download">
            <DownloadIcon />
          </button>
          <Link href={`/playground?id=${asset.id}&fw=${framework}`} className="btn btn-primary">
            Edit in Playground
          </Link>
        </div>
      </div>

      <div className="panel stage">
        <div className="stage-bar">
          <div className="text-tabs">
            {asset.html && (
              <button className={`text-tab ${framework === "html" ? "active" : ""}`} onClick={() => setFramework("html")}>
                HTML / CSS
              </button>
            )}
            {asset.react && (
              <button className={`text-tab ${framework === "react" ? "active" : ""}`} onClick={() => setFramework("react")}>
                React
              </button>
            )}
          </div>
          <div className="row">
            <div className="seg" role="group" aria-label="Device">
              {(
                [
                  ["desktop", <MonitorIcon key="d" size={16} />],
                  ["tablet", <TabletIcon key="t" size={16} />],
                  ["mobile", <PhoneIcon key="m" size={16} />],
                ] as const
              ).map(([d, icon]) => (
                <button key={d} className={`seg-btn icon ${device === d ? "active" : ""}`} onClick={() => setDevice(d)} aria-label={d}>
                  {icon}
                </button>
              ))}
            </div>
            <button className="icon-btn sm" onClick={() => setReload((r) => r + 1)} aria-label="Replay">
              <ReplayIcon size={15} />
            </button>
          </div>
        </div>
        <div className={`stage-canvas ${device === "desktop" ? "desktop" : ""}`}>
          {device === "desktop" && <BrowserFrame url={`oru.ui/${asset.id}`}>{preview()}</BrowserFrame>}
          {device === "tablet" && (
            <div className="tablet-wrap">
              <TabletFrame>{preview(768)}</TabletFrame>
            </div>
          )}
          {device === "mobile" && (
            <div className="phone-wrap">
              <PhoneFrame>{preview(390)}</PhoneFrame>
            </div>
          )}
        </div>
      </div>

      <div className="detail-grid">
        <div className="panel code-panel">
          <div className="code-bar">
            <div className="text-tabs">
              {files.map((f, i) => (
                <button key={f.name} className={`text-tab ${i === file ? "active" : ""}`} onClick={() => setFile(i)}>
                  {f.name}
                </button>
              ))}
            </div>
            <button className="btn btn-outline btn-sm" onClick={copy} disabled={!current}>
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="code-body">
            {current ? <CodeView key={`${framework}-${current.name}`} value={current.code} lang={current.lang} /> : <pre className="code-fallback">Preparing React component…</pre>}
          </div>
          {install && (
            <div className="install-strip">
              <span>$</span>
              <code>{install}</code>
              {install.startsWith("npm") && (
                <button className="icon-btn sm" style={{ marginLeft: "auto" }} onClick={() => copyText(install).then(() => toast("Install command copied"))} aria-label="Copy install command">
                  <CopyIcon size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        <aside className="panel meta-panel">
          <div>
            <h4>Animation libraries</h4>
            {asset.libraries.map((l) => (
              <a key={l} href={LIBRARY_MAP[l].docs} target="_blank" rel="noreferrer" className="meta-lib">
                <span className="orb" style={{ color: LIBRARY_MAP[l].color, marginTop: 5 }} />
                <span>
                  <b>{LIBRARY_MAP[l].label}</b>
                  <p>{LIBRARY_MAP[l].blurb}</p>
                </span>
              </a>
            ))}
          </div>
          <dl className="kv">
            <dt>Category</dt>
            <dd>{CATEGORY_MAP[asset.category].label}</dd>
            <dt>Frameworks</dt>
            <dd>{[asset.html && "HTML/CSS", asset.react && "React"].filter(Boolean).join(" · ")}</dd>
            <dt>Tone</dt>
            <dd style={{ textTransform: "capitalize" }}>{asset.tone}</dd>
            <dt>Added</dt>
            <dd>{new Date(asset.added).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</dd>
          </dl>
          {asset.credit && (
            <a
              href={asset.credit.url}
              target="_blank"
              rel="noreferrer"
              className="dim"
              style={{ fontSize: 12.5, display: "inline-block" }}
              title={`${asset.credit.license} license — ${asset.credit.source}`}
            >
              By @{asset.credit.author} on {asset.credit.source}
            </a>
          )}
          <div>
            <h4>Tags</h4>
            <div className="tag-list">
              {asset.tags.map((t) => (
                <Link key={t} href={`/library?q=${encodeURIComponent(t)}`}>
                  #{t}
                </Link>
              ))}
            </div>
          </div>
          {prompt && (
            <Link href={`/prompts?open=${prompt.id}`} className="btn btn-outline">
              View website prompt
            </Link>
          )}
        </aside>
      </div>

      {(prev || next) && (
        <div className="pager">
          {prev ? (
            <Link href={`/asset/${prev.id}`}>
              <small>Previous</small>
              <b>{prev.title}</b>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/asset/${next.id}`}>
              <small>Next</small>
              <b>{next.title}</b>
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}

      {related.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="h2">
              More like <span className="muted">this</span>
            </h2>
          </div>
          <div className="grid-cards">
            {related.map((a) => (
              <AssetCard key={a.id} asset={a} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
