"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Gauge, GitCompareArrows, Heart, Settings2 } from "lucide-react";
import type { Bike } from "@/lib/data";
import { discountPercent } from "@/lib/format";
import { Price } from "./price";
import { useStore } from "./providers";

export function BikeCard({ bike, priority = false, layout = "grid" }: { bike: Bike; priority?: boolean; layout?: "grid" | "list" }) {
  const { saved, compare, toggleSaved, toggleCompare } = useStore();
  const isSaved = saved.includes(bike.slug);
  const inCompare = compare.includes(bike.slug);
  const off = discountPercent(bike.price, bike.originalPrice);
  const list = layout === "list";

  return (
    <article
      className={`group relative flex overflow-hidden rounded-2xl bg-card ring-1 ring-line/80 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift hover:ring-ink/15 ${
        list ? "flex-row" : "flex-col"
      }`}
    >
      <div className={`relative shrink-0 overflow-hidden bg-[#f1f0ed] ${list ? "aspect-square w-36 sm:aspect-[4/3] sm:w-64" : "aspect-[4/3]"}`}>
        <Image
          src={bike.images[0]}
          alt={bike.name}
          fill
          priority={priority}
          sizes={list ? "(min-width: 640px) 256px, 144px" : "(min-width: 1280px) 300px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        {bike.images[1] && !list && (
          <Image
            src={bike.images[1]}
            alt=""
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
            className="object-cover opacity-0 transition duration-500 group-hover:opacity-100"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {off > 0 && <span className="rounded-full bg-brand px-2.5 py-1 text-[0.7rem] font-bold text-white shadow">-{off}%</span>}
          {bike.noLicense && <span className="rounded-full bg-white/95 px-2.5 py-1 text-[0.7rem] font-bold text-navy shadow">No license</span>}
          {bike.category === "Big Bike" && <span className="rounded-full bg-ink/90 px-2.5 py-1 text-[0.7rem] font-bold text-white shadow">Big bike</span>}
        </div>
        <button
          type="button"
          onClick={() => toggleSaved(bike.slug)}
          aria-pressed={isSaved}
          aria-label={isSaved ? `Remove ${bike.name} from saved` : `Save ${bike.name}`}
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-white/95 shadow ring-1 ring-black/5 transition hover:scale-110"
        >
          <Heart className={`size-4 transition ${isSaved ? "fill-brand text-brand" : "text-ink/70"}`} />
        </button>
      </div>

      <div className={`flex flex-1 flex-col ${list ? "p-4 sm:p-5" : "p-4"}`}>
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-wider text-muted uppercase">
          <span>{bike.brand}</span>
          {bike.year && (
            <>
              <span className="size-1 rounded-full bg-line" />
              <span>{bike.year}</span>
            </>
          )}
        </div>
        <h3 className="mt-1 text-[1.05rem] leading-snug font-bold">
          <Link href={`/bikes/${bike.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {bike.name}
          </Link>
        </h3>
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink/70">
          <span className="inline-flex items-center gap-1"><Gauge className="size-3.5" /> {bike.cc}cc</span>
          <span className="inline-flex items-center gap-1"><Settings2 className="size-3.5" /> {bike.transmission}</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            {bike.originalPrice && <Price vnd={bike.originalPrice} className="block text-xs text-muted line-through" />}
            <p className="leading-none">
              <Price vnd={bike.price} className="font-display text-xl font-extrabold" />
              <span className="text-xs text-muted"> /day</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleCompare(bike.slug)}
            aria-pressed={inCompare}
            className={`relative z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${
              inCompare ? "bg-ink text-white ring-ink" : "bg-white text-ink/70 ring-line hover:text-ink hover:ring-ink/30"
            }`}
          >
            {inCompare ? <Check className="size-3.5" /> : <GitCompareArrows className="size-3.5" />}
            Compare
          </button>
        </div>
      </div>
    </article>
  );
}
