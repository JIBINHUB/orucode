"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import CommandPalette from "./CommandPalette";
import IntroLoader from "./IntroLoader";
import { LeafTag, OruLogo } from "./Brand";
import {
  CATEGORY_GLYPHS,
  CheckIcon,
  CloseIcon,
  FavGlyph,
  GridIcon,
  HomeIcon,
  MenuIcon,
  PlayGlyph,
  PlusIcon,
  PromptGlyph,
  SearchIcon,
  UserGlyph,
} from "./Icons";
import { ASSETS, CATEGORY_COUNTS, LIBRARY_COUNTS, PROMPTS } from "@/data";
import { useStore } from "@/lib/store";
import { getReactVariant } from "@/lib/variants";
import { CATEGORIES, LIBRARIES } from "@/lib/taxonomy";

const LABELS: [RegExp, string, string][] = [
  [/^\/$/, "ORU", "Code Library"],
  [/^\/library/, "Browse", "Library"],
  [/^\/asset/, "Design", "Detail"],
  [/^\/playground/, "Live", "Playground"],
  [/^\/prompts/, "Website", "Prompts"],
  [/^\/favorites/, "Your", "Favorites"],
  [/^\/developer/, "The", "Developer"],
  [/^\/designs/, "Browse", "Designs"],
  [/^\/code/, "Browse", "Code"],
  [/^\/free-website-design/, "Free", "Website Designs"],
];

type NavQuery = { cat: string | null; lib: string | null };

/**
 * Reads the query string inside its own Suspense boundary. useSearchParams higher up
 * would make the whole shell — and every page in it — render only in the browser,
 * leaving search engines and AI crawlers an empty page.
 */
function QueryWatcher({ onChange }: { onChange: (q: NavQuery) => void }) {
  const params = useSearchParams();
  const cat = params.get("cat");
  const lib = params.get("lib");
  useEffect(() => onChange({ cat, lib }), [cat, lib, onChange]);
  return null;
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [query, setQuery] = useState<NavQuery>({ cat: null, lib: null });
  const { setPaletteOpen, favorites, toastMessage } = useStore();
  const [drawer, setDrawer] = useState(false);

  useEffect(() => setDrawer(false), [pathname, query]);

  // Dev-only hook for checking every design's generated React code in the browser.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __oru?: unknown }).__oru = { ASSETS, getReactVariant };
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = el.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(el.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPaletteOpen]);

  const onLibrary = pathname === "/library";
  const qCat = query.cat;
  const qLib = query.lib;
  const [, first, second] = LABELS.find(([re]) => re.test(pathname)) ?? LABELS[0];

  const item = (href: string, label: string, icon: ReactNode, active: boolean, count?: number) => (
    <Link key={href} href={href} className={`nav-item ${active ? "active" : ""}`}>
      {icon}
      <span>{label}</span>
      {count !== undefined && <span className="nav-count">{count}</span>}
    </Link>
  );
  const catItem = (id: (typeof CATEGORIES)[number]["id"], label: string) => {
    const Glyph = CATEGORY_GLYPHS[id];
    return item(`/library?cat=${id}`, label, <Glyph size={17} />, onLibrary && qCat === id && !qLib, CATEGORY_COUNTS[id] ?? 0);
  };

  return (
    <>
      <IntroLoader />
      <Suspense fallback={null}>
        <QueryWatcher onChange={setQuery} />
      </Suspense>
      <div className="shell">
        <aside className={`sidebar ${drawer ? "open" : ""}`}>
          <div className="side-panel panel">
            <div className="brand">
              <Link href="/">
                <OruLogo word="code" height={20} />
              </Link>
              <LeafTag />
            </div>
            <nav className="side-scroll" aria-label="Library">
              <div className="nav-group">
                {item("/", "Home", <HomeIcon size={17} />, pathname === "/")}
                {item("/library", "Browse all", <GridIcon size={17} />, onLibrary && !qCat && !qLib, ASSETS.length)}
                {item("/favorites", "Favorites", <FavGlyph size={17} />, pathname === "/favorites", favorites.size)}
                {item("/playground", "Playground", <PlayGlyph size={17} />, pathname.startsWith("/playground"))}
              </div>
              <div className="nav-group">
                <div className="nav-label">Animations</div>
                {CATEGORIES.filter((c) => c.kind === "animation").map((c) => catItem(c.id, c.label))}
                {LIBRARIES.map((l) =>
                  item(
                    `/library?lib=${l.id}`,
                    l.label,
                    <span className="orb" style={{ color: l.color, margin: "0 4px" }} />,
                    onLibrary && qLib === l.id && !qCat,
                    LIBRARY_COUNTS[l.id] ?? 0,
                  ),
                )}
              </div>
              <div className="nav-group">
                <div className="nav-label">Components</div>
                {CATEGORIES.filter((c) => c.kind === "component").map((c) => catItem(c.id, c.label))}
              </div>
              <div className="nav-group">
                <div className="nav-label">Sections</div>
                {CATEGORIES.filter((c) => c.kind === "section").map((c) => catItem(c.id, c.label))}
              </div>
              <div className="nav-group">
                <div className="nav-label">Websites</div>
                {catItem("pages", "Full pages")}
                {item(
                  "/free-website-design",
                  "Free business sites",
                  <GridIcon size={17} />,
                  pathname.startsWith("/free-website-design"),
                )}
                {item("/prompts", "Website prompts", <PromptGlyph size={17} />, pathname === "/prompts", PROMPTS.length)}
              </div>
            </nav>
            <div className="side-cta">
              <Link href="/playground" className="btn btn-primary">
                Open Playground
              </Link>
            </div>
          </div>
        </aside>
        {drawer && <div className="drawer-backdrop" onClick={() => setDrawer(false)} />}

        <main className="main">
          <header className="topbar">
            <button className="icon-btn menu-btn" onClick={() => setDrawer((d) => !d)} aria-label="Toggle menu">
              {drawer ? <CloseIcon /> : <MenuIcon />}
            </button>
            <div className="two-tone hide-sm" style={{ minWidth: 180 }}>
              {first} <span>{second}</span>
            </div>
            <button className="search-trigger" onClick={() => setPaletteOpen(true)}>
              <SearchIcon size={17} />
              <span className="grow">Search designs, animations & prompts</span>
              <span className="kbd hide-sm">⌘K</span>
            </button>
            <span className="spacer" />
            <Link href="/developer" className="icon-btn" aria-label="Developer — Jibin Chacko">
              <UserGlyph size={18} />
            </Link>
            <button className="icon-btn white" onClick={() => setPaletteOpen(true)} aria-label="Search">
              <SearchIcon size={18} />
            </button>
          </header>
          {children}
        </main>
      </div>

      <nav className="dock" aria-label="Quick navigation">
        <Link href="/" className={`dock-item ${pathname === "/" ? "active" : ""}`} aria-label="Home">
          <HomeIcon size={20} />
        </Link>
        <Link href="/library" className={`dock-item ${onLibrary ? "active" : ""}`} aria-label="Library">
          <GridIcon size={20} />
        </Link>
        <Link href="/playground" className="dock-center" aria-label="Playground">
          <PlusIcon size={22} />
        </Link>
        <Link href="/prompts" className={`dock-item ${pathname === "/prompts" ? "active" : ""}`} aria-label="Prompts">
          <PromptGlyph size={20} />
        </Link>
        <Link href="/developer" className={`dock-item ${pathname === "/developer" ? "active" : ""}`} aria-label="Developer">
          <UserGlyph size={20} />
        </Link>
      </nav>

      <CommandPalette />
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
          >
            <CheckIcon size={16} /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
