"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Heart, LayoutGrid, List, Search, SlidersHorizontal, Tag, BadgeCheck, X, RotateCcw } from "lucide-react";
import { bikes, brands, categories, priceBounds, type Bike, type Category, type Transmission } from "@/lib/data";
import {
  activeFilterCount,
  applyFilters,
  emptyFilters,
  engineBuckets,
  filtersToParams,
  parseFilters,
  sortOptions,
  type Filters,
  type SortKey,
} from "@/lib/filters";
import { formatPriceShort } from "@/lib/format";
import { BikeCard } from "./bike-card";
import { Price } from "./price";
import { useStore } from "./providers";

const transmissions: Transmission[] = ["Automatic", "Semi-Automatic", "Manual"];
const STEP = 10000;
const pricePresets = [
  { label: "Under 200K", min: null, max: 200000 },
  { label: "200K – 400K", min: 200000, max: 400000 },
  { label: "400K – 1M", min: 400000, max: 1000000 },
  { label: "1M +", min: 1000000, max: null },
];

function toggle<T>(arr: T[], v: T) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function BikeBrowser() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const { saved } = useStore();
  const spKey = sp.toString();

  // Local state updates instantly; the URL is kept in sync so searches are shareable.
  const [filters, setFilters] = useState<Filters>(() => parseFilters(new URLSearchParams(spKey)));
  const [q, setQ] = useState(filters.q);
  const [sheet, setSheet] = useState(false);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  // external navigation (e.g. header "saved" link, back button) → adopt URL state
  useEffect(() => {
    const next = parseFilters(new URLSearchParams(spKey));
    setFilters((cur) => (filtersToParams(cur).toString() === filtersToParams(next).toString() ? cur : next));
    setQ((cur) => (cur.trim() === next.q ? cur : next.q));
  }, [spKey]);

  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    const qs = filtersToParams(next).toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  };

  // debounce free-text search into the filter state / URL
  useEffect(() => {
    if (q.trim() === filters.q) return;
    const t = setTimeout(() => update({ q: q.trim() }), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
  }, [sheet]);

  const results = useMemo(() => applyFilters(bikes, { ...filters, q }, saved), [filters, q, saved]);

  /** Facet counts: how many bikes match if this option were the only one selected in its group */
  const facet = useMemo(() => {
    const base = (patch: Partial<Filters>) => applyFilters(bikes, { ...filters, q, ...patch }, saved);
    const cat = base({ categories: [] });
    const tr = base({ transmissions: [] });
    const br = base({ brands: [] });
    const en = base({ engines: [] });
    const count = <K extends keyof Bike>(list: Bike[], key: K, v: Bike[K]) => list.filter((b) => b[key] === v).length;
    return {
      category: (c: Category) => count(cat, "category", c),
      transmission: (t: Transmission) => count(tr, "transmission", t),
      brand: (b: string) => count(br, "brand", b),
      engine: (id: string) => {
        const bucket = engineBuckets.find((e) => e.id === id)!;
        return en.filter((b) => b.cc >= bucket.min && b.cc <= bucket.max).length;
      },
    };
  }, [filters, q, saved]);

  const activeCount = activeFilterCount(filters);
  const minP = filters.minPrice ?? priceBounds.min;
  const maxP = filters.maxPrice ?? priceBounds.max;

  const chips: { label: string; clear: () => void }[] = [
    ...filters.categories.map((c) => ({ label: c, clear: () => update({ categories: filters.categories.filter((x) => x !== c) }) })),
    ...filters.transmissions.map((t) => ({ label: t, clear: () => update({ transmissions: filters.transmissions.filter((x) => x !== t) }) })),
    ...filters.brands.map((b) => ({ label: b, clear: () => update({ brands: filters.brands.filter((x) => x !== b) }) })),
    ...filters.engines.map((e) => ({
      label: engineBuckets.find((x) => x.id === e)?.label ?? e,
      clear: () => update({ engines: filters.engines.filter((x) => x !== e) }),
    })),
    ...(filters.minPrice != null || filters.maxPrice != null
      ? [{ label: `${formatPriceShort(minP)} – ${formatPriceShort(maxP)}`, clear: () => update({ minPrice: null, maxPrice: null }) }]
      : []),
    ...(filters.sale ? [{ label: "On sale", clear: () => update({ sale: false }) }] : []),
    ...(filters.noLicense ? [{ label: "No license needed", clear: () => update({ noLicense: false }) }] : []),
    ...(filters.saved ? [{ label: "Saved bikes", clear: () => update({ saved: false }) }] : []),
  ];

  const resetAll = () => {
    setQ("");
    update({ ...emptyFilters, sort: filters.sort });
  };

  const panel = (
    <div className="space-y-7">
      <FilterGroup title="Transmission">
        {transmissions.map((t) => (
          <CheckRow
            key={t}
            label={t}
            count={facet.transmission(t)}
            checked={filters.transmissions.includes(t)}
            onChange={() => update({ transmissions: toggle(filters.transmissions, t) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Daily price">
        <DualRange
          min={priceBounds.min}
          max={priceBounds.max}
          value={[minP, maxP]}
          onCommit={([a, b]) => update({ minPrice: a <= priceBounds.min ? null : a, maxPrice: b >= priceBounds.max ? null : b })}
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pricePresets.map((p) => {
            const on = filters.minPrice === p.min && filters.maxPrice === p.max;
            return (
              <button
                key={p.label}
                type="button"
                data-active={on}
                onClick={() => update(on ? { minPrice: null, maxPrice: null } : { minPrice: p.min, maxPrice: p.max })}
                className="chip !px-2.5 !py-1 !text-xs"
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Engine size">
        <div className="flex flex-wrap gap-1.5">
          {engineBuckets.map((e) => {
            const n = facet.engine(e.id);
            return (
              <button
                key={e.id}
                type="button"
                data-active={filters.engines.includes(e.id)}
                disabled={n === 0 && !filters.engines.includes(e.id)}
                onClick={() => update({ engines: toggle(filters.engines, e.id) })}
                className="chip !px-3 !py-1.5 !text-xs disabled:opacity-40"
              >
                {e.label} <span className="opacity-50">{n}</span>
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Brand">
        {brands.map((b) => (
          <CheckRow key={b} label={b} count={facet.brand(b)} checked={filters.brands.includes(b)} onChange={() => update({ brands: toggle(filters.brands, b) })} />
        ))}
      </FilterGroup>

      <FilterGroup title="More">
        <SwitchRow icon={<Tag className="size-4 text-brand" />} label="On sale" checked={filters.sale} onChange={(v) => update({ sale: v })} />
        <SwitchRow icon={<BadgeCheck className="size-4 text-navy" />} label="No license needed (50cc)" checked={filters.noLicense} onChange={(v) => update({ noLicense: v })} />
        <SwitchRow icon={<Heart className="size-4 text-brand" />} label={`Saved bikes (${saved.length})`} checked={filters.saved} onChange={(v) => update({ saved: v })} />
      </FilterGroup>
    </div>
  );

  return (
    <div>
      {/* Search + sort bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search bikes</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search model, brand or engine size — e.g. “PCX”, “Honda 650”, “manual”"
            className="input !rounded-full !py-3.5 !pr-10 !pl-12 !text-[0.95rem] shadow-card"
            type="search"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted hover:text-ink" aria-label="Clear search">
              <X className="size-4" />
            </button>
          )}
        </label>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setSheet(true)} className="btn-light relative flex-1 lg:hidden">
            <SlidersHorizontal className="size-4" /> Filters
            {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-brand text-[0.65rem] text-white">{activeCount}</span>}
          </button>
          <label className="relative flex-1 sm:flex-none">
            <span className="sr-only">Sort by</span>
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="input w-full cursor-pointer appearance-none !rounded-full !py-3 !pr-9 font-medium sm:w-56"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute top-1/2 right-4 size-3 -translate-y-1/2 text-muted" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 4.5 3 3 3-3" /></svg>
          </label>
          <div className="hidden rounded-full bg-white p-1 ring-1 ring-line sm:flex" role="group" aria-label="Layout">
            <button type="button" onClick={() => setLayout("grid")} aria-pressed={layout === "grid"} className={`rounded-full p-2 ${layout === "grid" ? "bg-ink text-white" : "text-muted"}`} aria-label="Grid view">
              <LayoutGrid className="size-4" />
            </button>
            <button type="button" onClick={() => setLayout("list")} aria-pressed={layout === "list"} className={`rounded-full p-2 ${layout === "list" ? "bg-ink text-white" : "text-muted"}`} aria-label="List view">
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <button type="button" data-active={filters.categories.length === 0} onClick={() => update({ categories: [] })} className="chip shrink-0">
          All bikes
        </button>
        {categories.map((c) => (
          <button
            key={c.name}
            type="button"
            data-active={filters.categories.includes(c.name)}
            onClick={() => update({ categories: toggle(filters.categories, c.name) })}
            className="chip shrink-0"
          >
            {c.name} <span className="opacity-50">{facet.category(c.name)}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 pb-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              {activeCount > 0 && (
                <button type="button" onClick={resetAll} className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
                  <RotateCcw className="size-3" /> Reset
                </button>
              )}
            </div>
            {panel}
          </div>
        </aside>

        <section aria-live="polite">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <p className="mr-2 text-sm text-muted">
              <strong className="text-ink">{results.length}</strong> {results.length === 1 ? "bike" : "bikes"} available
            </p>
            {chips.map((c) => (
              <button key={c.label} type="button" onClick={c.clear} className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-xs font-medium text-white hover:bg-ink-3">
                {c.label} <X className="size-3" />
              </button>
            ))}
            {chips.length > 1 && (
              <button type="button" onClick={resetAll} className="text-xs font-semibold text-brand hover:underline">
                Clear all
              </button>
            )}
          </div>

          {results.length ? (
            <div className={layout === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-4"}>
              {results.map((b, i) => (
                <BikeCard key={b.slug} bike={b} priority={i < 3} layout={layout} />
              ))}
            </div>
          ) : (
            <div className="card grid place-items-center px-6 py-20 text-center">
              <div className="grid size-14 place-items-center rounded-full bg-brand-50 text-brand">
                <Search className="size-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold">No bikes match these filters</h3>
              <p className="mt-2 max-w-sm text-sm text-muted">
                {filters.saved && saved.length === 0
                  ? "You haven't saved any bikes yet — tap the heart on any bike to save it."
                  : "Try removing a filter or widening the price range. We also have more bikes in the shop — just ask us on WhatsApp."}
              </p>
              <button type="button" onClick={resetAll} className="btn-dark mt-6">
                <RotateCcw className="size-4" /> Reset filters
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Mobile filter sheet */}
      {sheet && (
        <div className="fixed inset-0 z-[55] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 animate-fade-in bg-ink/50" onClick={() => setSheet(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] animate-slide-up flex-col rounded-t-3xl bg-paper">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button type="button" onClick={() => setSheet(false)} className="rounded-full p-1.5 hover:bg-ink/5" aria-label="Close filters">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <FilterGroup title="Bike type">
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <button key={c.name} type="button" data-active={filters.categories.includes(c.name)} onClick={() => update({ categories: toggle(filters.categories, c.name) })} className="chip !py-1.5 !text-xs">
                      {c.name} <span className="opacity-50">{facet.category(c.name)}</span>
                    </button>
                  ))}
                </div>
              </FilterGroup>
              <div className="mt-7">{panel}</div>
            </div>
            <div className="flex gap-3 border-t border-line bg-white px-5 py-4">
              <button type="button" onClick={resetAll} className="btn-light">Reset</button>
              <button type="button" onClick={() => setSheet(false)} className="btn-dark flex-1">
                Show {results.length} bikes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-bold tracking-[0.14em] text-ink/50 uppercase">{title}</legend>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function CheckRow({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void }) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition hover:bg-ink/[0.04] ${count === 0 && !checked ? "opacity-40" : ""}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="grid size-[1.125rem] place-items-center rounded-[5px] border-[1.5px] border-ink/30 bg-white transition peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
        <svg viewBox="0 0 12 12" className={`size-3 text-white ${checked ? "" : "invisible"}`} fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m2.5 6.2 2.3 2.3 4.7-4.9" /></svg>
      </span>
      <span className="flex-1">{label}</span>
      <span className="text-xs text-muted tabular-nums">{count}</span>
    </label>
  );
}

function SwitchRow({ label, icon, checked, onChange }: { label: string; icon: React.ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-ink/[0.04]">
      {icon}
      <span className="flex-1">{label}</span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative h-5 w-9 rounded-full bg-ink/15 transition peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-4" />
    </label>
  );
}

function DualRange({ min, max, value, onCommit }: { min: number; max: number; value: [number, number]; onCommit: (v: [number, number]) => void }) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value[0], value[1]]); // eslint-disable-line react-hooks/exhaustive-deps
  const pct = (n: number) => ((n - min) / (max - min)) * 100;
  const commit = () => onCommit(v);
  const thumb =
    "pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-white";
  return (
    <div>
    <div className="flex items-center justify-between text-sm font-semibold tabular-nums">
      <Price vnd={v[0]} />
      <Price vnd={v[1]} />
    </div>
    <div className="relative mt-3 h-6">
      <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-ink/10" />
      <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink" style={{ left: `${pct(v[0])}%`, right: `${100 - pct(v[1])}%` }} />
      <input
        type="range"
        aria-label="Minimum price"
        min={min}
        max={max}
        step={STEP}
        value={v[0]}
        onChange={(e) => setV([Math.min(Number(e.target.value), v[1] - STEP), v[1]])}
        onPointerUp={commit}
        onKeyUp={commit}
        className={thumb}
      />
      <input
        type="range"
        aria-label="Maximum price"
        min={min}
        max={max}
        step={STEP}
        value={v[1]}
        onChange={(e) => setV([v[0], Math.max(Number(e.target.value), v[0] + STEP)])}
        onPointerUp={commit}
        onKeyUp={commit}
        className={thumb}
      />
    </div>
    </div>
  );
}
