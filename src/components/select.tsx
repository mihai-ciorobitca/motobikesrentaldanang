"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption<V extends string = string> = { value: V; label: string; icon?: React.ReactNode; hint?: string };

type Props<V extends string> = {
  value: V;
  onChange: (v: V) => void;
  options: SelectOption<V>[];
  /** Accessible name when there's no visible <label> pointing at it */
  ariaLabel?: string;
  /** id of an external label element */
  labelledBy?: string;
  variant?: "field" | "pill" | "bare" | "ghost";
  align?: "left" | "right";
  className?: string;
  buttonClassName?: string;
  /** Show only the icon + short text in the trigger (e.g. language switcher) */
  renderTrigger?: (selected: SelectOption<V> | undefined) => React.ReactNode;
  id?: string;
  dark?: boolean;
};

/** Accessible custom dropdown (listbox pattern) used instead of the native <select> everywhere on the site. */
export function Select<V extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  labelledBy,
  variant = "field",
  align = "left",
  className = "",
  buttonClassName = "",
  renderTrigger,
  id,
  dark = false,
}: Props<V>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const autoId = useId();
  const listId = `${id ?? autoId}-list`;
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    setActive(selectedIndex);
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    requestAnimationFrame(() => listRef.current?.focus());
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const choose = (i: number) => {
    const o = options[i];
    if (o) onChange(o.value);
    setOpen(false);
    btnRef.current?.focus();
  };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(options.length - 1);
    } else if (e.key === " " && Date.now() - typed.current.at < 600 && typed.current.text) {
      e.preventDefault();
      typed.current.text += " ";
      typed.current.at = Date.now();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    } else if (e.key.length === 1 && /\S/.test(e.key)) {
      e.preventDefault();
      const now = Date.now();
      typed.current.text = now - typed.current.at > 600 ? e.key.toLowerCase() : typed.current.text + e.key.toLowerCase();
      typed.current.at = now;
      const i = options.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.text));
      if (i >= 0) setActive(i);
    }
  };

  const triggerBase = {
    field:
      "flex w-full items-center justify-between gap-2 rounded-xl border border-line bg-white px-4 py-3 text-left text-sm text-ink transition hover:border-ink/40 focus-visible:border-ink focus-visible:ring-4 focus-visible:ring-ink/5 focus-visible:outline-none",
    pill:
      "flex w-full items-center justify-between gap-2 rounded-full border border-line bg-white px-4 py-3 text-left text-sm font-medium text-ink shadow-card transition hover:border-ink/40",
    bare: "flex w-full items-center justify-between gap-2 bg-transparent text-left text-sm font-medium text-ink outline-none",
    ghost: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-semibold transition ${
      dark ? "text-white/85 hover:bg-white/10 hover:text-white" : "text-ink/75 hover:bg-ink/5 hover:text-ink"
    }`,
  }[variant];

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={btnRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel ? `${ariaLabel}: ${selected?.label ?? ""}` : undefined}
        aria-labelledby={labelledBy ? `${labelledBy} ${id ?? ""}`.trim() : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          // keys pressed before focus moves into the open list still work
          if (open) return onListKey(e);
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={`${triggerBase} ${buttonClassName}`}
      >
        {renderTrigger ? (
          renderTrigger(selected)
        ) : (
          <span className="flex min-w-0 items-center gap-2">
            {selected?.icon}
            <span className="truncate">{selected?.label}</span>
          </span>
        )}
        <ChevronDown className={`size-4 shrink-0 opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${listId}-${active}`}
          onKeyDown={onListKey}
          className={`absolute top-[calc(100%+0.5rem)] z-[65] max-h-72 min-w-full animate-pop overflow-y-auto rounded-2xl bg-white p-1.5 text-ink shadow-lift ring-1 ring-line outline-none ${
            align === "right" ? "right-0" : "left-0"
          } ${variant === "ghost" ? "w-52" : ""}`}
        >
          {options.map((o, i) => {
            const isSel = o.value === value;
            return (
              <li
                key={o.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={isSel}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  i === active ? "bg-ink/[0.06]" : ""
                } ${isSel ? "font-semibold" : ""}`}
              >
                {o.icon}
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{o.label}</span>
                  {o.hint && <span className="block truncate text-xs font-normal text-muted">{o.hint}</span>}
                </span>
                <Check className={`size-4 shrink-0 text-brand ${isSel ? "" : "invisible"}`} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
