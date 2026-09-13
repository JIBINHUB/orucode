import type { Metadata } from "next";
import FavoritesView from "@/components/views/FavoritesView";

// Saved per browser, so there's nothing here for search engines.
export const metadata: Metadata = { title: "Favorites", robots: { index: false, follow: true } };

export default function FavoritesPage() {
  return <FavoritesView />;
}
