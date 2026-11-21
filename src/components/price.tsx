"use client";

import { useStore } from "./providers";
import { formatPrice } from "@/lib/format";

export function Price({ vnd, className }: { vnd: number; className?: string }) {
  const { currency } = useStore();
  return <span className={className}>{formatPrice(vnd, currency)}</span>;
}

export function CurrencyToggle({ dark = false }: { dark?: boolean }) {
  const { currency, setCurrency } = useStore();
  return (
    <div
      role="group"
      aria-label="Currency"
      className={`inline-flex rounded-full p-0.5 text-xs font-semibold ${dark ? "bg-white/10 ring-1 ring-white/15" : "bg-ink/5 ring-1 ring-line"}`}
    >
      {(["VND", "USD"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          className={`rounded-full px-2.5 py-1 transition ${
            currency === c ? (dark ? "bg-white text-ink" : "bg-ink text-white") : dark ? "text-white/70 hover:text-white" : "text-muted hover:text-ink"
          }`}
        >
          {c === "VND" ? "₫ VND" : "$ USD"}
        </button>
      ))}
    </div>
  );
}
