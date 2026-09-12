"use client";

import Link from "next/link";
import { useState } from "react";
import LivePreview from "./LivePreview";
import { GaugeIcon, HeartFilled, HeartIcon, LayersIcon, ReplayIcon } from "./Icons";
import { assetFrameworks } from "@/lib/search";
import { useStore } from "@/lib/store";
import { CATEGORY_MAP, COMPLEXITIES, LIBRARY_MAP } from "@/lib/taxonomy";
import type { Asset } from "@/lib/types";

export default function AssetCard({ asset }: { asset: Asset }) {
  const { isFavorite, toggleFavorite } = useStore();
  const [reload, setReload] = useState(0);
  const fav = isFavorite(asset.id);
  const kind = CATEGORY_MAP[asset.category].kind;
  const fws = assetFrameworks(asset).map((f) => (f === "html" ? "HTML" : "React"));

  return (
    <article className="acard">
      <div className="acard-media">
        <LivePreview
          asset={asset}
          title={asset.title}
          lazy
          interactive={false}
          reloadKey={reload}
          virtualWidth={kind === "component" ? 560 : kind === "animation" ? 760 : 1100}
        />
      </div>
      <div className="acard-shade" />
      <Link href={`/asset/${asset.id}`} className="acard-link" aria-label={`Open ${asset.title}`} />

      <div className="acard-top">
        <span className="pill">{fws.join(" · ")}</span>
        <button
          className={`acard-heart ${fav ? "on" : ""}`}
          onClick={() => toggleFavorite(asset.id)}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          {fav ? <HeartFilled size={17} /> : <HeartIcon size={17} />}
        </button>
      </div>
      <button className="icon-btn sm acard-replay" onClick={() => setReload((r) => r + 1)} aria-label="Replay preview">
        <ReplayIcon size={15} />
      </button>

      <div className="acard-body">
        <div className="acard-orbs">
          {asset.libraries.map((l) => (
            <span key={l} className="orb-lg" style={{ background: LIBRARY_MAP[l].color }} title={LIBRARY_MAP[l].label}>
              {LIBRARY_MAP[l].label.slice(0, 1)}
            </span>
          ))}
        </div>
        <div className="acard-sub">
          {asset.libraries.map((l) => LIBRARY_MAP[l].label).join(" + ")}
          {asset.credit ? ` · by ${asset.credit.author}` : ""}
        </div>
        <h3 className="acard-title">{asset.title}</h3>
        <div className="acard-meta">
          <span>
            <LayersIcon size={12} /> {CATEGORY_MAP[asset.category].label}
          </span>
          <span>
            <GaugeIcon size={12} /> {COMPLEXITIES.find((c) => c.id === asset.complexity)?.label} · {asset.tone}
          </span>
        </div>
      </div>
    </article>
  );
}
