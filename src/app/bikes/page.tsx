import type { Metadata } from "next";
import { Suspense } from "react";
import { BikeBrowser } from "@/components/bike-browser";
import { PageHero } from "@/components/page-hero";
import { bikes, media } from "@/lib/data";
import { formatPriceShort } from "@/lib/format";

export const metadata: Metadata = {
  title: "Bikes & Prices — Motorbike Rental Da Nang",
  description: `Compare ${bikes.length} rental motorbikes in Da Nang: automatic scooters, semi-automatics, manual sport bikes and 300–650cc big bikes. Filter by type, engine size, brand and daily price.`,
  alternates: { canonical: "/bikes" },
};

export default function BikesPage() {
  const min = Math.min(...bikes.map((b) => b.price));
  return (
    <>
      <PageHero
        eyebrow="Bikes & prices"
        title={<>Find your perfect ride<span className="text-brand">.</span></>}
        intro={`${bikes.length} bikes from ${formatPriceShort(min)}/day. Filter by type, engine size, brand and budget — save favourites and compare side by side.`}
        image={media.pageBg}
        crumbs={[{ href: "/bikes", label: "Bikes & Prices" }]}
      />
      <section className="container-x py-10 sm:py-14">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-ink/5" />}>
          <BikeBrowser />
        </Suspense>
      </section>
    </>
  );
}
