"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ExternalIcon, MailGlyph, SendIcon } from "../Icons";

const EMAIL = "jibinchackoarpookara@gmail.com";
const TELEGRAM = "jibinchacko";
/**
 * Save a square-ish portrait to public/photos/jibin.jpg and set this to
 * "/photos/jibin.jpg" — it then replaces the monogram. Empty keeps the
 * monogram and avoids a broken image request on every load.
 */
const PHOTO = "";

export default function DeveloperView() {
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <div className="dev-wrap">
      <div className="dev-card">
        <div className="dev-top">
          <Link href="/" className="dev-round" aria-label="Back to home">
            <ChevronLeft size={20} />
          </Link>
          <div className="dev-top-right">
            <a href={`mailto:${EMAIL}`} className="dev-round" aria-label={`Email ${EMAIL}`}>
              <MailGlyph size={18} />
            </a>
            <a
              href={`https://t.me/${TELEGRAM}`}
              target="_blank"
              rel="noreferrer"
              className="dev-round"
              aria-label={`Chat on Telegram, @${TELEGRAM}`}
            >
              <SendIcon size={18} />
            </a>
          </div>
        </div>

        <span className="dev-avatar-wrap">
          <span className="dev-monogram" aria-hidden="true">
            JC
          </span>
          {PHOTO && photoOk && (
            <img className="dev-avatar" src={PHOTO} alt="Jibin Chacko" onError={() => setPhotoOk(false)} />
          )}
          <span className="dev-dot" aria-hidden="true" />
        </span>

        <p className="dev-hello">Hey, I’m</p>
        <h1 className="dev-name">Jibin Chacko</h1>
        <p className="dev-sub">Designer &amp; developer · Leaf Creationism</p>

        <div className="dev-chips">
          <span className="dev-chip">Kerala, India</span>
          <span className="dev-chip">Websites &amp; apps</span>
          <span className="dev-chip">Made ORU CODE</span>
        </div>

        <div className="dev-actions">
          <a className="dev-action" href={`mailto:${EMAIL}`}>
            <span className="dev-tile">
              <MailGlyph size={22} />
            </span>
            <span>Email</span>
          </a>
          <a className="dev-action" href={`https://t.me/${TELEGRAM}`} target="_blank" rel="noreferrer">
            <span className="dev-tile">
              <SendIcon size={22} />
            </span>
            <span>Telegram</span>
          </a>
          <a className="dev-action" href="https://leafcreationism.in" target="_blank" rel="noreferrer">
            <span className="dev-tile">
              <ExternalIcon size={22} />
            </span>
            <span>Website</span>
          </a>
        </div>

        <div className="dev-bio">
          <p className="dev-bio-k">a little about me</p>
          <p className="dev-bio-v">
            I design and build websites and apps from Kerala, and I run Leaf Creationism — the place where
            rough ideas get turned into things people genuinely enjoy using.
          </p>
          <p className="dev-bio-v">
            I made ORU CODE because good interfaces shouldn’t sit locked away in one person’s folder.
            Everything here is free to copy, remix and ship. If a piece of it ends up in your project, I’d
            honestly love to see it — send me a message.
          </p>
          <p className="dev-sign">— Jibin</p>
        </div>

        <div className="dev-rows">
          <a className="dev-row" href={`mailto:${EMAIL}`}>
            <span className="dev-tile sm">
              <MailGlyph size={17} />
            </span>
            <span>
              <b>Mail</b>
              {EMAIL}
            </span>
          </a>
          <a className="dev-row" href={`https://t.me/${TELEGRAM}`} target="_blank" rel="noreferrer">
            <span className="dev-tile sm">
              <SendIcon size={17} />
            </span>
            <span>
              <b>Telegram</b>@{TELEGRAM}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
