"use client";

import { useId, type CSSProperties, type ReactNode } from "react";

/**
 * Sticker cluster for the Leaf Creationism call-to-action: one electric-blue
 * accent and crisp white line icons on near-black. All shapes are original.
 */

const BLUE_TOP = "#4a90ff";
const BLUE_BOTTOM = "#1f5fd6";
const INK = "#0b0b0d";
const W = "#ffffff";

const useSvgId = () => "lc" + useId().replace(/[^a-zA-Z0-9_-]/g, "");

function BlueGrad({ id, h = 100 }: { id: string; h?: number }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2={h} gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor={BLUE_TOP} />
      <stop offset="1" stopColor={BLUE_BOTTOM} />
    </linearGradient>
  );
}

function RingBadge() {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 120 120" className="badge-spin" aria-hidden="true">
      <defs>
        <BlueGrad id={`${id}g`} h={120} />
        <path id={`${id}p`} d="M60,60 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill={`url(#${id}g)`} />
      <circle cx="60" cy="60" r="23" fill={INK} />
      <text fontSize="11" fontWeight="700" letterSpacing="2" fill={W} fontFamily="var(--font-display)">
        <textPath href={`#${id}p`}>LEAF CREATIONISM • STUDIO • </textPath>
      </text>
    </svg>
  );
}

function SealBadge() {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id={`${id}p`} d="M60,60 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill={INK} stroke={W} strokeWidth="2.5" />
      <g className="lc-seal-text">
        <text fontSize="10" fontWeight="700" letterSpacing="2.2" fill={W} fontFamily="var(--font-display)">
          <textPath href={`#${id}p`}>WEB • APP • BRAND • STUDIO • </textPath>
        </text>
      </g>
      <circle cx="60" cy="60" r="22" fill={W} />
      <image href="/logos/leaf-mark.png" x="44" y="44" width="32" height="32" />
    </svg>
  );
}

function Smiley() {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <BlueGrad id={`${id}g`} />
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#${id}g)`} />
      <ellipse cx="38" cy="20" rx="16" ry="6" fill={W} opacity="0.16" />
      <rect x="33" y="27" width="10" height="23" rx="5" fill={W} />
      <rect x="57" y="27" width="10" height="23" rx="5" fill={W} />
      <path d="M27 59c9 17 37 17 46 0" stroke={W} strokeWidth="8.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const SmileyLine = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke={W} strokeWidth="3.4" strokeLinecap="round">
    <circle cx="50" cy="50" r="45" fill={INK} />
    <rect x="35" y="29" width="8" height="19" rx="4" />
    <rect x="57" y="29" width="8" height="19" rx="4" />
    <path d="M30 60c7 14 33 14 40 0" />
  </svg>
);

const ArrowTile = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <rect x="4" y="4" width="92" height="92" rx="28" fill={INK} stroke={W} strokeWidth="3.4" />
    <path d="M66 66 35 35M35 60V35h25" stroke={W} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

function BlueArrow() {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <BlueGrad id={`${id}g`} />
      </defs>
      <path
        d="M26 74 72 28M40 26h34v34"
        stroke={`url(#${id}g)`}
        strokeWidth="17"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

const ARMS = [0, 45, 90, 135];

function Asterisk() {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <BlueGrad id={`${id}g`} />
      </defs>
      <g fill={`url(#${id}g)`}>
        {ARMS.map((r) => (
          <rect key={r} x="41" y="5" width="18" height="90" rx="9" transform={`rotate(${r} 50 50)`} />
        ))}
      </g>
    </svg>
  );
}

// Outline of the union of the arms: white arms, then slightly thinner ink arms on top.
const AsteriskLine = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <g fill={W}>
      {ARMS.map((r) => (
        <rect key={r} x="39.5" y="3.5" width="21" height="93" rx="10.5" transform={`rotate(${r} 50 50)`} />
      ))}
    </g>
    <g fill={INK}>
      {ARMS.map((r) => (
        <rect key={r} x="42.5" y="6.5" width="15" height="87" rx="7.5" transform={`rotate(${r} 50 50)`} />
      ))}
    </g>
  </svg>
);

