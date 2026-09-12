"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, CodeIcon, ExternalIcon, MailGlyph, SendIcon } from "../Icons";

const EMAIL = "jibinchackoarpookara@gmail.com";
const TELEGRAM = "jibinchacko";
/**
 * Save a square-ish portrait to public/photos/jibin.jpg and set this to
 * "/photos/jibin.jpg" — it then replaces the monogram. Empty keeps the
 * monogram and avoids a broken image request on every load.
 */
const PHOTO = "";

export default function DeveloperView() {
  // No photo on disk yet — fall back to the monogram rather than a broken image.
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

        <h1 className="dev-name">Jibin Chacko</h1>
        <p className="dev-sub">Developer &amp; designer · Leaf Creationism</p>

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
          <a className="dev-action" href="https://github.com/JIBINHUB" target="_blank" rel="noreferrer">
            <span className="dev-tile">
              <CodeIcon size={22} />
            </span>
            <span>GitHub</span>
          </a>
          <a className="dev-action" href="https://leafcreationism.in" target="_blank" rel="noreferrer">
            <span className="dev-tile">
              <ExternalIcon size={22} />
            </span>
            <span>Website</span>
          </a>
        </div>

        <div className="dev-bio">
          <p className="dev-bio-k">bio</p>
          <p className="dev-bio-v">
            I build fast, modern websites and apps at Leaf Creationism. ORU CODE is where I keep the UI,
            code and motion worth reusing — all of it free to copy.
          </p>
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
