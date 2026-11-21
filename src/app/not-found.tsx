import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="font-display text-8xl font-black text-brand">404</p>
        <h1 className="mt-4 text-3xl font-black">This road doesn&apos;t go anywhere.</h1>
        <p className="mt-3 text-muted">The page you&apos;re looking for has moved or no longer exists.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/bikes" className="btn-primary">Browse bikes <ArrowRight className="size-4" /></Link>
          <Link href="/" className="btn-light">Go home</Link>
        </div>
      </div>
    </section>
  );
}
