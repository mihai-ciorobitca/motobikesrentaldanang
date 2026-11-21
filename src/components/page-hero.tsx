import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHero({
  title,
  eyebrow,
  intro,
  image,
  crumbs = [],
  children,
}: {
  title: React.ReactNode;
  eyebrow?: string;
  intro?: React.ReactNode;
  image?: string;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {image && (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
        </>
      )}
      <div className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-brand/25 blur-3xl" />
      <div className="container-x relative py-14 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-white/60">
          <Link href="/" className="hover:text-white">Home</Link>
          {crumbs.map((c) => (
            <span key={c.href} className="inline-flex items-center gap-1.5">
              <ChevronRight className="size-3" />
              <Link href={c.href} className="hover:text-white">{c.label}</Link>
            </span>
          ))}
        </nav>
        {eyebrow && <p className="eyebrow animate-fade-up">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl animate-fade-up text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl animate-fade-up text-base text-white/70 [animation-delay:80ms] sm:text-lg">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro, align = "left", action }: { eyebrow?: string; title: React.ReactNode; intro?: React.ReactNode; align?: "left" | "center"; action?: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-4 ${align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"}`}>
      <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-3 text-3xl font-black leading-[1.08] sm:text-4xl lg:text-[2.75rem]">{title}</h2>
        {intro && <p className="mt-4 text-base text-muted sm:text-lg">{intro}</p>}
      </div>
      {action && <div className="shrink-0 whitespace-nowrap">{action}</div>}
    </div>
  );
}
