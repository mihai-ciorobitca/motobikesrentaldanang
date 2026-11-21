import { imageSize } from "@/lib/server-data";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, BadgeDollarSign, Bike, CalendarRange, Headset, HardHat, MapPin, MousePointerClick, Route, Star, Zap,
} from "lucide-react";
import { HeroSearch } from "@/components/hero-search";
import { BikeCard } from "@/components/bike-card";
import { Reviews } from "@/components/reviews";
import { PhotoGrid } from "@/components/photo-grid";
import { SectionHeading } from "@/components/page-hero";
import { WhatsAppIcon } from "@/components/icons";
import { bikes, categories, dealBikes, featuredBikes, media, posts, postExcerpt } from "@/lib/data";
import { faqs, oneWay, perks } from "@/lib/content";
import { formatDate, formatPriceShort } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";

const perkIcons = [BadgeDollarSign, Bike, CalendarRange, Headset, HardHat, MousePointerClick];

export default function Home() {
  const bigBikes = bikes.filter((b) => b.category === "Big Bike").sort((a, b) => b.cc - a.cc);
  const minPrice = Math.min(...bikes.map((b) => b.price));
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image src={media.hero} alt="Motorbike parked on a sunny street" fill priority sizes="100vw" className="-z-10 object-cover object-[60%_center] opacity-70" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />
        <div className="container-x pt-36 pb-16 sm:pt-44 lg:pt-52 lg:pb-24">
          <p className="eyebrow animate-fade-up !text-white/80">
            Welcome to Quang Nga · {site.yearsExperience}+ years in Da Nang
          </p>
          <h1 className="mt-5 max-w-4xl animate-fade-up text-[2.75rem] leading-[0.95] font-black [animation-delay:60ms] sm:text-7xl lg:text-[5.5rem]">
            Ride Da Nang <br className="hidden sm:block" />
            <span className="text-brand">your way.</span>
          </h1>
          <p className="mt-6 max-w-xl animate-fade-up text-lg text-white/75 [animation-delay:120ms]">
            New motorbikes, good speed and the best prices in Da Nang — from easy 50cc scooters to 650cc big bikes, from {formatPriceShort(minPrice)} a day.
          </p>
          <div className="mt-10 max-w-4xl animate-fade-up [animation-delay:180ms]">
            <HeroSearch />
          </div>
          <dl className="mt-12 grid max-w-3xl animate-fade-up grid-cols-2 gap-6 [animation-delay:240ms] sm:grid-cols-4">
            {[
              [`${bikes.length}+`, "Bikes to choose"],
              ["50–650cc", "Scooters to big bikes"],
              [`${site.yearsExperience}+ yrs`, "Family-run in Da Nang"],
              ["24/7", "Rider support"],
            ].map(([v, l]) => (
              <div key={l} className="border-l border-white/20 pl-4">
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-2xl font-extrabold sm:text-3xl">{v}</dd>
                <dd className="mt-1 text-xs text-white/60">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-x py-20 sm:py-24">
        <SectionHeading
          eyebrow="Browse by type"
          title="What do you want to ride?"
          action={
            <Link href="/bikes" className="btn-light shrink-0">
              All {bikes.length} bikes <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {categories.map((c, i) => {
            const n = bikes.filter((b) => b.category === c.name);
            const from = Math.min(...n.map((b) => b.price));
            return (
              <Link
                key={c.name}
                href={`/bikes?category=${encodeURIComponent(c.name)}`}
                className={`group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl p-5 text-white ${i === 0 ? "col-span-2 aspect-[16/10] lg:col-span-1 lg:aspect-[4/5]" : ""}`}
              >
                <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 20vw, 50vw" className="-z-10 object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <span className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-brand">
                  <ArrowUpRight className="size-4" />
                </span>
                <h3 className="text-xl font-extrabold">{c.name}</h3>
                <p className="mt-1 text-sm text-white/70">{c.blurb}</p>
                <p className="mt-3 text-xs font-semibold text-white/90">
                  {n.length} bikes · from {formatPriceShort(from)}/day
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* DEALS */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Current deals"
            title={<>Discounted daily prices<span className="text-brand">.</span></>}
            intro="Popular bikes with reduced daily rates right now."
            action={
              <Link href="/bikes?sale=1&sort=discount" className="btn-light shrink-0">
                See all {dealBikes.length} deals <ArrowRight className="size-4" />
              </Link>
            }
          />
          <div className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {dealBikes.slice(0, 8).map((b) => (
              <div key={b.slug} className="w-[78%] shrink-0 snap-start sm:w-[300px]">
                <BikeCard bike={b} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BIG BIKES BAND */}
      <section className="relative isolate overflow-hidden bg-ink py-20 text-white sm:py-28">
        <Image src={media.darkBike} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">Big bikes · 300–650cc</p>
            <h2 className="mt-4 text-4xl leading-[1.02] font-black sm:text-5xl">
              One of Da Nang&apos;s largest <span className="text-brand">big-bike</span> fleets.
            </h2>
            <p className="mt-5 max-w-md text-white/70">
              Honda CB650 &amp; CBR650, Rebel, CB500X, Kawasaki Ninja, Yamaha MT-03 and more — serviced after every rental and ready for Hai Van Pass.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/bikes?category=Big%20Bike&sort=cc-desc" className="btn-primary">
                Explore {bigBikes.length} big bikes <ArrowRight className="size-4" />
              </Link>
              <Link href="/one-way-rental" className="btn-ghost-dark">
                <Route className="size-4" /> One-way trips
              </Link>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {bigBikes.slice(0, 6).map((b) => (
              <li key={b.slug}>
                <Link href={`/bikes/${b.slug}`} className="group block overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={b.images[0]} alt={b.name} fill sizes="(min-width: 640px) 200px, 45vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold">{b.name}</p>
                    <p className="text-xs text-white/60">{b.cc}cc · {formatPriceShort(b.price)}/day</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHY US + HOW IT WORKS */}
      <section className="container-x py-20 sm:py-24">
        <SectionHeading eyebrow="Why choose us" title="Everything you need for a worry-free ride." align="center" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((p, i) => {
            const Icon = perkIcons[i];
            return (
              <div key={p.title} className="card group p-6 transition hover:shadow-lift">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand transition group-hover:bg-brand group-hover:text-white">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl bg-ink text-white">
          <div className="grid lg:grid-cols-[1fr_1.4fr]">
            <div className="relative min-h-64">
              <Image src={media.about} alt="Quang Nga motorbike rental shop" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="p-8 sm:p-12">
              <p className="eyebrow">How it works</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">On the road in 3 easy steps.</h2>
              <ol className="mt-8 space-y-6">
                {[
                  ["Pick your bike", "Filter by type, engine size and budget, or compare up to 3 bikes side by side."],
                  ["Book on WhatsApp or Zalo", "Your bike and dates are pre-filled — we confirm availability in minutes."],
                  ["Pick up & ride", `Bring your passport to ${site.addressShort}. Helmet included, tank has fuel to get you going.`],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand font-display text-lg font-black">{i + 1}</span>
                    <div>
                      <h3 className="font-bold">{t}</h3>
                      <p className="mt-1 text-sm text-white/65">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <a href={whatsappLink("Hi Quang Nga! I'd like to rent a motorbike.")} target="_blank" rel="noopener noreferrer" className="btn mt-9 bg-whatsapp text-white hover:brightness-95">
                <WhatsAppIcon className="size-4" /> Chat with us now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Featured"
            title="Popular picks from our fleet."
            action={
              <Link href="/bikes" className="btn-light shrink-0">
                Browse all <ArrowRight className="size-4" />
              </Link>
            }
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredBikes.slice(0, 8).map((b) => (
              <BikeCard key={b.slug} bike={b} />
            ))}
          </div>
        </div>
      </section>

      {/* ONE WAY */}
      <section className="container-x py-20 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">One-way rental</p>
            <h2 className="mt-3 text-3xl leading-[1.08] font-black sm:text-4xl lg:text-[2.75rem]">Rent in Da Nang. Return it anywhere in Vietnam.</h2>
            <p className="mt-4 text-lg text-muted">
              Ride the coast and the mountains without doubling back — drop your bike off in another city, we take care of the rest.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/one-way-rental" className="btn-dark">
                See routes & rates <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {oneWay.destinations.map((d) => (
              <li key={d.city} className="card flex items-center gap-3 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy">
                  <MapPin className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-bold">{d.city}</span>
                  <span className="block truncate text-xs text-muted">{d.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="overflow-hidden bg-white py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Customer reviews"
            title={
              <span className="inline-flex flex-wrap items-center gap-x-3">
                Riders love Quang Nga
                <span className="inline-flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-7 fill-current" />
                  ))}
                </span>
              </span>
            }
            intro="Real reviews from our customers on Google Maps."
          />
          <div className="mt-10">
            <Reviews />
          </div>
        </div>
      </section>

      {/* CUSTOMER PHOTOS */}
      <section className="container-x py-20 sm:py-24">
        <SectionHeading
          eyebrow="Out on the road"
          title="Real moments from our customers."
          intro="Some actual photos of our customers' experiences at our store."
          action={
            <Link href="/about#gallery" className="btn-light shrink-0">
              More photos <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="mt-10">
          <PhotoGrid images={media.gallery.map((src) => ({ src, ...imageSize(src) }))} alt="Quang Nga customer photo" limit={8} />
        </div>
      </section>

      {/* BLOG + FAQ */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Blog & news"
              title="Latest from the shop."
              action={
                <Link href="/blog" className="text-sm font-semibold text-brand hover:underline">
                  See all
                </Link>
              }
            />
            <ul className="mt-8 space-y-4">
              {posts.slice(0, 3).map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="group flex gap-4 rounded-2xl p-2 transition hover:bg-paper">
                    <span className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-paper sm:w-28">
                      {p.cover && <Image src={p.cover} alt="" fill sizes="112px" className="object-cover transition duration-500 group-hover:scale-105" />}
                    </span>
                    <span className="min-w-0 py-1">
                      <span className="text-xs text-muted">{formatDate(p.date)}</span>
                      <span className="mt-1 line-clamp-2 block font-bold group-hover:text-brand">{p.title}</span>
                      <span className="mt-1 line-clamp-2 block text-sm text-muted">{postExcerpt(p, 110)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading
              eyebrow="FAQ"
              title="Good to know."
              action={
                <Link href="/faq" className="text-sm font-semibold text-brand hover:underline">
                  All questions
                </Link>
              }
            />
            <div className="mt-8 divide-y divide-line border-y border-line">
              {faqs.slice(0, 5).map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-paper text-lg transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 pr-10 text-sm leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20">
        <div className="relative isolate overflow-hidden rounded-3xl bg-brand px-6 py-14 text-white sm:px-14 sm:py-20">
          <Zap className="absolute -top-10 -right-10 -z-10 size-72 rotate-12 text-white/10" />
          <h2 className="max-w-2xl text-3xl leading-[1.05] font-black sm:text-5xl">Ready to ride? Your bike is waiting.</h2>
          <p className="mt-4 max-w-xl text-white/85">Message us with your dates — we reply fast, 24/7.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappLink("Hi Quang Nga! I'd like to rent a motorbike.")} target="_blank" rel="noopener noreferrer" className="btn bg-white text-ink hover:bg-white/90">
              <WhatsAppIcon className="size-4 text-whatsapp" /> WhatsApp {site.whatsappLabel}
            </a>
            <Link href="/bikes" className="btn bg-ink text-white hover:bg-ink-3">
              Browse bikes <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
