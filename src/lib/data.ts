export type DestinationType =
  | "Beach"
  | "Mountains"
  | "City"
  | "Adventure"
  | "International"
  | "Domestic"

export interface Destination {
  slug: string
  name: string
  country: string
  types: DestinationType[]
  blurb: string
  bestTime: string
  from: number
  image: string
  alt: string
  /** package slug to "View details" */
  featured?: boolean
}

export const destinationTypes: DestinationType[] = [
  "Beach",
  "Mountains",
  "City",
  "Adventure",
  "International",
  "Domestic",
]

export const destinations: Destination[] = [
  {
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    types: ["Beach", "Adventure", "International"],
    blurb: "Rice terraces, cliff-top temples and surf beaches, all within an easy scooter ride.",
    bestTime: "Apr – Oct",
    from: 58999,
    image: "1537996194471-e657df975ab4",
    alt: "Stone temple gate framing a green volcano in Bali",
    featured: true,
  },
  {
    slug: "maldives",
    name: "Maldives",
    country: "Maldives",
    types: ["Beach", "International"],
    blurb: "Overwater villas, glass-clear lagoons and house reefs you can snorkel from your deck.",
    bestTime: "Nov – Apr",
    from: 89999,
    image: "1540202404-a2f29016b523",
    alt: "Overwater villas over turquoise lagoon in the Maldives",
    featured: true,
  },
  {
    slug: "santorini",
    name: "Santorini",
    country: "Greece",
    types: ["Beach", "City", "International"],
    blurb: "Whitewashed lanes, blue domes and sunsets worth planning the whole day around.",
    bestTime: "May – Oct",
    from: 112000,
    image: "1570077188670-e3a8d69ac5ff",
    alt: "White buildings with blue domes above the Aegean Sea in Santorini",
    featured: true,
  },
  {
    slug: "kerala",
    name: "Kerala",
    country: "India",
    types: ["Beach", "Domestic"],
    blurb: "Houseboats on quiet backwaters, spice-scented hills and slow, generous meals.",
    bestTime: "Sep – Mar",
    from: 24999,
    image: "1602216056096-3b40cc0c9944",
    alt: "Traditional houseboat gliding through Kerala backwaters",
    featured: true,
  },
  {
    slug: "ladakh",
    name: "Ladakh",
    country: "India",
    types: ["Mountains", "Adventure", "Domestic"],
    blurb: "High-altitude passes, turquoise lakes and monasteries above the clouds.",
    bestTime: "Jun – Sep",
    from: 32999,
    image: "1506905925346-21bda4d32df4",
    alt: "Snow-capped Himalayan peaks at dusk",
  },
  {
    slug: "switzerland",
    name: "Swiss Alps",
    country: "Switzerland",
    types: ["Mountains", "Adventure", "International"],
    blurb: "Scenic trains, alpine lakes and villages that look painted onto the hillside.",
    bestTime: "Jun – Sep, Dec – Feb",
    from: 145000,
    image: "1501785888041-af3ef285b470",
    alt: "Alpine lake beneath jagged mountain peaks",
  },
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    types: ["City", "International"],
    blurb: "Café mornings, river walks and museums, with the Eiffel Tower lighting up your evening.",
    bestTime: "Apr – Jun, Sep – Oct",
    from: 125000,
    image: "1502602898657-3e91760cbb34",
    alt: "Eiffel Tower rising above Paris rooftops",
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    country: "Japan",
    types: ["City", "Adventure", "International"],
    blurb: "Neon alleys, quiet shrines and the best meal you'll have all year, usually at a counter for six.",
    bestTime: "Mar – May, Oct – Nov",
    from: 115000,
    image: "1503899036084-c55cdd92da26",
    alt: "Tokyo street glowing with neon signs at night",
  },
  {
    slug: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    types: ["City", "Adventure", "International"],
    blurb: "Record-breaking skylines, desert dunes at sunset and shopping that stays cool.",
    bestTime: "Nov – Mar",
    from: 49999,
    image: "1512453979798-5ea266f8880c",
    alt: "Dubai skyline with tall glass towers at dusk",
  },
  {
    slug: "jaipur",
    name: "Jaipur",
    country: "India",
    types: ["City", "Domestic"],
    blurb: "Pink palaces, bazaars full of block-print fabric and rooftop dinners with fort views.",
    bestTime: "Oct – Mar",
    from: 21999,
    image: "1477587458883-47145ed94245",
    alt: "Ornate pink sandstone palace facade in Jaipur",
  },
  {
    slug: "phuket",
    name: "Phuket & Krabi",
    country: "Thailand",
    types: ["Beach", "Adventure", "International"],
    blurb: "Longtail boats, limestone islands and night markets that smell incredible.",
    bestTime: "Nov – Apr",
    from: 39999,
    image: "1528181304800-259b08848526",
    alt: "Longtail boats on turquoise water near Thai limestone cliffs",
  },
  {
    slug: "goa",
    name: "Goa",
    country: "India",
    types: ["Beach", "Domestic"],
    blurb: "Beach shacks, Portuguese lanes and sunsets with a cold drink and nowhere to be.",
    bestTime: "Nov – Feb",
    from: 18999,
    image: "1519046904884-53103b34b206",
    alt: "Golden sand beach with gentle waves in Goa",
  },
]

