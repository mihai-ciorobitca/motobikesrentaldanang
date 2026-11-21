import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/archivo/wdth.css";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingContact } from "@/components/floating-contact";
import { CommandSearch } from "@/components/command-search";
import { CompareBar } from "@/components/compare-bar";
import { JsonLd } from "@/components/json-ld";
import { media } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Scooter & Big Bike Rental in Da Nang`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: ["motorbike rental Da Nang", "scooter rental Da Nang", "big bike rental Vietnam", "one-way motorbike rental", "Quang Nga"],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    images: [{ url: media.og, width: 1445, height: 1444 }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
          <FloatingContact />
          <CompareBar />
          <CommandSearch />
        </Providers>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "MotorcycleDealer",
            "@id": `${site.url}/#business`,
            name: site.name,
            url: site.url,
            image: `${site.url}${media.og}`,
            logo: `${site.url}/images/logo-mark.png`,
            telephone: site.phones[0].tel,
            priceRange: "₫₫",
            address: {
              "@type": "PostalAddress",
              streetAddress: "38 Le Quang Dao, Bac My Phu",
              addressLocality: "Ngu Hanh Son, Da Nang",
              addressCountry: "VN",
            },
            geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
            sameAs: [site.facebook],
            paymentAccepted: site.payments.join(", "),
          }}
        />
      </body>
    </html>
  );
}
