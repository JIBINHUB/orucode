"use client";

import { useEffect, useRef, useState } from "react";
import { buildAssetDocument } from "@/lib/variants";
import type { Asset, FrameworkId } from "@/lib/types";

export interface PreviewMessage {
  level: "log" | "info" | "warn" | "error";
  message: string;
}

interface Props {
  title: string;
  asset?: Asset;
  framework?: FrameworkId;
  /** A prebuilt document (e.g. from the playground) instead of an asset. */
  doc?: string;
  /** A live external URL to embed directly, instead of a sandboxed asset/doc. */
  src?: string;
  /** Virtual viewport width. When set, the frame is scaled to fit the host width. */
  virtualWidth?: number;
  interactive?: boolean;
  /** Mount only while on screen (used by gallery cards). */
  lazy?: boolean;
  reloadKey?: number;
  onMessage?: (m: PreviewMessage) => void;
}

export default function LivePreview({
  title,
  asset,
  framework = "html",
  doc,
  src,
  virtualWidth,
  interactive = true,
  lazy = false,
  reloadKey = 0,
  onMessage,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [visible, setVisible] = useState(!lazy);
  const [srcDoc, setSrcDoc] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!lazy) return;
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "240px 0px" });
    io.observe(host);
    return () => io.disconnect();
  }, [lazy]);

  useEffect(() => {
    if (!onMessage) return;
    const handler = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      const data = e.data as { __oru?: number; level?: PreviewMessage["level"]; message?: string };
      if (data && data.__oru === 1 && data.level) onMessage({ level: data.level, message: data.message ?? "" });
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onMessage]);

  useEffect(() => {
    if (src !== undefined) return;
    if (doc !== undefined) {
      setSrcDoc(doc);
      return;
    }
    if (!asset || !visible) return;
    let cancelled = false;
    buildAssetDocument(asset, framework)
      .then((built) => !cancelled && setSrcDoc(built))
      .catch((err) => console.error("Preview build failed:", err));
    return () => {
      cancelled = true;
    };
  }, [doc, asset, framework, visible]);

  useEffect(() => setLoaded(false), [srcDoc, src, reloadKey, visible]);

  const scale = virtualWidth && size.w ? size.w / virtualWidth : 1;
  const frameStyle: React.CSSProperties = virtualWidth
    ? { width: virtualWidth, height: size.h / scale, transform: `scale(${scale})` }
    : { width: "100%", height: "100%" };

  const frameProps = src !== undefined ? { src } : { srcDoc };
  const ready = src !== undefined ? visible : visible && !!srcDoc;

  return (
    <div ref={hostRef} className="preview-host">
      {!loaded && (
        <div className="preview-skeleton">
          <span className="preview-spinner" aria-hidden="true" />
        </div>
      )}
      {ready && size.w > 0 && (
        <iframe
          key={reloadKey}
          ref={frameRef}
          title={title}
          {...frameProps}
          sandbox={
            src !== undefined
              ? "allow-scripts allow-same-origin allow-popups"
              : "allow-scripts allow-pointer-lock allow-modals"
          }
          loading={lazy ? "lazy" : "eager"}
          onLoad={() => setLoaded(true)}
          style={{ ...frameStyle, pointerEvents: interactive ? "auto" : "none", opacity: loaded ? 1 : 0, transition: "opacity .35s" }}
          tabIndex={interactive ? 0 : -1}
          aria-hidden={interactive ? undefined : true}
        />
      )}
    </div>
  );
}
