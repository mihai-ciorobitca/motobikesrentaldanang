import { site } from "./site";

/** FAQ – compiled from information published on the original website and blog */
export const faqs: { q: string; a: string }[] = [
  {
    q: "What do I need to rent a motorbike?",
    a: "Just your passport (or another photo ID). If you don't want to leave your papers with us, you can leave a cash deposit instead — from 1,000,000₫ depending on the bike — which is returned in full when you bring the bike back.",
  },
  {
    q: "Do I need a driving license?",
    a: "For bikes over 50cc you should carry a valid motorbike license — an International Driving Permit (IDP) is recommended for travellers. Our 50cc Kymco scooters (Like / Candy) can be ridden without a motorbike license.",
  },
  {
    q: "Is a helmet included?",
    a: "Yes. Every rental includes a free helmet and essential safety gear, and you're free to choose whichever helmet fits you best. A phone holder can be fitted on request.",
  },
  {
    q: "What about fuel?",
    a: "Each bike leaves the shop with about 1 litre in the tank. You can refuel at any petrol station (ask for RON 95), or buy extra fuel from us — it's cheaper than the station.",
  },
  {
    q: "How long can I rent for?",
    a: "From a single day to a full month or longer. Weekly and monthly rentals get better rates — send us your dates on WhatsApp and we'll quote you.",
  },
  {
    q: "Can I return the bike in another city?",
    a: "Yes — our one-way service lets you rent in Da Nang and drop off in Hue, Hoi An, Nha Trang, Da Lat, Ho Chi Minh City or Hanoi. See the One-Way Rental page for rates.",
  },
  {
    q: "What if something goes wrong on the road?",
    a: "Our team is available 24/7, from booking to roadside assistance. Call or message us any time and we'll help you sort it out quickly.",
  },
  {
    q: "How do I book and pay?",
    a: `Choose a bike on this site and tap “Book on WhatsApp” — your dates and bike are filled in for you. You can also call or message us on Zalo. We accept ${site.payments.slice(0, -1).join(", ")} and cash.`,
  },
  {
    q: "Are the bikes well maintained?",
    a: "Every bike is checked by our mechanics as soon as it's returned — spokes, rims, tyres, oil and more — before it goes back out. Most of our fleet are recent models.",
  },
  {
    q: "Any tips for riding in Da Nang?",
    a: "Turn the key off whenever you stop (to protect the battery), and always park in a proper, safe spot. Ask us for route ideas — Son Tra Peninsula, Hai Van Pass and Hoi An are favourites.",
  },
];

/** One-way rental – from the shop's "One Way Rental Services" post (Jan 2025). Rates are indicative. */
export const oneWay = {
  destinations: [
    { city: "Hue", note: "Via the famous Hai Van Pass" },
    { city: "Hoi An", note: "Ancient town, short coastal ride" },
    { city: "Nha Trang", note: "Beach city down the coast" },
    { city: "Da Lat", note: "Cool highland city" },
    { city: "Ho Chi Minh City", note: "End your trip in Saigon" },
    { city: "Hanoi", note: "Ride north to the capital" },
  ],
  rates: [
    { name: "Semi-automatic bikes", price: 450000, note: "Easy-to-ride bikes for shorter trips" },
    { name: "Mid-range automatic", price: 450000, note: "Comfortable scooters for day trips" },
    { name: "High-end automatic", price: 700000, note: "Premium scooters for longer journeys" },
    { name: "300cc big bike", price: 1100000, note: "More power for highways and passes" },
    { name: "500cc big bike", price: 1400000, note: "The ultimate long-distance ride" },
  ],
  extras: [
    { name: "Go anywhere (long-distance trips)", price: 1200000, unit: "one-off" },
    { name: "Luggage transfer", price: 100000, unit: "per bag" },
  ],
};

export const perks = [
  { title: "Affordable rates", text: "Transparent daily prices with no hidden fees — and regular deals on popular bikes." },
  { title: "Wide range of bikes", text: "From 50cc scooters to 650cc big bikes — one of Da Nang's largest big-bike fleets." },
  { title: "Flexible periods", text: "Rent for a day, a week or a full month. Plans that fit your travel schedule." },
  { title: "24/7 support", text: "From booking to roadside assistance, our team is always reachable." },
  { title: "Free helmet & gear", text: "Every rental includes a free helmet and essential safety gear." },
  { title: "Easy booking", text: "Book online, on WhatsApp, Zalo or by phone in just a few minutes." },
] as const;
