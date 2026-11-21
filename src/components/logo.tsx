import Image from "next/image";
import Link from "next/link";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Quang Nga Motorbikes Rental – home">
      <Image src="/images/logo-mark.png" alt="" width={40} height={40} priority className="size-10 transition-transform duration-500 group-hover:rotate-[-12deg]" />
      <span className="leading-none">
        <span className="block font-display text-[1.15rem] font-black tracking-tight" style={{ fontStretch: "118%" }}>
          <span className="text-brand">QUANG</span>
          <span className={dark ? "text-white" : "text-navy"}>NGA</span>
        </span>
        <span className={`mt-1 block text-[0.55rem] font-semibold tracking-[0.1em] whitespace-nowrap uppercase sm:text-[0.6rem] sm:tracking-[0.2em] ${dark ? "text-white/60" : "text-muted"}`}>
          Motorbikes Rental Da Nang
        </span>
      </span>
    </Link>
  );
}
