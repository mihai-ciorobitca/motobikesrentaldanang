# Quang Nga Motorbikes Rental — Next.js site

A modern, fast rebuild of motobikesrentaldanang.com. It uses the shop's own photos, bikes, prices and text.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Requires Node.js 20.9+.

## Deploying

- **Vercel (easiest):** import the folder or repo, then deploy. No settings or environment variables are needed.
- **Any Node host / VPS:** run `npm run build`, then `npm start` (set `PORT` to change the port). Put Nginx or Caddy in front for HTTPS.

All 75 pages are pre-rendered at build time. Images are pre-compressed WebP, and Next.js serves them as AVIF/WebP at the right size for each device.

## Features

- **Bike finder (`/bikes`)**
  - Instant search with typo-friendly matching ("pcx", "650", "manual", "honda").
  - Filters: bike type, transmission, engine size, brand, price range slider with presets, on sale, no license needed, saved bikes.
  - Each filter option shows how many bikes it would match.
  - 7 sort options and a grid/list view.
  - Filters are saved in the URL, so a search can be shared as a link.
  - On mobile, filters open in a bottom sheet.
- **Search anywhere:** press ⌘K / Ctrl+K or `/` to open quick search across bikes and articles.
- **Bike pages:**
  - Photo gallery with a full-screen viewer (swipe on mobile).
  - Specs, description and similar bikes.
  - Rental calculator: choose dates and number of bikes to get an estimated total.
  - "Book on WhatsApp" opens WhatsApp with the bike, dates and price already filled in. Zalo and phone buttons are also there.
- **Compare:** compare up to 3 bikes side by side (price, weekly cost, engine and more). Compare links can be shared.
- **Saved bikes:** heart any bike; saved bikes are stored in the browser.
- **Currency toggle:** VND or approximate USD. Change the rate in `src/lib/site.ts` (`usdRate`).
- **Pages:** Home, Bikes, One-Way Rental (routes and rates), About (shop and customer photo galleries), Blog, FAQ, Contact (map and a WhatsApp message form).
- **Floating contact button:** WhatsApp, Zalo, Messenger and Call.
- **SEO:**
  - Per-page titles and descriptions, sitemap.xml and robots.txt.
  - Structured data: LocalBusiness, Product, FAQ and BlogPosting.
  - Permanent redirects from every old WordPress URL (`/pricing/...`, `/about-us`, old blog paths) so Google rankings carry over.

## Editing content

All content is plain JSON or TypeScript. No database is needed.

| What | File |
| --- | --- |
| Bikes, prices, sale prices, photos, descriptions | `src/data/bikes.json` |
| Blog posts | `src/data/posts.json` |
| Google reviews shown on the site | `src/data/reviews.json` |
| Phone numbers, WhatsApp, Zalo, address, map, USD rate | `src/lib/site.ts` |
| FAQ, one-way rental rates, "why choose us" | `src/lib/content.ts` |
| Colors and fonts | `src/app/globals.css` (`@theme`) |

**Updating a bike:**

- To change a bike's price, edit `price`.
- To show a discount, set `originalPrice` to the old price. Use `null` for no discount.

**Adding a bike:**

1. Copy an existing entry in `bikes.json`.
2. Give it a unique `slug`.
3. Put its photos in `public/images/` and list their paths in `images`.
4. Add each new photo's size to `src/data/image-sizes.json` (`"/images/file.webp": [width, height]`) so it displays without layout shift.

`category` must be one of: `Scooter`, `Big Bike`, `Sport & Naked`, `Semi-Automatic`, `50cc (No License)`.

## Important: the old WordPress site

While migrating, we found that the old site's sitemap lists **about 1,760 injected casino/gambling spam posts** (for example `/best-online-casinos-uk/`). This usually means the WordPress install has been compromised.

None of that content was carried over. Once this site replaces WordPress, those URLs will return 404 and drop out of Google over time.

Until then, we recommend:

- changing the WordPress and hosting passwords;
- removing unknown admin users and plugins;
- requesting removal of the spam URLs in Google Search Console.
