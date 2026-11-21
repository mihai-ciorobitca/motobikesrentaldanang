"use client";

import Image from "next/image";
import Link from "next/link";
import { useL, useT } from "@/i18n/client";

export function Logo({ dark = false }: { dark?: boolean }) {
  const t = useT();
  const l = useL();
  return (
    <Link href={l("/")} className="group flex min-w-0 items-center gap-2" aria-label={t.site.logoAria}>
      <Image src="/images/logo-mark.png" alt="" width={40} height={40} priority className="size-9 shrink-0 transition-transform duration-500 group-hover:rotate-[-12deg] sm:size-10" />
      <span className="leading-none">
        <span className="block font-display text-[1rem] font-black tracking-tight sm:text-[1.15rem]" style={{ fontStretch: "118%" }}>
          <span className="text-brand">QUANG</span>
          <span className={dark ? "text-white" : "text-navy"}>NGA</span>
        </span>
        <span className={`mt-1 block text-[0.5rem] font-semibold tracking-[0.06em] whitespace-nowrap uppercase sm:text-[0.6rem] sm:tracking-[0.2em] ${dark ? "text-white/60" : "text-muted"}`}>
          {t.site.tagline}
        </span>
      </span>
    </Link>
  );
}
