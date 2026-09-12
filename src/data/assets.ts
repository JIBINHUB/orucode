import { code } from "@/lib/code";
import type { Asset } from "@/lib/types";

/**
 * Starter set. Add new designs by appending objects to this array (or split
 * into files per category and spread them in). Every asset needs an `html`
 * variant, a `react` variant, or both — `react: "auto"` derives JSX from HTML.
 */
export const STARTER_ASSETS: Asset[] = [
  {
    id: "void-portal-hero",
    title: "Void Portal Hero",
    description: "Near-black canvas, one muted accent and whisper-thin ghost UI — a quiet, confident hero for studio sites.",
    category: "heroes",
    libraries: ["gsap"],
    tags: ["dark", "minimal", "studio", "ghost-ui", "editorial"],
    complexity: "intermediate",
    tone: "dark",
    added: "2026-09-12",
    featured: true,
    react: "auto",
    html: {
      html: code`
<section class="vp-hero">
  <div class="vp-glow" aria-hidden="true"></div>
  <span class="vp-pill">A quiet stage for interfaces</span>
  <h1 class="vp-title">Code that <em>feels</em><br />like nothing at all</h1>
  <p class="vp-sub">Motion, chrome and colour recede — the work carries the room.</p>
  <div class="vp-actions">
    <a href="#" class="vp-btn primary">Enter the studio</a>
    <a href="#" class="vp-btn ghost">See the work</a>
  </div>
  <div class="vp-ring" aria-hidden="true"></div>
</section>`,
      css: code`
body { margin: 0; background: #000; font-family: system-ui, sans-serif; color: #fff; }
.vp-hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 22px; padding: 8vh 6vw; box-sizing: border-box; overflow: hidden; text-align: center; }
.vp-glow { position: absolute; inset: -20%; background: radial-gradient(38% 30% at 50% 40%, rgba(150,90,60,.28), transparent 70%); filter: blur(40px); }
.vp-ring { position: absolute; width: 46vw; height: 46vw; max-width: 560px; max-height: 560px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,.08); z-index: 0; }
.vp-pill { position: relative; z-index: 1; height: 34px; padding: 0 18px; display: inline-flex; align-items: center;
  border-radius: 999px; border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.04);
  font-size: 12.5px; letter-spacing: .06em; color: rgba(255,255,255,.7); opacity: 0; }
.vp-title { position: relative; z-index: 1; margin: 0; max-width: 16ch; font-weight: 600; letter-spacing: -.03em;
  font-size: clamp(32px, 5.6vw, 62px); line-height: 1.06; opacity: 0; }
.vp-title em { font-family: Georgia, "Times New Roman", serif; font-style: italic; font-weight: 400; color: #d99a72; }
.vp-sub { position: relative; z-index: 1; margin: 0; max-width: 40ch; color: rgba(255,255,255,.5); font-size: 15px; opacity: 0; }
.vp-actions { position: relative; z-index: 1; display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; opacity: 0; }
.vp-btn { height: 46px; padding: 0 24px; border-radius: 999px; display: inline-flex; align-items: center; font-size: 14px;
  font-weight: 600; text-decoration: none; transition: transform .2s, background .2s; }
.vp-btn.primary { background: #d99a72; color: #1a1006; }
.vp-btn.ghost { border: 1px solid rgba(255,255,255,.18); color: #fff; }
.vp-btn:hover { transform: translateY(-2px); }`,
      js: code`
gsap.timeline({ defaults: { ease: "power3.out", duration: .8 }, delay: .1 })
  .to(".vp-ring", { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }, 0)
  .from(".vp-ring", { scale: .8, opacity: 0 }, 0)
  .to(".vp-pill", { opacity: 1, y: 0 }, .1)
  .to(".vp-title", { opacity: 1, y: 0 }, .22)
  .to(".vp-sub", { opacity: 1, y: 0 }, .36)
  .to(".vp-actions", { opacity: 1, y: 0 }, .46);
gsap.set([".vp-pill", ".vp-title", ".vp-sub", ".vp-actions"], { y: 16 });`,
    },
  },
  {
    id: "arc-portrait-hero",
    title: "Arc Portrait Hero",
    description: "A fan of tiles arcs over a centered mark, then a serif headline — a hero for personal brands and studios.",
    category: "heroes",
    libraries: ["gsap"],
    tags: ["portfolio", "studio", "arc", "editorial", "serif"],
    complexity: "intermediate",
    tone: "light",
    added: "2026-09-12",
    featured: true,
    react: "auto",
    html: {
      html: code`
<section class="ap-hero">
  <div class="ap-arc" aria-hidden="true">
    <span class="ap-tile" style="left:3%;top:76%;--r:-9deg;--c:#e8c7b0"></span>
    <span class="ap-tile" style="left:13%;top:42%;--r:7deg;--c:#c9d6c1"></span>
    <span class="ap-tile" style="left:25%;top:16%;--r:-13deg;--c:#0a0a0a"></span>
    <span class="ap-tile" style="left:38%;top:1%;--r:6deg;--c:#d8dbe6"></span>
    <span class="ap-tile round" style="left:50%;top:-6%;--r:0deg;--c:#f4e4c9"></span>
    <span class="ap-tile" style="left:62%;top:1%;--r:-8deg;--c:#c3b6d6"></span>
    <span class="ap-tile" style="left:75%;top:16%;--r:11deg;--c:#0a0a0a"></span>
    <span class="ap-tile" style="left:87%;top:42%;--r:-7deg;--c:#e2b8b0"></span>
    <span class="ap-tile" style="left:97%;top:76%;--r:9deg;--c:#c7d4d8"></span>
  </div>
  <div class="ap-brand">
    <span class="ap-avatar">N</span>
    <b>NOVA</b>
    <small>A Design &amp; Motion Studio</small>
  </div>
  <p class="ap-kicker">The craft of visual storytelling</p>
  <h1 class="ap-title">Interfaces worth <em>remembering</em></h1>
</section>`,
      css: code`
body { margin: 0; background: #f3f1ee; font-family: system-ui, sans-serif; color: #161512; }
.ap-hero { position: relative; min-height: 100vh; padding: 8vh 6vw 10vh; box-sizing: border-box; overflow: hidden; }
.ap-arc { position: relative; height: 30vh; max-width: 760px; margin: 0 auto; }
.ap-tile { position: absolute; width: clamp(44px, 5.6vw, 60px); height: clamp(44px, 5.6vw, 60px); border-radius: 16px;
  background: var(--c); box-shadow: 0 20px 30px -18px rgba(0,0,0,.4); transform: translate(-50%, -50%) rotate(var(--r)); opacity: 0; }
.ap-tile.round { border-radius: 50%; }
.ap-brand { position: relative; z-index: 1; margin: 4vh auto 0; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; opacity: 0; }
.ap-avatar { width: 56px; height: 56px; border-radius: 50%; background: #0a0a0a; color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 20px; }
.ap-brand b { font-size: 15px; letter-spacing: 0.14em; }
.ap-brand small { color: #6f6d68; font-size: 12.5px; }
.ap-kicker { text-align: center; margin: 3.5vh 0 0; font-style: italic; font-size: clamp(15px, 1.7vw, 19px); color: #6f6d68; opacity: 0; }
.ap-title { text-align: center; margin: 1.2vh auto 0; max-width: 16ch; font-family: Georgia, "Times New Roman", serif; font-weight: 400;
  font-size: clamp(34px, 6vw, 68px); line-height: 1.05; letter-spacing: -0.01em; opacity: 0; }
.ap-title em { font-style: italic; }`,
      js: code`
gsap.timeline({ defaults: { ease: "power3.out" } })
  .to(".ap-tile", { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 })
  .to(".ap-brand", { opacity: 1, duration: 0.6 }, "-=0.3")
  .to(".ap-kicker", { opacity: 1, duration: 0.6 }, "-=0.3")
  .to(".ap-title", { opacity: 1, duration: 0.7 }, "-=0.35");`,
    },
  },
  {
    id: "orbit-counter-loader",
    title: "Orbit Counter Loader",
    description: "Three counter-rotating rings with a GSAP percentage counter — drop-in preloader.",
    category: "loaders",
    libraries: ["gsap"],
    tags: ["preloader", "counter", "rings", "minimal"],
    complexity: "basic",
    tone: "dark",
    added: "2026-09-01",
    featured: true,
    react: "auto",
    html: {
      html: code`
<div class="loader">
  <div class="orbit"><span></span><span></span><span></span></div>
  <p class="label">Loading <b class="count">0</b>%</p>
</div>`,
      css: code`
body { margin: 0; background: #060708; font-family: system-ui, sans-serif; color: #fff; }
.loader { min-height: 100vh; display: grid; place-content: center; justify-items: center; gap: 28px;
  background: radial-gradient(40% 40% at 50% 45%, rgba(255,255,255,.06), transparent 70%); }
.orbit { position: relative; width: 110px; height: 110px; }
.orbit span { position: absolute; inset: 0; border-radius: 50%; border: 3px solid transparent; border-top-color: #fff; }
.orbit span:nth-child(2) { inset: 16px; border-top-color: rgba(255,255,255,.6); }
.orbit span:nth-child(3) { inset: 32px; border-top-color: rgba(255,255,255,.3); }
.label { margin: 0; font-size: 13px; letter-spacing: .22em; text-transform: uppercase; color: #8e9098; }
.label b { color: #fff; }`,
      js: code`
gsap.to(".orbit span", { rotate: 360, duration: (i) => 1 + i * 0.45, ease: "none", repeat: -1 });
const counter = { value: 0 };
gsap.to(counter, {
  value: 100, duration: 2.4, ease: "power2.inOut", repeat: -1, repeatDelay: 0.5,
  onUpdate: () => { document.querySelector(".count").textContent = Math.round(counter.value); }
});`,
    },
  },
  {
    id: "star-line-draw-logo",
    title: "Star Line-Draw Logo",
    description: "anime.js strokes an SVG star mark, fills it, then reveals the wordmark.",
    category: "logos",
    libraries: ["anime"],
    tags: ["svg", "line draw", "wordmark", "brand"],
    complexity: "intermediate",
    tone: "dark",
    added: "2026-09-02",
    featured: true,
    react: "auto",
    html: {
      html: code`
<div class="stage">
  <svg class="mark" viewBox="0 0 120 120" width="130" height="130">
    <path class="line" d="M60 8 L71 49 L112 60 L71 71 L60 112 L49 71 L8 60 L49 49 Z" />
  </svg>
  <h1 class="word"><span class="oru">ORU</span> CODE</h1>
</div>`,
      css: code`
body { margin: 0; background: #060708; font-family: system-ui, sans-serif; }
.stage { min-height: 100vh; display: grid; place-content: center; justify-items: center; gap: 18px;
  background: radial-gradient(35% 35% at 30% 20%, rgba(31,123,255,.45), transparent 70%), #060708; }
.line { fill: rgba(255,255,255,0); stroke: #fff; stroke-width: 3; stroke-linejoin: round; }
.mark { filter: drop-shadow(0 0 18px rgba(255,255,255,.35)); }
.word { margin: 0; color: #fff; font-size: 44px; font-weight: 900; letter-spacing: -.01em; opacity: 0; }
.word .oru { color: #ff3131; }`,
      js: code`
anime.timeline({ loop: true, direction: "alternate", endDelay: 600 })
  .add({ targets: ".line", strokeDashoffset: [anime.setDashoffset, 0], duration: 1600, easing: "easeInOutSine" })
  .add({ targets: ".line", fill: ["rgba(255,255,255,0)", "#ffffff"], duration: 500, easing: "linear" })
  .add({ targets: ".word", opacity: [0, 1], translateY: [18, 0], duration: 700, easing: "easeOutExpo" }, "-=300");`,
    },
  },
  {
    id: "glow-pill-button",
    title: "Glow Pill Button",
    description: "White pill CTA with a breathing halo and a magnetic GSAP hover pull.",
    category: "interactions",
    libraries: ["gsap"],
    tags: ["button", "magnetic", "glow", "cta"],
    complexity: "basic",
    tone: "dark",
    added: "2026-09-03",
    react: "auto",
    html: {
      html: code`
<div class="wrap">
  <button class="pill">Get Started</button>
</div>`,
      css: code`
body { margin: 0; background: #060708; font-family: system-ui, sans-serif; }
.wrap { min-height: 100vh; display: grid; place-items: center; }
.pill { border: 0; cursor: pointer; height: 58px; padding: 0 44px; border-radius: 999px; background: #fff; color: #0a0a0b;
  font-size: 16px; font-weight: 700; box-shadow: 0 0 30px 6px rgba(255,255,255,.3), 0 0 80px 20px rgba(255,255,255,.12);
  animation: breathe 2.8s ease-in-out infinite; }
@keyframes breathe { 50% { box-shadow: 0 0 44px 12px rgba(255,255,255,.4), 0 0 110px 30px rgba(255,255,255,.16); } }`,
      js: code`
const btn = document.querySelector(".pill");
btn.addEventListener("mousemove", (e) => {
  const r = btn.getBoundingClientRect();
  gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.5, duration: 0.4 });
});
btn.addEventListener("mouseleave", () => gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" }));`,
    },
  },
  {
    id: "onboarding-hero",
    title: "Onboarding Hero",
    description: "Photo-free onboarding hero: progress track, bold rounded headline and glowing Next pill.",
    category: "heroes",
    libraries: ["css"],
    tags: ["onboarding", "mobile", "glow", "dark"],
    complexity: "basic",
    tone: "dark",
    added: "2026-09-04",
    featured: true,
    react: "auto",
    html: {
      html: code`
<section class="hero">
  <div class="top"><div class="track"><i></i></div><a href="#" class="skip">Skip</a></div>
  <div class="art"><span></span><span></span><span></span></div>
  <div class="copy">
    <h1>See what’s happening around you</h1>
    <p>From concerts to tech meetups, art shows to sports events — find what excites you.</p>
  </div>
  <button class="next">Next</button>
</section>`,
      css: code`
body { margin: 0; background: #000; font-family: system-ui, sans-serif; color: #fff; }
.hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; padding: 28px 24px 40px; overflow: hidden; }
.top { display: flex; align-items: center; gap: 16px; position: relative; z-index: 2; }
.track { flex: 1; height: 4px; border-radius: 9px; background: rgba(255,255,255,.25); overflow: hidden; }
.track i { display: block; width: 30%; height: 100%; background: #fff; border-radius: 9px; animation: fill 3s ease-in-out infinite; }
@keyframes fill { from { width: 0; } to { width: 100%; } }
.skip { color: #fff; text-decoration: none; font-weight: 600; font-size: 14px; }
.art { position: absolute; inset: 0 0 35% 0; background: radial-gradient(50% 50% at 50% 40%, #0b3a8a, transparent 70%), radial-gradient(40% 40% at 20% 30%, #1f7bff, transparent 70%), radial-gradient(40% 40% at 80% 60%, #3d9bff, transparent 70%); filter: blur(10px); }
.art span { position: absolute; border-radius: 50%; background: rgba(255,255,255,.12); backdrop-filter: blur(6px); animation: float 6s ease-in-out infinite; }
.art span:nth-child(1) { width: 140px; height: 140px; left: 12%; top: 22%; }
.art span:nth-child(2) { width: 90px; height: 90px; right: 16%; top: 14%; animation-delay: -2s; }
.art span:nth-child(3) { width: 60px; height: 60px; right: 30%; top: 48%; animation-delay: -4s; }
@keyframes float { 50% { transform: translateY(-18px); } }
.copy { margin-top: auto; position: relative; z-index: 2; background: linear-gradient(180deg, transparent, #000 30%); padding-top: 60px; }
.copy h1 { margin: 0 0 18px; font-size: clamp(34px, 6vw, 64px); line-height: 1.05; font-weight: 900; max-width: 12ch; }
.copy p { margin: 0 0 0 auto; max-width: 30ch; color: rgba(255,255,255,.62); font-size: 15px; }
.next { position: relative; z-index: 2; align-self: center; margin-top: 40px; border: 0; height: 52px; width: 180px; border-radius: 999px; background: #fff; color: #000; font-weight: 600; font-size: 15px; box-shadow: 0 0 30px 8px rgba(255,255,255,.35), 0 0 80px 24px rgba(255,255,255,.12); cursor: pointer; }`,
    },
  },
  {
    id: "glass-category-grid",
    title: "Glass Category Grid",
    description: "“Choose category” tiles with frosted gradients, glowing glyphs and a halo CTA.",
    category: "cards",
    libraries: ["css"],
    tags: ["glassmorphism", "grid", "tiles", "onboarding"],
    complexity: "basic",
    tone: "dark",
    added: "2026-09-05",
    featured: true,
    react: "auto",
    html: {
      html: code`
<section class="cats">
  <h2>Choose Category’s</h2>
  <div class="grid">
    <button class="tile"><span class="ic">✦</span>Art</button>
    <button class="tile"><span class="ic">▣</span>Business</button>
    <button class="tile on"><span class="ic">✈</span>Travel</button>
    <button class="tile"><span class="ic">♥</span>Family</button>
    <button class="tile"><span class="ic">●</span>Sport</button>
    <button class="tile on"><span class="ic">♣</span>Hobbies</button>
    <button class="tile"><span class="ic">♫</span>Music</button>
    <button class="tile"><span class="ic">▤</span>Education</button>
  </div>
  <button class="cta">Get Started</button>
</section>`,
      css: code`
body { margin: 0; background: #07080a; font-family: system-ui, sans-serif; color: #fff; }
.cats { min-height: 100vh; padding: 40px 20px; display: flex; flex-direction: column; align-items: center;
  background: radial-gradient(40% 30% at 0% 60%, rgba(31,123,255,.35), transparent 70%), radial-gradient(40% 30% at 100% 100%, rgba(61,155,255,.3), transparent 70%), #07080a; }
.cats h2 { align-self: stretch; max-width: 640px; margin: 0 auto 18px; width: 100%; font-size: 22px; font-weight: 800; }
.grid { width: 100%; max-width: 640px; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
.tile { display: grid; justify-items: center; gap: 10px; padding: 26px 10px; border-radius: 18px; cursor: pointer; color: #fff; font-size: 14px;
  background: linear-gradient(165deg, rgba(40,41,46,.9), rgba(22,23,27,.9)); border: 1px solid rgba(255,255,255,.05); transition: background .3s, transform .3s; }
.tile:hover { transform: translateY(-3px); }
.tile.on { background: linear-gradient(165deg, rgba(96,98,104,.7), rgba(56,57,62,.7)); border-color: rgba(255,255,255,.18); box-shadow: inset 0 1px 0 rgba(255,255,255,.16); }
.ic { font-size: 24px; text-shadow: 0 0 14px rgba(255,255,255,.5); }
.cta { margin-top: 36px; border: 0; height: 50px; padding: 0 40px; border-radius: 999px; background: #fff; color: #000; font-weight: 600; cursor: pointer;
  box-shadow: 0 0 30px 8px rgba(255,255,255,.3), 0 0 80px 24px rgba(255,255,255,.1); }`,
    },
  },
  {
    id: "stagger-feature-tiles",
    title: "Stagger Feature Tiles",
    description: "Framer Motion variants stagger glass feature tiles in, with spring hover lift.",
    category: "features",
    libraries: ["framer-motion"],
    tags: ["stagger", "variants", "bento", "hover"],
    complexity: "intermediate",
    tone: "dark",
    added: "2026-09-06",
    featured: true,
    react: {
      code: code`
import { motion } from "framer-motion";
import "./styles.css";

const features = [
  { icon: "✦", title: "Live previews", text: "Every snippet renders in a sandbox as you edit." },
  { icon: "◌", title: "Motion first", text: "GSAP, anime.js and Framer Motion built in." },
  { icon: "▦", title: "Two flavours", text: "Copy HTML/CSS or a ready React component." },
  { icon: "✉", title: "Prompts", text: "Full website prompts to kickstart builds." },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };
const tile = { hidden: { opacity: 0, y: 30, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1 } };

export default function StaggerFeatureTiles() {
  return (
    <section className="features">
      <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        Built for <span>motion</span>
      </motion.h2>
      <motion.div className="grid" variants={container} initial="hidden" animate="show">
        {features.map((f) => (
          <motion.article key={f.title} className="tile" variants={tile} whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}>
            <span className="icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}`,
      css: code`
body { margin: 0; background: #060708; font-family: system-ui, sans-serif; color: #fff; }
.features { min-height: 100vh; padding: 64px 32px; box-sizing: border-box;
  background: radial-gradient(35% 30% at 10% 10%, rgba(31,123,255,.4), transparent 70%), #060708; }
.features h2 { margin: 0 0 32px; font-size: 44px; font-weight: 900; }
.features h2 span { color: #8e9098; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
.tile { padding: 26px; border-radius: 22px; background: linear-gradient(165deg, rgba(40,41,46,.85), rgba(18,19,22,.85)); border: 1px solid rgba(255,255,255,.07); }
.icon { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; background: rgba(255,255,255,.12); font-size: 20px; text-shadow: 0 0 12px rgba(255,255,255,.6); }
.tile h3 { margin: 18px 0 6px; font-size: 18px; }
.tile p { margin: 0; color: #8e9098; font-size: 14px; line-height: 1.5; }`,
    },
  },
  {
    id: "rising-wordmark-footer",
    title: "Rising Wordmark Footer",
    description: "Footer with link columns and a giant wordmark whose letters rise in with GSAP.",
    category: "footers",
    libraries: ["gsap"],
    tags: ["footer", "wordmark", "stagger", "typography"],
    complexity: "intermediate",
    tone: "dark",
    added: "2026-09-07",
    react: "auto",
    html: {
      html: code`
<footer class="footer">
  <div class="cols">
    <div><h4>Product</h4><a href="#">Library</a><a href="#">Playground</a><a href="#">Prompts</a></div>
    <div><h4>Company</h4><a href="#">About</a><a href="#">Careers</a><a href="#">Contact</a></div>
    <div><h4>Social</h4><a href="#">Dribbble</a><a href="#">Instagram</a><a href="#">X</a></div>
  </div>
  <div class="big"><span class="oru">O</span><span class="oru">R</span><span class="oru">U</span><span class="gap"></span><span>C</span><span>O</span><span>D</span><span>E</span></div>
</footer>`,
      css: code`
body { margin: 0; background: #060708; font-family: system-ui, sans-serif; color: #fff; }
.footer { min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; padding: 56px 40px 0; box-sizing: border-box;
  background: radial-gradient(40% 40% at 100% 100%, rgba(61,155,255,.35), transparent 70%), #060708; overflow: hidden; }
.cols { display: grid; grid-template-columns: repeat(3, minmax(0, 180px)); gap: 32px; }
.cols h4 { margin: 0 0 14px; font-size: 13px; color: #5c5f68; font-weight: 600; }
.cols a { display: block; color: #d8d8dc; text-decoration: none; margin-bottom: 8px; font-size: 15px; }
.cols a:hover { color: #fff; }
.big { display: flex; justify-content: space-between; font-size: 12.5vw; font-weight: 900; line-height: .78; letter-spacing: -.04em; overflow: hidden; color: rgba(255,255,255,.92); }
.big span { display: inline-block; }
.big .oru { color: #ff3131; }
.big .gap { width: 3vw; }`,
      js: code`
gsap.from(".big span", { yPercent: 100, duration: 1, stagger: 0.07, ease: "power4.out", repeat: -1, repeatDelay: 1.6, yoyo: true });`,
    },
  },
  {
    id: "event-app-landing",
    title: "Event App Landing",
    description: "Full landing page for an event-discovery app: nav, hero, event cards, categories and footer.",
    category: "pages",
    libraries: ["css"],
    tags: ["landing", "events", "app", "glass"],
    complexity: "advanced",
    tone: "dark",
    added: "2026-09-08",
    featured: true,
    promptId: "event-discovery-app",
    react: "auto",
    html: {
      html: code`
<div class="site">
  <nav class="nav">
    <b class="logo"><span class="oru">ORU</span> CODE</b>
    <div class="links"><a href="#events">Events</a><a href="#cats">Categories</a><a href="#">Pricing</a></div>
    <button class="btn">Get the app</button>
  </nav>
  <header class="hero">
    <p class="kicker">Dark Shot · <span>App Design</span></p>
    <h1>Choose Today’s Event</h1>
    <p class="sub">Concerts, meetups, art shows and sports — all around you, all in one place.</p>
    <button class="btn big">Explore events</button>
  </header>
  <section id="events" class="events">
    <article class="event e1"><span class="price">$99</span><div><small>150+ Joined</small><h3>Winter Music Festival 2026</h3><p>Jan 25, 2026 · Central Park, NY</p></div></article>
    <article class="event e2"><span class="price">$88</span><div><small>90+ Joined</small><h3>Birthday Rooftop Party</h3><p>Feb 2, 2026 · Brooklyn, NY</p></div></article>
    <article class="event e3"><span class="price">Free</span><div><small>300+ Joined</small><h3>Tech Meetup Night</h3><p>Feb 9, 2026 · SoHo, NY</p></div></article>
  </section>
  <section id="cats" class="cats">
    <h2>Choose Category’s</h2>
    <div class="grid"><span>Art</span><span>Business</span><span class="on">Travel</span><span>Family</span><span>Sport</span><span class="on">Hobbies</span><span>Music</span><span>Education</span></div>
  </section>
  <footer class="foot">© 2026 ORU CODE · Made for going out</footer>
</div>`,
      css: code`
body { margin: 0; background: #060708; color: #fff; font-family: system-ui, sans-serif; }
.site { background: radial-gradient(40% 25% at 0% 0%, rgba(31,123,255,.5), transparent 70%), radial-gradient(40% 30% at 100% 60%, rgba(61,155,255,.3), transparent 70%), #060708; }
.nav { display: flex; align-items: center; justify-content: space-between; padding: 22px 40px; }
.logo { font-size: 22px; }
.logo .oru { color: #ff3131; }
.links { display: flex; gap: 28px; }
.links a { color: #8e9098; text-decoration: none; font-size: 14px; }
.btn { border: 0; height: 44px; padding: 0 24px; border-radius: 999px; background: #fff; color: #000; font-weight: 600; cursor: pointer; box-shadow: 0 0 24px 4px rgba(255,255,255,.25); }
.btn.big { height: 54px; padding: 0 36px; margin-top: 28px; }
.hero { text-align: center; padding: 90px 24px 70px; }
.kicker { color: #fff; margin: 0; font-size: 18px; } .kicker span { color: #8e9098; }
.hero h1 { font-size: clamp(44px, 7vw, 96px); line-height: 1; margin: 18px auto; max-width: 11ch; font-weight: 900; }
.sub { color: #8e9098; max-width: 44ch; margin: 0 auto; font-size: 17px; }
.events { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; padding: 20px 40px 60px; }
.event { position: relative; height: 380px; border-radius: 26px; overflow: hidden; display: flex; align-items: flex-end; text-align: center; padding: 22px; }
.event::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 35%, rgba(12,12,14,.95)); }
.event > * { position: relative; z-index: 1; width: 100%; }
.e1 { background: radial-gradient(60% 50% at 40% 30%, #1f7bff, #06142e); }
.e2 { background: radial-gradient(60% 50% at 60% 30%, #3d3d44, #111114); }
.e3 { background: radial-gradient(60% 50% at 50% 30%, #0b58e0, #041029); }
.price { position: absolute !important; top: 16px; left: 16px; width: auto !important; padding: 6px 14px; border-radius: 99px; background: rgba(255,255,255,.2); backdrop-filter: blur(10px); font-size: 13px; }
.event small { color: rgba(255,255,255,.7); font-size: 12px; }
.event h3 { margin: 4px 0 8px; font-size: 26px; line-height: 1.05; font-weight: 900; }
.event p { margin: 0; color: rgba(255,255,255,.7); font-size: 12px; }
.cats { padding: 30px 40px 80px; }
.cats h2 { font-size: 28px; margin: 0 0 18px; }
.cats .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
.cats span { padding: 34px 10px; text-align: center; border-radius: 18px; background: linear-gradient(165deg, rgba(40,41,46,.9), rgba(22,23,27,.9)); border: 1px solid rgba(255,255,255,.05); }
.cats span.on { background: linear-gradient(165deg, rgba(96,98,104,.7), rgba(56,57,62,.7)); border-color: rgba(255,255,255,.18); }
.foot { padding: 30px 40px; color: #5c5f68; font-size: 13px; border-top: 1px solid rgba(255,255,255,.07); }`,
    },
  },
];
