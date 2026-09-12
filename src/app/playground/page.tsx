import type { Metadata } from "next";
import { Suspense } from "react";
import Playground from "@/components/views/Playground";

export const metadata: Metadata = { title: "Playground" };

export default function PlaygroundPage() {
  return (
    <Suspense fallback={null}>
      <Playground />
    </Suspense>
  );
}
