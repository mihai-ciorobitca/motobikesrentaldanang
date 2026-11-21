import "server-only";
import sizesJson from "@/data/image-sizes.json";
import descriptionsJson from "@/data/bike-descriptions.json";
import descriptionsViJson from "@/data/vi/bike-descriptions.json";
import postsJson from "@/data/posts.json";
import postsViJson from "@/data/vi/posts.json";
import type { Block, Post } from "./data";
import type { Locale } from "@/i18n/config";

/** Server-only data (kept out of client bundles) */
const sizes = sizesJson as unknown as Record<string, [number, number]>;
const descriptions: Record<Locale, Record<string, Block[]>> = {
  en: descriptionsJson as unknown as Record<string, Block[]>,
  vi: descriptionsViJson as unknown as Record<string, Block[]>,
};
const postsByLocale: Record<Locale, Post[]> = { en: postsJson as Post[], vi: postsViJson as Post[] };

export function imageSize(src: string): { width: number; height: number } {
  const s = sizes[src];
  return s ? { width: s[0], height: s[1] } : { width: 1200, height: 800 };
}

export function bikeDescription(slug: string, locale: Locale): Block[] {
  return descriptions[locale][slug] ?? descriptions.en[slug] ?? [];
}

export function getPosts(locale: Locale): Post[] {
  return postsByLocale[locale];
}

export function getPost(slug: string, locale: Locale) {
  return postsByLocale[locale].find((p) => p.slug === slug);
}

export function postExcerpt(p: Post, len = 150) {
  const text = p.blocks.filter((b) => b.t !== "img").map((b) => b.v).join(" ");
  return text.length > len ? text.slice(0, len).replace(/\s+\S*$/, "") + "…" : text;
}
