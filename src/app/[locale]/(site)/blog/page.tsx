import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { media } from "@/lib/data";
import { getPosts, postExcerpt } from "@/lib/server-data";
import { formatDate } from "@/lib/format";
import { getDict } from "@/i18n";
import { languageAlternates, localizeHref } from "@/i18n/config";
import { getLocale, type LocaleParams } from "@/i18n/server";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getLocale(params);
  const t = getDict(locale);
  return { title: t.blog.metaTitle, description: t.blog.metaDesc, alternates: languageAlternates(locale, "/blog") };
}

export default async function BlogPage({ params }: LocaleParams) {
  const locale = await getLocale(params);
  const t = getDict(locale);
  const l = (h: string) => localizeHref(locale, h);
  const [first, ...rest] = getPosts(locale);
  return (
    <>
      <PageHero eyebrow={t.blog.eyebrow} title={t.blog.title} image={media.darkBike} crumbs={[{ href: "/blog", label: t.nav.blog }]} />
      <section className="container-x py-14 sm:py-20">
        <Link href={l(`/blog/${first.slug}`)} className="group grid overflow-hidden rounded-3xl bg-white ring-1 ring-line lg:grid-cols-2">
          <div className="relative aspect-[16/10] bg-paper lg:aspect-auto lg:min-h-96">
            {first.cover && <Image src={first.cover} alt="" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />}
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="text-sm text-muted">{formatDate(first.date, locale)}</p>
            <h2 className="mt-3 text-2xl leading-tight font-black group-hover:text-brand sm:text-3xl">{first.title}</h2>
            <p className="mt-4 text-muted">{postExcerpt(first, 220)}</p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold">{t.blog.read} <ArrowUpRight className="size-4" /></span>
          </div>
        </Link>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link key={p.slug} href={l(`/blog/${p.slug}`)} className="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-line transition hover:shadow-lift">
              <div className="relative aspect-[16/10] bg-paper">
                {p.cover && <Image src={p.cover} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs text-muted">{formatDate(p.date, locale)}</p>
                <h2 className="mt-2 line-clamp-2 text-lg leading-snug font-bold group-hover:text-brand">{p.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{postExcerpt(p, 160)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
