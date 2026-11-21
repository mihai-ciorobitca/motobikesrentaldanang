import type { Bike, Category, Transmission } from "./data";

export type SortKey = "recommended" | "price-asc" | "price-desc" | "cc-asc" | "cc-desc" | "discount" | "name";

export const sortKeys: SortKey[] = ["recommended", "price-asc", "price-desc", "cc-desc", "cc-asc", "discount", "name"];

export const engineBuckets = [
  { id: "50", label: "50cc", min: 0, max: 50 },
  { id: "110-125", label: "110–125cc", min: 51, max: 125 },
  { id: "150-160", label: "150–160cc", min: 126, max: 199 },
  { id: "300-400", label: "300–400cc", min: 200, max: 449 },
  { id: "500+", label: "500cc +", min: 450, max: 10000 },
] as const;

export type Filters = {
  q: string;
  categories: Category[];
  transmissions: Transmission[];
  brands: string[];
  engines: string[];
  minPrice: number | null;
  maxPrice: number | null;
  sale: boolean;
  noLicense: boolean;
  saved: boolean;
  sort: SortKey;
};

export const emptyFilters: Filters = {
  q: "",
  categories: [],
  transmissions: [],
  brands: [],
  engines: [],
  minPrice: null,
  maxPrice: null,
  sale: false,
  noLicense: false,
  saved: false,
  sort: "recommended",
};

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
const num = (v: string | null) => (v && !Number.isNaN(Number(v)) ? Number(v) : null);

export function parseFilters(sp: URLSearchParams): Filters {
  const sort = sp.get("sort") as SortKey | null;
  return {
    q: sp.get("q") ?? "",
    categories: list(sp.get("category")) as Category[],
    transmissions: list(sp.get("type")) as Transmission[],
    brands: list(sp.get("brand")),
    engines: list(sp.get("cc")),
    minPrice: num(sp.get("min")),
    maxPrice: num(sp.get("max")),
    sale: sp.get("sale") === "1",
    noLicense: sp.get("nolicense") === "1",
    saved: sp.get("saved") === "1",
    sort: sort && sortKeys.includes(sort) ? sort : "recommended",
  };
}

export function filtersToParams(f: Filters) {
  const sp = new URLSearchParams();
  if (f.q.trim()) sp.set("q", f.q.trim());
  if (f.categories.length) sp.set("category", f.categories.join(","));
  if (f.transmissions.length) sp.set("type", f.transmissions.join(","));
  if (f.brands.length) sp.set("brand", f.brands.join(","));
  if (f.engines.length) sp.set("cc", f.engines.join(","));
  if (f.minPrice != null) sp.set("min", String(f.minPrice));
  if (f.maxPrice != null) sp.set("max", String(f.maxPrice));
  if (f.sale) sp.set("sale", "1");
  if (f.noLicense) sp.set("nolicense", "1");
  if (f.saved) sp.set("saved", "1");
  if (f.sort !== "recommended") sp.set("sort", f.sort);
  return sp;
}

export function activeFilterCount(f: Filters) {
  return (
    f.categories.length +
    f.transmissions.length +
    f.brands.length +
    f.engines.length +
    (f.minPrice != null || f.maxPrice != null ? 1 : 0) +
    (f.sale ? 1 : 0) +
    (f.noLicense ? 1 : 0) +
    (f.saved ? 1 : 0)
  );
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Searchable text for a bike, including useful synonyms */
export function bikeHaystack(b: Bike) {
  const extra = [
    b.transmission === "Automatic" ? "scooter auto automatic" : "",
    b.transmission === "Manual" ? "manual clutch gear" : "",
    b.transmission === "Semi-Automatic" ? "semi auto semi-automatic" : "",
    b.cc >= 300 ? "big bike large displacement" : "",
    b.noLicense ? "no license 50cc free go" : "",
    b.originalPrice ? "sale deal discount" : "",
  ];
  return norm([b.name, b.originalName, b.brand, b.category, `${b.cc}cc`, `${b.cc}`, b.year ?? "", ...extra].join(" "));
}

export function matchesQuery(b: Bike, q: string) {
  const tokens = norm(q).split(" ").filter(Boolean);
  if (!tokens.length) return true;
  const hay = bikeHaystack(b);
  return tokens.every((t) => hay.includes(t) || hay.includes(t.replace(/cc$/, "")));
}

export function applyFilters(all: Bike[], f: Filters, savedSlugs: string[] = []) {
  const res = all.filter((b) => {
    if (!matchesQuery(b, f.q)) return false;
    if (f.categories.length && !f.categories.includes(b.category)) return false;
    if (f.transmissions.length && !f.transmissions.includes(b.transmission)) return false;
    if (f.brands.length && !f.brands.includes(b.brand)) return false;
    if (f.engines.length) {
      const ok = f.engines.some((id) => {
        const bucket = engineBuckets.find((e) => e.id === id);
        return bucket ? b.cc >= bucket.min && b.cc <= bucket.max : false;
      });
      if (!ok) return false;
    }
    if (f.minPrice != null && b.price < f.minPrice) return false;
    if (f.maxPrice != null && b.price > f.maxPrice) return false;
    if (f.sale && !b.originalPrice) return false;
    if (f.noLicense && !b.noLicense) return false;
    if (f.saved && !savedSlugs.includes(b.slug)) return false;
    return true;
  });
  const disc = (b: Bike) => (b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0);
  const sorters: Record<SortKey, (a: Bike, z: Bike) => number> = {
    recommended: (a, z) => Number(z.featured) - Number(a.featured) || disc(z) - disc(a) || a.price - z.price,
    "price-asc": (a, z) => a.price - z.price,
    "price-desc": (a, z) => z.price - a.price,
    "cc-asc": (a, z) => a.cc - z.cc || a.price - z.price,
    "cc-desc": (a, z) => z.cc - a.cc || z.price - a.price,
    discount: (a, z) => disc(z) - disc(a),
    name: (a, z) => a.name.localeCompare(z.name),
  };
  return [...res].sort(sorters[f.sort]);
}
