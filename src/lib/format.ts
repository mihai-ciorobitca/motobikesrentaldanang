import { site } from "./site";

export type Currency = "VND" | "USD";

const vnd = new Intl.NumberFormat("en-US");

export function formatPrice(amountVnd: number, currency: Currency = "VND") {
  if (currency === "USD") {
    const usd = amountVnd / site.usdRate;
    return `≈ $${usd < 10 ? usd.toFixed(1) : Math.round(usd)}`;
  }
  return `${vnd.format(amountVnd)}₫`;
}

export function formatPriceShort(amountVnd: number) {
  if (amountVnd >= 1_000_000) {
    const m = amountVnd / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(1)}M₫`;
  }
  return `${Math.round(amountVnd / 1000)}K₫`;
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function discountPercent(price: number, original?: number | null) {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}
