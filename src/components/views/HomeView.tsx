"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import AssetCard from "../AssetCard";
import CommunityCard from "../CommunityCard";
import { LeafLogo } from "../Brand";
import LeafStickers from "../LeafStickers";
import LivePreview from "../LivePreview";
import { ArrowRight, BookmarkFilled, CATEGORY_GLYPHS, PlusIcon, PromptGlyph, WandIcon } from "../Icons";
import { ASSETS, CATEGORY_COUNTS, LIBRARY_COUNTS, PROMPTS } from "@/data";
import { FAQS, designsPath } from "@/lib/seo";
import { SERVICES, servicePath } from "@/lib/services";
import { useStore } from "@/lib/store";
import { CATEGORIES, CATEGORY_MAP, LIBRARIES } from "@/lib/taxonomy";
import type { CategoryId } from "@/lib/types";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

// Each piece watches its own visibility, so the fade-in can't be stranded by a wrapper.
const reveal = (i: number) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, delay: 0.05 + i * 0.12, ease: [0.2, 0.8, 0.2, 1] as const },
});

function IdeaHead({ step, title, sub }: { step: number; title: string; sub: string }) {
  return (
    <div className="idea-head">
      <span className="step">{step}</span>
      <h2 className="idea-title">{title}</h2>
      <p className="idea-sub">{sub}</p>
    </div>
  );
}

