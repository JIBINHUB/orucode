import type { Metadata } from "next";
import DeveloperView from "@/components/views/DeveloperView";

export const metadata: Metadata = { title: "Developer — Jibin Chacko" };

export default function DeveloperPage() {
  return <DeveloperView />;
}
