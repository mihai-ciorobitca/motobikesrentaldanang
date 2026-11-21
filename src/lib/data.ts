import bikesJson from "@/data/bikes.json";
import postsJson from "@/data/posts.json";
import reviewsJson from "@/data/reviews.json";
import mediaJson from "@/data/media.json";

export type Block = { t: "h" | "p" | "li" | "img"; v: string };

export type Transmission = "Automatic" | "Semi-Automatic" | "Manual";
export type Category = "Scooter" | "Big Bike" | "Sport & Naked" | "Semi-Automatic" | "50cc (No License)";

export type Bike = {
  slug: string;
  name: string;
  originalName: string;
  brand: string;
  cc: number;
  year: string | null;
  transmission: Transmission;
  category: Category;
  price: number;
  originalPrice: number | null;
  typeLabel: string;
  images: string[];
  noLicense: boolean;
  featured: boolean;
};

export type Post = { slug: string; title: string; date: string; cover: string | null; blocks: Block[] };
export type Review = { name: string; time: number; stars: number; text: string };

export const bikes = bikesJson as Bike[];
export const posts = postsJson as Post[];
export const reviews = (reviewsJson as Review[]).filter((r) => r.text.length > 12);
export const media = mediaJson as {
  hero: string;
  about: string;
  logo: string;
  logoAlt: string;
  banner: string;
  darkBike: string;
  reviewsBg: string;
  pageBg: string;
  og: string;
  gallery: string[];
  store: string[];
};
export const categories: { name: Category; blurb: string; image: string }[] = [
  { name: "Scooter", blurb: "Easy automatic city rides", image: "/images/2025-12-edit-honda-pcx-moi-4-17310347204612071262001-1.webp" },
  { name: "Big Bike", blurb: "300cc – 650cc power", image: "/images/2026-01-cb-650cc-new-1.webp" },
  { name: "Sport & Naked", blurb: "Manual 150cc fun", image: "/images/2024-12-gia-xe-yamaha-tfx-15-6236.webp" },
  { name: "Semi-Automatic", blurb: "Classic Vietnam tourer", image: bikesJson.find((b) => b.category === "Semi-Automatic")?.images[0] ?? "" },
  { name: "50cc (No License)", blurb: "No motorbike license needed", image: bikesJson.find((b) => b.category === "50cc (No License)")?.images[0] ?? "" },
];

export const brands = Array.from(new Set(bikes.map((b) => b.brand))).sort();
export const priceBounds = {
  min: Math.min(...bikes.map((b) => b.price)),
  max: Math.max(...bikes.map((b) => b.price)),
};

export function getBike(slug: string) {
  return bikes.find((b) => b.slug === slug);
}

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function relatedBikes(bike: Bike, n = 4) {
  return bikes
    .filter((b) => b.slug !== bike.slug)
    .map((b) => ({
      b,
      score:
        (b.category === bike.category ? 3 : 0) +
        (b.transmission === bike.transmission ? 1 : 0) +
        (b.brand === bike.brand ? 1 : 0) -
        Math.abs(b.price - bike.price) / 500000,
    }))
    .sort((a, z) => z.score - a.score)
    .slice(0, n)
    .map((x) => x.b);
}

export const featuredBikes = bikes.filter((b) => b.featured);
export const dealBikes = bikes
  .filter((b) => b.originalPrice)
  .sort((a, z) => (z.originalPrice! - z.price) / z.originalPrice! - (a.originalPrice! - a.price) / a.originalPrice!);

export function postExcerpt(p: Post, len = 150) {
  const text = p.blocks.filter((b) => b.t !== "img").map((b) => b.v).join(" ");
  return text.length > len ? text.slice(0, len).replace(/\s+\S*$/, "") + "…" : text;
}
