"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useL, useT } from "@/i18n/client";

export default function NotFound() {
  const t = useT();
  const l = useL();
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="font-display text-8xl font-black text-brand">404</p>
        <h1 className="mt-4 text-3xl font-black">{t.notFound.title}</h1>
        <p className="mt-3 text-muted">{t.notFound.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={l("/bikes")} className="btn-primary">{t.common.browseBikes} <ArrowRight className="size-4" /></Link>
          <Link href={l("/")} className="btn-light">{t.notFound.home}</Link>
        </div>
      </div>
    </section>
  );
}
