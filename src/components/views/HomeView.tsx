"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import AssetCard from "../AssetCard";
import { Arrow, ArrowTile, Asterisk, Blob, CircleBadge, LabelPill, LeafLogo, Ring, Smiley } from "../Brand";
import LivePreview from "../LivePreview";
import { ArrowRight, BookmarkFilled, CATEGORY_GLYPHS, PromptGlyph, WandIcon } from "../Icons";
import { ASSETS, CATEGORY_COUNTS, LIBRARY_COUNTS, PROMPTS } from "@/data";
import { useStore } from "@/lib/store";
import { CATEGORIES, CATEGORY_MAP, LIBRARIES } from "@/lib/taxonomy";
import type { CategoryId } from "@/lib/types";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const leafReveal = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const leafItem = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const } },
};

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
              <Link key={c.id} href={`/library?cat=${c.id}`} className="cat-tile">
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
        <motion.div
          className="leaf-cta"
          variants={leafReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="leaf-stickers" aria-hidden="true">
            <span className="leaf-glow" />
            <span className="lst" style={{ left: "5%", top: "15%", "--r": "-12deg" } as CSSProperties}>
              <Asterisk size={46} />
            </span>
            <span className="lst" style={{ left: "12%", top: "34%", "--r": "-7deg", animationDelay: "-1.2s" } as CSSProperties}>
              <LabelPill variant="white">Design</LabelPill>
            </span>
            <span className="lst" style={{ left: "4%", top: "52%", animationDelay: "-2.4s" } as CSSProperties}>
              <Blob size={74} color="rgba(255,255,255,.32)" />
            </span>
            <span className="lst" style={{ left: "9%", top: "76%", "--r": "-10deg", animationDelay: "-3.1s" } as CSSProperties}>
              <Smiley size={48} />
            </span>
            <span className="lst" style={{ right: "5%", top: "11%", animationDelay: "-0.6s" } as CSSProperties}>
              <CircleBadge text="LEAF CREATIONISM • WEB • APP • BRAND • " size={96} />
            </span>
            <span className="lst" style={{ right: "17%", top: "30%", "--r": "8deg", animationDelay: "-1.8s" } as CSSProperties}>
              <Arrow size={44} />
            </span>
            <span className="lst" style={{ right: "6%", top: "48%", "--r": "11deg", animationDelay: "-2.9s" } as CSSProperties}>
              <ArrowTile size={62} />
            </span>
            <span className="lst" style={{ right: "10%", top: "74%", "--r": "13deg", animationDelay: "-3.7s" } as CSSProperties}>
              <LabelPill>Build</LabelPill>
            </span>
            <span className="lst" style={{ left: "22%", top: "8%", "--r": "6deg", animationDelay: "-4.3s" } as CSSProperties}>
              <Ring size={82} color="rgba(255,255,255,.3)" />
            </span>
          </div>

          <motion.span className="leaf-logo" variants={leafItem}>
            <LeafLogo size={64} />
          </motion.span>
          <motion.h2 variants={leafItem}>Finding it hard to design or build your website or app?</motion.h2>
          <motion.p variants={leafItem}>
            Leaf Creationism designs and builds fast, modern sites and apps — talk to our team about yours.
          </motion.p>
          <motion.div className="btn-row-cta" variants={leafItem}>
            <a href="https://leafcreationism.in" target="_blank" rel="noreferrer" className="btn btn-light">
              Talk to Leaf Creationism <ArrowRight size={16} />
            </a>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
