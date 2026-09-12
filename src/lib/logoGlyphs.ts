/**
 * Geometry for the ORU block-letter logotype, in grid units (cap height = 5,
 * stroke = 1). Each glyph is split into the separate strips it is built from,
 * so the intro can animate every strip as its own paper cut-out.
 */
export interface Glyph {
  w: number;
  pieces: string[];
}

const STEM = "M0 1H1V5H0Z";
const BOWL = "M1 0H3.5A1.5 1.5 0 0 1 5 1.5V2A1.5 1.5 0 0 1 3.5 3.5H1.5V2.5H3.5A.5.5 0 0 0 4 2V1.5A.5.5 0 0 0 3.5 1H1Z";

export const GLYPHS: Record<string, Glyph> = {
  O: {
    w: 5,
    pieces: [
      "M1 0H3.5A1.5 1.5 0 0 1 5 1.5V4H4V1.5A.5.5 0 0 0 3.5 1H1Z",
      "M0 1H1V3.5A.5.5 0 0 0 1.5 4H4V5H1.5A1.5 1.5 0 0 1 0 3.5Z",
    ],
  },
  R: {
    w: 5,
    pieces: [STEM, BOWL, "M3.5 2.5A1.5 1.5 0 0 1 5 4V5H4V4A.5.5 0 0 0 3.5 3.5Z"],
  },
  U: {
    w: 5,
    pieces: ["M0 0H1V3.5A.5.5 0 0 0 1.5 4H4V5H1.5A1.5 1.5 0 0 1 0 3.5Z", "M4 0H5V4H4Z"],
  },
  C: {
    w: 5,
    pieces: [
      "M0 4V1.5A1.5 1.5 0 0 1 1.5 0H4V1H1.5A.5.5 0 0 0 1 1.5V4Z",
      "M4 1H5V2H4Z",
      "M1 4H4V3.5H5V5H1Z",
    ],
  },
  D: {
    w: 5,
    pieces: ["M0 1H1V4H4V5H0Z", "M1 0H3.5A1.5 1.5 0 0 1 5 1.5V4H4V1.5A.5.5 0 0 0 3.5 1H1Z"],
  },
  E: {
    w: 5,
    pieces: [
      "M1 0H5V1H1Z",
      "M0 1H1V3.5A.5.5 0 0 0 1.5 4H5V5H1.5A1.5 1.5 0 0 1 0 3.5Z",
      "M1.5 2H4.5V3H1.5Z",
    ],
  },
  S: {
    w: 5,
    pieces: [
      "M1 0H3.5A1.5 1.5 0 0 1 5 1.5H4A.5.5 0 0 0 3.5 1H1Z",
      "M0 1H1V1.5A.5.5 0 0 0 1.5 2H3.5A1.5 1.5 0 0 1 5 3.5V4H4V3.5A.5.5 0 0 0 3.5 3H1.5A1.5 1.5 0 0 1 0 1.5Z",
      "M0 3.5H1A.5.5 0 0 0 1.5 4H4V5H1.5A1.5 1.5 0 0 1 0 3.5Z",
    ],
  },
  I: {
    w: 4.6,
    pieces: [
      "M0 0H4.6V1H0Z",
      "M1.8 1.5H2.8V3.5A.5.5 0 0 0 3.3 4H4.6V5H3.3A1.5 1.5 0 0 1 1.8 3.5Z",
      "M0 4H1.8V5H0Z",
    ],
  },
  G: {
    w: 5,
    pieces: [
      "M4.5 0V1H1.5A.5.5 0 0 0 1 1.5V3.5A.5.5 0 0 0 1.5 4H4V5H1.5A1.5 1.5 0 0 1 0 3.5V1.5A1.5 1.5 0 0 1 1.5 0Z",
      "M2 2H5V4H4V3H2Z",
    ],
  },
  N: {
    w: 5,
    pieces: [STEM, "M1 0C2.6 0 2.6 4 4 4V5C2.4 5 2.4 1 1 1Z", "M4 0H5V4H4Z"],
  },
  P: {
    w: 5,
    pieces: [STEM, BOWL],
  },
  M: {
    w: 6,
    pieces: [
      STEM,
      "M1 0C2.2 0 2.3 3.8 3 3.8C3.7 3.8 3.8 0 5 0V1C4.1 1 4.1 5 3 5C1.9 5 1.9 1 1 1Z",
      "M5 1H6V5H5Z",
    ],
  },
  T: {
    w: 5,
    pieces: ["M0 0H1.5A1.5 1.5 0 0 1 3 1.5V5H2V1.5A.5.5 0 0 0 1.5 1H0Z", "M3 0H5V1H3Z"],
  },
};

