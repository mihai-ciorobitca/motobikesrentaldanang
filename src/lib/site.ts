export const site = {
  name: "Quang Nga Motorbikes Rental",
  shortName: "Quang Nga",
  tagline: "Motorbikes Rental Da Nang",
  url: "https://motobikesrentaldanang.com",
  address: "38 Le Quang Dao, Bac My Phu, Ngu Hanh Son, Da Nang",
  addressShort: "38 Le Quang Dao, Da Nang",
  geo: { lat: 16.0524209, lng: 108.2447391 },
  phones: [
    { label: "+84 827 659 829", tel: "+84827659829" },
    { label: "+84 943 696 818", tel: "+84943696818" },
  ],
  whatsapp: "84827659829",
  whatsappLabel: "+84 827 659 829",
  zalo: [
    { label: "082 765 9829", id: "0827659829" },
    { label: "0943 696 818", id: "0943696818" },
  ],
  facebook: "https://www.facebook.com/profile.php?id=100064098811106",
  mapsLink: "https://maps.google.com/?q=Quang+Nga+Motorbikes+Rental+38+Le+Quang+Dao+Da+Nang",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.2517461692455!2d108.24473909999999!3d16.052420899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314217bf4d4fc135%3A0xe30eba5564026f9e!2sQuang%20Nga%20Motorbikes%20Rental!5e0!3m2!1sen!2s!4v1734664167794!5m2!1sen!2s",
  payments: ["Visa", "MasterCard", "PayPal", "Stripe", "Cash"],
  /** Approximate VND per 1 USD, used only for the "≈ USD" display toggle. Update as needed. */
  usdRate: 26000,
  yearsExperience: 10,
} as const;

export const nav = [
  { href: "/bikes", key: "bikes" },
  { href: "/one-way-rental", key: "oneWay" },
  { href: "/about", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
] as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function zaloLink(id: string = site.zalo[0].id) {
  return `https://zalo.me/${id}`;
}
