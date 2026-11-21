import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/archivo/wdth.css";
import "../globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingContact } from "@/components/floating-contact";
import { CommandSearch } from "@/components/command-search";
import { CompareBar } from "@/components/compare-bar";
import { JsonLd } from "@/components/json-ld";
import { LocaleProvider } from "@/i18n/client";
import { languageAlternates, localeNames, locales } from "@/i18n/config";
import { getDict } from "@/i18n";
import { getLocale, type LocaleParams } from "@/i18n/server";
import { media } from "@/lib/data";
import { site } from "@/lib/site";


export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await getLocale(params);
  const t = getDict(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.site.title, template: `%s · ${site.name}` },
    description: t.site.description,
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: localeNames[locale].og,
      images: [{ url: media.og, width: 1445, height: 1444 }],
    },
    twitter: { card: "summary_large_image" },
    alternates: languageAlternates(locale, "/"),
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children, params }: { children: React.ReactNode } & LocaleParams) {
  const locale = await getLocale(params);
  const t = getDict(locale);
  return (
    <html lang={localeNames[locale].htmlLang}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          {t.site.skip}
        </a>
        <LocaleProvider locale={locale}>
          <Providers>
            <Header />
            <main id="main" className="flex-1">{children}</main>
            <Footer />
            <FloatingContact />
            <CompareBar />
            <CommandSearch />
          </Providers>
        </LocaleProvider>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "MotorcycleDealer",
            "@id": `${site.url}/#business`,
            name: site.name,
            url: site.url,
            description: t.site.description,
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
