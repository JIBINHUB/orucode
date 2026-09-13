import type { Metadata } from "next";
import { Suspense } from "react";
import PromptsView from "@/components/views/PromptsView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Website Prompts — Detailed Briefs for AI Coding & Vibe Coding",
  description:
    "Free, detailed website briefs you can paste into AI coding tools like Cursor, Claude Code, Lovable or v0 — pick a site type, sections and animation library to build a complete website faster.",
  path: "/prompts",
});

export default function PromptsPage() {
  return (
    <Suspense
      fallback={
        <div className="page-head">
          <div>
            <h1 className="h1">Website prompts</h1>
            <p className="lead">Detailed website briefs to paste into your AI coding tool.</p>
          </div>
        </div>
      }
    >
      <PromptsView />
    </Suspense>
  );
}
