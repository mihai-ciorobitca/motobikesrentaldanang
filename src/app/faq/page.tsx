import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { JsonLd } from "@/components/json-ld";
import { WhatsAppIcon } from "@/components/icons";
import { faqs } from "@/lib/content";
import { media } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ — Renting a Motorbike in Da Nang",
  description: "Documents, licenses, helmets, fuel, one-way rentals, payment and support — everything you need to know before renting a motorbike from Quang Nga.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Questions? Answered." intro="Everything you need to know before you ride." image={media.reviewsBg} crumbs={[{ href: "/faq", label: "FAQ" }]} />
      <section className="container-x grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={f.q} className="group card open:shadow-lift" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-lg font-bold sm:p-6 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-paper text-xl transition group-open:rotate-45 group-open:bg-brand group-open:text-white">+</span>
              </summary>
              <p className="-mt-1 px-5 pb-6 leading-relaxed text-muted sm:px-6">{f.a}</p>
            </details>
          ))}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-ink p-7 text-white">
            <p className="text-xl font-bold">Still have a question?</p>
            <p className="mt-2 text-sm text-white/65">Our team replies fast on WhatsApp and Zalo — 24/7.</p>
            <a href={whatsappLink("Hi Quang Nga! I have a question:")} target="_blank" rel="noopener noreferrer" className="btn mt-6 w-full bg-whatsapp text-white">
              <WhatsAppIcon className="size-4" /> Ask on WhatsApp
            </a>
            <Link href="/contact" className="btn-ghost-dark mt-3 w-full">All contact options</Link>
          </div>
        </aside>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </>
  );
}
