import type { MetadataRoute } from "next";
import { bikes, postIndex } from "@/lib/data";
import { site } from "@/lib/site";
import { localizeHref } from "@/i18n/config";

const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "weekly"): MetadataRoute.Sitemap[number] => ({
  url: `${site.url}${path === "/" ? "" : path}`,
  lastModified: new Date(),
  changeFrequency,
  priority,
  alternates: {
    languages: {
      en: `${site.url}${path === "/" ? "" : path}`,
      vi: `${site.url}${localizeHref("vi", path)}`,
    },
  },
});

export default function sitemap(): MetadataRoute.Sitemap {
  const paths: [string, number, "weekly" | "monthly"][] = [
    ["/", 1, "weekly"],
    ...["/bikes", "/one-way-rental", "/about", "/blog", "/faq", "/contact"].map((p) => [p, 0.8, "weekly"] as [string, number, "weekly"]),
    ...bikes.map((b) => [`/bikes/${b.slug}`, 0.7, "weekly"] as [string, number, "weekly"]),
    ...postIndex.map((p) => [`/blog/${p.slug}`, 0.5, "monthly"] as [string, number, "monthly"]),
  ];
  return paths.flatMap(([p, prio, freq]) => {
    const en = entry(p, prio, freq);
    return [en, { ...en, url: `${site.url}${localizeHref("vi", p)}` }];
  });
}
