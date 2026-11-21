import type { Metadata } from "next";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { FacebookIcon, WhatsAppIcon } from "@/components/icons";
import { media } from "@/lib/data";
import { site, whatsappLink, zaloLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Visit us at ${site.address}. Hotline / WhatsApp ${site.whatsappLabel}. Zalo, Facebook and phone support 24/7.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const channels = [
    { href: whatsappLink("Hi Quang Nga!"), label: "WhatsApp", value: site.whatsappLabel, icon: <WhatsAppIcon className="size-6" />, cls: "bg-whatsapp" },
    { href: zaloLink(), label: "Zalo", value: site.zalo.map((z) => z.label).join(" / "), icon: <span className="text-xs font-black">Zalo</span>, cls: "bg-zalo" },
    { href: `tel:${site.phones[0].tel}`, label: "Hotline", value: site.phones.map((p) => p.label).join(" / "), icon: <Phone className="size-6" />, cls: "bg-ink" },
    { href: site.facebook, label: "Facebook", value: "Message us on Messenger", icon: <FacebookIcon className="size-6" />, cls: "bg-[#1877f2]" },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's get you riding." intro="Message us on any channel — we usually reply within minutes." image={media.store[2]} crumbs={[{ href: "/contact", label: "Contact" }]} />
      <section className="container-x py-14 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c) => (
            <a key={c.label} href={c.href} target={c.href.startsWith("tel:") ? undefined : "_blank"} rel="noopener noreferrer" className="card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-lift">
              <span className={`grid size-12 place-items-center rounded-2xl text-white ${c.cls}`}>{c.icon}</span>
              <span className="mt-5 text-lg font-bold">{c.label}</span>
              <span className="mt-1 text-sm text-muted">{c.value}</span>
            </a>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-2xl font-black">Send us a message</h2>
            <p className="mt-2 text-muted">Tell us what you need and we&apos;ll get back to you on WhatsApp.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black">Visit the shop</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3"><MapPin className="size-5 shrink-0 text-brand" /> {site.address}</li>
              <li className="flex gap-3"><Clock className="size-5 shrink-0 text-brand" /> {site.hours}</li>
            </ul>
            <div className="mt-6 overflow-hidden rounded-3xl ring-1 ring-line">
              <iframe
                src={site.mapsEmbed}
                title="Map to Quang Nga Motorbikes Rental"
                className="aspect-[4/3] w-full grayscale-[0.2]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a href={site.mapsLink} target="_blank" rel="noopener noreferrer" className="btn-dark mt-4 w-full">
              <Navigation className="size-4" /> Get directions
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