const Pebble = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke={W} strokeWidth="3.4" strokeLinejoin="round">
    <path d="M20 34C28 14 62 8 80 22s18 46-2 58-52 12-62-4-6-28 4-42z" fill={INK} />
  </svg>
);

const PebbleHill = () => (
  <svg
    viewBox="0 0 100 100"
    aria-hidden="true"
    fill="none"
    stroke={W}
    strokeWidth="3.4"
    strokeLinejoin="round"
    strokeLinecap="round"
  >
    <path d="M16 50C16 24 38 10 58 12s32 20 30 42-22 36-44 34S16 72 16 50z" fill={INK} />
    <path d="M34 62c5-12 11-18 16-18s11 6 16 18z" />
  </svg>
);

const RingEllipse = () => (
  <svg viewBox="0 0 100 56" aria-hidden="true" fill="none" stroke={W} strokeWidth="3">
    <ellipse cx="50" cy="28" rx="46" ry="23" fill={INK} />
    <ellipse cx="52" cy="28" rx="23" ry="7" />
  </svg>
);

function Drop() {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <BlueGrad id={`${id}g`} />
      </defs>
      <path d="M50 6c16 20 32 38 32 58a32 32 0 0 1-64 0c0-20 16-38 32-58z" fill={`url(#${id}g)`} />
    </svg>
  );
}

type Place = { node: ReactNode; x: string; y: string; w?: number; r?: number; d: number; delay?: number; sm?: boolean };

// x/y are sticker centres inside the cluster; d is parallax depth in px.
const PLACES: Place[] = [
  { node: <RingBadge />, x: "66%", y: "19%", w: 132, d: 18 },
  { node: <SealBadge />, x: "18%", y: "52%", w: 112, r: -8, d: 12, delay: -2 },
  { node: <Smiley />, x: "38%", y: "18%", w: 78, r: -12, d: 26, delay: -1 },
  { node: <ArrowTile />, x: "84%", y: "52%", w: 90, r: 9, d: 20, delay: -3 },
  { node: <Asterisk />, x: "70%", y: "82%", w: 84, r: 14, d: 30, delay: -4 },
  { node: <AsteriskLine />, x: "46%", y: "50%", w: 74, r: -8, d: 16, delay: -1.5, sm: true },
  { node: <Pebble />, x: "14%", y: "16%", w: 72, r: 6, d: 10, delay: -2.5, sm: true },
  { node: <PebbleHill />, x: "40%", y: "82%", w: 88, r: -6, d: 14, delay: -3.5 },
  { node: <RingEllipse />, x: "92%", y: "90%", w: 104, r: -10, d: 12, delay: -5, sm: true },
  { node: <BlueArrow />, x: "12%", y: "86%", w: 66, d: 24, delay: -0.5 },
  { node: <Drop />, x: "58%", y: "66%", w: 26, r: 20, d: 34, delay: -2 },
  { node: <SmileyLine />, x: "94%", y: "22%", w: 60, r: 12, d: 16, delay: -4.5, sm: true },
  { node: <span className="lc-pill blue">Design</span>, x: "30%", y: "68%", r: -14, d: 22, delay: -1.2 },
  { node: <span className="lc-pill line">Develop</span>, x: "62%", y: "44%", r: 10, d: 18, delay: -2.8 },
  { node: <span className="lc-pill blue">Launch</span>, x: "86%", y: "72%", r: -8, d: 26, delay: -3.8, sm: true },
];

export default function LeafStickers() {
  return (
    <div className="lc-cluster" aria-hidden="true">
      {PLACES.map((p, i) => (
        <span
          key={i}
          className={p.sm ? "lc-s hide-sm" : "lc-s"}
          style={
            {
              "--x": p.x,
              "--y": p.y,
              "--w": p.w ? `${p.w}px` : undefined,
              "--r": `${p.r ?? 0}deg`,
              "--d": p.d,
            } as CSSProperties
          }
        >
          <span className="lc-float" style={{ animationDelay: `${p.delay ?? 0}s` }}>
            {p.node}
          </span>
        </span>
      ))}
    </div>
  );
}
