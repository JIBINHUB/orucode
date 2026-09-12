"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ASSETS, PROMPTS, getAsset } from "@/data";
import { CATEGORY_GLYPHS, ArrowRight, FavGlyph, PlayGlyph, PromptGlyph, SearchIcon, GridIcon } from "./Icons";
import { searchAssets, searchPrompts } from "@/lib/search";
import { useStore } from "@/lib/store";
import { CATEGORIES, CATEGORY_MAP, LIBRARIES, LIBRARY_MAP } from "@/lib/taxonomy";

interface Row {
  key: string;
  group: string;
  title: string;
  sub: string;
  glyph: ReactNode;
  href: string;
  right?: ReactNode;
}

const NAV: Row[] = [
  { key: "nav-lib", group: "Jump to", title: "Browse library", sub: "All designs & animations", glyph: <GridIcon />, href: "/library" },
  { key: "nav-pg", group: "Jump to", title: "Live playground", sub: "Edit HTML, CSS, JS or React live", glyph: <PlayGlyph />, href: "/playground" },
  { key: "nav-pr", group: "Jump to", title: "Website prompts", sub: "Full-site prompts & builder", glyph: <PromptGlyph />, href: "/prompts" },
  { key: "nav-fav", group: "Jump to", title: "Favorites", sub: "Your saved designs", glyph: <FavGlyph />, href: "/favorites" },
];

export default function CommandPalette() {
  const { paletteOpen, setPaletteOpen, recent } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [paletteOpen]);

  const rows = useMemo<Row[]>(() => {
    const assetRow = (id: string, group: string): Row | null => {
      const a = getAsset(id);
      if (!a) return null;
      const Glyph = CATEGORY_GLYPHS[a.category];
      return {
        key: `${group}-${a.id}`,
        group,
        title: a.title,
        sub: `${CATEGORY_MAP[a.category].label} · ${a.libraries.map((l) => LIBRARY_MAP[l].label).join(", ")}`,
        glyph: <Glyph />,
        href: `/asset/${a.id}`,
        right: <span className="kbd">{a.html && a.react ? "HTML · React" : a.html ? "HTML" : "React"}</span>,
      };
    };
    const query = q.trim().toLowerCase();
    if (!query) {
      const rec = recent.map((id) => assetRow(id, "Recent")).filter(Boolean).slice(0, 4) as Row[];
      const featured = ASSETS.filter((a) => a.featured).slice(0, 5).map((a) => assetRow(a.id, "Featured")) as Row[];
      return [...rec, ...NAV, ...featured];
    }
    const nav = NAV.filter((n) => n.title.toLowerCase().includes(query));
    const filters: Row[] = [
      ...CATEGORIES.filter((c) => c.label.toLowerCase().includes(query)).map((c) => {
        const Glyph = CATEGORY_GLYPHS[c.id];
        return { key: `cat-${c.id}`, group: "Filters", title: c.label, sub: c.blurb, glyph: <Glyph />, href: `/library?cat=${c.id}`, right: <ArrowRight size={14} /> };
      }),
      ...LIBRARIES.filter((l) => l.label.toLowerCase().includes(query)).map((l) => ({
        key: `lib-${l.id}`,
        group: "Filters",
        title: `${l.label} animations`,
        sub: l.blurb,
        glyph: <span className="orb" style={{ color: l.color }} />,
        href: `/library?lib=${l.id}`,
        right: <ArrowRight size={14} />,
      })),
    ];
    const assetHits = searchAssets(ASSETS, query);
    const designs = assetHits ? ([...assetHits.keys()].slice(0, 8).map((id) => assetRow(id, "Designs")).filter(Boolean) as Row[]) : [];
    const promptHits = searchPrompts(PROMPTS, query);
    const prompts: Row[] = promptHits
      ? [...promptHits.keys()].slice(0, 4).map((id) => {
          const p = PROMPTS.find((x) => x.id === id)!;
          return { key: `p-${id}`, group: "Website prompts", title: p.title, sub: p.industry, glyph: <PromptGlyph />, href: `/prompts?open=${id}` };
        })
      : [];
    return [...designs, ...filters, ...prompts, ...nav];
  }, [q, recent]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (row?: Row) => {
    if (!row) return;
    setPaletteOpen(false);
    router.push(row.href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(rows.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(rows[active]);
    } else if (e.key === "Escape") {
      setPaletteOpen(false);
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {paletteOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && setPaletteOpen(false)}
        >
          <motion.div
            className="modal"
            role="dialog"
            aria-label="Search"
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            onKeyDown={onKey}
          >
            <div className="palette-input">
              <SearchIcon size={20} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search designs, animations, libraries, prompts…"
                aria-label="Search"
              />
              <span className="kbd">esc</span>
            </div>
            <div className="palette-list" ref={listRef}>
              {rows.length === 0 && <div className="palette-group">No matches for “{q}”.</div>}
              {rows.map((row, i) => {
                const header = row.group !== lastGroup ? <div className="palette-group">{row.group}</div> : null;
                lastGroup = row.group;
                return (
                  <div key={row.key}>
                    {header}
                    <button
                      data-index={i}
                      className={`palette-row ${i === active ? "active" : ""}`}
                      onMouseMove={() => setActive(i)}
                      onClick={() => go(row)}
                    >
                      <span className="glyph">{row.glyph}</span>
                      <span>
                        <b>{row.title}</b>
                        <small>{row.sub}</small>
                      </span>
                      <span className="right">{row.right}</span>
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="palette-foot">
              <span><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
              <span><span className="kbd">↵</span> open</span>
              <span><span className="kbd">⌘</span><span className="kbd">K</span> toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
