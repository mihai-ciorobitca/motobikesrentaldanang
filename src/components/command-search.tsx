"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CornerDownLeft, FileText, Search, X } from "lucide-react";
import { useStore } from "./providers";
import { bikes, postIndex } from "@/lib/data";
import { useL, useLocale, useT } from "@/i18n/client";
import { matchesQuery } from "@/lib/filters";
import { formatPrice } from "@/lib/format";

type Item = { key: string; href: string; title: string; sub: string; image?: string; kind: "bike" | "post" | "action" };

export function CommandSearch() {
  const { searchOpen, setSearchOpen, currency } = useStore();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useT();
  const l = useL();
  const locale = useLocale();
  const quick = useMemo<Item[]>(() => t.search.quick.map((q, i) => ({ key: `q${i}`, href: q.href, title: q.title, sub: q.sub, kind: "action" })), [t]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "/" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setQ("");
      setActive(0);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }
  }, [searchOpen]);

  const results = useMemo<Item[]>(() => {
    if (!q.trim()) return quick;
    const b = bikes
      .filter((x) => matchesQuery(x, q))
      .slice(0, 7)
      .map<Item>((x) => ({
        key: x.slug,
        href: `/bikes/${x.slug}`,
        title: x.name + (x.year ? ` · ${x.year}` : ""),
        sub: `${t.transmissions[x.transmission]} · ${x.cc}cc · ${formatPrice(x.price, currency, locale)}${t.common.perDay}`,
        image: x.images[0],
        kind: "bike",
      }));
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const p = postIndex
      .filter((x) => terms.every((term) => x.title[locale].toLowerCase().includes(term)))
      .slice(0, 3)
      .map<Item>((x) => ({ key: x.slug, href: `/blog/${x.slug}`, title: x.title[locale], sub: t.search.blog, kind: "post" }));
    return [
      ...b,
      ...p,
      { key: "all", href: `/bikes?q=${encodeURIComponent(q.trim())}`, title: t.search.seeAll(q.trim()), sub: t.search.seeAllSub, kind: "action" },
    ];
  }, [q, currency, t, locale, quick]);

  if (!searchOpen) return null;

  const go = (item: Item) => {
    setSearchOpen(false);
    router.push(l(item.href));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[10vh]" role="dialog" aria-modal="true" aria-label={t.search.aria}>
      <div className="absolute inset-0 animate-fade-in bg-ink/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
      <div className="relative w-full max-w-xl animate-fade-up overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-line">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-5 text-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter" && results[active]) {
                go(results[active]);
              } else if (e.key === "Escape") {
                setSearchOpen(false);
              }
            }}
            placeholder={t.search.placeholder}
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted/70"
            aria-label={t.search.aria}
          />
          <button type="button" onClick={() => setSearchOpen(false)} className="rounded-md p-1 text-muted hover:text-ink" aria-label={t.common.close}>
            <X className="size-5" />
          </button>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto p-2">
          {!q.trim() && <li className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted uppercase">{t.search.quickLinks}</li>}
          {results.map((r, i) => (
            <li key={r.key}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${i === active ? "bg-ink/[0.05]" : ""}`}
              >
                <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-paper ring-1 ring-line">
                  {r.image ? (
                    <Image src={r.image} alt="" fill sizes="44px" className="object-cover" />
                  ) : r.kind === "post" ? (
                    <FileText className="size-4 text-muted" />
                  ) : (
                    <ArrowRight className="size-4 text-brand" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{r.title}</span>
                  <span className="block truncate text-xs text-muted">{r.sub}</span>
                </span>
                {i === active && <CornerDownLeft className="size-4 text-muted" />}
              </button>
            </li>
          ))}
          {q.trim() && results.length === 1 && (
            <li className="px-3 py-6 text-center text-sm text-muted">{t.search.noResults(q)}</li>
          )}
        </ul>
        <div className="flex items-center gap-4 border-t border-line bg-paper px-4 py-2.5 text-[0.7rem] text-muted">
          <span><kbd className="font-semibold">↑↓</kbd> {t.search.navigate}</span>
          <span><kbd className="font-semibold">↵</kbd> {t.search.open}</span>
          <span><kbd className="font-semibold">esc</kbd> {t.search.close}</span>
        </div>
      </div>
    </div>
  );
}
