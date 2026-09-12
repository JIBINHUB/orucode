"use client";

import Link from "next/link";
import AssetCard from "../AssetCard";
import { ASSETS, PROMPTS } from "@/data";
import { useStore } from "@/lib/store";

export default function FavoritesView() {
  const { favorites } = useStore();
  const assets = ASSETS.filter((a) => favorites.has(a.id));
  const prompts = PROMPTS.filter((p) => favorites.has(`p:${p.id}`));

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="h1">
            Your <span className="muted">Favorites</span>
          </h1>
          <p className="lead">Tap the heart on any design or prompt to save it here. Saved in this browser.</p>
        </div>
      </div>
      {assets.length === 0 && prompts.length === 0 ? (
        <div className="empty">
          <h3 className="h3">No favorites yet</h3>
          <Link href="/library" className="btn btn-primary btn-sm">
            Browse library
          </Link>
        </div>
      ) : (
        <>
          {assets.length > 0 && (
            <div className="grid-cards">
              {assets.map((a) => (
                <AssetCard key={a.id} asset={a} />
              ))}
            </div>
          )}
          {prompts.length > 0 && (
            <section className="section">
              <h2 className="h2" style={{ marginBottom: 16 }}>
                Saved <span className="muted">prompts</span>
              </h2>
              <div className="fresh-list">
                {prompts.map((p) => (
                  <Link key={p.id} href={`/prompts?open=${p.id}`} className="fresh-row">
                    <span className="glyph">✦</span>
                    <span>
                      <b>{p.title}</b>
                      <small>{p.industry}</small>
                    </span>
                    <span className="pill ghost">Open</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