export default function HomeView() {
  const { setPaletteOpen } = useStore();
  const [tab, setTab] = useState<"all" | CategoryId>("all");

  const tabs = useMemo(() => {
    const present = CATEGORIES.filter((c) => CATEGORY_COUNTS[c.id]);
    return [{ id: "all" as const, label: "All" }, ...present.map((c) => ({ id: c.id, label: c.label }))];
  }, []);

  const featured = ASSETS.filter((a) => (tab === "all" ? a.featured : a.category === tab));
  const fresh = [...ASSETS].sort((a, b) => b.added.localeCompare(a.added)).slice(0, 4);

  return (
    <>
      <section className="cover">
        <div className="corner-row">
          <span className="corner-label">Code Library</span>
          <span className="corner-label">Animation Showcase</span>
        </div>

        <div className="cover-center rise">
          <Link href="/library" className="save-pill">
            <span className="save-label">
              <BookmarkFilled size={20} /> Save This
            </span>
            <span className="save-part">{plural(ASSETS.length, "Design")}</span>
          </Link>
          <h1 className="cover-title">UI, Code &amp; Motion to Steal</h1>
          <p className="cover-sub">for Your Next Project</p>
          <div className="hero-actions">
            <Link href="/library" className="btn btn-primary" style={{ minWidth: 170 }}>
              Browse library
            </Link>
            <button className="btn btn-outline" onClick={() => setPaletteOpen(true)}>
              Search <span className="kbd">⌘K</span>
            </button>
          </div>
        </div>

        <div className="cover-card rise" style={{ animationDelay: "0.15s" }}>
          <Link href="/library" className="cover-card-badge">
            <span className="ccb-icon">
              <WandIcon size={16} />
            </span>
            <span className="ccb-text">
              <b>You can build a site like this</b>
              <small>with our code &amp; designs — free to copy</small>
            </span>
            <ArrowRight size={14} className="ccb-arrow" />
          </Link>
          <a href="https://coveomusic.com" target="_blank" rel="noreferrer" className="cover-card-source">
            coveomusic.com <ArrowRight size={13} />
          </a>
          <LivePreview
            src="https://coveomusic.com/"
            title="Live reference: coveomusic.com"
            virtualWidth={1280}
            interactive={false}
          />
        </div>

        <div className="cover-foot">
          <span>oru.code</span>
          <Link href="/library">
            Swipe for More <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <section className="section">
        <IdeaHead step={1} title="Fresh Visuals" sub="Hand-picked designs with live previews and copy-ready code." />
        <div className="text-tabs" role="tablist" style={{ justifyContent: "center", marginBottom: 22 }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`text-tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="hscroll">
          <AnimatePresence mode="popLayout" initial={false}>
            {featured.map((a) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35 }}
              >
                <AssetCard asset={a} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <section className="section">
        <IdeaHead step={2} title="Browse by Category" sub="Every section, page and animation, neatly organised." />
        <div className="cat-grid">
          {CATEGORIES.map((c) => {
            const Glyph = CATEGORY_GLYPHS[c.id];
            return (
              <Link
                key={c.id}
                href={CATEGORY_COUNTS[c.id] ? designsPath(c.id) : `/library?cat=${c.id}`}
                className="cat-tile"
              >
                <span className="icon-tile">
                  <Glyph size={24} className="cat-icon" />
                </span>
                <span className="label">{c.label}</span>
                <span className="count">{plural(CATEGORY_COUNTS[c.id] ?? 0, "design")}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section">
        <IdeaHead step={3} title="Motion, Your Way" sub="Turn timelines, springs and line-draws into easy-to-reuse code." />
        <div className="dark-card">
          <div className="dark-card-top">
            <div>
              <span className="dark-kicker">Animation libraries</span>
              <b className="dark-title">Pick your engine</b>
            </div>
            <Link href="/library?kind=animation" className="icon-btn dark" aria-label="Browse animations">
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="lib-grid">
            {LIBRARIES.map((l) => (
              <Link key={l.id} href={`/library?lib=${l.id}`} className="lib-tile">
                <span className="orb" style={{ color: l.color === "#1c1c1e" ? "#ffffff" : l.color, width: 12, height: 12 }} />
                <h3 className="h3">{l.label}</h3>
                <p style={{ margin: 0, fontSize: 14 }}>{l.blurb}</p>
                <div className="foot">
                  <span className="mono">{l.install}</span>
                  <span className="n">{plural(LIBRARY_COUNTS[l.id] ?? 0, "design")}</span>
                </div>
              </Link>
            ))}
          </div>
          <svg className="wave" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="oru-wave" x1="0" x2="1">
                <stop offset="0" stopColor="#ff8a3d" />
                <stop offset="1" stopColor="#ff3131" />
              </linearGradient>
            </defs>
            <path
              d="M0 80C40 30 70 110 110 70S180 10 220 60 280 115 320 50 400 45 440 62 500 112 545 52 620 72 680 35 740 44 820 78 880 40 1000 26"
              fill="none"
              stroke="url(#oru-wave)"
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="months" aria-hidden="true">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m) => (
              <span key={m} className={m === "Jun" ? "on" : ""}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <IdeaHead step={4} title="Latest Drops" sub="New designs added to the library, freshest first." />
        <div className="fresh-list">
          {fresh.map((a) => {
            const Glyph = CATEGORY_GLYPHS[a.category];
            return (
              <Link key={a.id} href={`/asset/${a.id}`} className="fresh-row">
                <span className="glyph">
                  <Glyph size={26} />
                </span>
                <span>
                  <b>{a.title}</b>
                  <small>
                    {CATEGORY_MAP[a.category].label} · {a.description}
                  </small>
                </span>
                <span className="icon-btn sm">
                  <ArrowRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {PROMPTS[0] && (
        <section className="section">
          <IdeaHead step={5} title="Start With a Prompt" sub="Use a full website brief to make your next build easier." />
          <div className="dot-card">
            <span className="icon-tile lg">
              <PromptGlyph size={34} />
            </span>
            <h3 className="dot-title">Generate a complete website brief</h3>
            <p className="dot-sub">Pick a site type, sections and motion library — get a detailed prompt in seconds.</p>
            <pre className="dot-pre">{PROMPTS[0].prompt}</pre>
            <div className="btn-row">
              <Link href="/prompts" className="btn btn-outline">
                Browse prompts
              </Link>
              <Link href="/prompts" className="btn btn-primary">
                Open builder
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <IdeaHead
          step={6}
          title="Free Designs for Your Business"
          sub="Pick your business — get free section designs, code and a ready-made AI prompt for the whole site."
        />
        <div className="seo-links svc-home">
          {SERVICES.map((s) => (
            <Link key={s.slug} href={servicePath(s.slug)} className="chip">
              {s.icon} {s.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="section" id="community">
        <CommunityCard />
      </section>

      <section className="section" id="faq">
        <IdeaHead step={7} title="Questions, Answered" sub="The things people usually ask about ORU CODE." />
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <details key={f.q} className="faq-item" open={i === 0}>
              <summary>
                <h3>{f.q}</h3>
                <span className="faq-icon" aria-hidden="true">
                  <PlusIcon size={16} />
                </span>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <motion.div
          className="lc"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
            e.currentTarget.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.setProperty("--mx", "0");
            e.currentTarget.style.setProperty("--my", "0");
          }}
        >
          <div className="lc-copy">
            <motion.span className="lc-tag" {...reveal(0)}>
              <LeafLogo size={22} /> Leaf Creationism
            </motion.span>
            <motion.h2 className="lc-title" {...reveal(1)}>
              Finding it hard to design or build your <em>website or app?</em>
            </motion.h2>
            <motion.p className="lc-text" {...reveal(2)}>
              Leaf Creationism designs and builds fast, modern sites and apps — talk to our team about yours.
            </motion.p>
            <motion.div className="lc-actions" {...reveal(3)}>
              <a href="https://leafcreationism.in" target="_blank" rel="noreferrer" className="btn btn-light">
                Talk to Leaf Creationism <ArrowRight size={16} />
              </a>
              <span className="lc-url">leafcreationism.in</span>
            </motion.div>
          </div>
          <LeafStickers />
        </motion.div>
      </section>
    </>
  );
}
