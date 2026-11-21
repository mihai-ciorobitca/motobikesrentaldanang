"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "./lightbox";
import { useT } from "@/i18n/client";

export function PhotoGrid({ images, alt, limit }: { images: { src: string; width: number; height: number }[]; alt: string; limit?: number }) {
  const t = useT();
  const [index, setIndex] = useState<number | null>(null);
  const shown = limit ? images.slice(0, limit) : images;
  return (
    <>
      <div className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        {shown.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative mb-3 block w-full overflow-hidden rounded-2xl bg-ink/5 sm:mb-4"
            aria-label={t.gallery.openN(i + 1)}
          >
            <Image
              src={img.src}
              alt={`${alt} ${i + 1}`}
              width={img.width}
              height={img.height}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="h-auto w-full transition duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/15" />
          </button>
        ))}
      </div>
      {index !== null && <Lightbox images={images.map((i) => i.src)} index={index} onIndex={setIndex} onClose={() => setIndex(null)} alt={alt} />}
    </>
  );
}
