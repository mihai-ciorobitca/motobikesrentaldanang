"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { bikes } from "@/lib/data";
import { whatsappLink } from "@/lib/site";
import { Select } from "./select";
import { useT } from "@/i18n/client";

export function ContactForm() {
  const t = useT();
  const [form, setForm] = useState({ name: "", bike: "", dates: "", message: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      t.contactForm.hello(form.name),
      form.bike ? `${t.contactForm.bikeLine}: ${form.bike}` : "",
      form.dates ? `${t.contactForm.datesLine}: ${form.dates}` : "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  };

  const bikeOptions = [
    { value: "", label: t.contactForm.notSure },
    ...[...bikes]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((b) => {
        const label = `${b.name}${b.year ? ` (${b.year})` : ""}`;
        return { value: label, label, hint: `${b.cc}cc · ${t.transmissions[b.transmission]}` };
      }),
  ];

  return (
    <form onSubmit={submit} className="card grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
      <label>
        <span className="label">{t.contactForm.name}</span>
        <input className="input" value={form.name} onChange={set("name")} placeholder={t.contactForm.namePh} />
      </label>
      <label>
        <span className="label">{t.contactForm.dates}</span>
        <input className="input" value={form.dates} onChange={set("dates")} placeholder={t.contactForm.datesPh} />
      </label>
      <div className="sm:col-span-2">
        <span id="cf-bike-label" className="label">{t.contactForm.bike}</span>
        <Select id="cf-bike" labelledBy="cf-bike-label" value={form.bike} onChange={(v) => setForm((f) => ({ ...f, bike: v }))} options={bikeOptions} />
      </div>
      <label className="sm:col-span-2">
        <span className="label">{t.contactForm.message}</span>
        <textarea className="input min-h-32" value={form.message} onChange={set("message")} placeholder={t.contactForm.messagePh} required />
      </label>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">{t.contactForm.note}</p>
        <button type="submit" className="btn-primary">
          <Send className="size-4" /> {t.contactForm.send}
        </button>
      </div>
    </form>
  );
}
