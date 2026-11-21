"use client";

import { createContext, useCallback, useContext } from "react";
import { getDict } from "./index";
import { localizeHref, type Locale } from "./config";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useT() {
  return getDict(useContext(LocaleContext));
}

/** Returns a function that prefixes internal links for the current language */
export function useL() {
  const locale = useContext(LocaleContext);
  return useCallback((href: string) => localizeHref(locale, href), [locale]);
}
