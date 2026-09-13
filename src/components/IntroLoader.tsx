"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  GLYPHS,
  LETTER_GAP,
  ML_CODE_GAP,
  ML_ORU,
  ML_WIDTH,
  ML_Y,
  WORDS,
  WORD_GAPS,
  letterOffsets,
  wordWidth,
  type WordId,
} from "@/lib/logoGlyphs";

const RED = "#ff3131";
const INK = "#0a0a0a";
const CARET_GAP = 0.45;
/** Playback speed multiplier for the whole logo sequence. */
const INTRO_SPEED = 2.2;

/**
 * The handwritten "ചേട്ടാ" tag is the original artwork, cropped from the 5000px
 * logo export into public/logos/chetta-tag.png. Placement is in grid units
 * relative to the top-left of "ഒ" at source px (530, 2030), 81.2 px = 1 unit;
 * the crop covers source px x 250–920, y 1680–2120.
 */
const TAG = { href: "/logos/chetta-tag.png", x: -3.4483, y: -4.3103, w: 8.2512, h: 5.4187 };

function LatinWord({ id, color }: { id: WordId; color: string }) {
  let x = 0;
  return (
    <g className={`w w-${id}`}>
      {WORDS[id].map((ch, i) => {
        const glyph = GLYPHS[ch];
        const letter = (
          <g key={i} transform={`translate(${x} 0)`}>
            <g className="l">
              {glyph.pieces.map((d, j) => (
                <path key={j} d={d} fill={color} />
              ))}
            </g>
          </g>
        );
        x += glyph.w + LETTER_GAP;
        return letter;
      })}
    </g>
  );
}

function MalayalamWord() {
  return (
    <g className="w w-ml" transform={`translate(0 ${ML_Y})`}>
      {ML_ORU.map((glyph, i) => (
        <g key={i} transform={`translate(${glyph.x} 0)`}>
          <g className="l">
            {glyph.pieces.map((d, j) => (
              <path key={j} d={d} fill={RED} fillRule="evenodd" />
            ))}
          </g>
        </g>
      ))}
    </g>
  );
}

/**
 * Loading screen: the ORU logos in order on plain white. A red caret types
 * ORU CODE, the second word odometer-rolls to DESIGN and PROMPT, ORU rolls to
 * ഒരു, then the handwritten tag draws itself and the screen splits open.
 * Plays on every full page load (about 4 seconds); with reduced motion the
 * finished logo is shown briefly instead of the sequence.
 */
