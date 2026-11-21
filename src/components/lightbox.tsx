"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function Lightbox({ images, index, onClose, onIndex, alt }: { images: string[]; index: number; onClose: () => void; onIndex: (i: number) => void; alt: string }) {
  const prev = useCallback(() => onIndex((index - 1 + images.length) % images.length), [index, images.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % images.length), [index, images.length, onIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  let startX = 0;
  return (
    <div
      className="fixed inset-0 z-[70] flex animate-fade-in flex-col bg-ink/95 backdrop-blur"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onTouchStart={(e) => (startX = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
      }}
    >
      <div className="flex items-center justify-between p-4 text-sm text-white/70">
        <span className="tabular-nums">{index + 1} / {images.length}</span>
        <button type="button" onClick={onClose} className="rounded-full p-2 text-white hover:bg-white/10" aria-label="Close">
          <X className="size-6" />
        </button>
      </div>
      <div className="relative flex-1" onClick={onClose}>
        <Image src={images[index]} alt={`${alt} – photo ${index + 1}`} fill sizes="100vw" className="object-contain p-2 sm:p-8" onClick={(e) => e.stopPropagation()} />
      </div>
      {images.length > 1 && (
        <>
          <button type="button" onClick={prev} className="absolute top-1/2 left-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Previous photo">
            <ChevronLeft className="size-6" />
          </button>
          <button type="button" onClick={next} className="absolute top-1/2 right-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Next photo">
            <ChevronRight className="size-6" />
          </button>
        </>
      )}
    </div>
  );
}
