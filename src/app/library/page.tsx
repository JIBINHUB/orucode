import type { Metadata } from "next";
import { Suspense } from "react";
import LibraryView from "@/components/views/LibraryView";
import { ASSETS } from "@/data";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Design Library — Search Website Sections, Components & Animations",
  description: `Search and filter ${ASSETS.length} free website designs by category, animation library, framework, level and tone — hero sections, loading animations, React and Tailwind components, all with live previews and code.`,
  path: "/library",
});

export default function LibraryPage() {
  return (
    // The fallback is real server HTML, so crawlers still get a heading while filters load.
    <Suspense
      fallback={
        <div className="page-head">
          <div>
            <h1 className="h1">All designs</h1>
            <p className="lead">Every section, page and animation — filter by library, framework, complexity and tone.</p>
          </div>
        </div>
      }
    >
      <LibraryView />
    </Suspense>
  );
}
