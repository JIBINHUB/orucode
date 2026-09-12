"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CloseIcon, CopyIcon, HeartFilled, HeartIcon, SearchIcon, CATEGORY_GLYPHS } from "../Icons";
import { PROMPTS } from "@/data";
import { searchPrompts } from "@/lib/search";
import { copyText, useStore } from "@/lib/store";
import { LIBRARIES, LIBRARY_MAP } from "@/lib/taxonomy";
import type { CategoryId, LibraryId } from "@/lib/types";

const TINTS = ["#ff3131", "#ff8a3d", "#1c1c1e", "#ffb3a3"];
const SITE_TYPES: { id: string; label: string; glyph: CategoryId }[] = [
  { id: "SaaS product", label: "SaaS", glyph: "features" },
  { id: "portfolio", label: "Portfolio", glyph: "cards" },
  { id: "e-commerce store", label: "E-commerce", glyph: "pricing" },
  { id: "creative agency", label: "Agency", glyph: "logos" },
  { id: "event discovery app", label: "Events", glyph: "heroes" },
  { id: "restaurant", label: "Restaurant", glyph: "cta" },
];
const SECTIONS = ["Loader", "Navbar", "Hero", "Features", "Pricing", "Testimonials", "Stats", "FAQ", "Contact", "Footer"];
const STYLES = ["Dark glassmorphism", "Minimal light", "Editorial", "Brutalist", "Playful gradient"];

