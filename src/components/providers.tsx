"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Currency } from "@/lib/format";

type Store = {
  saved: string[];
  compare: string[];
  currency: Currency;
  hydrated: boolean;
  toggleSaved: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  setCurrency: (c: Currency) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
};

const StoreContext = createContext<Store | null>(null);
export const MAX_COMPARE = 3;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode) – ignore */
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [currency, setCurrencyState] = useState<Currency>("VND");
  const [hydrated, setHydrated] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setSaved(read("qn:saved", []));
    setCompare(read("qn:compare", []));
    setCurrencyState(read("qn:currency", "VND"));
    setHydrated(true);
  }, []);

  const toggleSaved = useCallback((slug: string) => {
    setSaved((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      write("qn:saved", next);
      return next;
    });
  }, []);

  const toggleCompare = useCallback((slug: string) => {
    setCompare((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length >= MAX_COMPARE
          ? [...prev.slice(1), slug]
          : [...prev, slug];
      write("qn:compare", next);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompare([]);
    write("qn:compare", []);
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    write("qn:currency", c);
  }, []);

  const value = useMemo(
    () => ({ saved, compare, currency, hydrated, toggleSaved, toggleCompare, clearCompare, setCurrency, searchOpen, setSearchOpen }),
    [saved, compare, currency, hydrated, toggleSaved, toggleCompare, clearCompare, setCurrency, searchOpen],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <Providers>");
  return ctx;
}
