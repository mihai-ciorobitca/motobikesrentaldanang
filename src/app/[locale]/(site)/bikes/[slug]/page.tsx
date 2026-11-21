import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarClock, Fuel, Gauge, HardHat, Headset, Settings2, Tag, Wrench } from "lucide-react";
import { bikes, getBike, relatedBikes } from "@/lib/data";
import { bikeDescription } from "@/lib/server-data";
import { discountPercent, formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { BikeGallery } from "@/components/bike-gallery";
import { BookingCard } from "@/components/booking-card";
import { BikeCard } from "@/components/bike-card";
import { Blocks } from "@/components/blocks";
import { JsonLd } from "@/components/json-ld";
import { getDict } from "@/i18n";
import { isLocale, languageAlternates, localizeHref } from "@/i18n/config";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return bikes.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const bike = getBike(slug);
  if (!bike || !isLocale(locale)) return {};
  const t = getDict(locale);
  const name = `${bike.name}${bike.year ? ` ${bike.year}` : ""}`;
  return {
    title: t.bike.metaTitle(name, formatPrice(bike.price, "VND", locale)),
    description: t.bike.metaDesc(bike.name, bike.cc, t.transmissions[bike.transmission], formatPrice(bike.price, "VND", locale)),
    alternates: languageAlternates(locale, `/bikes/${bike.slug}`),
    openGraph: { images: [{ url: bike.images[0] }] },
  };
}

export default async function BikePage({ params }: Props) {
  const { slug, locale } = await params;
  const bike = getBike(slug);
  if (!bike || !isLocale(locale)) notFound();
  const t = getDict(locale);
  const l = (h: string) => localizeHref(locale, h);
  const off = discountPercent(bike.price, bike.originalPrice);
  const related = relatedBikes(bike);
  const description = bikeDescription(bike.slug, locale);
  const catName = t.categories[bike.category].name;

  const specs = [
    { icon: Gauge, label: t.bike.engine, value: `${bike.cc}cc` },
    { icon: Settings2, label: t.bike.transmission, value: t.transmissions[bike.transmission] },
    { icon: Tag, label: t.bike.brand, value: bike.brand },
    { icon: CalendarClock, label: t.bike.year, value: bike.year ?? t.common.recent },
    { icon: BadgeCheck, label: t.bike.license, value: bike.noLicense ? t.bike.licenseNo : t.bike.licenseYes },
    { icon: Wrench, label: t.bike.category, value: catName },
  ];
  const includedIcons = [HardHat, Fuel, Headset, Wrench];

  return (
    <>
      <div className="container-x pt-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <Link href={l("/")} className="hover:text-ink">{t.nav.home}</Link>/
          <Link href={l("/bikes")} className="hover:text-ink">{t.nav.bikes}</Link>/
          <Link href={l(`/bikes?category=${encodeURIComponent(bike.category)}`)} className="hover:text-ink">{catName}</Link>/
          <span className="text-ink">{bike.name}</span>
        </nav>
      </div>

      <section className="container-x grid gap-10 py-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        <div className="min-w-0">
          <BikeGallery
            images={bike.images}
            name={bike.name}
            badge={off > 0 ? <span className="rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-white shadow">{t.bike.offToday(off)}</span> : undefined}
          />

          <div className="mt-10">
            <h2 className="text-xl font-bold">{t.bike.specs}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specs.map((s) => (
                <div key={s.label} className="card p-4">
                  <s.icon className="size-5 text-brand" />
                  <dt className="mt-3 text-xs text-muted">{s.label}</dt>
                  <dd className="mt-0.5 text-sm font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {description.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold">{t.bike.about}</h2>
              <div className="mt-2">
                <Blocks blocks={description} alt={bike.name} />
              </div>
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-xl font-bold">{t.bike.included}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {t.bike.includedItems.map(([title, d], i) => {
                const Icon = includedIcons[i];
                return (
                  <li key={title} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-line/80">
                    <Icon className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                    <span>
                      <span className="block text-sm font-semibold">{title}</span>
                      <span className="block text-xs text-muted">{d}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-sm text-muted">
              {t.bike.bring(site.address)}{" "}
              <Link href={l("/faq")} className="font-semibold text-ink underline underline-offset-2">{t.bike.readFaq}</Link>
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-semibold tracking-wider text-muted uppercase">
            {bike.brand} · {catName}
          </p>
          <h1 className="mt-2 text-3xl leading-tight font-black sm:text-4xl">{bike.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            {bike.year && <span className="rounded-full bg-ink/5 px-3 py-1">{bike.year}</span>}
            <span className="rounded-full bg-ink/5 px-3 py-1">{bike.cc}cc</span>
            <span className="rounded-full bg-ink/5 px-3 py-1">{t.transmissions[bike.transmission]}</span>
            {bike.noLicense && <span className="rounded-full bg-navy-50 px-3 py-1 text-navy">{t.bike.noLicenseBadge}</span>}
          </div>
          <div className="mt-6">
            <BookingCard bike={bike} />
          </div>
        </aside>
      </section>

      <section className="border-t border-line bg-white py-16">
        <div className="container-x">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-black sm:text-3xl">{t.bike.similar}</h2>
            <Link href={l(`/bikes?category=${encodeURIComponent(bike.category)}`)} className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              {t.bike.moreOf(catName)} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((b) => (
              <BikeCard key={b.slug} bike={b} />
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: bike.name,
          brand: { "@type": "Brand", name: bike.brand },
          image: bike.images.map((i) => `${site.url}${i}`),
          description: description.filter((b) => b.t === "p").map((b) => b.v).join(" ").slice(0, 300) || bike.name,
          offers: {
            "@type": "Offer",
            price: bike.price,
            priceCurrency: "VND",
            availability: "https://schema.org/InStock",
            url: `${site.url}${l(`/bikes/${bike.slug}`)}`,
            priceSpecification: { "@type": "UnitPriceSpecification", price: bike.price, priceCurrency: "VND", unitText: "DAY" },
          },
        }}
      />
    </>
  );
}
