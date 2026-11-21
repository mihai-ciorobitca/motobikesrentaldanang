import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Bike, HeartHandshake, ShieldCheck, Headset, TrendingUp } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/page-hero";
import { PhotoGrid } from "@/components/photo-grid";
import { Reviews } from "@/components/reviews";
import { bikes, media } from "@/lib/data";
import { imageSize } from "@/lib/server-data";
import { site } from "@/lib/site";
import { getDict } from "@/i18n";
import { languageAlternates, localizeHref } from "@/i18n/config";
import { getLocale, type LocaleParams } from "@/i18n/server";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getLocale(params);
  const t = getDict(locale);
  return { title: t.about.metaTitle, description: t.about.metaDesc(site.yearsExperience), alternates: languageAlternates(locale, "/about") };
}

const reasonIcons = [Award, Bike, TrendingUp, HeartHandshake, ShieldCheck, Headset];

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await getLocale(params);
  const t = getDict(locale);
  const a = t.about;
  const l = (h: string) => localizeHref(locale, h);
  const store = media.store.map((src) => ({ src, ...imageSize(src) }));
  const gallery = media.gallery.map((src) => ({ src, ...imageSize(src) }));
  return (
    <>
      <PageHero
        eyebrow={a.eyebrow}
        title={<>{a.title1}<br /><span className="text-brand">{a.title2}</span></>}
        intro={a.intro}
        image={media.store[0]}
        crumbs={[{ href: "/about", label: t.nav.about }]}
      />

      <section className="container-x grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image src={media.store[1]} alt={a.bigBikesAlt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="absolute -right-3 -bottom-6 rounded-3xl bg-brand p-6 text-white shadow-lift sm:-right-8">
            <p className="font-display text-5xl font-black">{site.yearsExperience}+</p>
            <p className="text-sm font-semibold text-white/85">{a.years}</p>
          </div>
        </div>
        <div>
          <p className="eyebrow">{a.storyEyebrow}</p>
          <h2 className="mt-3 text-3xl leading-[1.08] font-black sm:text-4xl">{a.storyTitle}</h2>
          <div className="prose-content mt-5">
            {a.story(site.yearsExperience).map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            <h2>{a.fleetTitle}</h2>
            <ul>
              {a.fleet.map(([b, rest]) => (
                <li key={b}><strong>{b}</strong> — {rest}</li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={l("/bikes")} className="btn-primary">{a.seeAll(bikes.length)} <ArrowRight className="size-4" /></Link>
            <Link href={l("/contact")} className="btn-light">{a.visit}</Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow={a.standEyebrow} title={a.standTitle} align="center" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {a.reasons(site.yearsExperience).map(([title, d], i) => {
              const Icon = reasonIcons[i];
              return (
                <div key={title} className="rounded-3xl bg-paper p-6">
                  <Icon className="size-7 text-brand" />
                  <h3 className="mt-4 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-x py-16 sm:py-24">
        <SectionHeading eyebrow={a.shopEyebrow} title={a.shopTitle} intro={site.address} />
        <div className="mt-10">
          <PhotoGrid images={store} alt={a.shopAlt} />
        </div>
      </section>

      <section id="gallery" className="scroll-mt-24 bg-white py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow={a.customersEyebrow} title={a.customersTitle} />
          <div className="mt-10">
            <PhotoGrid images={gallery} alt={a.customerAlt} />
          </div>
          <div className="mt-16">
            <Reviews />
          </div>
        </div>
      </section>
    </>
  );
}
