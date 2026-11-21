import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Info, Luggage, MapPin, Route } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/page-hero";
import { PhotoGrid } from "@/components/photo-grid";
import { Price } from "@/components/price";
import { WhatsAppIcon } from "@/components/icons";
import { imageSize } from "@/lib/server-data";
import { oneWayPrices } from "@/lib/content";
import { whatsappLink } from "@/lib/site";
import { getDict } from "@/i18n";
import { languageAlternates, localizeHref } from "@/i18n/config";
import { getLocale, type LocaleParams } from "@/i18n/server";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getLocale(params);
  const t = getDict(locale);
  return { title: t.oneWay.metaTitle, description: t.oneWay.metaDesc, alternates: languageAlternates(locale, "/one-way-rental") };
}

const photos = [
  "/images/2025-01-z6223158280964_f3e48787297ed2a279cb1a40a1a0d61f.webp",
  "/images/2025-01-z6223158304128_476884e3cb6d666fe64e2947d3c1dba3.webp",
  "/images/2025-01-z6220480289448_abd0f22e4834fd2a7d10fbd1516317c3.webp",
  "/images/2025-01-z6220491755438_c89e1fc11975e5534e9851e4dcc7bef7.webp",
];

export default async function OneWayPage({ params }: LocaleParams) {
  const locale = await getLocale(params);
  const t = getDict(locale);
  const o = t.oneWay;
  const l = (h: string) => localizeHref(locale, h);
  return (
    <>
      <PageHero
        eyebrow={o.eyebrow}
        title={<>{o.title1}<br />{o.title2} <span className="text-brand">{o.title3}</span></>}
        intro={o.intro}
        image="/images/2025-01-z6223158275121_1786c8ea10c72fdf89fa90fbd3b208d9-1.webp"
        crumbs={[{ href: "/one-way-rental", label: t.nav.oneWay }]}
      >
        <a href={whatsappLink(o.waQuote)} target="_blank" rel="noopener noreferrer" className="btn mt-8 bg-whatsapp text-white hover:brightness-95">
          <WhatsAppIcon className="size-4" /> {o.quote}
        </a>
      </PageHero>

      <section className="container-x py-16 sm:py-20">
        <SectionHeading eyebrow={o.citiesEyebrow} title={o.citiesTitle} />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {o.destinations.map((d, i) => (
            <div key={d.city} className="card flex items-center gap-4 p-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink font-display text-lg font-black text-white">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="flex items-center gap-1.5 text-xs text-muted"><MapPin className="size-3.5" /> {locale === "vi" ? "Đà Nẵng" : "Da Nang"} <ArrowRight className="size-3" /></p>
                <p className="text-lg font-bold">{d.city}</p>
                <p className="text-sm text-muted">{d.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading eyebrow={o.ratesEyebrow} title={o.ratesTitle} intro={o.ratesIntro} />
            <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl ring-1 ring-line">
              {o.rates.map((r, i) => (
                <li key={r.name} className="flex items-center justify-between gap-4 bg-white p-5">
                  <div>
                    <p className="font-bold">{r.name}</p>
                    <p className="text-sm text-muted">{r.note}</p>
                  </div>
                  <p className="shrink-0 text-right">
                    <Price vnd={oneWayPrices.rates[i]} className="font-display text-xl font-extrabold" />
                    <span className="block text-xs text-muted">{t.common.perDayWord}</span>
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {o.extras.map((x, i) => (
                <div key={x.name} className="flex gap-3 rounded-2xl bg-paper p-5">
                  {i === 0 ? <Route className="size-5 shrink-0 text-brand" /> : <Luggage className="size-5 shrink-0 text-brand" />}
                  <div>
                    <p className="text-sm font-bold">{x.name}</p>
                    <p className="text-sm"><Price vnd={oneWayPrices.extras[i]} className="font-semibold" /> <span className="text-muted">{x.unit}</span></p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 flex gap-2 text-xs text-muted">
              <Info className="size-4 shrink-0" /> {o.ratesNote}
            </p>
          </div>
          <div>
            <div className="relative overflow-hidden rounded-3xl ring-1 ring-line">
              <Image src="/images/2026-05-image.webp" alt={o.posterAlt} {...imageSize("/images/2026-05-image.webp")} sizes="(min-width: 1024px) 40vw, 100vw" className="h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 sm:py-20">
        <SectionHeading
          eyebrow={o.whyEyebrow}
          title={o.whyTitle}
          action={<Link href={l("/bikes")} className="btn-light shrink-0">{t.common.browseBikes} <ArrowRight className="size-4" /></Link>}
        />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {o.why.map((w) => (
            <li key={w} className="card p-5 text-sm font-semibold">✓ {w}</li>
          ))}
        </ul>
        <div className="mt-12">
          <PhotoGrid images={photos.map((src) => ({ src, ...imageSize(src) }))} alt={o.photosAlt} />
        </div>
      </section>
    </>
  );
}
