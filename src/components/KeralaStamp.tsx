"use client";

/**
 * A postage stamp carrying a Kerala motif. The perforated edge is a computed
 * path (a run of small inward arcs) rather than a CSS mask, so it renders the
 * same everywhere and scales cleanly.
 *
 * The motifs are original simplified shapes — a palm, a snake boat, a
 * caparisoned elephant, a festival umbrella and a Kathakali crown.
 */

export type Motif = "palm" | "boat" | "elephant" | "umbrella" | "crown";

const W = 120;
const H = 152;
const PITCH = 8;

const PINK = "#e8467c";
const BLUE = "#2f4bd8";
const INK = "#191622";

function perforatedPath() {
  const nx = Math.round(W / PITCH);
  const ny = Math.round(H / PITCH);
  const sx = W / nx;
  const sy = H / ny;
  const run = (n: number, dx: number, dy: number, r: number) =>
    Array.from({ length: n }, () => `a${r},${r} 0 0,1 ${dx},${dy}`).join("");
  return [
    "M0,0",
    run(nx, sx, 0, sx / 2),
    run(ny, 0, sy, sy / 2),
    run(nx, -sx, 0, sx / 2),
    run(ny, 0, -sy, sy / 2),
    "Z",
  ].join("");
}

const MOTIFS: Record<Motif, React.ReactNode> = {
  palm: (
    <>
      <path d="M-2 30c0-16 2-26 6-36" stroke={INK} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M4-8c-10-7-22-5-28 3 10-3 19-1 26 3z" fill={BLUE} />
      <path d="M4-8c10-7 22-5 28 3-10-3-19-1-26 3z" fill={PINK} />
      <path d="M4-8C1-21-8-29-18-29c7 7 11 15 13 24z" fill={PINK} />
      <path d="M4-8C7-21 16-29 26-29c-7 7-11 15-13 24z" fill={BLUE} />
      <circle cx="-3" cy="-1" r="3.2" fill={INK} />
      <circle cx="8" cy="0" r="3.2" fill={INK} />
    </>
  ),
  boat: (
    <>
      <path d="M-32 6c14 11 40 11 54 3" stroke={INK} strokeWidth="3.6" fill="none" strokeLinecap="round" />
      <path d="M22 9c8-11 11-24 6-33-7 7-9 19-9 30z" fill={BLUE} />
      <path d="M-32 6c-6-3-9-7-8-11 6 1 11 5 13 9z" fill={PINK} />
      {[-22, -14, -6, 2, 10].map((x) => (
        <rect key={x} x={x} y={-8} width="3.2" height="13" rx="1.6" fill={PINK} />
      ))}
      <path d="M-30 14c14 7 34 7 48 1" stroke={PINK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),
  elephant: (
    <>
      <ellipse cx="-25" cy="6" rx="9" ry="13" fill={INK} />
      <ellipse cx="25" cy="6" rx="9" ry="13" fill={INK} />
      <path d="M-20-8a20 20 0 0 1 40 0v12a20 20 0 0 1-40 0z" fill={INK} />
      <path d="M-20-8a20 20 0 0 1 40 0z" fill={PINK} />
      <path d="M-14-8a14 14 0 0 1 28 0z" fill={BLUE} />
      <path d="M0 16c1 9 3 15 7 19" stroke={INK} strokeWidth="6.5" fill="none" strokeLinecap="round" />
      <circle cx="-8" cy="2" r="2.4" fill="#fff" />
      <circle cx="8" cy="2" r="2.4" fill="#fff" />
    </>
  ),
  umbrella: (
    <>
      <path d="M-30 6a30 27 0 0 1 60 0z" fill={PINK} />
      <path d="M-19 6a19 24 0 0 1 38 0z" fill={BLUE} />
      {[-24, -12, 0, 12, 24].map((x) => (
        <circle key={x} cx={x} cy="6" r="5" fill={PINK} />
      ))}
      <circle cx="0" cy="-23" r="4" fill={INK} />
      <path d="M0 6v24" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      {[-16, 0, 16].map((x) => (
        <circle key={x} cx={x} cy="15" r="2.2" fill={INK} />
      ))}
    </>
  ),
  crown: (
    <>
      <path d="M-32 20a32 30 0 0 1 64 0z" fill={BLUE} />
      <path d="M-21 20a21 22 0 0 1 42 0z" fill={PINK} />
      <path d="M-10 20a10 12 0 0 1 20 0z" fill={INK} />
      {[-26, -17, -8, 8, 17, 26].map((x, i) => (
        <circle key={x} cx={x} cy={6 - (i === 2 || i === 3 ? 6 : 0)} r="2.6" fill="#fff" />
      ))}
      <circle cx="0" cy="-14" r="4.5" fill={PINK} />
      <path d="M-34 21h68" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
};

export default function KeralaStamp({
  n,
  title,
  caption,
  motif,
  tint = "#fdfaf5",
  size = 120,
}: {
  n: string;
  title: [string, string];
  caption: string;
  motif: Motif;
  tint?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={(size * H) / W}
      viewBox={`-3 -3 ${W + 6} ${H + 6}`}
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 14px 18px rgba(0,0,0,.45))" }}
    >
      <path d={perforatedPath()} fill={tint} />

      <text x="12" y="20" fontSize="9.5" fontWeight="700" fill={INK} fontFamily="var(--font-display)">
        {title[0]}
      </text>
      <text x="12" y="31" fontSize="9.5" fontWeight="700" fill={INK} fontFamily="var(--font-display)">
        {title[1]}
      </text>

      <circle cx="101" cy="23" r="9" fill="none" stroke={PINK} strokeWidth="1.2" strokeDasharray="2.5 2.2" />
      <text x="101" y="26" fontSize="7" fontWeight="700" fill={PINK} textAnchor="middle">
        KL
      </text>

      <g transform="translate(60 84)">{MOTIFS[motif]}</g>

      <text x="12" y="140" fontSize="14" fontWeight="700" fill={INK} fontFamily="var(--font-display)">
        {n}
      </text>
      <text x="108" y="140" fontSize="6.4" fontStyle="italic" fill="#6d6577" textAnchor="end">
        {caption}
      </text>
    </svg>
  );
}
