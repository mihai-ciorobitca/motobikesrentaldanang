"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock, GitCompareArrows, Heart, Phone, ShieldCheck } from "lucide-react";
import type { Bike } from "@/lib/data";
import { discountPercent, formatPrice } from "@/lib/format";
import { site, whatsappLink, zaloLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";
import { Price } from "./price";
import { useStore } from "./providers";
import { Select } from "./select";
import { useLocale, useT } from "@/i18n/client";

/** Local "today" as YYYY-MM-DD */
const todayIso = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
/** Add days to a YYYY-MM-DD string (timezone-safe, pure UTC arithmetic) */
const addDays = (isoDate: string, n: number) => {
  const d = new Date(isoDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

export function BookingCard({ bike }: { bike: Bike }) {
  const { currency, saved, toggleSaved, compare, toggleCompare } = useStore();
  const t = useT();
  const locale = useLocale();
  const fp = (v: number, c: typeof currency = currency) => formatPrice(v, c, locale);
  // dates are set after mount so server HTML and client agree
  const [today, setToday] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  useEffect(() => {
    const t = todayIso();
    setToday(t);
    setStart(t);
    setEnd(addDays(t, 3));
  }, []);
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);

  const days = start && end ? Math.max(1, Math.round((Date.parse(end) - Date.parse(start)) / 86400000)) : 3;
  const total = days * bike.price * qty;
  const off = discountPercent(bike.price, bike.originalPrice);
  const longTerm = days >= 7;

  const message = [
    t.booking.msg.intro,
    `🏍 ${bike.name}${bike.year ? ` (${bike.year})` : ""} x${qty}`,
    start && end ? `📅 ${start} → ${end} (${t.common.days(days)})` : "",
    `💰 ${t.booking.msg.estimated}: ${fp(total, "VND")} (${fp(bike.price, "VND")}${t.common.perDay})`,
    name ? `👤 ${t.booking.msg.name}: ${name}` : "",
    t.booking.msg.available,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          {bike.originalPrice && (
            <div className="flex items-center gap-2">
              <Price vnd={bike.originalPrice} className="text-sm text-muted line-through" />
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand">{t.booking.save(off)}</span>
            </div>
          )}
          <p className="mt-0.5">
            <Price vnd={bike.price} className="font-display text-4xl font-extrabold tracking-tight" />
            <span className="text-sm text-muted"> {t.common.perDaySpaced}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => toggleSaved(bike.slug)}
            aria-pressed={saved.includes(bike.slug)}
            className="grid size-11 place-items-center rounded-full ring-1 ring-line transition hover:ring-ink/30"
            aria-label={t.booking.saveBike}
          >
            <Heart className={`size-5 ${saved.includes(bike.slug) ? "fill-brand text-brand" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(bike.slug)}
            aria-pressed={compare.includes(bike.slug)}
            className={`grid size-11 place-items-center rounded-full ring-1 transition ${compare.includes(bike.slug) ? "bg-ink text-white ring-ink" : "ring-line hover:ring-ink/30"}`}
            aria-label={t.booking.addCompare}
          >
            <GitCompareArrows className="size-5" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <label>
          <span className="label">{t.booking.pickup}</span>
          <input
            type="date"
            className="input"
            value={start}
            min={today || undefined}
            onChange={(e) => {
              if (!e.target.value) return;
              setStart(e.target.value);
              if (e.target.value >= end) setEnd(addDays(e.target.value, 1));
            }}
          />
        </label>
        <label>
          <span className="label">{t.booking.return}</span>
          <input type="date" className="input" value={end} min={start ? addDays(start, 1) : undefined} onChange={(e) => e.target.value && setEnd(e.target.value)} />
        </label>
        <div>
          <span id="bk-qty-label" className="label">{t.booking.bikes}</span>
          <Select
            id="bk-qty"
            labelledBy="bk-qty-label"
            value={String(qty)}
            onChange={(v) => setQty(Number(v))}
            options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))}
          />
        </div>
        <label>
          <span className="label">{t.booking.name}</span>
          <input className="input" placeholder={t.booking.optional} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>

      <dl className="mt-5 space-y-2 rounded-2xl bg-paper p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">
            {fp(bike.price)} × {t.common.days(days)}{qty > 1 ? ` × ${qty}` : ""}
          </dt>
          <dd className="font-medium">{fp(total)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">{t.booking.helmet}</dt>
          <dd className="font-medium text-emerald-600">{t.booking.free}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-2 text-base">
          <dt className="font-semibold">{t.booking.total}</dt>
          <dd className="font-display font-extrabold">{fp(total)}</dd>
        </div>
        {longTerm && (
          <p className="flex gap-2 rounded-xl bg-navy-50 p-3 text-xs text-navy">
            <Clock className="size-4 shrink-0" /> {days >= 28 ? t.booking.longMonth : t.booking.longWeek}
          </p>
        )}
      </dl>

      <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="btn mt-5 w-full bg-whatsapp py-3.5 text-white hover:brightness-95">
        <WhatsAppIcon className="size-5" /> {t.common.bookOnWhatsApp}
      </a>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        <a href={zaloLink()} target="_blank" rel="noopener noreferrer" className="btn bg-zalo text-white hover:brightness-95">
          Zalo
        </a>
        <a href={`tel:${site.phones[0].tel}`} className="btn-light">
          <Phone className="size-4" /> {t.common.call}
        </a>
      </div>
      <ul className="mt-5 space-y-2 text-xs text-muted">
        <li className="flex gap-2"><ShieldCheck className="size-4 shrink-0 text-emerald-600" /> {t.booking.requestNote}</li>
        <li className="flex gap-2"><CalendarDays className="size-4 shrink-0 text-emerald-600" /> {t.booking.flexNote}</li>
      </ul>
    </div>
  );
}
