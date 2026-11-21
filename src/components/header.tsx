"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Phone, Search, X } from "lucide-react";
import { Logo } from "./logo";
import { CurrencyToggle } from "./price";
import { useStore } from "./providers";
import { LanguageButtons, LanguageSwitcher } from "./language-switcher";
import { WhatsAppIcon } from "./icons";
import { nav, site, whatsappLink } from "@/lib/site";
import { useL, useT } from "@/i18n/client";
import { stripLocale } from "@/i18n/config";

export function Header() {
  const fullPath = usePathname();
  const pathname = stripLocale(fullPath);
  const t = useT();
  const l = useL();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { saved, hydrated, setSearchOpen } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [fullPath]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const dark = overHero && !scrolled && !open;
  const iconBtn = dark ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-ink/70 hover:bg-ink/5 hover:text-ink";

  return (
    <>
      <div className="hidden bg-ink text-white/70 lg:block">
        <div className="container-x flex h-9 items-center justify-between text-xs">
          <span>{site.address}</span>
          <div className="flex items-center gap-5">
            {site.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`} className="inline-flex items-center gap-1.5 hover:text-white">
                <Phone className="size-3.5" /> {p.label}
              </a>
            ))}
            <span className="text-white/40">{t.site.hours}</span>
          </div>
        </div>
      </div>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          dark ? "bg-transparent" : "border-b border-line/80 bg-paper/85 backdrop-blur-xl"
        } ${overHero ? "-mb-[73px]" : ""}`}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-3">
          <Logo dark={dark} />

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={l(item.href)}
                  className={`rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition ${
                    dark
                      ? active ? "bg-white/15 text-white" : "text-white/80 hover:text-white"
                      : active ? "bg-ink/[0.06] text-ink" : "text-ink/70 hover:text-ink"
                  }`}
                >
                  {t.nav[item.key]}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
            <button type="button" onClick={() => setSearchOpen(true)} className={`inline-flex items-center gap-2 rounded-full p-2 text-sm transition sm:px-2.5 ${iconBtn}`} aria-label={t.header.search}>
              <Search className="size-[1.15rem]" />
              <kbd className={`hidden rounded-md px-1.5 py-0.5 text-[0.65rem] font-semibold 2xl:inline ${dark ? "bg-white/10" : "bg-ink/5"}`}>⌘K</kbd>
            </button>
            <Link href={l("/bikes?saved=1")} className={`relative hidden rounded-full p-2 transition sm:block ${iconBtn}`} aria-label={t.header.saved(saved.length)}>
              <Heart className="size-[1.15rem]" />
              {hydrated && saved.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid size-4.5 place-items-center rounded-full bg-brand text-[0.6rem] font-bold text-white">{saved.length}</span>
              )}
            </Link>
            <LanguageSwitcher dark={dark} />
            <div className="hidden sm:block">
              <CurrencyToggle dark={dark} />
            </div>
            <a href={whatsappLink(t.common.waHello)} target="_blank" rel="noopener noreferrer" className="btn-primary ml-1 hidden !py-2.5 whitespace-nowrap md:inline-flex">
              <WhatsAppIcon className="size-4" /> {t.common.bookNow}
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className={`rounded-full p-2 xl:hidden ${dark ? "text-white" : "text-ink"}`}
              aria-label={open ? t.header.closeMenu : t.header.openMenu}
              aria-expanded={open}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div className="fixed inset-x-0 top-[72px] bottom-0 z-[52] animate-fade-in overflow-y-auto bg-paper xl:hidden">
          <nav className="container-x flex flex-col py-6" aria-label="Mobile">
            {[{ href: "/", key: "home" as const }, ...nav].map((item, i) => (
              <Link
                key={item.href}
                href={l(item.href)}
                className="animate-fade-up border-b border-line py-4 font-display text-2xl font-bold"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {t.nav[item.key]}
              </Link>
            ))}
            <div className="mt-6">
              <p className="label">{t.common.language}</p>
              <LanguageButtons />
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-muted">{t.common.showPricesIn}</span>
              <CurrencyToggle />
            </div>
            <div className="mt-6 grid gap-3">
              <a href={whatsappLink(t.common.waHello)} className="btn-primary">
                <WhatsAppIcon className="size-4" /> {t.header.bookWhatsApp}
              </a>
              {site.phones.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} className="btn-light">
                  <Phone className="size-4" /> {t.common.callNumber(p.label)}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
