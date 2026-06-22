import { ServiceCategory } from '../types';

export const SALON_INFO = {
  name: "Look's Men's Parlour & Salon",
  tagline: "Experience the ultimate grooming and styling precision at Suriyawan's ultimate destination. Premium haircuts, beard detailing, facial treatments, and modern style trends.",
  rating: "4.8/5",
  ratingCount: "73+ Reviews",
  happyClients: "1,000+ Happy Clients",
  experience: "10+ Years Experience",
  phone1: "09696666689",
  phone2: "",
  email: "ksurajyadav93@gmail.com",
  address: "Shop No A5 Siyaram Complex bypass chauraha, Suriyawan - Bhadohi Rd, Suriyawan, Uttar Pradesh 221404",
  workingHours: [
    { day: "Monday - Sunday", hours: "8:00 AM - 8:00 PM" }
  ]
};

export const SERVICES_DATA: ServiceCategory[] = [
  {
    id: "hair-care",
    name: "Hair Care & Styling",
    iconName: "Scissors",
    description: "Premium cuts, modern styling, protein treatments, and high-gloss coloring by certified stylists.",
    items: [
      { id: "h1", name: "Classic Haircut & Wash", price: 299, duration: "40 mins", description: "Precision trim customized to your face shape, complete with nourishing deep hair wash and basic blow-style." },
      { id: "h2", name: "Signature Hair Spa (L'Oreal)", price: 899, duration: "60 mins", description: "Intense deep conditioning restorer, scalp massage, and steam therapy to combat dryness and frizz." },
      { id: "h3", name: "Premium Keratin Therapy", price: 3499, duration: "120 mins", description: "Brazilian protein reconstruction treatment for high gloss, frizz-eliminated straight hair that lasts months." },
      { id: "h4", name: "Luxurious Global Coloring", price: 2199, duration: "90 mins", description: "Rich uniform permanent color of your choice using premium ammonia-free formulas for long-lasting lock shine." },
      { id: "h5", name: "Beard Designing & Royal Shave", price: 199, duration: "30 mins", description: "Hot-towel shave treatment, contours shaving, precision beard trim, and nourishing almond oil massage." }
    ]
  },
  {
    id: "facial-skin",
    name: "Facial & Skin Care",
    iconName: "Sparkles",
    description: "Rejuvenating therapies to cleanse, exfoliate, brighten, and infuse nutrients into your skin.",
    items: [
      { id: "f1", name: "O3+ Bridal D-Tan & Brightening Facial", price: 1799, duration: "75 mins", description: "D-Tan skin prep, deep hydration cleansing, cellular oxygen repair, and high-performance brightening peel-off mask." },
      { id: "f2", name: "Charcoal Deep Cleanse Facial", price: 699, duration: "45 mins", description: "Active activated carbon extraction of blackheads, deep pore steaming, ultra-soothing clay hydration mask." },
      { id: "f3", name: "Gold Radiance Luxury Facial", price: 1299, duration: "60 mins", description: "Therapeutic massage with pure gold dust scrub, hydration cream, skin tightening cream, and metallic face glow mask." },
      { id: "f4", name: "Hydrating Aloe Vera Organic Facial", price: 599, duration: "40 mins", description: "Instantly cool down tired skin with pure certified aloe herbal gel, gentle extraction, and refreshing mist." }
    ]
  },
  {
    id: "hair-removal",
    name: "Hair Removal Services",
    iconName: "Sparkle",
    description: "Gentle threading and silky-smooth waxing options for arms, legs, face, and full body.",
    items: [
      { id: "w1", name: "Rica Chocolate Waxing (Full Arms)", price: 399, duration: "30 mins", description: "Colophony-free Italian Rica wax with chocolate extracts for sensitive skin, effectively reducing hair growth." },
      { id: "w2", name: "Rica Honey Waxing (Full Legs)", price: 549, duration: "45 mins", description: "Gentle Rica formulation to peel off tan and skin cells, leaving legs brilliantly polished and moisturized." },
      { id: "w3", name: "Eyebrow & Upper Lip Threading", price: 79, duration: "15 mins", description: "Premium thread contouring of eyebrows, forehead, and upper-lip areas by expert cosmetologists with minimum sting." },
      { id: "w4", name: "Full Body Rica Waxing Combo", price: 1499, duration: "90 mins", description: "Comprehensive Rica chocolate waxing package including legs, arms, underarms, and back at a discount." }
    ]
  },
  {
    id: "beauty-makeup",
    name: "Beauty & Makeup",
    iconName: "Heart",
    description: "Aesthetic masterclasses, specialized airbrush bridal makeups, party styles, and eyelash craft.",
    items: [
      { id: "m1", name: "Glamorous Party Makeup", price: 1999, duration: "60 mins", description: "High-definition foundation base, gorgeous customized eye contouring, luxury lashes, and long-stay lip styling." },
      { id: "m2", name: "HD Bridal Makeup Package", price: 7999, duration: "150 mins", description: "Premium bridal makeover, waterproof HD base, jewelry styling assistance, high-lash extensions, and hair accessory setting." },
      { id: "m3", name: "Elegant Engagement Makeup", price: 4499, duration: "90 mins", description: "Satin finish modern look with light corrective contouring and matching drape placement advice." },
      { id: "m4", name: "Volume Eyelash Extensions", price: 1199, duration: "60 mins", description: "Semi-permanent individual extensions that deliver beautiful curl depth and natural volume density." }
    ]
  },
  {
    id: "nail-care",
    name: "Nail Care",
    iconName: "Hand",
    description: "Professional manicures, pedicures, extensions, and premium gel-lacquer nail art styling.",
    items: [
      { id: "n1", name: "Russian Spa Pedicure", price: 799, duration: "60 mins", description: "Aromatherapy bath dip, advanced callous scraper, skin brightening pack, and premium moisturizing massage." },
      { id: "n2", name: "Classic French Manicure", price: 499, duration: "45 mins", description: "Cuticle cleaning, warm cream soak, expert nail shaping, and classic French white-tip varnish finish." },
      { id: "n3", name: "Gel Nail Extensions & Art", price: 1499, duration: "90 mins", description: "High-performance UV cured resin extensions with customizable gold glitter or custom metallic accents." },
      { id: "n4", name: "Gel Polish Accent Overlay", price: 399, duration: "30 mins", description: "Odorless long-stay shade curation from professional gel ranges, guaranteed scratch-free for 3+ weeks." }
    ]
  },
  {
    id: "personal-grooming",
    name: "Personal Grooming",
    iconName: "UserCheck",
    description: "Convenient combo grooms, organic body polishes, detan packs, and customized styling consults.",
    items: [
      { id: "p1", name: "Royal Groom Combo (Men)", price: 1199, duration: "90 mins", description: "Haircut, gold charcoal facial scrub, Rica armpit wax, and deep head massage with stress relief oil." },
      { id: "p2", name: "Royal Bride Pre-Groom Combo", price: 3999, duration: "180 mins", description: "O3+ facial, Full-body body glow polishing, Rica waxing, hair spa, and advanced pedicure." },
      { id: "p3", name: "Stress Relief Head & Shoulder Massage", price: 349, duration: "30 mins", description: "Using cold-pressed herbal oils containing eucalyptus and rosemary scalp triggers to ease heavy posture pressure." },
      { id: "p4", name: "Full Face Insta-Glow D-Tan Pack", price: 249, duration: "20 mins", description: "Quick fruit-infusion pack that breaks down sun-damaged melanin, delivering a fresh skin surface." }
    ]
  }
];

