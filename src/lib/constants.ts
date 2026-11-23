// ═══════════════════════════════════════════════════════════
// MAISON NOIR — Brand Constants & Configuration
// ═══════════════════════════════════════════════════════════

export const BRAND = {
  name: "MAISON NOIR",
  tagline: "The Art of Darkness",
  description:
    "Where shadow meets sophistication. MAISON NOIR is a luxury fashion house crafting modern clothing for those who wear confidence as their finest garment.",
  shortDescription: "Contemporary luxury fashion for the boldly refined.",
  foundedYear: 2024,
  currency: "INR",
  currencySymbol: "₹",
  locale: "en-IN",
  email: "hello@maisonnoir.com",
  phone: "+91 00000 00000",
  social: {
    instagram: "https://instagram.com/maisonnoir",
    twitter: "https://twitter.com/maisonnoir",
    facebook: "https://facebook.com/maisonnoir",
    pinterest: "https://pinterest.com/maisonnoir",
  },
} as const;

export const BRAND_STORY = {
  headline: "Born From Darkness, Crafted With Light",
  paragraph1:
    "MAISON NOIR was founded on a singular belief: that true elegance emerges from the contrast between shadow and radiance. Our collections draw from the quiet confidence of midnight — where every silhouette is deliberate and every detail speaks volumes.",
  paragraph2:
    "We design for the modern individual who refuses to blend in. From the streets of Mumbai to the avenues of Paris, MAISON NOIR pieces are crafted with premium fabrics, meticulous tailoring, and an unwavering commitment to quality that transcends seasons.",
  paragraph3:
    "Every stitch carries our philosophy — that luxury is not about excess, but about intention. When you wear MAISON NOIR, you don't just dress — you declare.",
} as const;

// ── Navigation Structure ───
export const NAV_LINKS = {
  main: [
    {
      label: "New Arrivals",
      href: "/collections/new-arrivals",
    },
    {
      label: "Men",
      href: "/collections/men",
      children: [
        { label: "T-Shirts & Polos", href: "/collections/men/t-shirts-polos" },
        { label: "Shirts", href: "/collections/men/shirts" },
        { label: "Jeans", href: "/collections/men/jeans" },
        { label: "Trousers & Cargos", href: "/collections/men/trousers" },
        { label: "Hoodies & Sweatshirts", href: "/collections/men/hoodies" },
        { label: "Jackets & Coats", href: "/collections/men/jackets" },
        { label: "Suits & Blazers", href: "/collections/men/suits" },
        { label: "Shorts", href: "/collections/men/shorts" },
        { label: "Activewear", href: "/collections/men/activewear" },
      ],
    },
    {
      label: "Women",
      href: "/collections/women",
      children: [
        { label: "Tops & T-Shirts", href: "/collections/women/tops" },
        { label: "Shirts & Blouses", href: "/collections/women/shirts" },
        { label: "Jeans & Trousers", href: "/collections/women/jeans" },
        { label: "Dresses", href: "/collections/women/dresses" },
        { label: "Skirts", href: "/collections/women/skirts" },
        { label: "Hoodies & Sweatshirts", href: "/collections/women/hoodies" },
        { label: "Jackets & Coats", href: "/collections/women/jackets" },
        { label: "Activewear", href: "/collections/women/activewear" },
        { label: "Occasion Wear", href: "/collections/women/occasion-wear" },
      ],
    },
    {
      label: "Collections",
      href: "/collections",
      children: [
        { label: "Streetwear", href: "/collections/streetwear" },
        { label: "Essentials", href: "/collections/essentials" },
        { label: "After Dark", href: "/collections/after-dark" },
        { label: "Best Sellers", href: "/collections/best-sellers" },
        { label: "The Archive", href: "/collections/archive" },
      ],
    },
    {
      label: "Accessories",
      href: "/collections/accessories",
    },
    {
      label: "Sale",
      href: "/collections/sale",
    },
  ],
  footer: {
    shop: [
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Best Sellers", href: "/collections/best-sellers" },
      { label: "Men", href: "/collections/men" },
      { label: "Women", href: "/collections/women" },
      { label: "Accessories", href: "/collections/accessories" },
      { label: "Sale", href: "/collections/sale" },
    ],
    help: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "FAQs", href: "/faq" },
      { label: "Track Order", href: "/track-order" },
    ],
    company: [
      { label: "Our Story", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Sustainability", href: "/sustainability" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
} as const;

// ── Color Palette Reference ───
export const COLORS = {
  noir: "#121212",
  noirDeep: "#0A0A0A",
  noirLight: "#1A1A1A",
  noirMuted: "#2A2A2A",
  gold: "#B89A5A",
  goldLight: "#D4B978",
  goldDark: "#9A7E42",
  goldMuted: "#C8AD72",
  ivory: "#F5F0E6",
  ivoryLight: "#FAF7F0",
  ivoryDark: "#E8E0D0",
  burgundy: "#4A1424",
  burgundyLight: "#6B2038",
  burgundyDark: "#350E1A",
  white: "#FFFFFF",
  whiteOff: "#FAFAFA",
} as const;

// ── Size Chart ───
export const SIZE_OPTIONS = {
  clothing: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
  jeans: ["28", "30", "32", "34", "36", "38", "40"],
  shoes: ["6", "7", "8", "9", "10", "11", "12"],
} as const;

// ── Pagination ───
export const PRODUCTS_PER_PAGE = 12;
export const REVIEWS_PER_PAGE = 5;

// ── Image dimensions ───
export const IMAGE_SIZES = {
  productCard: { width: 400, height: 520 },
  productDetail: { width: 800, height: 1040 },
  hero: { width: 1920, height: 800 },
  category: { width: 600, height: 400 },
  thumbnail: { width: 100, height: 130 },
} as const;
