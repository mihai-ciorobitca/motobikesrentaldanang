import type { NextConfig } from "next";
import bikes from "./src/data/bikes.json";
import posts from "./src/data/posts.json";

// Old WordPress product IDs that were used as slugs on the previous site
const legacyBikeSlugs: Record<string, string> = {
  "29156": "honda-cb650-e-clutch-2025",
  "29090": "honda-adv-160-abs-2025",
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  // Keep old WordPress URLs working (and their Google ranking) after migration
  async redirects() {
    return [
      { source: "/pricing", destination: "/bikes", permanent: true },
      { source: "/cua-hang", destination: "/bikes", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/faqs", destination: "/faq", permanent: true },
      { source: "/categories/blogs", destination: "/blog", permanent: true },
      { source: "/category/:path*", destination: "/blog", permanent: true },
      ...Object.entries(legacyBikeSlugs).map(([from, to]) => ({
        source: `/pricing/${from}`,
        destination: `/bikes/${to}`,
        permanent: true,
      })),
      ...bikes.map((b) => ({ source: `/pricing/${b.slug}`, destination: `/bikes/${b.slug}`, permanent: true })),
      ...posts.map((p) => ({ source: `/${p.slug}`, destination: `/blog/${p.slug}`, permanent: true })),
      {
        source: "/%f0%9f%9a%a8-latest-news-from-quang-nga-motorbike-rental-%f0%9f%9a%a8",
        destination: "/blog/latest-news-from-quang-nga-motorbike-rental",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
