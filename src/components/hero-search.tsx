"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { categories } from "@/lib/data";
import { Select } from "./select";
import { useL, useT } from "@/i18n/client";

const budgetRanges = [
  { min: "", max: "" },
  { min: "", max: "200000" },
  { min: "200000", max: "400000" },
  { min: "400000", max: "1000000" },
  { min: "1000000", max: "" },
];

export function HeroSearch() {
  const router = useRouter();
  const t = useT();
  const l = useL();
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("0");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (type) sp.set("category", type);
    const b = budgetRanges[Number(budget)];
    if (b.min) sp.set("min", b.min);
    if (b.max) sp.set("max", b.max);
    router.push(l(`/bikes${sp.toString() ? `?${sp}` : ""}`));
  };

  const cell = "rounded-full px-4 py-2.5 transition focus-within:bg-paper hover:bg-paper sm:py-1.5";
  const caption = "block text-[0.65rem] font-bold tracking-wider text-muted uppercase";

  return (
    <form onSubmit={submit} className="grid gap-2 rounded-3xl bg-white p-2 text-ink shadow-lift ring-1 ring-black/5 sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:rounded-full">
      <label className={`relative flex items-center ${cell}`}>
        <Search className="mr-3 size-5 shrink-0 text-muted" />
        <span className="flex-1">
          <span className={caption}>{t.heroSearch.model}</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.heroSearch.modelPh} className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-ink/40" />
        </span>
      </label>
      <div className={`${cell} sm:border-l sm:border-line`}>
        <span id="hs-type-label" className={caption}>{t.heroSearch.type}</span>
        <Select
          id="hs-type"
          variant="bare"
          labelledBy="hs-type-label"
          value={type}
          onChange={setType}
          options={[{ value: "", label: t.heroSearch.allTypes }, ...categories.map((c) => ({ value: c.name as string, label: t.categories[c.name].name }))]}
        />
      </div>
      <div className={`${cell} sm:border-l sm:border-line`}>
        <span id="hs-budget-label" className={caption}>{t.heroSearch.budget}</span>
        <Select
          id="hs-budget"
          variant="bare"
          labelledBy="hs-budget-label"
          value={budget}
          onChange={setBudget}
          options={t.heroSearch.budgets.map((label, i) => ({ value: String(i), label }))}
        />
      </div>
      <button type="submit" className="btn-primary !rounded-full !px-6 !py-3.5">
        {t.heroSearch.find} <ArrowRight className="size-4" />
      </button>
    </form>
  );
}
