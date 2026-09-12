import type { Metadata } from "next";
import { Suspense } from "react";
import PromptsView from "@/components/views/PromptsView";

export const metadata: Metadata = { title: "Website Prompts" };

export default function PromptsPage() {
  return (
    <Suspense fallback={null}>
      <PromptsView />
    </Suspense>
  );
}
