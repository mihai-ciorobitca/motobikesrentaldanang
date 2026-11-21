import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { Logo } from "./logo";
import { FacebookIcon, WhatsAppIcon, ZaloIcon } from "./icons";
import { nav, site, whatsappLink, zaloLink } from "@/lib/site";
import { categories } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white/70">
      <div className="pointer-events-none absolute -top-40 -right-40 size-[28rem] rounded-full bg-brand/20 blur-3xl" />
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Logo dark />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Family-run motorbike rental in Da Nang for over {site.yearsExperience} years — scooters to 650cc big bikes, one-way trips across Vietnam.
          </p>
          <div className="mt-6 flex gap-2">
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid size-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:bg-white/15 hover:text-white">
              <FacebookIcon className="size-4" />
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid size-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:bg-white/15 hover:text-white">
              <WhatsAppIcon className="size-4" />
            </a>
            <a href={zaloLink()} target="_blank" rel="noopener noreferrer" aria-label="Zalo" className="grid size-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:bg-white/15 hover:text-white">
              <ZaloIcon className="size-5 text-transparent" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-white">{n.label}</Link>
              </li>
            ))}
            <li><Link href="/compare" className="hover:text-white">Compare bikes</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white">Bike types</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.name}>
                <Link href={`/bikes?category=${encodeURIComponent(c.name)}`} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
            <li><Link href="/bikes?sale=1" className="hover:text-white">Deals & discounts</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white">Customer support</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={site.mapsLink} target="_blank" rel="noopener noreferrer" className="flex gap-2.5 hover:text-white">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" /> {site.address}
              </a>
            </li>
            {site.phones.map((p) => (
              <li key={p.tel}>
                <a href={`tel:${p.tel}`} className="flex gap-2.5 hover:text-white">
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand" /> {p.label}
                </a>
              </li>
            ))}
            <li className="flex gap-2.5">
              <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-whatsapp" /> WhatsApp {site.whatsappLabel}
            </li>
            <li className="flex gap-2.5">
              <span className="mt-0.5 w-4 shrink-0 text-center text-[0.6rem] font-bold text-zalo">Zalo</span>
              {site.zalo.map((z) => z.label).join(" / ")}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} Quang Nga Motorbikes Rental · motobikesrentaldanang.com</p>
          <ul className="flex flex-wrap items-center gap-2" aria-label="Accepted payments">
            {site.payments.map((p) => (
              <li key={p} className="rounded-md bg-white/5 px-2.5 py-1 font-semibold text-white/80 ring-1 ring-white/10">{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
