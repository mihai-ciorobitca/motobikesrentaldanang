import "server-only";
import sizesJson from "@/data/image-sizes.json";
import descriptionsJson from "@/data/bike-descriptions.json";
import type { Block } from "./data";

/** Server-only data (kept out of client bundles) */
const sizes = sizesJson as unknown as Record<string, [number, number]>;
const descriptions = descriptionsJson as unknown as Record<string, Block[]>;

export function imageSize(src: string): { width: number; height: number } {
  const s = sizes[src];
  return s ? { width: s[0], height: s[1] } : { width: 1200, height: 800 };
}

export function bikeDescription(slug: string): Block[] {
  return descriptions[slug] ?? [];
}
