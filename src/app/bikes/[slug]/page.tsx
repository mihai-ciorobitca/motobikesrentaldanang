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

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return bikes.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bike = getBike(slug);
  if (!bike) return {};
  const title = `${bike.name}${bike.year ? ` ${bike.year}` : ""} for rent in Da Nang — ${formatPrice(bike.price)}/day`;
  return {
    title,
    description: `Rent the ${bike.name} (${bike.cc}cc, ${bike.transmission.toLowerCase()}) in Da Nang from ${formatPrice(bike.price)} per day. Free helmet, 24/7 support, easy WhatsApp booking.`,
    alternates: { canonical: `/bikes/${bike.slug}` },
    openGraph: { images: [{ url: bike.images[0] }] },
  };
}

export default async function BikePage({ params }: Props) {
  const { slug } = await params;
  const bike = getBike(slug);
  if (!bike) notFound();
  const off = discountPercent(bike.price, bike.originalPrice);
  const related = relatedBikes(bike);
  const description = bikeDescription(bike.slug);

  const specs = [
    { icon: Gauge, label: "Engine", value: `${bike.cc}cc` },
    { icon: Settings2, label: "Transmission", value: bike.transmission },
    { icon: Tag, label: "Brand", value: bike.brand },
    { icon: CalendarClock, label: "Model year", value: bike.year ?? "Recent" },
    { icon: BadgeCheck, label: "License", value: bike.noLicense ? "Not required (50cc)" : "Motorbike license / IDP" },
    { icon: Wrench, label: "Category", value: bike.category },
  ];

  return (
    <>
      <div className="container-x pt-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <Link href="/" className="hover:text-ink">Home</Link>/
          <Link href="/bikes" className="hover:text-ink">Bikes</Link>/
          <Link href={`/bikes?category=${encodeURIComponent(bike.category)}`} className="hover:text-ink">{bike.category}</Link>/
          <span className="text-ink">{bike.name}</span>
        </nav>
      </div>

      <section className="container-x grid gap-10 py-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        <div className="min-w-0">
          <BikeGallery
            images={bike.images}
            name={bike.name}
            badge={off > 0 ? <span className="rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-white shadow">-{off}% today</span> : undefined}
          />

          <div className="mt-10">
            <h2 className="text-xl font-bold">Specifications</h2>
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
              <h2 className="text-xl font-bold">About this bike</h2>
              <div className="mt-2">
                <Blocks blocks={description} alt={bike.name} />
              </div>
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-xl font-bold">Included with every rental</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { icon: HardHat, t: "Free helmet & safety gear", d: "Choose any helmet that fits you." },
                { icon: Fuel, t: "Fuel to get you going", d: "About 1 litre in the tank at pick-up." },
                { icon: Headset, t: "24/7 support", d: "Roadside help whenever you need it." },
                { icon: Wrench, t: "Checked after every rental", d: "Tyres, rims, oil & more inspected." },
              ].map((x) => (
                <li key={x.t} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-line/80">
                  <x.icon className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  <span>
                    <span className="block text-sm font-semibold">{x.t}</span>
                    <span className="block text-xs text-muted">{x.d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Bring your passport (or leave a deposit) when you pick up at {site.address}.{" "}
              <Link href="/faq" className="font-semibold text-ink underline underline-offset-2">Read the FAQ</Link>
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-semibold tracking-wider text-muted uppercase">
            {bike.brand} · {bike.category}
          </p>
          <h1 className="mt-2 text-3xl leading-tight font-black sm:text-4xl">{bike.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            {bike.year && <span className="rounded-full bg-ink/5 px-3 py-1">{bike.year}</span>}
            <span className="rounded-full bg-ink/5 px-3 py-1">{bike.cc}cc</span>
            <span className="rounded-full bg-ink/5 px-3 py-1">{bike.transmission}</span>
            {bike.noLicense && <span className="rounded-full bg-navy-50 px-3 py-1 text-navy">No license needed</span>}
          </div>
          <div className="mt-6">
            <BookingCard bike={bike} />
          </div>
        </aside>
      </section>

      <section className="border-t border-line bg-white py-16">
        <div className="container-x">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-black sm:text-3xl">Similar bikes</h2>
            <Link href={`/bikes?category=${encodeURIComponent(bike.category)}`} className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
              More {bike.category.toLowerCase()} <ArrowRight className="size-4" />
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
          description: description.filter((b) => b.t === "p").map((b) => b.v).join(" ").slice(0, 300) || `${bike.name} for rent in Da Nang`,
          offers: {
            "@type": "Offer",
            price: bike.price,
            priceCurrency: "VND",
            availability: "https://schema.org/InStock",
            url: `${site.url}/bikes/${bike.slug}`,
            priceSpecification: { "@type": "UnitPriceSpecification", price: bike.price, priceCurrency: "VND", unitText: "DAY" },
          },
        }}
      />
    </>
  );
}
