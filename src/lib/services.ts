import { SITE_URL, categorySeoName, listJoin } from "./seo";
import { LIBRARY_MAP } from "./taxonomy";
import type { CategoryId, LibraryId } from "./types";

/** A kind of business someone might search "free ___ website design" for. */
export interface Service {
  slug: string;
  name: string;
  icon: string;
  /** Phrase used inside the AI prompt: "Build a complete, responsive ___ website". */
  siteType: string;
  goal: string;
  needs: string[];
  sections: string[];
  /** Library categories worth starting from, most important first. */
  picks: CategoryId[];
  style: string;
  lib: LibraryId;
}

export const SERVICES: Service[] = [
  {
    slug: "restaurant",
    name: "Restaurant",
    icon: "🍽️",
    siteType: "restaurant",
    goal: "turn hungry visitors into table bookings and online orders",
    needs: ["menu with dishes and prices", "table reservation form", "opening hours and Google Maps location", "WhatsApp order button", "photo gallery of food and interiors"],
    sections: ["Loader", "Navbar", "Hero", "Menu highlights", "Gallery", "Testimonials", "Reservation form", "Footer"],
    picks: ["heroes", "cards", "testimonials", "contact", "footers"],
    style: "Warm editorial",
    lib: "gsap",
  },
  {
    slug: "cafe-bakery",
    name: "Cafe & Bakery",
    icon: "☕",
    siteType: "cafe and bakery",
    goal: "show off the menu and bring people in the door",
    needs: ["menu with prices and specials", "custom cake order form", "Instagram-style photo grid", "location and opening hours", "WhatsApp contact button"],
    sections: ["Navbar", "Hero", "Today's specials", "Menu", "Gallery", "Testimonials", "Order form", "Footer"],
    picks: ["heroes", "cards", "testimonials", "contact", "footers"],
    style: "Playful gradient",
    lib: "framer-motion",
  },
  {
    slug: "resort-homestay",
    name: "Resort & Homestay",
    icon: "🏝️",
    siteType: "resort and homestay",
    goal: "get direct booking enquiries without paying booking-site commissions",
    needs: ["room types with photos and rates", "booking enquiry form with dates", "nearby attractions and experiences", "guest reviews", "location map and how to reach"],
    sections: ["Loader", "Navbar", "Hero", "Rooms", "Experiences", "Gallery", "Testimonials", "Booking form", "Footer"],
    picks: ["heroes", "cards", "pricing", "testimonials", "contact", "footers"],
    style: "Minimal light",
    lib: "gsap",
  },
  {
    slug: "ayurveda-wellness",
    name: "Ayurveda & Wellness Centre",
    icon: "🌿",
    siteType: "Ayurveda and wellness centre",
    goal: "build trust and get treatment and consultation bookings",
    needs: ["treatments and packages with durations", "doctor and therapist profiles", "consultation booking form", "certifications and approvals", "guest testimonials"],
    sections: ["Navbar", "Hero", "Treatments", "Packages", "Doctors", "Testimonials", "FAQ", "Booking form", "Footer"],
    picks: ["heroes", "features", "pricing", "testimonials", "faq", "contact"],
    style: "Minimal light",
    lib: "framer-motion",
  },
  {
    slug: "hospital-clinic",
    name: "Hospital & Clinic",
    icon: "🏥",
    siteType: "hospital and clinic",
    goal: "help patients find the right doctor and book an appointment quickly",
    needs: ["departments and specialities", "doctor profiles with timings", "online appointment booking", "emergency contact number", "insurance and facilities information"],
    sections: ["Navbar", "Hero", "Departments", "Doctors", "Stats", "Testimonials", "FAQ", "Appointment form", "Footer"],
    picks: ["heroes", "features", "stats", "faq", "contact", "footers"],
    style: "Minimal light",
    lib: "css",
  },
  {
    slug: "dental-clinic",
    name: "Dental Clinic",
    icon: "🦷",
    siteType: "dental clinic",
    goal: "turn visitors into booked dental appointments",
    needs: ["treatments with before-and-after photos", "dentist profiles", "appointment booking form", "clinic timings and location", "patient reviews"],
    sections: ["Navbar", "Hero", "Treatments", "Before and after", "Dentists", "Testimonials", "FAQ", "Contact", "Footer"],
    picks: ["heroes", "features", "testimonials", "faq", "contact"],
    style: "Minimal light",
    lib: "framer-motion",
  },
  {
    slug: "school-college",
    name: "School & College",
    icon: "🎓",
    siteType: "school and college",
    goal: "inform parents and students and collect admission enquiries",
    needs: ["courses and programmes", "admission enquiry form", "facilities and campus gallery", "news, events and results", "faculty profiles"],
    sections: ["Navbar", "Hero", "Programmes", "Facilities", "Stats", "Events", "FAQ", "Admission form", "Footer"],
    picks: ["heroes", "features", "stats", "cards", "faq", "contact"],
    style: "Editorial",
    lib: "gsap",
  },
  {
    slug: "coaching-centre",
    name: "Coaching & Tuition Centre",
    icon: "📚",
    siteType: "coaching and tuition centre",
    goal: "fill new batches with enquiries and free demo class sign-ups",
    needs: ["courses and batch timings", "fees and plans", "toppers and results", "free demo class form", "faculty profiles"],
    sections: ["Navbar", "Hero", "Courses", "Results", "Pricing", "Testimonials", "FAQ", "Demo class form", "Footer"],
    picks: ["heroes", "pricing", "stats", "testimonials", "faq", "contact"],
    style: "Playful gradient",
    lib: "framer-motion",
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    icon: "🏠",
    siteType: "real estate",
    goal: "showcase properties and collect site-visit and callback requests",
    needs: ["property listings with filters", "project pages with floor plans", "site visit booking form", "location maps", "EMI and price details"],
    sections: ["Navbar", "Hero with search", "Featured properties", "Projects", "Stats", "Testimonials", "Contact", "Footer"],
    picks: ["heroes", "cards", "stats", "testimonials", "contact", "footers"],
    style: "Dark glassmorphism",
    lib: "gsap",
  },
  {
    slug: "construction-builders",
    name: "Construction & Builders",
    icon: "🏗️",
    siteType: "construction company",
    goal: "prove quality with past work and get quote requests",
    needs: ["completed projects gallery", "services list", "quote request form", "years of experience and project stats", "client testimonials"],
    sections: ["Navbar", "Hero", "Services", "Projects", "Stats", "Process", "Testimonials", "Quote form", "Footer"],
    picks: ["heroes", "features", "stats", "cards", "testimonials", "contact"],
    style: "Brutalist",
    lib: "gsap",
  },
  {
    slug: "interior-design",
    name: "Interior Design",
    icon: "🛋️",
    siteType: "interior design studio",
    goal: "win clients with a beautiful portfolio and consultation bookings",
    needs: ["project portfolio with photos", "services and design styles", "consultation booking form", "design process steps", "client reviews"],
    sections: ["Loader", "Navbar", "Hero", "Portfolio", "Services", "Process", "Testimonials", "Contact", "Footer"],
    picks: ["heroes", "cards", "features", "testimonials", "contact"],
    style: "Editorial",
    lib: "gsap",
  },
  {
    slug: "salon-beauty",
    name: "Salon & Beauty Parlour",
    icon: "💇",
    siteType: "salon and beauty parlour",
    goal: "get more appointments and promote offers",
    needs: ["services with prices", "stylist team", "appointment booking", "offers and packages", "before-and-after gallery"],
    sections: ["Navbar", "Hero", "Services", "Pricing", "Team", "Gallery", "Testimonials", "Booking form", "Footer"],
    picks: ["heroes", "pricing", "cards", "testimonials", "contact"],
    style: "Playful gradient",
    lib: "framer-motion",
  },
  {
    slug: "gym-fitness",
    name: "Gym & Fitness",
    icon: "🏋️",
    siteType: "gym and fitness studio",
    goal: "sell memberships and book free trial sessions",
    needs: ["membership plans and pricing", "trainer profiles", "class schedule", "free trial sign-up form", "transformation stories"],
    sections: ["Loader", "Navbar", "Hero", "Programmes", "Pricing", "Trainers", "Testimonials", "Free trial form", "Footer"],
    picks: ["heroes", "pricing", "features", "testimonials", "contact"],
    style: "Brutalist",
    lib: "gsap",
  },
  {
    slug: "wedding-events",
    name: "Wedding & Event Planner",
    icon: "💍",
    siteType: "wedding and event planning",
    goal: "show real events and get enquiries for dates",
    needs: ["event portfolio and galleries", "packages and pricing", "enquiry form with event date", "vendor and venue partners", "couple testimonials"],
    sections: ["Loader", "Navbar", "Hero", "Services", "Portfolio", "Packages", "Testimonials", "Enquiry form", "Footer"],
    picks: ["heroes", "cards", "pricing", "testimonials", "contact"],
    style: "Editorial",
    lib: "gsap",
  },
  {
    slug: "photography-studio",
    name: "Photography Studio",
    icon: "📷",
    siteType: "photography studio",
    goal: "let the photos sell and get booking enquiries",
    needs: ["full-screen portfolio galleries", "shoot packages and pricing", "booking enquiry form", "about the photographer", "client reviews"],
    sections: ["Loader", "Navbar", "Hero", "Portfolio", "Packages", "About", "Testimonials", "Contact", "Footer"],
    picks: ["heroes", "cards", "pricing", "testimonials", "contact"],
    style: "Dark glassmorphism",
    lib: "gsap",
  },
  {
    slug: "travel-agency",
    name: "Tour & Travel Agency",
    icon: "✈️",
    siteType: "tour and travel agency",
    goal: "sell tour packages and collect trip enquiries",
    needs: ["tour packages with itineraries and prices", "destination pages", "trip enquiry form", "traveller reviews", "WhatsApp contact button"],
    sections: ["Navbar", "Hero", "Popular packages", "Destinations", "Why us", "Testimonials", "FAQ", "Enquiry form", "Footer"],
    picks: ["heroes", "cards", "pricing", "testimonials", "faq", "contact"],
    style: "Playful gradient",
    lib: "framer-motion",
  },
  {
    slug: "online-store",
    name: "Online Store",
    icon: "🛍️",
    siteType: "e-commerce store",
    goal: "turn visitors into buyers",
    needs: ["product grid with filters", "product detail pages", "cart and checkout flow", "offers and discount banners", "customer reviews"],
    sections: ["Navbar", "Hero", "Categories", "Best sellers", "Offers", "Testimonials", "Newsletter", "Footer"],
    picks: ["heroes", "cards", "pricing", "testimonials", "cta", "footers"],
    style: "Minimal light",
    lib: "framer-motion",
  },
  {
    slug: "jewellery-textiles",
    name: "Jewellery & Textile Shop",
    icon: "💎",
    siteType: "jewellery and textile shop",
    goal: "showcase collections and bring customers to the store or WhatsApp",
    needs: ["collection galleries", "new arrivals and offers", "store locations", "WhatsApp enquiry button", "customer reviews"],
    sections: ["Loader", "Navbar", "Hero", "Collections", "New arrivals", "Offers", "Testimonials", "Store locator", "Footer"],
    picks: ["heroes", "cards", "marquee", "testimonials", "contact"],
    style: "Editorial",
    lib: "gsap",
  },
  {
    slug: "startup-saas",
    name: "Startup & SaaS",
    icon: "🚀",
    siteType: "SaaS product",
    goal: "explain the product clearly and get sign-ups",
    needs: ["clear value proposition", "feature highlights", "pricing plans", "customer logos and testimonials", "sign-up call to action"],
    sections: ["Loader", "Navbar", "Hero", "Logos", "Features", "Pricing", "Testimonials", "FAQ", "Call to action", "Footer"],
    picks: ["heroes", "features", "pricing", "marquee", "faq", "cta"],
    style: "Dark glassmorphism",
    lib: "framer-motion",
  },
  {
    slug: "portfolio",
    name: "Personal Portfolio",
    icon: "🧑‍💻",
    siteType: "personal portfolio",
    goal: "show your best work and get hired",
    needs: ["selected projects with case studies", "about and skills", "resume download", "contact form", "social links"],
    sections: ["Loader", "Navbar", "Hero", "Work", "About", "Skills", "Testimonials", "Contact", "Footer"],
    picks: ["heroes", "cards", "text", "interactions", "contact", "footers"],
    style: "Brutalist",
    lib: "gsap",
  },
  {
    slug: "digital-agency",
    name: "Digital Marketing Agency",
    icon: "📈",
    siteType: "digital marketing agency",
    goal: "prove results and book strategy calls",
    needs: ["services with outcomes", "case studies with numbers", "client logos", "strategy call booking form", "team section"],
    sections: ["Loader", "Navbar", "Hero", "Services", "Case studies", "Stats", "Logos", "Testimonials", "Contact", "Footer"],
    picks: ["heroes", "features", "stats", "marquee", "testimonials", "contact"],
    style: "Dark glassmorphism",
    lib: "gsap",
  },
  {
    slug: "law-accounting",
    name: "Law & CA Firm",
    icon: "⚖️",
    siteType: "law and chartered accountancy firm",
    goal: "look trustworthy and get consultation requests",
    needs: ["practice areas and services", "partner profiles", "consultation booking form", "FAQs about common cases and filings", "office location and hours"],
    sections: ["Navbar", "Hero", "Practice areas", "Team", "Stats", "Testimonials", "FAQ", "Consultation form", "Footer"],
    picks: ["heroes", "features", "stats", "faq", "contact"],
    style: "Editorial",
    lib: "css",
  },
  {
    slug: "ngo-charity",
    name: "NGO & Charity",
    icon: "🤝",
    siteType: "NGO and charity",
    goal: "tell the story, build trust and collect donations and volunteers",
    needs: ["causes and impact stories", "donate call to action", "volunteer sign-up form", "impact numbers", "events and updates"],
    sections: ["Navbar", "Hero", "Causes", "Impact stats", "Stories", "Volunteer", "Call to action", "Footer"],
    picks: ["heroes", "stats", "cards", "cta", "contact"],
    style: "Minimal light",
    lib: "framer-motion",
  },
  {
    slug: "taxi-car-rental",
    name: "Taxi & Car Rental",
    icon: "🚕",
    siteType: "taxi and car rental service",
    goal: "get bookings by phone, WhatsApp and online form",
    needs: ["fleet with prices per km or day", "quick booking form", "airport and outstation packages", "call and WhatsApp buttons", "customer reviews"],
    sections: ["Navbar", "Hero with booking form", "Fleet", "Packages", "Why us", "Testimonials", "FAQ", "Footer"],
    picks: ["heroes", "cards", "pricing", "testimonials", "faq", "contact"],
    style: "Playful gradient",
    lib: "css",
  },
];

