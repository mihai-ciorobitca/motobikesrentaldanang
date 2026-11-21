"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { categories } from "@/lib/data";

const budgets = [
  { label: "Any budget", min: "", max: "" },
  { label: "Under 200K₫ / day", min: "", max: "200000" },
  { label: "200K – 400K₫ / day", min: "200000", max: "400000" },
  { label: "400K – 1M₫ / day", min: "400000", max: "1000000" },
  { label: "1M₫ + / day", min: "1000000", max: "" },
];

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (type) sp.set("category", type);
    const b = budgets[budget];
    if (b.min) sp.set("min", b.min);
    if (b.max) sp.set("max", b.max);
    router.push(`/bikes${sp.toString() ? `?${sp}` : ""}`);
  };

  return (
    <form onSubmit={submit} className="grid gap-2 rounded-3xl bg-white p-2 text-ink shadow-lift ring-1 ring-black/5 sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:rounded-full">
      <label className="relative flex items-center rounded-full px-4 py-2.5 transition focus-within:bg-paper hover:bg-paper sm:py-1.5">
        <Search className="mr-3 size-5 shrink-0 text-muted" />
        <span className="flex-1">
          <span className="block text-[0.65rem] font-bold tracking-wider text-muted uppercase">Model</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="PCX, Ninja, 650cc…" className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-ink/40" />
        </span>
      </label>
      <label className="rounded-full px-4 py-2.5 transition focus-within:bg-paper hover:bg-paper sm:border-l sm:border-line sm:py-1.5">
        <span className="block text-[0.65rem] font-bold tracking-wider text-muted uppercase">Bike type</span>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full cursor-pointer bg-transparent text-sm font-medium outline-none">
          <option value="">All types</option>
          {categories.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </label>
      <label className="rounded-full px-4 py-2.5 transition focus-within:bg-paper hover:bg-paper sm:border-l sm:border-line sm:py-1.5">
        <span className="block text-[0.65rem] font-bold tracking-wider text-muted uppercase">Budget</span>
        <select value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full cursor-pointer bg-transparent text-sm font-medium outline-none">
          {budgets.map((b, i) => (
            <option key={b.label} value={i}>{b.label}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn-primary !rounded-full !px-6 !py-3.5">
        Find a bike <ArrowRight className="size-4" />
      </button>
    </form>
  );
}
