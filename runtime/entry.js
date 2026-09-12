// Preview runtime: bundled into public/vendor/oru-runtime.js and loaded inside
// sandboxed preview iframes. React snippets are compiled with Babel standalone
// to CommonJS, and their `require()` calls resolve against this module table.
import * as React from "react";
import * as ReactJsxRuntime from "react/jsx-runtime";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import * as FramerMotion from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import anime from "animejs";
// Tree-shaken re-export of just the icons imported assets use — see the file
// itself for how it's generated (importing "lucide-react" directly here would
// bundle its full ~1000-icon set into this shared runtime).
import * as LucideReact from "./lucide-icons.generated.js";

gsap.registerPlugin(ScrollTrigger);

const esm = (def, named) => Object.assign({ __esModule: true, default: def }, named);

window.OruModules = {
  react: esm(React, React),
  "react/jsx-runtime": ReactJsxRuntime,
  "react-dom": esm(ReactDOM, ReactDOM),
  "react-dom/client": esm(ReactDOMClient, ReactDOMClient),
  "framer-motion": FramerMotion,
  "motion/react": FramerMotion,
  gsap: esm(gsap, { gsap, ScrollTrigger }),
  "gsap/ScrollTrigger": esm(ScrollTrigger, { ScrollTrigger }),
  animejs: esm(anime, { anime }),
  "lucide-react": LucideReact,
};
