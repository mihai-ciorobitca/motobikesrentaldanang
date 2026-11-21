export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, { short: string; name: string; htmlLang: string; dateLocale: string; og: string }> = {
  en: { short: "EN", name: "English", htmlLang: "en", dateLocale: "en-GB", og: "en_US" },
  vi: { short: "VI", name: "Tiếng Việt", htmlLang: "vi", dateLocale: "vi-VN", og: "vi_VN" },
};

export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}

/** Prefix an internal path for the given locale. English lives at the root, Vietnamese under /vi. */
export function localizeHref(locale: Locale, href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (locale === defaultLocale) return href;
  if (href === "/") return "/vi";
  if (href.startsWith("/?") || href.startsWith("/#")) return "/vi" + href.slice(1);
  return "/vi" + href;
}

/** Remove a locale prefix from a visible pathname */
export function stripLocale(pathname: string) {
  const stripped = pathname.replace(/^\/vi(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

/** Same page, other language */
export function switchLocalePath(pathname: string, to: Locale) {
  return localizeHref(to, stripLocale(pathname));
}

/** hreflang alternates for metadata */
export function languageAlternates(locale: Locale, path: string) {
  return {
    canonical: localizeHref(locale, path),
    languages: { en: path, vi: localizeHref("vi", path), "x-default": path },
  };
}