/* ------------------------------------------------------------------ */

export type Audience = "couples" | "family" | "friends"

export interface TravelPackage {
  slug: string
  title: string
  destination: string
  audience: Audience
  nights: number
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  image: string
  alt: string
  summary: string
  includes: { hotel: string; flights: string; meals: string; sightseeing: string }
  tag?: string
}

export const audiences: { value: Audience; label: string }[] = [
  { value: "couples", label: "Couples" },
  { value: "family", label: "Family" },
  { value: "friends", label: "Solo & Friends" },
]

export const packages: TravelPackage[] = [
  /* couples */
  {
    slug: "bali-honeymoon",
    title: "Bali Honeymoon Escape",
    destination: "Bali, Indonesia",
    audience: "couples",
    nights: 6,
    price: 68999,
    oldPrice: 78999,
    rating: 4.9,
    reviews: 312,
    image: "1537996194471-e657df975ab4",
    alt: "Couple-friendly temple gate and rice terraces in Bali",
    summary: "Private pool villa in Ubud, Nusa Penida day trip and a candle-lit beach dinner.",
    includes: {
      hotel: "6 nights, private pool villa",
      flights: "Return economy flights",
      meals: "Daily breakfast + 2 dinners",
      sightseeing: "Temples, Tegalalang, Nusa Penida",
    },
    tag: "Best seller",
  },
  {
    slug: "maldives-retreat",
    title: "Maldives Overwater Retreat",
    destination: "Maldives",
    audience: "couples",
    nights: 4,
    price: 124999,
    rating: 4.9,
    reviews: 187,
    image: "1540202404-a2f29016b523",
    alt: "Overwater villa deck above clear Maldivian lagoon",
    summary: "A water villa, a sandbank picnic and a sunset cruise. That's the whole plan.",
    includes: {
      hotel: "4 nights, overwater villa",
      flights: "Return flights + speedboat",
      meals: "Half board",
      sightseeing: "Sunset cruise, snorkel trip",
    },
    tag: "Most romantic",
  },
  {
    slug: "santorini-sunsets",
    title: "Santorini Sunset Romance",
    destination: "Santorini, Greece",
    audience: "couples",
    nights: 5,
    price: 138000,
    rating: 4.8,
    reviews: 142,
    image: "1570077188670-e3a8d69ac5ff",
    alt: "Blue-domed church above the Aegean Sea at Santorini",
    summary: "Caldera-view suite in Oia, a catamaran sail and a wine tasting on volcanic soil.",
    includes: {
      hotel: "5 nights, caldera-view suite",
      flights: "Return flights via Athens",
      meals: "Daily breakfast + 1 tasting dinner",
      sightseeing: "Oia, catamaran sail, winery",
    },
  },
  /* family */
  {
    slug: "kerala-backwaters",
    title: "Kerala Backwaters & Hills",
    destination: "Kerala, India",
    audience: "family",
    nights: 6,
    price: 32999,
    oldPrice: 37999,
    rating: 4.8,
    reviews: 428,
    image: "1602216056096-3b40cc0c9944",
    alt: "Houseboat on calm Kerala backwaters",
    summary: "Munnar tea hills, a private houseboat night in Alleppey and an elephant sanctuary visit.",
    includes: {
      hotel: "5 nights hotel + 1 night houseboat",
      flights: "Airport transfers, private car",
      meals: "Breakfast + houseboat meals",
      sightseeing: "Tea estates, backwaters, spice walk",
    },
    tag: "Family favourite",
  },
  {
    slug: "dubai-family",
    title: "Dubai Family Fun",
    destination: "Dubai, UAE",
    audience: "family",
    nights: 5,
    price: 59999,
    rating: 4.7,
    reviews: 263,
    image: "1512453979798-5ea266f8880c",
    alt: "Dubai skyline seen from the waterfront",
    summary: "Theme parks, a desert safari with dinner and a ride up the tallest tower.",
    includes: {
      hotel: "5 nights, family room near Marina",
      flights: "Return economy flights",
      meals: "Daily breakfast + desert dinner",
      sightseeing: "Burj Khalifa, desert safari, theme park pass",
    },
  },
  {
    slug: "rajasthan-royal",
    title: "Rajasthan Royal Trail",
    destination: "Jaipur & Udaipur, India",
    audience: "family",
    nights: 6,
    price: 38999,
    rating: 4.8,
    reviews: 205,
    image: "1477587458883-47145ed94245",
    alt: "Ornate sandstone palace in Rajasthan",
    summary: "Forts, palaces and a heritage-hotel stay your kids will talk about for years.",
    includes: {
      hotel: "6 nights, heritage hotels",
      flights: "Private car with driver",
      meals: "Daily breakfast + 2 dinners",
      sightseeing: "Amber Fort, City Palace, lake cruise",
    },
  },
  /* friends */
  {
    slug: "ladakh-road-trip",
    title: "Ladakh Road Trip",
    destination: "Ladakh, India",
    audience: "friends",
    nights: 7,
    price: 36999,
    oldPrice: 41999,
    rating: 4.9,
    reviews: 356,
    image: "1506905925346-21bda4d32df4",
    alt: "Snow-capped peaks along a Himalayan road in Ladakh",
    summary: "Pangong, Nubra and Khardung La with a crew, a driver who knows every bend and good chai.",
    includes: {
      hotel: "7 nights, camps and guesthouses",
      flights: "Return flights to Leh",
      meals: "Breakfast + dinner",
      sightseeing: "Pangong Lake, Nubra Valley, monasteries",
    },
    tag: "Adventure pick",
  },
  {
    slug: "phuket-island-hopper",
    title: "Thailand Island Hopper",
    destination: "Phuket & Krabi, Thailand",
    audience: "friends",
    nights: 6,
    price: 44999,
    rating: 4.7,
    reviews: 298,
    image: "1528181304800-259b08848526",
    alt: "Longtail boats and limestone cliffs in Thailand",
    summary: "Four islands, one night market crawl and a sunset kayak through mangroves.",
    includes: {
      hotel: "6 nights, beach hotels",
      flights: "Return flights + ferries",
      meals: "Daily breakfast",
      sightseeing: "Phi Phi, James Bond Island, Old Town",
    },
  },
  {
    slug: "tokyo-neon",
    title: "Tokyo Neon Nights",
    destination: "Tokyo & Kyoto, Japan",
    audience: "friends",
    nights: 6,
    price: 109999,
    rating: 4.9,
    reviews: 174,
    image: "1503899036084-c55cdd92da26",
    alt: "Neon-lit street in Tokyo at night",
    summary: "Izakaya hopping in Shinjuku, a bullet train to Kyoto and a very early temple morning.",
    includes: {
      hotel: "6 nights, city-centre hotels",
      flights: "Return flights + bullet train pass",
      meals: "Daily breakfast + food tour",
      sightseeing: "Shibuya, Fushimi Inari, Arashiyama",
    },
  },
]

