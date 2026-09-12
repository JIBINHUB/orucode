"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import { GLYPHS, LETTER_GAP, WORDS, WORD_GAPS, wordWidth, type WordId } from "@/lib/logoGlyphs";

const ACCENT = "#ff3131";
const ORANGE = "#ff7a2f";
const INK = "#0a0a0a";

function logoWord(id: WordId, start: number) {
  let x = start;
  return WORDS[id].map((ch, i) => {
    const glyph = GLYPHS[ch];
    const letter = (
      <g key={`${id}-${i}`} transform={`translate(${x} 0)`}>
        {glyph.pieces.map((d, j) => (
          <path key={j} d={d} />
        ))}
      </g>
    );
    x += glyph.w + LETTER_GAP;
    return letter;
  });
}

/** The ORU block-letter logotype: "ORU" in logo red + CODE / DESIGN / PROMPT in ink. */
export function OruLogo({ word = "code", height = 22 }: { word?: Exclude<WordId, "oru">; height?: number }) {
  const oruWidth = wordWidth("oru");
  const gap = WORD_GAPS[word];
  const total = oruWidth + gap + wordWidth(word);
  return (
    <svg
      className="oru-logo"
      viewBox={`0 0 ${total} 5`}
      height={height}
      width={(height * total) / 5}
      role="img"
      aria-label={`ORU ${word.toUpperCase()}`}
    >
      <g fill={ACCENT}>{logoWord("oru", 0)}</g>
      <g fill="currentColor">{logoWord(word, oruWidth + gap)}</g>
    </svg>
  );
}

type SvgProps = { size?: number; color?: string };

export const Smiley = ({ size = 56, color = ACCENT, face = "#fff" }: SvgProps & { face?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill={color} />
    <rect x="21" y="17" width="6.5" height="15" rx="3.25" fill={face} />
    <rect x="36.5" y="17" width="6.5" height="15" rx="3.25" fill={face} />
    <path d="M18 38c5 9 23 9 28 0" stroke={face} strokeWidth="5.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const Asterisk = ({ size = 56, color = ORANGE }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <g fill={color}>
      {[0, 45, 90, 135].map((r) => (
        <rect key={r} x="25.5" y="3" width="13" height="58" rx="6.5" transform={`rotate(${r} 32 32)`} />
      ))}
    </g>
  </svg>
);

export const ArrowTile = ({ size = 64, color = INK }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <rect x="3" y="3" width="58" height="58" rx="17" fill="rgba(255,255,255,.75)" stroke={INK} strokeWidth="1.6" />
    <path d="M22 41V22h19M22 22l20 20" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const Arrow = ({ size = 56, color = ACCENT }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <path d="M18 46 46 18M24 16h22v22" stroke={color} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const Blob = ({ size = 72, color = INK }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <path d="M15 13C25 3 46 5 54 17s6 29-6 37-30 8-40-2S5 23 15 13z" fill="none" stroke={color} strokeWidth="1.4" />
  </svg>
);

export const LeafGlyph = ({ size = 40, color = "#fff" }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path
      d="M39 9C22 9 9 22 9 39c17 0 30-13 30-30z"
      fill="none"
      stroke={color}
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    <path d="M13 35 33 15" stroke={color} strokeWidth="2.2" strokeLinecap="round" opacity=".7" />
  </svg>
);

/**
 * Leaf Creationism's real mark (public/logos/leaf-mark.png, supplied by the
 * company) — the blue-to-yellow gradient roundel with the white leaf.
 */
export function LeafLogo({ size = 56 }: { size?: number }) {
  return (
    <img
      src="/logos/leaf-mark.png"
      alt="Leaf Creationism"
      width={size}
      height={size}
      style={{ display: "block", width: size, height: size, borderRadius: "50%" }}
    />
  );
}

/** Small credit line: this product is built by Leaf Creationism. Links out to the company site. */
export function LeafTag({ className = "" }: { className?: string }) {
  return (
    <a href="https://leafcreationism.in" target="_blank" rel="noreferrer" className={`leaf-tag ${className}`}>
      A Leaf Creationism company
    </a>
  );
}

export const Ring = ({ size = 90, color = INK }: SvgProps) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 90 56" aria-hidden="true">
    <ellipse cx="45" cy="28" rx="42" ry="25" fill="none" stroke={color} strokeWidth="1.4" />
    <ellipse cx="45" cy="28" rx="20" ry="7" fill="none" stroke={color} strokeWidth="1.4" />
  </svg>
);

export function LabelPill({ children, variant = "accent" }: { children: ReactNode; variant?: "accent" | "outline" | "white" }) {
  return <span className={`sticker-pill ${variant}`}>{children}</span>;
}

/** Spinning circular text badge. */
export function CircleBadge({ text = "CREATIVE • DESIGNER • ", size = 96, tone = "accent" }: { text?: string; size?: number; tone?: "accent" | "ink" }) {
  const id = "cb" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const accent = tone === "accent";
  return (
    <svg className="badge-spin" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <path id={id} d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0" />
      </defs>
      <circle cx="50" cy="50" r="48" fill={accent ? ACCENT : INK} />
      <text fontSize="10.5" fontWeight="700" letterSpacing="2.4" fill="#fff" fontFamily="var(--font-display)">
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
      <circle cx="50" cy="50" r="19" fill="#fff" />
    </svg>
  );
}

type Placed = [ReactNode, CSSProperties];

const HERO: Placed[] = [
  [<CircleBadge key="a" text="CREATIVE • CODE • LIBRARY • " size={104} />, { left: "5%", top: "6%" }],
  [<LabelPill key="b">Design</LabelPill>, { left: "40%", top: "7%", rotate: "14deg" }],
  [<Blob key="c" size={64} />, { left: "68%", top: "3%" }],
  [<ArrowTile key="d" size={70} />, { left: "76%", top: "18%", rotate: "-10deg" }],
  [<Ring key="e" size={100} />, { left: "30%", top: "24%", rotate: "-16deg" }],
  [<Smiley key="f" size={58} />, { left: "8%", top: "36%", rotate: "-12deg" }],
  [<LabelPill key="g" variant="outline">Inspire</LabelPill>, { left: "54%", top: "40%", rotate: "-8deg" }],
  [<Asterisk key="h" size={60} />, { left: "84%", top: "42%" }],
  [<LabelPill key="j">Create</LabelPill>, { left: "68%", top: "58%", rotate: "-18deg" }],
];

export function StickerField() {
  return (
    <div className="sticker-field" aria-hidden="true">
      {HERO.map(([node, style], i) => (
        <span key={i} className="sticker" style={{ ...style, animationDelay: `${-i * 0.8}s` }}>
          {node}
        </span>
      ))}
    </div>
  );
}
