"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitCompareArrows, X } from "lucide-react";
import { useStore, MAX_COMPARE } from "./providers";
import { getBike } from "@/lib/data";
import { useL, useT } from "@/i18n/client";

export function CompareBar() {
  const { compare, toggleCompare, clearCompare, hydrated } = useStore();
  const pathname = usePathname();
  const t = useT();
  const l = useL();
  if (!hydrated || compare.length === 0 || pathname.endsWith("/compare")) return null;
  const items = compare.map(getBike).filter(Boolean);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 animate-slide-up p-3 sm:p-4">
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl bg-ink p-2.5 pr-3 text-white shadow-lift ring-1 ring-white/10 sm:gap-4 sm:pl-4">
        <GitCompareArrows className="hidden size-5 shrink-0 text-brand sm:block" />
        <ul className="flex min-w-0 flex-1 gap-2">
          {items.map((b) => (
            <li key={b!.slug} className="relative flex min-w-0 items-center gap-2 rounded-xl bg-white/10 py-1 pr-7 pl-1">
              <span className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-white">
                <Image src={b!.images[0]} alt="" fill sizes="36px" className="object-cover" />
              </span>
              <span className="hidden truncate text-xs font-medium sm:block">{b!.name}</span>
              <button type="button" onClick={() => toggleCompare(b!.slug)} className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded p-0.5 text-white/60 hover:text-white" aria-label={t.compareBar.remove(b!.name)}>
                <X className="size-3.5" />
              </button>
            </li>
          ))}
          {Array.from({ length: MAX_COMPARE - items.length }).map((_, i) => (
            <li key={i} className="hidden size-11 rounded-xl border border-dashed border-white/20 sm:block" />
          ))}
        </ul>
        <button type="button" onClick={clearCompare} className="hidden text-xs text-white/60 hover:text-white sm:block">
          {t.compareBar.clear}
        </button>
        <Link href={l(`/compare?bikes=${compare.join(",")}`)} className="btn-primary shrink-0 !px-4 !py-2.5">
          {t.compareBar.compare(items.length)}
        </Link>
      </div>
    </div>
  );
}
