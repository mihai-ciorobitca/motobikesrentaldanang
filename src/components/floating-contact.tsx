"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "./providers";
import { MessageCircle, Phone, X } from "lucide-react";
import { FacebookIcon, WhatsAppIcon } from "./icons";
import { site, whatsappLink, zaloLink } from "@/lib/site";

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const { compare, hydrated } = useStore();
  const pathname = usePathname();
  const lifted = hydrated && compare.length > 0 && pathname !== "/compare";
  const items = [
    { label: "WhatsApp", href: whatsappLink("Hi Quang Nga! I'd like to rent a motorbike."), cls: "bg-whatsapp", icon: <WhatsAppIcon className="size-5" /> },
    { label: "Zalo", href: zaloLink(), cls: "bg-zalo", icon: <span className="text-[0.7rem] font-black">Zalo</span> },
    { label: "Messenger", href: site.facebook, cls: "bg-[#1877f2]", icon: <FacebookIcon className="size-5" /> },
    { label: "Call us", href: `tel:${site.phones[0].tel}`, cls: "bg-ink", icon: <Phone className="size-5" /> },
  ];
  return (
    <div className={`fixed right-4 z-50 flex flex-col items-end gap-3 transition-[bottom] sm:right-6 ${lifted ? "bottom-24 sm:bottom-28" : "bottom-4 sm:bottom-6"}`}>
      {open && (
        <ul className="flex flex-col items-end gap-2.5">
          {items.map((it, i) => (
            <li key={it.label} className="animate-fade-up" style={{ animationDelay: `${(items.length - i) * 35}ms` }}>
              <a
                href={it.href}
                target={it.href.startsWith("tel:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-card ring-1 ring-line">{it.label}</span>
                <span className={`grid size-12 place-items-center rounded-full text-white shadow-lift ${it.cls}`}>{it.icon}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close contact options" : "Contact us"}
        className="relative grid size-14 place-items-center rounded-full bg-brand text-white shadow-[0_12px_32px_-8px_rgb(229_22_31/0.7)] transition hover:scale-105"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-brand/40 [animation-duration:2.5s]" />}
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  );
}