/** Measured from the 5000px logo exports: gap between letters, and after "ORU" per word. */
export const LETTER_GAP = 0.578;
export const WORD_GAPS = { code: 2.487, design: 2.387, prompt: 1.658 } as const;

export const WORDS = {
  oru: ["O", "R", "U"],
  code: ["C", "O", "D", "E"],
  design: ["D", "E", "S", "I", "G", "N"],
  prompt: ["P", "R", "O", "M", "P", "T"],
} as const;

export type WordId = keyof typeof WORDS;

export const wordWidth = (id: WordId) =>
  WORDS[id].reduce((sum, ch) => sum + GLYPHS[ch].w, 0) + LETTER_GAP * (WORDS[id].length - 1);

/** Left offset and width of every letter in a word, in grid units. */
export const letterOffsets = (id: WordId) => {
  let x = 0;
  return WORDS[id].map((ch) => {
    const at = { x, w: GLYPHS[ch].w };
    x += GLYPHS[ch].w + LETTER_GAP;
    return at;
  });
};

/**
 * Malayalam "ഒരു" from the ORU logo, traced onto the same grid (cap height 5,
 * stroke ≈ 1). Paths use even-odd fill so the counters stay open.
 */
export const ML_ORU: { x: number; w: number; pieces: string[] }[] = [
  {
    // ഒ — stem + top bar, lower-left bowl, and the "3" on the right
    x: 0,
    w: 5.77,
    pieces: [
      "M0 0H4V1H1V5H0Z",
      "M1 1.3H1.55C2.6 1.3 3.15 2.15 3.15 3.13C3.15 4.1 2.5 5 1.25 5H1Z M1 2.13V4.03H1.55C1.9 4.03 2.1 3.7 2.1 3.13C2.1 2.6 1.9 2.13 1.55 2.13Z",
      "M4 0C5.15 0 5.77 .68 5.77 1.52C5.77 1.95 5.6 2.25 5.35 2.48C5.65 2.75 5.77 3.05 5.77 3.48C5.77 4.42 5.15 5 4.26 5H3.45V4.03H4.03C4.45 4.03 4.65 3.9 4.65 3.61C4.65 3.29 4.45 3.03 4.03 3.03H3.45V2.06H4.26C4.45 2.06 4.65 1.87 4.65 1.61C4.65 1.19 4.45 1 4.03 1H4Z",
    ],
  },
  {
    // ര — stem + top bar, round bowl
    x: 6.084,
    w: 6.48,
    pieces: [
      "M0 0H3.7V1H1V5H0Z",
      "M3.68 0C5.55 0 6.48 1.13 6.48 2.68C6.48 4.03 5.55 5 4 5C2.39 5 1.52 3.94 1.52 2.68C1.52 1.65 1.81 1.19 2.1 1H3.68Z M3.94 1.1C4.84 1.1 5.35 1.74 5.35 2.61C5.35 3.39 4.97 3.97 4 3.97C3.1 3.97 2.58 3.35 2.58 2.61C2.58 1.74 3.16 1.1 3.94 1.1Z",
    ],
  },
  {
    // ു — squared hook with a descending loop
    x: 12.833,
    w: 3.1,
    pieces: [
      "M0 0H1.81C2.32 0 2.48 .26 2.48 .68V3.35C2.48 3.65 2.42 3.81 2.29 3.87C2.71 4 3.1 4.52 3.1 5.32C3.1 6.26 2.52 6.77 1.52 6.77H0V3.77H1.45V1H1V2.06H0Z M1 4.65H1.42C1.81 4.65 2.03 4.94 2.03 5.29C2.03 5.65 1.77 5.84 1.42 5.84H1Z",
    ],
  },
];

export const ML_WIDTH = 15.911;
/** Measured: gap between "ഒരു" and CODE, and ഒരു's vertical offset relative to CODE. */
export const ML_CODE_GAP = 2.217;
export const ML_Y = -0.123;
