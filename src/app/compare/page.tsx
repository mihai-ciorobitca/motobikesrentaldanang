import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareView } from "@/components/compare-view";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Compare bikes",
  description: "Compare rental motorbikes side by side — daily price, engine size, transmission and more.",
  robots: { index: false },
};

export default function ComparePage() {
  return (
    <>
      <PageHero eyebrow="Compare" title="Compare bikes side by side." crumbs={[{ href: "/compare", label: "Compare" }]} />
      <section className="container-x py-12">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-ink/5" />}>
          <CompareView />
        </Suspense>
      </section>
    </>
  );
}
