import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Blocks } from "@/components/blocks";
import { JsonLd } from "@/components/json-ld";
import { WhatsAppIcon } from "@/components/icons";
import { getPost, getPosts, imageSize, postExcerpt } from "@/lib/server-data";
import { formatDate } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import { getDict } from "@/i18n";
import { isLocale, languageAlternates, localizeHref } from "@/i18n/config";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return getPosts("en").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  if (!isLocale(locale)) return {};
  const post = getPost(slug, locale);
  if (!post) return {};
  return {
    title: post.title,
    description: postExcerpt(post, 155),
    alternates: languageAlternates(locale, `/blog/${post.slug}`),
    openGraph: { type: "article", publishedTime: post.date, images: post.cover ? [{ url: post.cover }] : undefined },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug, locale } = await params;
  if (!isLocale(locale)) notFound();
  const post = getPost(slug, locale);
  if (!post) notFound();
  const t = getDict(locale);
  const l = (h: string) => localizeHref(locale, h);
  const blocks = post.blocks[0]?.t === "img" && post.blocks[0].v === post.cover ? post.blocks.slice(1) : post.blocks;
  const others = getPosts(locale).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article>
      <header className="container-x max-w-3xl pt-10 sm:pt-16">
        <Link href={l("/blog")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft className="size-4" /> {t.blog.all}
        </Link>
        <p className="mt-8 text-sm text-muted">{formatDate(post.date, locale)} · {t.blog.by}</p>
        <h1 className="mt-3 text-3xl leading-[1.1] font-black sm:text-5xl">{post.title}</h1>
      </header>
      {post.cover && (
        <div className="container-x mt-10 max-w-4xl">
          <Image src={post.cover} alt="" {...imageSize(post.cover)} priority sizes="(min-width: 1024px) 896px, 100vw" className="h-auto max-h-[80vh] w-full rounded-3xl bg-ink/5 object-contain" />
        </div>
      )}
      <div className="container-x max-w-3xl py-10">
        {blocks.length ? <Blocks blocks={blocks} alt={post.title} /> : null}
        <div className="mt-12 flex flex-col gap-4 rounded-3xl bg-ink p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold">{t.blog.questions}</p>
            <p className="text-sm text-white/65">{t.blog.messageUs(site.whatsappLabel)}</p>
          </div>
          <a href={whatsappLink(t.blog.waAsk(post.title))} target="_blank" rel="noopener noreferrer" className="btn shrink-0 bg-whatsapp text-white">
            <WhatsAppIcon className="size-4" /> {t.blog.chat}
          </a>
        </div>
      </div>
      <section className="border-t border-line bg-white py-14">
        <div className="container-x">
          <h2 className="text-2xl font-black">{t.blog.more}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {others.map((p) => (
              <Link key={p.slug} href={l(`/blog/${p.slug}`)} className="group">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-paper">
                  {p.cover && <Image src={p.cover} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />}
                </div>
                <p className="mt-3 text-xs text-muted">{formatDate(p.date, locale)}</p>
                <p className="mt-1 line-clamp-2 font-bold group-hover:text-brand">{p.title}</p>
              </Link>
            ))}
          </div>
          <Link href={l("/bikes")} className="btn-dark mt-10">{t.common.browseBikes} <ArrowRight className="size-4" /></Link>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          inLanguage: locale,
          datePublished: post.date,
          image: post.cover ? `${site.url}${post.cover}` : undefined,
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
        }}
      />
    </article>
  );
}
