"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { GitCompareArrows, Plus, X } from "lucide-react";
import { bikes, getBike, type Bike } from "@/lib/data";
import { discountPercent } from "@/lib/format";
import { whatsappLink } from "@/lib/site";
import { Price } from "./price";
import { useStore, MAX_COMPARE } from "./providers";
import { WhatsAppIcon } from "./icons";
import { useL, useT } from "@/i18n/client";

export function CompareView() {
  const sp = useSearchParams();
  const { compare, toggleCompare, hydrated } = useStore();
  const t = useT();
  const l = useL();
  const fromUrl = useMemo(() => (sp.get("bikes") ?? "").split(",").filter((s) => getBike(s)), [sp]);

  // if the URL lists bikes that are not in the local compare list (shared link), adopt them
  useEffect(() => {
    if (!hydrated || !fromUrl.length) return;
    fromUrl.filter((s) => !compare.includes(s)).slice(0, MAX_COMPARE).forEach((s) => toggleCompare(s));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const slugs = hydrated ? compare : fromUrl;
  const list = slugs.map(getBike).filter(Boolean) as Bike[];

  const key = list.map((b) => b.slug).join(",");
  useEffect(() => {
    if (!hydrated) return;
    window.history.replaceState(null, "", l(key ? `/compare?bikes=${key}` : "/compare"));
  }, [hydrated, key, l]);

  if (!list.length) {
    return (
      <div className="card grid place-items-center px-6 py-20 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-brand-50 text-brand">
          <GitCompareArrows className="size-6" />
        </span>
        <h2 className="mt-4 text-xl font-bold">{t.compare.emptyTitle}</h2>
        <p className="mt-2 max-w-sm text-sm text-muted">{t.compare.emptyText(MAX_COMPARE)}</p>
        <Link href={l("/bikes")} className="btn-dark mt-6">{t.common.browseBikes}</Link>
      </div>
    );
  }

  const cheapest = Math.min(...list.map((b) => b.price));
  const biggest = Math.max(...list.map((b) => b.cc));
  const rows: { label: string; render: (b: Bike) => React.ReactNode }[] = [
    {
      label: t.compare.rows.price,
      render: (b) => (
        <span className={b.price === cheapest && list.length > 1 ? "font-bold text-emerald-600" : "font-bold"}>
          <Price vnd={b.price} />
          {b.originalPrice && <span className="ml-2 text-xs font-semibold text-brand">-{discountPercent(b.price, b.originalPrice)}%</span>}
        </span>
      ),
    },
    { label: t.compare.rows.weekly, render: (b) => <Price vnd={b.price * 7} /> },
    { label: t.compare.rows.engine, render: (b) => <span className={b.cc === biggest && list.length > 1 ? "font-semibold text-navy" : ""}>{b.cc}cc</span> },
    { label: t.compare.rows.transmission, render: (b) => t.transmissions[b.transmission] },
    { label: t.compare.rows.category, render: (b) => t.categories[b.category].name },
    { label: t.compare.rows.brand, render: (b) => b.brand },
    { label: t.compare.rows.year, render: (b) => b.year ?? "—" },
    { label: t.compare.rows.license, render: (b) => (b.noLicense ? t.compare.licenseNo : t.compare.licenseYes) },
    { label: t.compare.rows.photos, render: (b) => b.images.length },
  ];
  const suggestions = bikes.filter((b) => !slugs.includes(b.slug) && b.category === list[0].category).slice(0, 4);

  return (
    <div>
      <div className="no-scrollbar overflow-x-auto">
        <table className="w-full min-w-[640px] table-fixed border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="w-32 align-bottom sm:w-44" />
              {list.map((b) => (
                <th key={b.slug} className="px-2 pb-4 text-left align-top font-normal">
                  <div className="card relative overflow-hidden">
                    <button type="button" onClick={() => toggleCompare(b.slug)} className="absolute top-2 right-2 z-10 grid size-8 place-items-center rounded-full bg-white/95 shadow" aria-label={t.compare.remove(b.name)}>
                      <X className="size-4" />
                    </button>
                    <div className="relative aspect-[4/3] bg-paper">
                      <Image src={b.images[0]} alt={b.name} fill sizes="300px" className="object-cover" />
                    </div>
                    <div className="p-4">
                      <Link href={l(`/bikes/${b.slug}`)} className="font-bold hover:text-brand">{b.name}</Link>
                    </div>
                  </div>
                </th>
              ))}
              {list.length < MAX_COMPARE && (
                <th className="px-2 pb-4 align-top">
                  <Link href={l("/bikes")} className="grid aspect-[4/3] place-items-center rounded-2xl border-2 border-dashed border-line text-muted transition hover:border-ink/30 hover:text-ink">
                    <span className="flex flex-col items-center gap-2 text-sm font-semibold"><Plus className="size-6" /> {t.compare.addBike}</span>
                  </Link>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <th scope="row" className="border-t border-line py-3.5 pr-4 text-left text-xs font-semibold tracking-wide text-muted uppercase">{r.label}</th>
                {list.map((b) => (
                  <td key={b.slug} className="border-t border-line px-4 py-3.5">{r.render(b)}</td>
                ))}
                {list.length < MAX_COMPARE && <td className="border-t border-line" />}
              </tr>
            ))}
            <tr>
              <th />
              {list.map((b) => (
                <td key={b.slug} className="px-2 pt-5">
                  <a
                    href={whatsappLink(t.compare.waAsk(`${b.name}${b.year ? ` (${b.year})` : ""}`))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn w-full bg-whatsapp text-white hover:brightness-95"
                  >
                    <WhatsAppIcon className="size-4" /> {t.compare.book}
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {list.length < MAX_COMPARE && suggestions.length > 0 && (
        <div className="mt-14">
          <h2 className="text-lg font-bold">{t.compare.addAnother(t.categories[list[0].category].name)}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((b) => (
              <button key={b.slug} type="button" onClick={() => toggleCompare(b.slug)} className="chip">
                <Plus className="size-3.5" /> {b.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
