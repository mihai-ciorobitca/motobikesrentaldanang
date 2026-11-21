import { en, type Dict } from "./en";
import { vi } from "./vi";
import type { Locale } from "./config";

const dicts: Record<Locale, Dict> = { en, vi };

export function getDict(locale: Locale): Dict {
  return dicts[locale] ?? en;
}

export type { Dict };