export interface Tier {
  id: "budget" | "standard" | "luxury"
  name: string
  label: string
  price: number
  blurb: string
  highlight?: boolean
  features: { text: string; included: boolean }[]
}

export const tiers: Tier[] = [
  {
    id: "budget",
    name: "Explorer",
    label: "Budget",
    price: 19999,
    blurb: "Everything you need, nothing you don't. Great for short escapes.",
    features: [
      { text: "3-star hotels, shared rooms optional", included: true },
      { text: "Airport and station transfers", included: true },
      { text: "Daily breakfast", included: true },
      { text: "Group sightseeing tours", included: true },
      { text: "24/7 trip helpline", included: true },
      { text: "Flexible date changes", included: false },
      { text: "Private guide and car", included: false },
    ],
  },
  {
    id: "standard",
    name: "Voyager",
    label: "Standard",
    price: 39999,
    blurb: "Our most-booked tier: comfort, flexibility and a few special moments.",
    highlight: true,
    features: [
      { text: "4-star hotels with great locations", included: true },
      { text: "Private airport and city transfers", included: true },
      { text: "Breakfast + 2 dinners", included: true },
      { text: "Small-group tours, skip-the-line tickets", included: true },
      { text: "24/7 trip helpline", included: true },
      { text: "One free date change", included: true },
      { text: "Private guide and car", included: false },
    ],
  },
  {
    id: "luxury",
    name: "Signature",
    label: "Luxury",
    price: 89999,
    blurb: "Villas, private guides and the table by the window.",
    features: [
      { text: "5-star hotels and boutique villas", included: true },
      { text: "Chauffeur-driven private car", included: true },
      { text: "Half board with curated dining", included: true },
      { text: "Private guides and priority access", included: true },
      { text: "Dedicated trip manager", included: true },
      { text: "Free date changes up to 7 days before", included: true },
      { text: "Surprise upgrade on arrival", included: true },
    ],
  },
]

