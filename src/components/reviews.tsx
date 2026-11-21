"use client";

import { Star } from "lucide-react";
import { reviews } from "@/lib/data";
import { GoogleIcon } from "./icons";
import { useT } from "@/i18n/client";

export function Reviews() {
  const t = useT();
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
      {reviews.map((r) => (
        <figure key={r.name} className="card flex w-[85%] shrink-0 snap-start flex-col p-6 sm:w-[380px]">
          <div className="flex items-center justify-between">
            <div className="flex gap-0.5 text-amber-400" aria-label={t.common.starsAria(r.stars)}>
              {Array.from({ length: r.stars }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <GoogleIcon className="size-5" />
          </div>
          <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink/80">“{r.text}”</blockquote>
          <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
            <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-brand to-navy text-sm font-bold text-white">
              {r.name.charAt(0).toUpperCase()}
            </span>
            <span>
              <span className="block text-sm font-semibold capitalize">{r.name}</span>
              <span className="block text-xs text-muted">{t.common.googleReview}</span>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
