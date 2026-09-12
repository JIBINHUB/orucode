import type { WebsitePrompt } from "@/lib/types";

/** Starter full-website prompts. Append more objects to grow the library. */
export const STARTER_PROMPTS: WebsitePrompt[] = [
  {
    id: "event-discovery-app",
    title: "Event Discovery App Landing",
    industry: "Events",
    tags: ["dark", "glassmorphism", "mobile-first"],
    complexity: "advanced",
    libraries: ["gsap", "framer-motion"],
    sections: ["Navbar", "Onboarding hero", "Event cards", "Category grid", "Testimonials", "App download CTA", "Footer"],
    relatedAssetIds: ["event-app-landing", "glass-category-grid", "onboarding-hero"],
    added: "2026-09-08",
    prompt: `Build a dark, premium landing page for "ORU CODE", an app for discovering local events.

Visual style: near-black background (#060708) with large blurred colour glows (deep red top-left, teal left-centre, warm amber bottom-right). Frosted glass tiles with 22px radius, subtle top highlight borders. Bold rounded display font (Nunito 900) for headlines, Manrope for body. Primary buttons are white pills with a soft white halo glow.

Sections:
1. Sticky glass navbar with logo "ORU CODE" ("ORU" in red #ff3131), links, and a white "Get the app" pill.
2. Onboarding-style hero: thin progress track, headline "See what's happening around you", muted right-aligned subtext, glowing "Next" pill.
3. "Choose Today's Event" — text tabs (All, Birthday, Music, Games, Anniversary) filtering a horizontal scroll of tall event cards: price pill top-left, heart button top-right, avatar cluster, "150+ Joined", title, date + location.
4. "Choose Category's" — 2-column grid of glass tiles with glowing white glyphs; selected tiles are lighter.
5. Testimonial marquee, app store CTA, and a footer with a giant faint wordmark.

Motion: GSAP intro loader with a counter, staggered headline reveal, ScrollTrigger fade-ups; Framer Motion layout animation when tabs filter cards. Fully responsive; bottom floating dock nav on mobile with a white centre "+" pill. Accessible: focus rings, reduced-motion support, semantic HTML.`,
  },
  {
    id: "creative-studio-portfolio",
    title: "Creative Studio Portfolio",
    industry: "Agency",
    tags: ["editorial", "kinetic type", "case studies"],
    complexity: "intermediate",
    libraries: ["gsap"],
    sections: ["Loader", "Kinetic hero", "Selected work", "Services", "Clients marquee", "Contact", "Footer"],
    added: "2026-09-06",
    prompt: `Create a portfolio website for an independent creative studio.

Style: dark editorial layout, oversized kinetic typography, generous whitespace, one accent colour. Cursor follower that grows over links.

Sections: GSAP loading screen with a 0–100 counter and curtain wipe; hero with split-letter headline animation; selected work grid with hover video-style reveals; services accordion; infinite client logo marquee; contact form with floating labels; footer with magnetic social links and a giant wordmark.

Code: semantic HTML, CSS custom properties for theming, GSAP + ScrollTrigger for all motion, prefers-reduced-motion fallbacks, responsive down to 360px.`,
  },
  {
    id: "saas-analytics-startup",
    title: "SaaS Analytics Startup",
    industry: "SaaS",
    tags: ["bento", "pricing", "conversion"],
    complexity: "intermediate",
    libraries: ["framer-motion", "css"],
    sections: ["Navbar", "Hero with product shot", "Logo cloud", "Bento features", "Pricing toggle", "FAQ", "CTA", "Footer"],
    added: "2026-09-04",
    prompt: `Design and build a React (Next.js) marketing site for an analytics SaaS called "Pulse".

Style: dark glass UI, soft gradient glows, rounded cards, white primary pill buttons with halo.

Sections: responsive navbar with mobile menu; hero with headline, subcopy, two CTAs and a tilted dashboard mockup; logo cloud; bento feature grid with animated mini charts; stats counters; monthly/yearly pricing toggle (Framer Motion layout animation on the price); FAQ accordion; newsletter CTA; four-column footer.

Motion: Framer Motion staggered reveals on scroll (whileInView), spring hovers on cards, AnimatePresence for the mobile menu. Keep Lighthouse accessibility at 100.`,
  },
];
