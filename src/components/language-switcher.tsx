"use client";

import { usePathname, useRouter } from "next/navigation";
import { Flag } from "./flags";
import { Select } from "./select";
import { useLocale, useT } from "@/i18n/client";
import { localeNames, locales, switchLocalePath, type Locale } from "@/i18n/config";

export function useSwitchLocale() {
  const router = useRouter();
  const pathname = usePathname();
  return (to: Locale) => {
    try {
      document.cookie = `lang=${to}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      /* cookies blocked — the URL still carries the language */
    }
    const search = typeof window !== "undefined" ? window.location.search : "";
    router.push(switchLocalePath(pathname, to) + search);
  };
}

export function LanguageSwitcher({ dark = false, align = "right" }: { dark?: boolean; align?: "left" | "right" }) {
  const locale = useLocale();
  const t = useT();
  const switchTo = useSwitchLocale();
  return (
    <Select<Locale>
      variant="ghost"
      dark={dark}
      align={align}
      ariaLabel={t.common.language}
      value={locale}
      onChange={(v) => v !== locale && switchTo(v)}
      options={locales.map((l) => ({ value: l, label: localeNames[l].name, icon: <Flag locale={l} /> }))}
      renderTrigger={() => (
        <span className="flex items-center gap-1.5">
          <Flag locale={locale} />
          <span className="text-xs">{localeNames[locale].short}</span>
        </span>
      )}
    />
  );
}

/** Two big buttons for the mobile menu */
export function LanguageButtons() {
  const locale = useLocale();
  const switchTo = useSwitchLocale();
  return (
    <div className="grid grid-cols-2 gap-2">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => l !== locale && switchTo(l)}
          aria-pressed={l === locale}
          className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold ring-1 transition ${
            l === locale ? "bg-ink text-white ring-ink" : "bg-white text-ink ring-line"
          }`}
        >
          <Flag locale={l} /> {localeNames[l].name}
        </button>
      ))}
    </div>
  );
}
