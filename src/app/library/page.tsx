import type { Metadata } from "next";
import { Suspense } from "react";
import LibraryView from "@/components/views/LibraryView";

export const metadata: Metadata = { title: "Library" };

export default function LibraryPage() {
  return (
    <Suspense fallback={null}>
      <LibraryView />
    </Suspense>
  );
}