export const servicePath = (slug: string) => `/free-website-design/${slug}`;

export function serviceSeo(s: Service) {
  const lower = s.name.toLowerCase();
  const designs = listJoin(s.picks.slice(0, 4).map((id) => categorySeoName(id).toLowerCase()));
  return {
    h1: `Free ${s.name} Website Design`,
    title: `Free ${s.name} Website Design — Code & AI Prompt`,
    description: `Build a ${lower} website for free: ${designs} designs with copy-ready HTML, CSS & React code, plus an AI website prompt covering ${listJoin(s.needs.slice(0, 3))}.`,
  };
}

/** Same shape as the Prompts page builder, filled in for this kind of business. */
export function servicePrompt(s: Service) {
  const lib = LIBRARY_MAP[s.lib];
  return `Build a complete, responsive ${s.siteType} website called "Your Business Name".

Goal: ${s.goal}.

Visual style: ${s.style}. Use CSS custom properties for colours, spacing and radii; consistent rounded corners; clear typographic hierarchy with a bold display font for headlines.

Sections (in order):
${s.sections.map((x, i) => `${i + 1}. ${x}`).join("\n")}

Must include: ${s.needs.join("; ")}.

Animation: use ${lib.label} for motion — ${lib.blurb.toLowerCase()} Include a loading/intro animation, staggered entrance reveals and hover micro-interactions. Respect prefers-reduced-motion.

Deliver: semantic HTML/CSS/JS and an equivalent React component version, mobile-first responsive layout (360px → 1440px), accessible focus states and ARIA labels, optimised images and realistic placeholder copy. Add local SEO basics: a page title and meta description with the business name and city, and LocalBusiness structured data.

Free section designs and animation code to start from: ${SITE_URL}/designs`;
}