export const faqs = [
  {
    q: "How do I book a package?",
    a: "Pick a package, tap Book, and send us your dates and travelers. A trip planner replies within 2 hours with a final quote. You only pay a 20% deposit to confirm.",
  },
  {
    q: "Can I customize a package?",
    a: "Yes. Every itinerary is a starting point. Swap hotels, add days, remove sightseeing you don't want. Tell us what you'd change and we'll reprice it the same day.",
  },
  {
    q: "What does the price include?",
    a: "Each package lists its hotel, flights or transfers, meals and sightseeing. Visa fees, travel insurance and personal spending are not included unless the card says so.",
  },
  {
    q: "What if I need to cancel or change dates?",
    a: "Cancel free up to 30 days before departure on Standard and Signature tiers. Explorer tier carries a 10% fee. Date changes are free once on Standard and up to 7 days before on Signature.",
  },
  {
    q: "Do you arrange visas and travel insurance?",
    a: "We guide you through visa applications and can add insurance at checkout. For most countries we'll send a checklist and review your documents before you submit.",
  },
  {
    q: "Is it safe to pay online?",
    a: "Payments go through an encrypted gateway and we never store card details. You'll get a written confirmation and an itinerary for every payment.",
  },
  {
    q: "What if something goes wrong while I'm travelling?",
    a: "Call or WhatsApp the 24/7 helpline printed on your itinerary. A real person picks up, and we fix delays, missed transfers and hotel issues on your behalf.",
  },
]

export interface Testimonial {
  name: string
  trip: string
  quote: string
  rating: number
  avatar: string
}

