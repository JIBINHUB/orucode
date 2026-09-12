import { STARTER_ASSETS } from "./assets";
import { STARTER_PROMPTS } from "./prompts";
import { UIVERSE_ASSETS } from "./uiverse";
import { VENGEANCE_ASSETS } from "./vengeance";
import type { Asset, CategoryId, LibraryId, WebsitePrompt } from "@/lib/types";

export const ASSETS: Asset[] = [...STARTER_ASSETS, ...UIVERSE_ASSETS, ...VENGEANCE_ASSETS];
export const PROMPTS: WebsitePrompt[] = STARTER_PROMPTS;

const assetById = new Map(ASSETS.map((a) => [a.id, a]));
export const getAsset = (id: string) => assetById.get(id);
export const getPrompt = (id: string) => PROMPTS.find((p) => p.id === id);

export const CATEGORY_COUNTS = ASSETS.reduce<Partial<Record<CategoryId, number>>>((acc, a) => {
  acc[a.category] = (acc[a.category] ?? 0) + 1;
  return acc;
}, {});

export const LIBRARY_COUNTS = ASSETS.reduce<Partial<Record<LibraryId, number>>>((acc, a) => {
  for (const l of a.libraries) acc[l] = (acc[l] ?? 0) + 1;
  return acc;
}, {});
