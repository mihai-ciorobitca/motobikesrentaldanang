import type { Locale } from "@/i18n/config";

/** SVG flags (emoji flags don't render on Windows) */
export function Flag({ locale, className = "h-3.5 w-5" }: { locale: Locale; className?: string }) {
  if (locale === "vi") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[3px] shadow-[0_0_0_1px_rgb(0_0_0/0.08)]`} aria-hidden="true">
        <rect width="30" height="20" fill="#DA251D" />
        <polygon fill="#FFFF00" points="15,4 16.76,9.43 22.47,9.43 17.85,12.77 19.61,18.2 15,14.85 10.39,18.2 12.15,12.77 7.53,9.43 13.24,9.43" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 30" className={`${className} shrink-0 rounded-[3px] shadow-[0_0_0_1px_rgb(0_0_0/0.08)]`} aria-hidden="true">
      <clipPath id="uk-s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="uk-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#uk-s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-t)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
