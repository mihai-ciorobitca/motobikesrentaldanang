"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand } from "lucide-react";
import { Lightbox } from "./lightbox";

export function BikeGallery({ images, name, badge }: { images: string[]; name: string; badge?: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[#f1f0ed] ring-1 ring-line"
        aria-label="Open photo viewer"
      >
        <Image src={images[active]} alt={name} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" />
        {badge && <div className="absolute top-4 left-4">{badge}</div>}
        <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          <Expand className="size-3.5" /> {images.length} photos
        </span>
      </button>
      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-xl bg-[#f1f0ed] ring-2 transition sm:w-24 ${
                i === active ? "ring-ink" : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      {open && <Lightbox images={images} index={active} onIndex={setActive} onClose={() => setOpen(false)} alt={name} />}
    </div>
  );
}