export default function IntroLoader() {
  const [show, setShow] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);

  useEffect(() => setShow(true), []);

  const dismiss = useCallback(() => {
    const el = root.current;
    if (leaving.current || !el) return;
    leaving.current = true;
    gsap.to(el.querySelector(".intro-stage"), { scale: 0.97, opacity: 0, duration: 0.18, ease: "power2.in" });
    gsap.to(el, {
      clipPath: "inset(50% 0% 50% 0%)",
      duration: 0.32,
      ease: "expo.inOut",
      onComplete: () => setShow(false),
    });
  }, []);

  useEffect(() => {
    if (!show) return;
    // The overlay has painted above the static boot cover, so it can go.
    document.getElementById("oru-boot")?.setAttribute("data-done", "");
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const layout = (left: number, right: number, gap: number) => {
        const start = -(left + gap + right) / 2;
        return { left: start, right: start + left + gap, end: start + left + gap + right };
      };
      const L1 = layout(wordWidth("oru"), wordWidth("code"), WORD_GAPS.code);
      const L2 = layout(wordWidth("oru"), wordWidth("design"), WORD_GAPS.design);
      const L3 = layout(wordWidth("oru"), wordWidth("prompt"), WORD_GAPS.prompt);
      const L4 = layout(ML_WIDTH, wordWidth("code"), ML_CODE_GAP);
      const caret = q(".caret");

      gsap.set(q(".l"), { autoAlpha: 0 });
      gsap.set(q(".slot-left"), { x: L1.left });
      gsap.set(q(".slot-right"), { x: L1.right });
      gsap.set(caret, { x: L1.left, autoAlpha: 0 });
      gsap.to(q(".caret-blink"), { opacity: 0, duration: 0.3, ease: "steps(1)", repeat: -1, yoyo: true });

      const count = q(".intro-count")[0] as HTMLElement | undefined;
      const tl = gsap.timeline({
        onUpdate() {
          if (count) count.textContent = String(Math.min(100, Math.round(this.progress() * 100)));
        },
      });
      tl.timeScale(INTRO_SPEED);

      // 1 · caret blinks, then types ORU CODE
      tl.set(caret, { autoAlpha: 1 }, 0.15);
      let t = 0.8;
      const type = (id: WordId, base: number) => {
        const letters = q(`.w-${id} .l`);
        letterOffsets(id).forEach(({ x, w }, i) => {
          tl.set(letters[i], { autoAlpha: 1, y: 0 }, t);
          tl.set(caret, { x: base + x + w + CARET_GAP }, t);
          t += 0.075;
        });
      };
      type("oru", L1.left);
      t += 0.1;
      tl.set(caret, { x: L1.right - CARET_GAP - 0.55 }, t);
      t += 0.1;
      type("code", L1.right);

      // 2–4 · odometer roll between words, logo re-centres, caret glides along
      const swap = (label: string, outs: string[], ins: string[], to: typeof L1) => {
        tl.addLabel(label, "+=0.55");
        for (const sel of outs) {
          tl.to(q(`${sel} .l`), { y: -9, duration: 0.5, ease: "power3.in", stagger: 0.025 }, label);
        }
        for (const sel of ins) {
          tl.fromTo(
            q(`${sel} .l`),
            { y: 9, autoAlpha: 1 },
            { y: 0, duration: 0.75, ease: "expo.out", stagger: 0.035 },
            `${label}+=0.32`,
          );
        }
        tl.to(q(".slot-left"), { x: to.left, duration: 0.9, ease: "expo.inOut" }, label);
        tl.to(q(".slot-right"), { x: to.right, duration: 0.9, ease: "expo.inOut" }, label);
        tl.to(caret, { x: to.end + CARET_GAP, duration: 0.9, ease: "expo.inOut" }, label);
      };
      swap("design", [".w-code"], [".w-design"], L2);
      swap("prompt", [".w-design"], [".w-prompt"], L3);
      swap("malayalam", [".w-oru", ".w-prompt"], [".w-ml", ".w-code"], L4);

      // 5 · caret bows out, the handwritten tag writes in left to right
      tl.addLabel("tag", "+=0.35");
      tl.to(caret, { autoAlpha: 0, duration: 0.2 }, "tag");
      tl.to(q(".tag-reveal"), { attr: { width: TAG.w + 0.2 }, duration: 1.35, ease: "power1.inOut" }, "tag+=0.1");

      // the finished ചേട്ടാ tag holds here — without this beat it flashes past
      tl.addLabel("out", "+=1");
      tl.add(dismiss, "out");

      if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __oruIntro?: gsap.core.Timeline }).__oruIntro = tl;
      }

      // Reduced motion: show the finished logo without the sequence, then continue.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        tl.pause();
        tl.seek(tl.labels.out - 0.01);
        gsap.delayedCall(1, dismiss);
      }
    }, root);

    return () => ctx.revert();
  }, [show, dismiss]);

  if (!show) return null;

  return (
    <div ref={root} className="intro" role="dialog" aria-label="Loading ORU">
      <div className="intro-stage">
        <svg viewBox="-28 -5 56 13" role="img" aria-label="ORU CODE, ORU DESIGN, ORU PROMPT, ഒരു CODE">
          <g className="slot-left">
            <clipPath id="oru-clip-left">
              <rect x={-0.6} y={-0.6} width={ML_WIDTH + 1.2} height={7.8} />
            </clipPath>
            <g clipPath="url(#oru-clip-left)">
              <LatinWord id="oru" color={RED} />
              <MalayalamWord />
            </g>
            <filter id="oru-ink" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
              {/* keep only the dark ink: alpha = source alpha − red channel, so white and red drop out */}
              <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -1 0 0 1 0" />
            </filter>
            <mask id="oru-tag-mask">
              <image
                href={TAG.href}
                x={TAG.x}
                y={TAG.y}
                width={TAG.w}
                height={TAG.h}
                preserveAspectRatio="none"
                filter="url(#oru-ink)"
              />
            </mask>
            <clipPath id="oru-tag-reveal">
              <rect className="tag-reveal" x={TAG.x - 0.1} y={TAG.y - 0.1} width={0} height={TAG.h + 0.2} />
            </clipPath>
            <g transform={`translate(0 ${ML_Y})`}>
              <g clipPath="url(#oru-tag-reveal)">
                <rect x={TAG.x} y={TAG.y} width={TAG.w} height={TAG.h} fill={INK} mask="url(#oru-tag-mask)" />
              </g>
            </g>
          </g>

          <g className="slot-right">
            <clipPath id="oru-clip-right">
              <rect x={-0.6} y={-0.6} width={wordWidth("prompt") + 1.2} height={6.2} />
            </clipPath>
            <g clipPath="url(#oru-clip-right)">
              <LatinWord id="code" color={INK} />
              <LatinWord id="design" color={INK} />
              <LatinWord id="prompt" color={INK} />
            </g>
          </g>

          <g className="caret">
            <rect className="caret-blink" x={0} y={0} width={0.55} height={5} fill={RED} />
          </g>
        </svg>
      </div>
      <div className="intro-meter" aria-hidden="true">
        <span className="intro-count">0</span>
      </div>
    </div>
  );
}
