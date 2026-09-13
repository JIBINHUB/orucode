import type { Metadata } from "next";
import { Suspense } from "react";
import Playground from "@/components/views/Playground";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Code Playground — Edit HTML, CSS & React Live",
  description: "Edit HTML, CSS and React code in the browser and see the result instantly — try any ORU CODE design or paste your own.",
  path: "/playground",
});

export default function PlaygroundPage() {
  return (
    <Suspense fallback={null}>
      <Playground />
    </Suspense>
  );
}
