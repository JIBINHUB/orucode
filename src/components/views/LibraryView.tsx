"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import AssetCard from "../AssetCard";
import { CheckIcon, ChevronDown, CloseIcon, SearchIcon } from "../Icons";
import { ASSETS } from "@/data";
import {
  DEFAULT_FILTERS,
  activeFilterCount,
  facetCounts,
  filtersToQuery,
  parseFilters,
  runQuery,
  type FilterState,
} from "@/lib/search";
import { CATEGORIES, CATEGORY_MAP, COMPLEXITIES, FRAMEWORKS, KINDS, LIBRARIES, LIBRARY_MAP, TONES } from "@/lib/taxonomy";

type ListFacet = "cats" | "libs" | "fws" | "levels" | "tones";

function FacetDropdown({
  label,
  options,
  selected,
  counts,
  onToggle,
}: {
  label: string;
  options: { id: string; label: string }[];
  selected: string[];
  counts: Record<string, number>;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div className="facet" ref={ref}>
      <button className="btn btn-outline facet-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {label}
        {selected.length > 0 && <span className="n">{selected.length}</span>}
        <ChevronDown size={14} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="facet-pop"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {options.map((o) => {
              const on = selected.includes(o.id);
              const n = counts[o.id] ?? 0;
              return (
                <button
                  key={o.id}
                  className={`facet-opt ${on ? "on" : ""} ${!n && !on ? "zero" : ""}`}
                  onClick={() => onToggle(o.id)}
                  role="menuitemcheckbox"
                  aria-checked={on}
                >
                  <span className="box">{on && <CheckIcon size={12} strokeWidth={3} />}</span>
                  {o.label}
                  <span className="count">{n}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LibraryView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => parseFilters(params), [params]);
  const [q, setQ] = useState(filters.q);

  useEffect(() => setQ(filters.q), [filters.q]);

  const update = (patch: Partial<FilterState>) => {
    const qs = filtersToQuery({ ...filters, ...patch });
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (q === filters.q) return;
    const t = setTimeout(() => update({ q }), 220);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const results = useMemo(() => runQuery(ASSETS, filters), [filters]);
  const counts = useMemo(() => facetCounts(ASSETS, filters), [filters]);

  const toggle = (facet: ListFacet, id: string) => {
    const list = filters[facet] as string[];
    update({ [facet]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] } as Partial<FilterState>);
  };

  const heading =
    filters.cats.length === 1
      ? CATEGORY_MAP[filters.cats[0]].label
      : filters.libs.length === 1
        ? `${LIBRARY_MAP[filters.libs[0]].label} designs`
        : "All designs";
  const blurb =
    filters.cats.length === 1
      ? CATEGORY_MAP[filters.cats[0]].blurb
      : filters.libs.length === 1
        ? LIBRARY_MAP[filters.libs[0]].blurb
        : "Every section, page and animation — filter by library, framework, complexity and tone.";

  const chips: { key: string; label: string; remove: () => void }[] = [
    ...filters.cats.map((id) => ({ key: `c${id}`, label: CATEGORY_MAP[id].label, remove: () => toggle("cats", id) })),
    ...filters.libs.map((id) => ({ key: `l${id}`, label: LIBRARY_MAP[id].label, remove: () => toggle("libs", id) })),
    ...filters.fws.map((id) => ({ key: `f${id}`, label: id === "html" ? "HTML / CSS" : "React", remove: () => toggle("fws", id) })),
    ...filters.levels.map((id) => ({ key: `v${id}`, label: id, remove: () => toggle("levels", id) })),
    ...filters.tones.map((id) => ({ key: `t${id}`, label: `${id} tone`, remove: () => toggle("tones", id) })),
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="h1">{heading}</h1>
          <p className="lead">{blurb}</p>
        </div>
      </div>

      <div className="text-tabs" style={{ marginBottom: 16 }}>
        {[{ id: "all" as const, label: "All" }, ...KINDS].map((k) => (
          <button
            key={k.id}
            className={`text-tab ${filters.kind === k.id ? "active" : ""}`}
            onClick={() => update({ kind: k.id })}
          >
            {k.label}
            <sup>{k.id === "all" ? Object.values(counts.kind).reduce((a, b) => a + b, 0) : counts.kind[k.id] ?? 0}</sup>
          </button>
        ))}
      </div>

      <div className="toolbar">
        <label className="search-field">
          <SearchIcon size={17} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, tag, library…" aria-label="Search library" />
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear search">
              <CloseIcon size={15} />
            </button>
          )}
        </label>
        <FacetDropdown label="Category" options={CATEGORIES} selected={filters.cats} counts={counts.cats} onToggle={(id) => toggle("cats", id)} />
        <FacetDropdown label="Library" options={LIBRARIES} selected={filters.libs} counts={counts.libs} onToggle={(id) => toggle("libs", id)} />
        <FacetDropdown label="Framework" options={FRAMEWORKS} selected={filters.fws} counts={counts.fws} onToggle={(id) => toggle("fws", id)} />
        <FacetDropdown label="Level" options={COMPLEXITIES} selected={filters.levels} counts={counts.levels} onToggle={(id) => toggle("levels", id)} />
        <FacetDropdown label="Tone" options={TONES} selected={filters.tones} counts={counts.tones} onToggle={(id) => toggle("tones", id)} />
        <select className="select" value={filters.sort} onChange={(e) => update({ sort: e.target.value as FilterState["sort"] })} aria-label="Sort">
          <option value="featured">{filters.q ? "Best match" : "Featured"}</option>
          <option value="newest">Newest</option>
          <option value="az">A → Z</option>
        </select>
      </div>

      {chips.length > 0 && (
        <div className="active-chips">
          {chips.map((c) => (
            <button key={c.key} className="chip" onClick={c.remove} style={{ textTransform: "capitalize" }}>
              {c.label} <CloseIcon size={12} />
            </button>
          ))}
          {activeFilterCount(filters) > 1 && (
            <button className="chip" onClick={() => update({ ...DEFAULT_FILTERS, q: filters.q })}>
              Clear all
            </button>
          )}
        </div>
      )}

      <div className="result-line">
        <span>
          {results.length} {results.length === 1 ? "design" : "designs"}
          {filters.q && <> for “{filters.q}”</>}
        </span>
      </div>

      {results.length ? (
        <motion.div layout className="grid-cards">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((a) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <AssetCard asset={a} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="empty">
          <h3 className="h3">Nothing matches yet</h3>
          <p className="muted" style={{ margin: 0 }}>
            Try a different search or remove a filter.
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => { setQ(""); update(DEFAULT_FILTERS); }}>
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