export const testimonials: Testimonial[] = [
  {
    name: "Sneha R.",
    trip: "Bali honeymoon",
    quote:
      "They remembered it was our honeymoon at every hotel. The private pool villa was the best surprise of the trip.",
    rating: 5,
    avatar: "1534528741775-53994a69daeb",
  },
  {
    name: "Vikram S.",
    trip: "Ladakh road trip",
    quote:
      "Seven friends, one itinerary, zero arguments. Our driver knew every bend and every good chai stop.",
    rating: 5,
    avatar: "1472099645785-5658abf4ff4e",
  },
  {
    name: "Ananya P.",
    trip: "Kerala with parents",
    quote:
      "Mom and dad slept on a houseboat for the first time. The team adjusted the pace for them without us asking.",
    rating: 5,
    avatar: "1531123897727-8f129e1688ce",
  },
  {
    name: "Rahul M.",
    trip: "Dubai family trip",
    quote:
      "Kids' tickets, the desert dinner, airport pickups: all sorted. We just showed up and enjoyed it.",
    rating: 4,
    avatar: "1560250097-0b93528c311a",
  },
  {
    name: "Kavya T.",
    trip: "Santorini anniversary",
    quote:
      "Our flight was cancelled and they rebooked us in twenty minutes, at 2 am. That's why I'll book again.",
    rating: 5,
    avatar: "1580489944761-15a19d654956",
  },
  {
    name: "Nikhil B.",
    trip: "Tokyo with friends",
    quote:
      "The food tour alone was worth it. The itinerary had gaps for us to wander, which is exactly what we wanted.",
    rating: 5,
    avatar: "1519085360753-af0119f7cbe7",
  },
  {
    name: "Tanvi G.",
    trip: "Solo in Thailand",
    quote:
      "First solo trip and I was nervous. Check-in calls every evening made me feel looked after, not watched.",
    rating: 5,
    avatar: "1573496359142-b8d87734a5a2",
  },
  {
    name: "Aisha K.",
    trip: "Maldives retreat",
    quote:
      "No hidden fees. The price on the quote was the price I paid, and the villa was better than the photos.",
    rating: 5,
    avatar: "1544005313-94ddf0286df2",
  },
]

export const team = [
  {
    name: "Rohan Kapoor",
    role: "Founder & Head of Journeys",
    bio: "Started Onceagain after a missed ferry in Greece. Has visited 60+ countries, still gets lost.",
    image: "1507003211169-0a1dd7228f2d",
  },
  {
    name: "Meera Nair",
    role: "Head of Experiences",
    bio: "Designs every itinerary and personally tests new hotels before we list them.",
    image: "1494790108377-be9c29b29330",
  },
  {
    name: "Arjun Desai",
    role: "Operations Lead",
    bio: "The reason your transfers show up on time. Runs a spreadsheet for everything.",
    image: "1500648767791-00dcc994a43e",
  },
  {
    name: "Isha Verma",
    role: "Customer Care Lead",
    bio: "Leads the 24/7 helpline. Calm in every crisis, usually on her third chai.",
    image: "1438761681033-6461ffad8d80",
  },
]

export const timeline = [
  {
    year: "2011",
    title: "A missed ferry, a better idea",
    text: "Rohan plans a friend's trip around Greece from a rented desk in Delhi and realises travel planning is mostly worry. The first Onceagain itinerary goes out that winter.",
  },
  {
    year: "2014",
    title: "Our first 1,000 travelers",
    text: "We hit 1,000 trips and hire our first full-time trip planners, with one rule: you speak to a human who has been there.",
  },
  {
    year: "2018",
    title: "Families, friends and honeymoons",
    text: "Packages are redesigned around who's travelling. Couples, families and friend groups each get their own pace and perks.",
  },
  {
    year: "2021",
    title: "Flexible by default",
    text: "Free date changes and a 24/7 helpline become standard, so people can book without fear of the unexpected.",
  },
  {
    year: "Today",
    title: "10,000+ happy travelers",
    text: "150+ destinations, a 4.9 average rating and a rule that hasn't changed: plan trips you'd take again yourself.",
  },
]

export const partners = [
  "Skyline Airways",
  "Palm & Pine Resorts",
  "Nomad Rail",
  "Harbour Hotels",
  "Cedar Cruises",
  "Atlas Car Rentals",
  "Lantern Stays",
  "Meridian Insurance",
]

export const values = [
  {
    title: "Honest pricing",
    text: "The quote is the price. No surprise add-ons at the airport, no fine print in the footer.",
    icon: "wallet",
  },
  {
    title: "Been there",
    text: "Our planners have visited the places they sell. You get advice, not brochure copy.",
    icon: "compass",
  },
  {
    title: "Fix it fast",
    text: "Something goes wrong? A real person answers any hour and solves it before you ask twice.",
    icon: "life-buoy",
  },
  {
    title: "Travel lightly",
    text: "We support local guides, small family-run stays and low-impact experiences wherever we can.",
    icon: "leaf",
  },
] as const
