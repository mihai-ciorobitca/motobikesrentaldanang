import { imageSize } from "@/lib/server-data";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Bike, HeartHandshake, ShieldCheck, Headset, TrendingUp } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/page-hero";
import { PhotoGrid } from "@/components/photo-grid";
import { Reviews } from "@/components/reviews";
import { bikes, media } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `From a small shop to one of Da Nang's most trusted motorbike rentals — over ${site.yearsExperience} years of experience and one of the city's largest big-bike fleets.`,
  alternates: { canonical: "/about" },
};

const reasons = [
  { icon: Award, t: `Over ${site.yearsExperience} years of experience`, d: "Our decade in the business means we know exactly how to give you a smooth and memorable ride." },
  { icon: Bike, t: "Largest selection of big bikes", d: "One of the few companies in Da Nang with a large fleet of big bikes for riders seeking adventure." },
  { icon: TrendingUp, t: "Highly rated", d: "Many customers return to us again and again for reliable bikes and outstanding service." },
  { icon: HeartHandshake, t: "Affordable and flexible", d: "Short-term or long trips — competitive prices and flexible options to suit your needs." },
  { icon: ShieldCheck, t: "Safety first", d: "Bikes fully maintained and equipped with the necessary safety gear." },
  { icon: Headset, t: "24/7 support", d: "We're here to help with any questions, so your rental is stress-free." },
];

export default function AboutPage() {
  const store = media.store.map((src) => ({ src, ...imageSize(src) }));
  const gallery = media.gallery.map((src) => ({ src, ...imageSize(src) }));
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={<>Quang Nga Motorbikes<br /><span className="text-brand">Rental Da Nang.</span></>}
        intro="From a small motorbike rental shop to one of the most trusted and well-known rental companies in Da Nang."
        image={media.store[0]}
        crumbs={[{ href: "/about", label: "About" }]}
      />

      <section className="container-x grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image src={media.store[1]} alt="Big bikes lined up outside the Quang Nga shop" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="absolute -right-3 -bottom-6 rounded-3xl bg-brand p-6 text-white shadow-lift sm:-right-8">
            <p className="font-display text-5xl font-black">{site.yearsExperience}+</p>
            <p className="text-sm font-semibold text-white/85">years in Da Nang</p>
          </div>
        </div>
        <div>
          <p className="eyebrow">Our story</p>
          <h2 className="mt-3 text-3xl leading-[1.08] font-black sm:text-4xl">A family business that grew with Da Nang&apos;s riders.</h2>
          <div className="prose-content mt-5">
            <p>
              With over {site.yearsExperience} years of experience in the industry, Quang Nga Motorbike Rental has grown into a leading business known for its wide selection of motorbikes and top-notch service.
            </p>
            <p>
              What started as a modest venture is now a top choice for both locals and travellers looking to explore the stunning landscapes of Da Nang. Thanks to our commitment to quality and customer satisfaction, we&apos;re proud to be one of the few businesses in Da Nang offering a large collection of big bikes.
            </p>
            <h2>Our fleet</h2>
            <ul>
              <li><strong>Big bikes</strong> — for those who love speed, power and thrill on the road.</li>
              <li><strong>Scooters and motorbikes</strong> — ideal for city rides or exploring the beautiful surroundings.</li>
              <li><strong>Well-maintained</strong> — every bike is regularly serviced and checked after each rental.</li>
            </ul>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/bikes" className="btn-primary">See all {bikes.length} bikes <ArrowRight className="size-4" /></Link>
            <Link href="/contact" className="btn-light">Visit us</Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="What makes us stand out" title="Why riders choose Quang Nga." align="center" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r) => (
              <div key={r.t} className="rounded-3xl bg-paper p-6">
                <r.icon className="size-7 text-brand" />
                <h3 className="mt-4 text-lg font-bold">{r.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-16 sm:py-24">
        <SectionHeading eyebrow="The shop" title="Come and see the fleet." intro={site.address} />
        <div className="mt-10">
          <PhotoGrid images={store} alt="Quang Nga shop and fleet" />
        </div>
      </section>

      <section id="gallery" className="scroll-mt-24 bg-white py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Customers" title="Happy riders, real moments." />
          <div className="mt-10">
            <PhotoGrid images={gallery} alt="Quang Nga customer" />
          </div>
          <div className="mt-16">
            <Reviews />
          </div>
        </div>
      </section>
    </>
  );
}
