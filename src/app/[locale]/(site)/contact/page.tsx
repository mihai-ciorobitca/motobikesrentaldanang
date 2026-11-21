import type { Metadata } from "next";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { FacebookIcon, WhatsAppIcon } from "@/components/icons";
import { media } from "@/lib/data";
import { site, whatsappLink, zaloLink } from "@/lib/site";
import { getDict } from "@/i18n";
import { languageAlternates } from "@/i18n/config";
import { getLocale, type LocaleParams } from "@/i18n/server";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getLocale(params);
  const t = getDict(locale);
  return { title: t.contactPage.metaTitle, description: t.contactPage.metaDesc(site.address, site.whatsappLabel), alternates: languageAlternates(locale, "/contact") };
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await getLocale(params);
  const t = getDict(locale);
  const c = t.contactPage;
  const channels = [
    { href: whatsappLink(t.common.waHi), label: "WhatsApp", value: site.whatsappLabel, icon: <WhatsAppIcon className="size-6" />, cls: "bg-whatsapp" },
    { href: zaloLink(), label: "Zalo", value: site.zalo.map((z) => z.label).join(" / "), icon: <span className="text-xs font-black">Zalo</span>, cls: "bg-zalo" },
    { href: `tel:${site.phones[0].tel}`, label: c.hotline, value: site.phones.map((p) => p.label).join(" / "), icon: <Phone className="size-6" />, cls: "bg-ink" },
    { href: site.facebook, label: "Facebook", value: c.messenger, icon: <FacebookIcon className="size-6" />, cls: "bg-[#1877f2]" },
  ];
  const mapSrc = locale === "vi" ? site.mapsEmbed.replace("!1sen!2s", "!1svi!2s") : site.mapsEmbed;
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} intro={c.intro} image={media.store[2]} crumbs={[{ href: "/contact", label: t.nav.contact }]} />
      <section className="container-x py-14 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((ch) => (
            <a key={ch.label} href={ch.href} target={ch.href.startsWith("tel:") ? undefined : "_blank"} rel="noopener noreferrer" className="card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-lift">
              <span className={`grid size-12 place-items-center rounded-2xl text-white ${ch.cls}`}>{ch.icon}</span>
              <span className="mt-5 text-lg font-bold">{ch.label}</span>
              <span className="mt-1 text-sm text-muted">{ch.value}</span>
            </a>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-2xl font-black">{c.formTitle}</h2>
            <p className="mt-2 text-muted">{c.formIntro}</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black">{c.visitTitle}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3"><MapPin className="size-5 shrink-0 text-brand" /> {site.address}</li>
              <li className="flex gap-3"><Clock className="size-5 shrink-0 text-brand" /> {t.site.hours}</li>
            </ul>
            <div className="mt-6 overflow-hidden rounded-3xl ring-1 ring-line">
              <iframe src={mapSrc} title={c.mapTitle} className="aspect-[4/3] w-full grayscale-[0.2]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
            <a href={site.mapsLink} target="_blank" rel="noopener noreferrer" className="btn-dark mt-4 w-full">
              <Navigation className="size-4" /> {c.directions}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