export const GALLERY_IMAGES = [
  {
    url: "https://www.image2url.com/r2/default/images/1782114541980-8237d9f5-60c9-4cd8-89ae-1dfe22cb1ef2.webp",
    title: "Classic Premium Styling Station Setup",
    category: "Shop"
  },
  {
    url: "https://www.image2url.com/r2/default/images/1782114636254-4f9b41b4-4c89-42ee-a37f-b23f30df99c7.webp",
    title: "Luxury Lounge & Inner Parlour View",
    category: "Shop"
  },
  {
    url: "https://www.image2url.com/r2/default/images/1782114732811-930caf4c-4f7f-44b9-9dbc-764c98f6b545.webp",
    title: "Executive Grooming & Styling Bay",
    category: "Shop"
  },
  {
    url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800",
    title: "Artistic Haircut & Blow dry Finish",
    category: "Styling"
  },
  {
    url: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&q=80&w=800",
    title: "Royal Shaving & Beard Contouring",
    category: "Grooming"
  },
  {
    url: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
    title: "Facial & Skin Hydration Spa Room",
    category: "Grooming"
  },
  {
    url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800",
    title: "Professional Carbon-Steel Styling Scissors",
    category: "Equipment"
  },
  {
    url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800",
    title: "Signature Premium Leather Styling Chairs",
    category: "Equipment"
  }
];

export const REVIEWS = [
  { name: "Suraj Yadav", rating: 5, text: "The gold radiance facial and haircut has completely changed my grooming style. Suriyawan needed this premium standard. The staff is polite and professionally skilled!", ref: "Google Maps" },
  { name: "Anjali Mishra", rating: 5, text: "High quality HD Bridal makeup. I booked my engagement & bridal package here. Staff styled my jewelry and hair accessories so elegantly.", ref: "Instagram" },
  { name: "Deepak Baghel", rating: 5, text: "Excellent beard contouring and L'Oreal hair spa! A highly sanitized and absolute premium luxury vibe. Strongly recommended.", ref: "Direct Link" }
];
