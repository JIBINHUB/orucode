import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_HOST } from "@/lib/seo";

export const alt = "ORU CODE — free website section designs, UI components and animations with code";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "src/app/icon.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "#ededee",
          color: "#161618",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={120} height={120} alt="" />
          <div style={{ display: "flex", fontSize: 60, fontWeight: 700, letterSpacing: -2 }}>ORU CODE</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>
            Website section designs, UI components &amp; animations
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#5b5b60" }}>
            Live previews · Copy-ready HTML, CSS &amp; React code · Free
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#5b5b60" }}>
          <span>{SITE_HOST}</span>
          <span style={{ color: "#ff3131" }}>Made in Kerala, India</span>
        </div>
      </div>
    ),
    size,
  );
}
