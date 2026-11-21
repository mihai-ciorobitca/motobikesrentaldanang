import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { JsonLd } from "@/components/json-ld";
import { WhatsAppIcon } from "@/components/icons";
import { media } from "@/lib/data";
import { site, whatsappLink } from "@/lib/site";
import { getDict } from "@/i18n";
import { languageAlternates, localizeHref } from "@/i18n/config";
import { getLocale, type LocaleParams } from "@/i18n/server";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getLocale(params);
  const t = getDict(locale);
  return { title: t.faqPage.metaTitle, description: t.faqPage.metaDesc, alternates: languageAlternates(locale, "/faq") };
}

export default async function FaqPage({ params }: LocaleParams) {
  const locale = await getLocale(params);
  const t = getDict(locale);
  const f = t.faqPage;
  const faqs = t.faqs(site.payments.slice(0, -1).join(", "));
  return (
    <>
      <PageHero eyebrow={f.eyebrow} title={f.title} intro={f.intro} image={media.reviewsBg} crumbs={[{ href: "/faq", label: t.nav.faq }]} />
      <section className="container-x grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <details key={item.q} className="group card open:shadow-lift" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-lg font-bold sm:p-6 [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-paper text-xl transition group-open:rotate-45 group-open:bg-brand group-open:text-white">+</span>
              </summary>
              <p className="-mt-1 px-5 pb-6 leading-relaxed text-muted sm:px-6">{item.a}</p>
            </details>
          ))}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-ink p-7 text-white">
            <p className="text-xl font-bold">{f.stillTitle}</p>
            <p className="mt-2 text-sm text-white/65">{f.stillText}</p>
            <a href={whatsappLink(t.common.waQuestion)} target="_blank" rel="noopener noreferrer" className="btn mt-6 w-full bg-whatsapp text-white">
              <WhatsAppIcon className="size-4" /> {f.ask}
            </a>
            <Link href={localizeHref(locale, "/contact")} className="btn-ghost-dark mt-3 w-full">{f.allContact}</Link>
          </div>
        </aside>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: locale,
          mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
        }}
      />
    </>
  );
}
