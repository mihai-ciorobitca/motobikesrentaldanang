"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { bikes } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", bike: "", dates: "", message: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      `Hi Quang Nga!${form.name ? ` I'm ${form.name}.` : ""}`,
      form.bike ? `Bike: ${form.bike}` : "",
      form.dates ? `Dates: ${form.dates}` : "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={submit} className="card grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
      <label>
        <span className="label">Your name</span>
        <input className="input" value={form.name} onChange={set("name")} placeholder="Jane Doe" />
      </label>
      <label>
        <span className="label">Dates</span>
        <input className="input" value={form.dates} onChange={set("dates")} placeholder="e.g. 12–18 Dec" />
      </label>
      <label className="sm:col-span-2">
        <span className="label">Bike you're interested in</span>
        <select className="input" value={form.bike} onChange={set("bike")}>
          <option value="">Not sure yet — recommend one</option>
          {[...bikes].sort((a, b) => a.name.localeCompare(b.name)).map((b) => (
            <option key={b.slug} value={`${b.name}${b.year ? ` (${b.year})` : ""}`}>
              {b.name}{b.year ? ` (${b.year})` : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="sm:col-span-2">
        <span className="label">Message</span>
        <textarea className="input min-h-32" value={form.message} onChange={set("message")} placeholder="Questions, one-way trip plans, how long you need the bike…" required />
      </label>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">Opens WhatsApp with your message ready to send.</p>
        <button type="submit" className="btn-primary">
          <Send className="size-4" /> Send on WhatsApp
        </button>
      </div>
    </form>
  );
}
