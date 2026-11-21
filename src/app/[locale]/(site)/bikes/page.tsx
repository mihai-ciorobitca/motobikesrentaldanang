import type { Metadata } from "next";
import { Suspense } from "react";
import { BikeBrowser } from "@/components/bike-browser";
import { PageHero } from "@/components/page-hero";
import { bikes, media } from "@/lib/data";
import { formatPriceShort } from "@/lib/format";
import { getDict } from "@/i18n";
import { languageAlternates } from "@/i18n/config";
import { getLocale, type LocaleParams } from "@/i18n/server";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getLocale(params);
  const t = getDict(locale);
  return { title: t.bikesPage.metaTitle, description: t.bikesPage.metaDesc(bikes.length), alternates: languageAlternates(locale, "/bikes") };
}

export default async function BikesPage({ params }: LocaleParams) {
  const locale = await getLocale(params);
  const t = getDict(locale);
  const min = Math.min(...bikes.map((b) => b.price));
  return (
    <>
      <PageHero
        eyebrow={t.bikesPage.eyebrow}
        title={<>{t.bikesPage.title}<span className="text-brand">.</span></>}
        intro={t.bikesPage.intro(bikes.length, formatPriceShort(min))}
        image={media.pageBg}
        crumbs={[{ href: "/bikes", label: t.nav.bikes }]}
      />
      <section className="container-x py-10 sm:py-14">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-ink/5" />}>
          <BikeBrowser />
        </Suspense>
      </section>
    </>
  );
}
