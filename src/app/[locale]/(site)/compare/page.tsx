import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareView } from "@/components/compare-view";
import { PageHero } from "@/components/page-hero";
import { getDict } from "@/i18n";
import { getLocale, type LocaleParams } from "@/i18n/server";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const t = getDict(await getLocale(params));
  return { title: t.compare.metaTitle, description: t.compare.metaDesc, robots: { index: false } };
}

export default async function ComparePage({ params }: LocaleParams) {
  const t = getDict(await getLocale(params));
  return (
    <>
      <PageHero eyebrow={t.compare.eyebrow} title={t.compare.title} crumbs={[{ href: "/compare", label: t.compare.eyebrow }]} />
      <section className="container-x py-12">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-ink/5" />}>
          <CompareView />
        </Suspense>
      </section>
    </>
  );
}