export default function PromptsView() {
  const params = useSearchParams();
  const router = useRouter();
  const { isFavorite, toggleFavorite, toast } = useStore();
  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState("All");
  const openId = params.get("open");
  const open = PROMPTS.find((p) => p.id === openId);

  const [siteType, setSiteType] = useState(SITE_TYPES[4].id);
  const [sections, setSections] = useState<string[]>(["Loader", "Navbar", "Hero", "Features", "Footer"]);
  const [style, setStyle] = useState(STYLES[0]);
  const [lib, setLib] = useState<LibraryId>("gsap");
  const [brand, setBrand] = useState("ORU CODE");

  const industries = ["All", ...new Set(PROMPTS.map((p) => p.industry))];
  const results = useMemo(() => {
    const hits = searchPrompts(PROMPTS, q);
    return PROMPTS.filter((p) => (!hits || hits.has(p.id)) && (industry === "All" || p.industry === industry));
  }, [q, industry]);

  const generated = `Build a complete, responsive ${siteType} website called "${brand || "Untitled"}".

Visual style: ${style}. Use CSS custom properties for colours, spacing and radii; consistent rounded corners; clear typographic hierarchy with a bold display font for headlines.

Sections (in order):
${sections.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Animation: use ${LIBRARY_MAP[lib].label} for motion — ${LIBRARY_MAP[lib].blurb.toLowerCase()} Include a loading/intro animation, staggered entrance reveals, and hover micro-interactions. Respect prefers-reduced-motion.

Deliver: semantic HTML/CSS/JS and an equivalent React component version, mobile-first responsive layout (360px → 1440px), accessible focus states and ARIA labels, and realistic placeholder copy.`;

  const copy = (text: string, label = "Prompt copied") => copyText(text).then(() => toast(label));

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="h1">
            Website <span className="muted">Prompts</span>
          </h1>
          <p className="lead">Copy-ready prompts for complete websites, plus a builder to compose your own.</p>
        </div>
      </div>

      <div className="text-tabs" style={{ marginBottom: 14 }}>
        {industries.map((i) => (
          <button key={i} className={`text-tab ${industry === i ? "active" : ""}`} onClick={() => setIndustry(i)}>
            {i}
          </button>
        ))}
      </div>
      <div className="toolbar">
        <label className="search-field">
          <SearchIcon size={17} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search prompts by industry, section, style…" aria-label="Search prompts" />
        </label>
      </div>

      <div className="prompt-grid">
        {results.map((p, i) => {
          const fav = isFavorite(`p:${p.id}`);
          return (
            <article key={p.id} className="prompt-card" style={{ "--tint": TINTS[i % TINTS.length] } as React.CSSProperties}>
              <div className="row between">
                <span className="pill">{p.industry}</span>
                <button className={`acard-heart ${fav ? "on" : ""}`} onClick={() => toggleFavorite(`p:${p.id}`)} aria-label="Favorite prompt">
                  {fav ? <HeartFilled size={16} /> : <HeartIcon size={16} />}
                </button>
              </div>
              <h3 className="h2" style={{ fontSize: 24 }}>
                {p.title}
              </h3>
              <p>{p.prompt}</p>
              <div className="sections">
                {p.sections.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              <div className="foot">
                <button className="btn btn-primary btn-sm" onClick={() => copy(p.prompt)}>
                  <CopyIcon size={14} /> Copy
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => router.replace(`/prompts?open=${p.id}`, { scroll: false })}>
                  Read full
                </button>
                <span style={{ marginLeft: "auto" }} className="row">
                  {p.libraries.map((l) => (
                    <span key={l} className="orb" title={LIBRARY_MAP[l].label} style={{ color: LIBRARY_MAP[l].color }} />
                  ))}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <section className="section">
        <div className="section-head">
          <h2 className="h2">
            Prompt <span className="muted">Builder</span>
          </h2>
        </div>
        <div className="panel builder">
          <div>
            <div className="builder-step">
              <h4>Choose Category’s</h4>
              <div className="builder-tiles">
                {SITE_TYPES.map((t) => {
                  const Glyph = CATEGORY_GLYPHS[t.glyph];
                  return (
                    <button key={t.id} className={`cat-tile ${siteType === t.id ? "active" : ""}`} onClick={() => setSiteType(t.id)}>
                      <Glyph size={24} className="cat-icon" />
                      <span className="label">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="builder-step">
              <h4>Brand name</h4>
              <label className="search-field" style={{ maxWidth: 320 }}>
                <input value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Brand name" />
              </label>
            </div>
            <div className="builder-step">
              <h4>Sections</h4>
              <div className="chip-row">
                {SECTIONS.map((s) => (
                  <button
                    key={s}
                    className={`chip ${sections.includes(s) ? "active" : ""}`}
                    onClick={() => setSections((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : SECTIONS.filter((x) => cur.includes(x) || x === s)))}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="builder-step">
              <h4>Style</h4>
              <div className="chip-row">
                {STYLES.map((s) => (
                  <button key={s} className={`chip ${style === s ? "active" : ""}`} onClick={() => setStyle(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="builder-step">
              <h4>Animation library</h4>
              <div className="chip-row">
                {LIBRARIES.map((l) => (
                  <button key={l.id} className={`chip ${lib === l.id ? "active" : ""}`} onClick={() => setLib(l.id)}>
                    <span className="orb" style={{ color: l.color }} /> {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="builder-output">
            <textarea value={generated} readOnly aria-label="Generated prompt" />
            <button className="btn btn-primary" onClick={() => copy(generated)} style={{ alignSelf: "center", minWidth: 200 }}>
              Get Started — Copy prompt
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && router.replace("/prompts", { scroll: false })}
          >
            <motion.div className="modal" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
              <div className="code-bar">
                <div>
                  <span className="pill ghost">{open.industry}</span>
                  <h3 className="h2" style={{ marginTop: 10 }}>
                    {open.title}
                  </h3>
                </div>
                <div className="row">
                  <button className="btn btn-primary btn-sm" onClick={() => copy(open.prompt)}>
                    <CopyIcon size={14} /> Copy
                  </button>
                  <button className="icon-btn sm" onClick={() => router.replace("/prompts", { scroll: false })} aria-label="Close">
                    <CloseIcon size={15} />
                  </button>
                </div>
              </div>
              <div className="modal-body">
                <pre>{open.prompt}</pre>
                {open.relatedAssetIds?.length ? (
                  <div className="row wrap" style={{ marginTop: 20 }}>
                    <span className="muted" style={{ fontSize: 13 }}>
                      Matching designs:
                    </span>
                    {open.relatedAssetIds.map((id) => (
                      <Link key={id} href={`/asset/${id}`} className="chip">
                        {id.replace(/-/g, " ")}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
