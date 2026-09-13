"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "./Icons";
import { COMMUNITY } from "@/lib/seo";

const EASE = [0.2, 0.8, 0.2, 1] as const;

export function TelegramMark({ size = 22, bg = "#fff", fg = "#229ED9" }: { size?: number; bg?: string; fg?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill={bg} />
      <path
        d="M5.43 11.87 16.9 7.45c.53-.19 1 .13.83.93l-1.95 9.2c-.14.66-.54.82-1.09.51l-3-2.21-1.45 1.39c-.16.16-.3.3-.61.3l.21-3.05 5.56-5.02c.24-.21-.05-.33-.38-.12l-6.87 4.33-2.96-.93c-.64-.2-.66-.64.14-.95Z"
        fill={fg}
      />
    </svg>
  );
}

/** Channel-style posts showing what the community shares — not member messages. */
const POSTS = [
  { tag: "New design", text: "Perspective Carousel — live preview with React code", time: "10:24" },
  { tag: "Free prompt", text: "A full restaurant website brief, ready for Cursor or Claude Code", time: "13:05" },
  { tag: "Tip", text: "Mix any hero, pricing and footer from ORU CODE into one landing page", time: "18:40" },
];

export default function CommunityCard() {
  return (
    <motion.div
      className="tg"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="tg-copy">
        <span className="tg-tag">
          <TelegramMark size={20} /> Telegram community
        </span>
        <h2 className="tg-title">
          Join the <em>ORU CODE</em> community
        </h2>
        <p className="tg-text">
          Be the first to get new designs, animation drops and free website prompts — and share what you’re building with designers
          and developers from Kerala and beyond.
        </p>
        <div className="tg-actions">
          <a href={COMMUNITY.url} target="_blank" rel="noreferrer" className="tg-btn">
            <TelegramMark size={30} bg="#229ED9" fg="#fff" />
            Join on Telegram
            <ArrowRight size={16} />
          </a>
          <span className="tg-free">Free to join</span>
        </div>
        <ul className="tg-perks">
          <li>New designs first</li>
          <li>Free website prompts</li>
          <li>Share your builds</li>
        </ul>
      </div>

      <div className="tg-phone" aria-hidden="true">
        <svg className="tg-plane" viewBox="0 0 64 64">
          <path d="M3 29.5 60 6.5 49.5 57 32.5 44.5 23.5 55 21.5 40 48 17 17.5 36.5Z" fill="#fff" />
          <path d="M21.5 40 23.5 55 32.5 44.5Z" fill="#bfe0f6" />
        </svg>
        <div className="tg-screen">
          <div className="tg-head">
            <span className="tg-avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.png" alt="" />
            </span>
            <span>
              <b>ORU CODE</b>
              <small>community</small>
            </span>
          </div>
          <div className="tg-feed">
            {POSTS.map((p, i) => (
              <motion.div
                key={p.tag}
                className="tg-bubble"
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.35 + i * 0.45, duration: 0.5, ease: EASE }}
              >
                <span className="tg-bubble-tag">{p.tag}</span>
                <p>{p.text}</p>
                <span className="tg-time">{p.time} ✓✓</span>
              </motion.div>
            ))}
            <motion.div
              className="tg-typing"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.9, duration: 0.4 }}
            >
              <span />
              <span />
              <span />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
