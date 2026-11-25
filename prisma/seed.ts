// ═══════════════════════════════════════════════════════════
// MAISON NOIR — Database Seeding Script
// Populates 32 luxury clothing products across Men, Women, Streetwear & Accessories
// ═══════════════════════════════════════════════════════════

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🏛️  Starting MAISON NOIR Database Seed...");

  // ── 1. Clear Existing Data ───
  await prisma.auditLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();

  console.log("✔ Cleared existing records.");

  // ── 2. Create Default Users ───
  const adminPassword = await bcrypt.hash("MaisonAdmin2026!", 10);
  const clientPassword = await bcrypt.hash("Password123!", 10);

  const adminUser = await prisma.user.create({
    data: {
      name: "Maison Admin",
      email: "admin@maisonnoir.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      phone: "+91 99999 00001",
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      name: "Alexander Wright",
      email: "client@maisonnoir.com",
      passwordHash: clientPassword,
      role: "CUSTOMER",
      phone: "+91 98765 43210",
      addresses: {
        create: {
          fullName: "Alexander Wright",
          phone: "+91 98765 43210",
          streetLine1: "42 Altamount Road, Cumballa Hill",
          streetLine2: "Apartment 18B",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400026",
          country: "India",
          isDefault: true,
          type: "SHIPPING",
        },
      },
      cart: { create: {} },
      wishlist: { create: {} },
    },
  });

  console.log(`✔ Users created: ${adminUser.email} (ADMIN), ${clientUser.email} (CUSTOMER)`);

  // ── 3. Create Collections ───
  const collectionsData = [
    {
      name: "After Dark",
      slug: "after-dark",
      tagline: "The nocturnal signature series",
      description: "Deep noir tones, heavy satin finishes, and commanding silhouettes tailored for midnight elegance.",
      bannerUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Streetwear Atelier",
      slug: "streetwear",
      tagline: "Raw urban spirit, couture execution",
      description: "Heavyweight drop-shoulder hoodies, tailored technical cargos, and boxy silhouette luxury tees.",
      bannerUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "Permanent Essentials",
      slug: "essentials",
      tagline: "Timeless foundations of the modern wardrobe",
      description: "Giza long-staple cotton t-shirts, fine merino wool knitwear, and clean-line trousers.",
      bannerUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
    },
    {
      name: "High Formal",
      slug: "black-tie",
      tagline: "Precision bespoke tailoring",
      description: "Hand-canvassed blazers, Italian wool overcoats, and structured architectural evening wear.",
      bannerUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop",
    },
  ];

  const collections: Record<string, string> = {};
  for (const c of collectionsData) {
    const col = await prisma.collection.create({ data: c });
    collections[c.slug] = col.id;
  }
  console.log(`✔ Created ${Object.keys(collections).length} brand collections.`);

  // ── 4. Create Categories ───
  const categoriesData = [
    // Men
    { name: "Men's T-Shirts & Polos", slug: "men-t-shirts-polos", gender: "MEN", description: "Heavyweight combed cotton and refined mercerized polos." },
    { name: "Men's Shirts", slug: "men-shirts", gender: "MEN", description: "Structured poplin, washed linen, and evening oxford shirts." },
    { name: "Men's Jeans", slug: "men-jeans", gender: "MEN", description: "Japanese selvedge and raw denim with modern architectural cuts." },
    { name: "Men's Trousers & Cargos", slug: "men-trousers", gender: "MEN", description: "Tailored wool trousers and technical luxury cargos." },
    { name: "Men's Hoodies & Sweatshirts", slug: "men-hoodies", gender: "MEN", description: "450 GSM French terry cotton with subtle tonal branding." },
    { name: "Men's Jackets & Coats", slug: "men-jackets", gender: "MEN", description: "Double-breasted cashmere overcoats and tailored bomber jackets." },
    { name: "Men's Suits & Blazers", slug: "men-suits", gender: "MEN", description: "Italian Super 130s wool blazers with peak lapels." },
    // Women
    { name: "Women's Tops & Blouses", slug: "women-tops", gender: "WOMEN", description: "Silk georgette blouses, sculpted corsets, and fine knit tops." },
    { name: "Women's Jeans & Trousers", slug: "women-jeans-trousers", gender: "WOMEN", description: "Wide-leg pleated trousers and tailored high-waisted denim." },
    { name: "Women's Dresses", slug: "women-dresses", gender: "WOMEN", description: "Silk slip evening gowns, minimal column dresses, and tailored daywear." },
    { name: "Women's Skirts", slug: "women-skirts", gender: "WOMEN", description: "Structured pleated midi skirts and bias-cut silk skirts." },
    { name: "Women's Jackets & Coats", slug: "women-jackets", gender: "WOMEN", description: "Trench coats, tailored blazers, and belted shearling outerwear." },
    { name: "Women's Occasion Wear", slug: "women-occasion", gender: "WOMEN", description: "Dramatic silhouettes, velvet details, and evening formal dresses." },
    // Accessories & Streetwear
    { name: "Luxury Streetwear", slug: "streetwear", gender: "UNISEX", description: "Oversized silhouettes, drop shoulders, and statement outer layers." },
    { name: "Leather Goods & Belts", slug: "accessories-leather", gender: "UNISEX", description: "Full-grain Italian calfskin belts and minimalist cardholders." },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const c = await prisma.category.create({ data: cat });
    categories[cat.slug] = c.id;
  }
  console.log(`✔ Created ${Object.keys(categories).length} categories.`);

  // ── 5. Curate 32 Realistic Luxury Products ───
  const products = [
    // ── MEN'S PRODUCTS (12) ──
    {
      name: "Nocturne Heavyweight Oversized Tee",
      slug: "nocturne-heavyweight-oversized-tee",
      description: "Crafted from 320 GSM organic Giza cotton with a structured drop-shoulder drape. Finished with a subtle tone-on-tone high-density Maison Noir crest on the nape.",
      basePrice: 4200,
      salePrice: 3600,
      sku: "MN-TEE-001",
      gender: "MEN",
      categorySlug: "men-t-shirts-polos",
      collectionSlug: "streetwear",
      isFeatured: true,
      fabricDetails: "100% Giza Long-Staple Cotton, 320 GSM Preshrunk",
      careInstructions: "Machine wash cold inside out. Reshape and flat dry. Iron low.",
      fitInfo: "Oversized boxy cut. Size down for regular fit. Model is 6'1 wearing Medium.",
      images: [
        { url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop", isPrimary: false },
      ],
      variants: [
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 18 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 24 },
        { size: "L", colorName: "Royal Noir", colorHex: "#121212", stock: 20 },
        { size: "XL", colorName: "Royal Noir", colorHex: "#121212", stock: 12 },
        { size: "M", colorName: "Warm Ivory", colorHex: "#F5F0E6", stock: 15 },
        { size: "L", colorName: "Warm Ivory", colorHex: "#F5F0E6", stock: 10 },
      ],
    },
    {
      name: "Mercerized Pima Cotton Polo",
      slug: "mercerized-pima-cotton-polo",
      description: "Double-mercerized Peruvian Pima cotton with a lustrous silk-like handfeel. Features genuine mother-of-pearl buttons and a non-roll knit collar.",
      basePrice: 5800,
      sku: "MN-POLO-002",
      gender: "MEN",
      categorySlug: "men-t-shirts-polos",
      collectionSlug: "essentials",
      isFeatured: false,
      fabricDetails: "100% Peruvian Pima Cotton, Double Mercerized Finish",
      careInstructions: "Gentle machine wash cold. Do not tumble dry.",
      fitInfo: "Tailored athletic fit through the chest and waist.",
      images: [
        { url: "https://images.unsplash.com/photo-1625910513413-7fc2a8c3e809?q=80&w=800&auto=format&fit=crop", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop", isPrimary: false },
      ],
      variants: [
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 15 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 20 },
        { size: "L", colorName: "Royal Noir", colorHex: "#121212", stock: 18 },
        { size: "M", colorName: "Antique Gold", colorHex: "#B89A5A", stock: 12 },
        { size: "L", colorName: "Antique Gold", colorHex: "#B89A5A", stock: 8 },
      ],
    },
    {
      name: "Italian Cotton Poplin Evening Shirt",
      slug: "italian-cotton-poplin-evening-shirt",
      description: "Crisp 120/2 two-ply Italian cotton poplin with a concealed placket and French cuffs. Hand-stitched collar stays ensure a razor-sharp profile.",
      basePrice: 7900,
      sku: "MN-SHIRT-003",
      gender: "MEN",
      categorySlug: "men-shirts",
      collectionSlug: "black-tie",
      isFeatured: true,
      fabricDetails: "100% Extra-Long Staple Italian Cotton Poplin",
      careInstructions: "Professional dry clean or hand wash warm. Warm steam press.",
      fitInfo: "Modern slim silhouette with clean shoulder yoke.",
      images: [
        { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop", isPrimary: false },
      ],
      variants: [
        { size: "38", colorName: "Pure White", colorHex: "#FFFFFF", stock: 14 },
        { size: "40", colorName: "Pure White", colorHex: "#FFFFFF", stock: 22 },
        { size: "42", colorName: "Pure White", colorHex: "#FFFFFF", stock: 16 },
        { size: "40", colorName: "Royal Noir", colorHex: "#121212", stock: 10 },
      ],
    },
    {
      name: "Shadow Japanese Selvedge Raw Denim",
      slug: "shadow-japanese-selvedge-raw-denim",
      description: "14.5 oz Kuroki Mills shuttle-loom selvedge denim dyed in pure sulfur black warp and weft. Features antique gold hardware and a custom debossed leather patch.",
      basePrice: 9400,
      sku: "MN-JEAN-004",
      gender: "MEN",
      categorySlug: "men-jeans",
      collectionSlug: "streetwear",
      isFeatured: true,
      fabricDetails: "100% Cotton 14.5 oz Japanese Shuttle-Loom Selvedge",
      careInstructions: "Wear raw for 6 months before first cold soak. Line dry inside out.",
      fitInfo: "Mid-rise modern straight taper.",
      images: [
        { url: "https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=800&auto=format&fit=crop", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop", isPrimary: false },
      ],
      variants: [
        { size: "30", colorName: "Royal Noir", colorHex: "#121212", stock: 10 },
        { size: "32", colorName: "Royal Noir", colorHex: "#121212", stock: 16 },
        { size: "34", colorName: "Royal Noir", colorHex: "#121212", stock: 14 },
        { size: "36", colorName: "Royal Noir", colorHex: "#121212", stock: 8 },
      ],
    },
    {
      name: "Pleated Relaxed Wool Flannel Trousers",
      slug: "pleated-relaxed-wool-flannel-trousers",
      description: "Woven from 320g Vitale Barberis Canonico wool flannel. Double reverse pleats create a fluid, commanding drape from hip to cuff.",
      basePrice: 11200,
      sku: "MN-TROUS-005",
      gender: "MEN",
      categorySlug: "men-trousers",
      collectionSlug: "essentials",
      isFeatured: false,
      fabricDetails: "100% Super 120s Wool Flannel",
      careInstructions: "Dry clean only by luxury garment specialist.",
      fitInfo: "Relaxed tailored cut with generous break.",
      images: [
        { url: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "30", colorName: "Charcoal Noir", colorHex: "#1F2421", stock: 12 },
        { size: "32", colorName: "Charcoal Noir", colorHex: "#1F2421", stock: 18 },
        { size: "34", colorName: "Charcoal Noir", colorHex: "#1F2421", stock: 15 },
      ],
    },
    {
      name: "Atelier Technical Cargo Pant",
      slug: "atelier-technical-cargo-pant",
      description: "Structured water-repellent Italian nylon twill with articulated knees, matte gold Swiss zippers, and magnetic pocket flaps.",
      basePrice: 8800,
      sku: "MN-CARGO-006",
      gender: "MEN",
      categorySlug: "men-trousers",
      collectionSlug: "streetwear",
      isFeatured: true,
      fabricDetails: "70% Cotton, 30% Cordura Nylon with DWR Coating",
      careInstructions: "Machine wash cold gentle. Do not use fabric softener.",
      fitInfo: "Tapered utility silhouette with elasticated hem adjusters.",
      images: [
        { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 10 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 15 },
        { size: "L", colorName: "Royal Noir", colorHex: "#121212", stock: 12 },
      ],
    },
    {
      name: "L'Etoile Heavyweight French Terry Hoodie",
      slug: "letoile-heavyweight-french-terry-hoodie",
      description: "Substantial 480 GSM unbrushed loopback cotton hoodie with double-layer crossover hood and discreet gold-plated aglets.",
      basePrice: 6500,
      salePrice: 5600,
      sku: "MN-HOOD-007",
      gender: "MEN",
      categorySlug: "men-hoodies",
      collectionSlug: "streetwear",
      isFeatured: true,
      fabricDetails: "100% Combed Organic Cotton, 480 GSM Loopback",
      careInstructions: "Wash inside out at 30°C. Hang dry to maintain fleece density.",
      fitInfo: "Structured relaxed body with snug ribbed cuffs and waist.",
      images: [
        { url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop", isPrimary: false },
      ],
      variants: [
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 16 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 25 },
        { size: "L", colorName: "Royal Noir", colorHex: "#121212", stock: 20 },
        { size: "XL", colorName: "Royal Noir", colorHex: "#121212", stock: 10 },
        { size: "M", colorName: "Deep Burgundy", colorHex: "#4A1424", stock: 14 },
        { size: "L", colorName: "Deep Burgundy", colorHex: "#4A1424", stock: 12 },
      ],
    },
    {
      name: "Double-Breasted Cashmere Blend Overcoat",
      slug: "double-breasted-cashmere-blend-overcoat",
      description: "A tailored monument. 750g wool-cashmere blend with 6x2 gold horn buttons, peak lapels, and full cupro lining that glides effortlessly over suits.",
      basePrice: 24500,
      sku: "MN-COAT-008",
      gender: "MEN",
      categorySlug: "men-jackets",
      collectionSlug: "after-dark",
      isFeatured: true,
      fabricDetails: "90% Virgin Wool, 10% Cashmere, Bemberg Cupro Lining",
      careInstructions: "Professional dry clean only.",
      fitInfo: "Constructed shoulders with room for tailored knitwear or jacket beneath.",
      images: [
        { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop", isPrimary: false },
      ],
      variants: [
        { size: "38", colorName: "Royal Noir", colorHex: "#121212", stock: 8 },
        { size: "40", colorName: "Royal Noir", colorHex: "#121212", stock: 12 },
        { size: "42", colorName: "Royal Noir", colorHex: "#121212", stock: 10 },
        { size: "40", colorName: "Deep Burgundy", colorHex: "#4A1424", stock: 6 },
      ],
    },
    {
      name: "Silk-Blend Velvet Smoking Jacket",
      slug: "silk-blend-velvet-smoking-jacket",
      description: "Lush deep-pile silk velvet framed with satin shawl lapels and silk-braided frogging. An heirloom piece for galas and nocturnal affairs.",
      basePrice: 28000,
      sku: "MN-SMOK-009",
      gender: "MEN",
      categorySlug: "men-suits",
      collectionSlug: "black-tie",
      isFeatured: true,
      fabricDetails: "70% Silk, 30% Rayon Velvet with Mulberry Silk Satin Lapels",
      careInstructions: "Specialist dry clean only. Store on wide hanger.",
      fitInfo: "Classic evening drape. Single button closure.",
      images: [
        { url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "38", colorName: "Midnight Noir", colorHex: "#0D0D11", stock: 6 },
        { size: "40", colorName: "Midnight Noir", colorHex: "#0D0D11", stock: 9 },
        { size: "42", colorName: "Midnight Noir", colorHex: "#0D0D11", stock: 7 },
        { size: "40", colorName: "Deep Burgundy", colorHex: "#4A1424", stock: 5 },
      ],
    },
    {
      name: "Super 130s Merino Peak Lapel Blazer",
      slug: "super-130s-merino-peak-lapel-blazer",
      description: "Half-canvassed single-breasted jacket tailored from Reda 1865 Italian wool. Features functional 4-button surgeon cuffs and interior passport pocket.",
      basePrice: 19800,
      sku: "MN-BLAZ-010",
      gender: "MEN",
      categorySlug: "men-suits",
      collectionSlug: "black-tie",
      isFeatured: false,
      fabricDetails: "100% Super 130s Pure Virgin Merino Wool",
      careInstructions: "Dry clean only.",
      fitInfo: "Slim tailored silhouette.",
      images: [
        { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "38", colorName: "Royal Noir", colorHex: "#121212", stock: 10 },
        { size: "40", colorName: "Royal Noir", colorHex: "#121212", stock: 15 },
        { size: "42", colorName: "Royal Noir", colorHex: "#121212", stock: 12 },
      ],
    },
    {
      name: "Tailored Linen Camp Collar Shirt",
      slug: "tailored-linen-camp-collar-shirt",
      description: "Breezy French Normandy linen washed with river pumice for instant softness. Features French seams and a relaxed camp collar.",
      basePrice: 5200,
      sku: "MN-LIN-011",
      gender: "MEN",
      categorySlug: "men-shirts",
      collectionSlug: "essentials",
      isFeatured: false,
      fabricDetails: "100% Normandy Flax Linen, 175 GSM",
      careInstructions: "Machine wash cold gentle. Line dry.",
      fitInfo: "Relaxed resort cut.",
      images: [
        { url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "M", colorName: "Warm Ivory", colorHex: "#F5F0E6", stock: 14 },
        { size: "L", colorName: "Warm Ivory", colorHex: "#F5F0E6", stock: 12 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 10 },
      ],
    },
    {
      name: "Merino Wool Fine-Gauge Mockneck",
      slug: "merino-wool-fine-gauge-mockneck",
      description: "Spun from 16-micron extrafine Australian merino wool on 18-gauge Japanese knitting machines. Unrivaled softness against the skin without bulk.",
      basePrice: 7200,
      sku: "MN-MOCK-012",
      gender: "MEN",
      categorySlug: "men-hoodies",
      collectionSlug: "essentials",
      isFeatured: false,
      fabricDetails: "100% Extrafine Australian Merino Wool",
      careInstructions: "Hand wash cold with wool wash. Dry flat.",
      fitInfo: "Form-fitting luxury base layer.",
      images: [
        { url: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 12 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 18 },
        { size: "L", colorName: "Royal Noir", colorHex: "#121212", stock: 14 },
      ],
    },

    // ── WOMEN'S PRODUCTS (14) ──
    {
      name: "Mulberry Silk Bias-Cut Column Gown",
      slug: "mulberry-silk-bias-cut-column-gown",
      description: "Heavy 25 Momme sandwashed mulberry silk cut on the bias to skim the contours of the body. Features an open architectural back with delicate crossing ties.",
      basePrice: 22000,
      salePrice: 19500,
      sku: "MN-DRS-013",
      gender: "WOMEN",
      categorySlug: "women-dresses",
      collectionSlug: "after-dark",
      isFeatured: true,
      fabricDetails: "100% Grade 6A Mulberry Silk, 25 Momme Sandwashed",
      careInstructions: "Professional green dry clean only. Steam with silk attachment.",
      fitInfo: "Bias cut flows effortlessly with natural body lines.",
      images: [
        { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop", isPrimary: false },
      ],
      variants: [
        { size: "XS", colorName: "Royal Noir", colorHex: "#121212", stock: 8 },
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 15 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 14 },
        { size: "L", colorName: "Royal Noir", colorHex: "#121212", stock: 6 },
        { size: "S", colorName: "Deep Burgundy", colorHex: "#4A1424", stock: 10 },
        { size: "M", colorName: "Deep Burgundy", colorHex: "#4A1424", stock: 8 },
      ],
    },
    {
      name: "Sartorial Hourglass Wool Blazer",
      slug: "sartorial-hourglass-wool-blazer",
      description: "Strong sculpted shoulders contrasting a defined nipped-in waist. Fully lined in duchess satin with gold-finished engraved crest buttons.",
      basePrice: 18500,
      sku: "MN-BLAZ-014",
      gender: "WOMEN",
      categorySlug: "women-jackets",
      collectionSlug: "after-dark",
      isFeatured: true,
      fabricDetails: "98% Italian Wool, 2% Elastane for structured recovery",
      careInstructions: "Dry clean only.",
      fitInfo: "Sculpted tailored fit. True to size.",
      images: [
        { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800&auto=format&fit=crop", isPrimary: false },
      ],
      variants: [
        { size: "XS", colorName: "Royal Noir", colorHex: "#121212", stock: 7 },
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 14 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 12 },
        { size: "L", colorName: "Royal Noir", colorHex: "#121212", stock: 6 },
      ],
    },
    {
      name: "Palazzo High-Waisted Pleated Trouser",
      slug: "palazzo-high-waisted-pleated-trouser",
      description: "Extravagant fluid drape in Japanese triacetate crepe. Deep front pleats and a concealed closure elongate the silhouette from hip to floor.",
      basePrice: 10500,
      sku: "MN-TROUS-015",
      gender: "WOMEN",
      categorySlug: "women-jeans-trousers",
      collectionSlug: "essentials",
      isFeatured: true,
      fabricDetails: "72% Japanese Triacetate, 28% Polyester Crepe",
      careInstructions: "Hand wash cold or gentle dry clean.",
      fitInfo: "High rise with wide relaxed leg.",
      images: [
        { url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "XS", colorName: "Warm Ivory", colorHex: "#F5F0E6", stock: 10 },
        { size: "S", colorName: "Warm Ivory", colorHex: "#F5F0E6", stock: 16 },
        { size: "M", colorName: "Warm Ivory", colorHex: "#F5F0E6", stock: 14 },
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 18 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 15 },
      ],
    },
    {
      name: "Architectural Silk Organza Blouse",
      slug: "architectural-silk-organza-blouse",
      description: "Semi-sheer silk organza with exaggerated French cuffs and a dramatic removable pussy-bow necktie. Includes a tonal silk camisole base.",
      basePrice: 9800,
      sku: "MN-BLS-016",
      gender: "WOMEN",
      categorySlug: "women-tops",
      collectionSlug: "after-dark",
      isFeatured: false,
      fabricDetails: "100% Silk Organza with 100% Silk Habotai Cami",
      careInstructions: "Delicate dry clean only.",
      fitInfo: "Airy relaxed silhouette.",
      images: [
        { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 12 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 10 },
        { size: "S", colorName: "Warm Ivory", colorHex: "#F5F0E6", stock: 8 },
      ],
    },
    {
      name: "Double-Faced Cashmere Wrap Coat",
      slug: "double-faced-cashmere-wrap-coat",
      description: "Hand-stitched double-faced cashmere overcoat with a waterfall shawl collar and self-tie belt. Sumptuously unlined for lightweight warmth.",
      basePrice: 32000,
      sku: "MN-COAT-017",
      gender: "WOMEN",
      categorySlug: "women-jackets",
      collectionSlug: "after-dark",
      isFeatured: true,
      fabricDetails: "100% Mongolian Cashmere Double-Face",
      careInstructions: "Specialist dry clean only.",
      fitInfo: "Relaxed wrap styling. Cinch waist with belt.",
      images: [
        { url: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "S", colorName: "Camel Gold", colorHex: "#C19A6B", stock: 6 },
        { size: "M", colorName: "Camel Gold", colorHex: "#C19A6B", stock: 8 },
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 7 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 10 },
      ],
    },
    {
      name: "Bias-Cut Silk Charmeuse Midi Skirt",
      slug: "bias-cut-silk-charmeuse-midi-skirt",
      description: "Luxurious 22 Momme silk charmeuse with an elasticated grosgrain waistband. Liquid drape reflects the light with every step.",
      basePrice: 8200,
      sku: "MN-SKT-018",
      gender: "WOMEN",
      categorySlug: "women-skirts",
      collectionSlug: "essentials",
      isFeatured: false,
      fabricDetails: "100% Pure Silk Charmeuse",
      careInstructions: "Hand wash cold with delicate silk detergent.",
      fitInfo: "Gently hugs the hips before flaring into a fluid midi hem.",
      images: [
        { url: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "XS", colorName: "Antique Gold", colorHex: "#B89A5A", stock: 9 },
        { size: "S", colorName: "Antique Gold", colorHex: "#B89A5A", stock: 14 },
        { size: "M", colorName: "Antique Gold", colorHex: "#B89A5A", stock: 11 },
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 16 },
      ],
    },
    {
      name: "Structured Cotton Corset Top",
      slug: "structured-cotton-corset-top",
      description: "Modernized tailoring featuring internal flexible boning, an exposed antique gold back zipper, and a sweetheart neckline.",
      basePrice: 6200,
      sku: "MN-COR-019",
      gender: "WOMEN",
      categorySlug: "women-tops",
      collectionSlug: "streetwear",
      isFeatured: false,
      fabricDetails: "97% Cotton Twill, 3% Spandex with cotton lining",
      careInstructions: "Dry clean or gentle hand wash.",
      fitInfo: "Form-fitting structural bodice.",
      images: [
        { url: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "XS", colorName: "Royal Noir", colorHex: "#121212", stock: 10 },
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 15 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 12 },
      ],
    },
    {
      name: "Draped Velvet Cocktail Mini Dress",
      slug: "draped-velvet-cocktail-mini-dress",
      description: "Plush midnight velvet gathered at the hip with asymmetrical draping and a high mock neckline. Rich, tactile, and unforgettable.",
      basePrice: 12800,
      salePrice: 10800,
      sku: "MN-VLV-020",
      gender: "WOMEN",
      categorySlug: "women-dresses",
      collectionSlug: "after-dark",
      isFeatured: true,
      fabricDetails: "82% Rayon, 18% Silk Velvet",
      careInstructions: "Dry clean only. Do not iron.",
      fitInfo: "Bodycon silhouette with flattering side ruching.",
      images: [
        { url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "XS", colorName: "Deep Burgundy", colorHex: "#4A1424", stock: 7 },
        { size: "S", colorName: "Deep Burgundy", colorHex: "#4A1424", stock: 12 },
        { size: "M", colorName: "Deep Burgundy", colorHex: "#4A1424", stock: 10 },
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 14 },
      ],
    },
    {
      name: "High-Waist Japanese Vintage Wash Denim",
      slug: "high-waist-japanese-vintage-wash-denim",
      description: "13 oz non-stretch Japanese cotton denim subtly hand-abraded for an authentic aged patina. Straight leg with a clean floor-length hem.",
      basePrice: 7900,
      sku: "MN-WJN-021",
      gender: "WOMEN",
      categorySlug: "women-jeans-trousers",
      collectionSlug: "streetwear",
      isFeatured: false,
      fabricDetails: "100% Japanese Cotton Denim",
      careInstructions: "Machine wash cold inside out. Hang dry.",
      fitInfo: "Flattering high rise fitted through the hips.",
      images: [
        { url: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "26", colorName: "Washed Noir", colorHex: "#2B2D42", stock: 8 },
        { size: "28", colorName: "Washed Noir", colorHex: "#2B2D42", stock: 14 },
        { size: "30", colorName: "Washed Noir", colorHex: "#2B2D42", stock: 12 },
      ],
    },
    {
      name: "Merino Knit Ribbed Midi Dress",
      slug: "merino-knit-ribbed-midi-dress",
      description: "Fine-gauge ribbed merino wool dress with a flattering square neckline and a subtle side slit. Effortlessly transitions from boardroom to evening.",
      basePrice: 11500,
      sku: "MN-KNT-022",
      gender: "WOMEN",
      categorySlug: "women-dresses",
      collectionSlug: "essentials",
      isFeatured: false,
      fabricDetails: "100% Extrafine Merino Wool",
      careInstructions: "Hand wash cold. Dry flat on towel.",
      fitInfo: "Form-fitting ribbed stretch.",
      images: [
        { url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "XS", colorName: "Royal Noir", colorHex: "#121212", stock: 9 },
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 14 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 11 },
      ],
    },
    {
      name: "Trench Coat in Waterproof Cotton Gabardine",
      slug: "trench-coat-waterproof-cotton-gabardine",
      description: "Traditional storm-flapped trench reinvented with oversized lapels, deep horn buckles, and a removable insulated quilted lining.",
      basePrice: 21000,
      sku: "MN-TRN-023",
      gender: "WOMEN",
      categorySlug: "women-jackets",
      collectionSlug: "essentials",
      isFeatured: false,
      fabricDetails: "100% Water-Resistant Cotton Gabardine",
      careInstructions: "Specialist dry clean.",
      fitInfo: "Generous tailored cut for layering.",
      images: [
        { url: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "S", colorName: "Warm Sand", colorHex: "#D8C3A5", stock: 8 },
        { size: "M", colorName: "Warm Sand", colorHex: "#D8C3A5", stock: 10 },
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 12 },
      ],
    },
    {
      name: "Pleated Asymmetric Georgette Skirt",
      slug: "pleated-asymmetric-georgette-skirt",
      description: "Sunray knife pleats in lightweight georgette with an asymmetric handkerchief hem that creates hypnotic movement.",
      basePrice: 7600,
      sku: "MN-GEO-024",
      gender: "WOMEN",
      categorySlug: "women-skirts",
      collectionSlug: "after-dark",
      isFeatured: false,
      fabricDetails: "100% Poly Georgette with Silk Habotai Lining",
      careInstructions: "Dry clean only to maintain crisp pleating.",
      fitInfo: "Mid-rise waistband with hidden zip.",
      images: [
        { url: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 10 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 8 },
      ],
    },
    {
      name: "Open-Back Silk Charmeuse Evening Top",
      slug: "open-back-silk-charmeuse-evening-top",
      description: "High halter neckline falling into a cowl drape at the back. Crafted from 22 Momme heavyweight silk charmeuse.",
      basePrice: 6800,
      sku: "MN-HLT-025",
      gender: "WOMEN",
      categorySlug: "women-tops",
      collectionSlug: "after-dark",
      isFeatured: false,
      fabricDetails: "100% Pure Mulberry Silk",
      careInstructions: "Dry clean or cold hand wash.",
      fitInfo: "Draped relaxed silhouette.",
      images: [
        { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "S", colorName: "Antique Gold", colorHex: "#B89A5A", stock: 11 },
        { size: "M", colorName: "Antique Gold", colorHex: "#B89A5A", stock: 9 },
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 14 },
      ],
    },
    {
      name: "Embellished Velvet Gala Gown",
      slug: "embellished-velvet-gala-gown",
      description: "Floor-length midnight velvet gown with hand-applied jet black crystal beading across the collarbones and cuffs.",
      basePrice: 34000,
      sku: "MN-GLA-026",
      gender: "WOMEN",
      categorySlug: "women-occasion",
      collectionSlug: "black-tie",
      isFeatured: true,
      fabricDetails: "Silk-Rayon Velvet with Glass Jet Bead Accents",
      careInstructions: "Specialist couture cleaning only.",
      fitInfo: "Architectural mermaid hem with modest sweep train.",
      images: [
        { url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "XS", colorName: "Royal Noir", colorHex: "#121212", stock: 4 },
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 6 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 5 },
      ],
    },

    // ── UNISEX & STREETWEAR / ACCESSORIES (6) ──
    {
      name: "The Maison Monogram Leather Belt",
      slug: "the-maison-monogram-leather-belt",
      description: "Handcrafted from 3.5mm full-grain vegetable-tanned Italian bridle leather. Features a sculpted solid brass buckle plated in 18k antique gold.",
      basePrice: 4800,
      sku: "MN-BLT-027",
      gender: "UNISEX",
      categorySlug: "accessories-leather",
      collectionSlug: "essentials",
      isFeatured: false,
      fabricDetails: "100% Full-Grain Italian Bridle Leather, Solid Brass Hardware",
      careInstructions: "Condition with natural beeswax leather balm annually.",
      fitInfo: "Width: 35mm. Order 2 inches larger than pant waist.",
      images: [
        { url: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "32", colorName: "Royal Noir", colorHex: "#121212", stock: 15 },
        { size: "34", colorName: "Royal Noir", colorHex: "#121212", stock: 20 },
        { size: "36", colorName: "Royal Noir", colorHex: "#121212", stock: 12 },
      ],
    },
    {
      name: "Minimalist Italian Leather Cardholder",
      slug: "minimalist-italian-leather-cardholder",
      description: "Ultra-slim profile crafted from French box calf leather with hand-painted beveled edges. Accommodates 6 cards with a central cash slot.",
      basePrice: 2800,
      sku: "MN-CRD-028",
      gender: "UNISEX",
      categorySlug: "accessories-leather",
      collectionSlug: "essentials",
      isFeatured: false,
      fabricDetails: "100% French Box Calf Leather, Cupro Lined",
      careInstructions: "Wipe with soft damp cloth.",
      fitInfo: "Dimensions: 10cm x 7.5cm.",
      images: [
        { url: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "One Size", colorName: "Royal Noir", colorHex: "#121212", stock: 30 },
        { size: "One Size", colorName: "Deep Burgundy", colorHex: "#4A1424", stock: 18 },
      ],
    },
    {
      name: "Raw-Edge Luxury Wool Scarf",
      slug: "raw-edge-luxury-wool-scarf",
      description: "Oversized 200cm x 70cm scarf woven from superfine Geelong lambswool with eyelash fringing. Cloud-soft warmth for crisp evenings.",
      basePrice: 4500,
      sku: "MN-SCF-029",
      gender: "UNISEX",
      categorySlug: "streetwear",
      collectionSlug: "essentials",
      isFeatured: false,
      fabricDetails: "100% Superfine Australian Lambswool",
      careInstructions: "Dry clean only.",
      fitInfo: "Generous 200cm length for multi-wrap styling.",
      images: [
        { url: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "One Size", colorName: "Royal Noir", colorHex: "#121212", stock: 25 },
        { size: "One Size", colorName: "Warm Ivory", colorHex: "#F5F0E6", stock: 15 },
      ],
    },
    {
      name: "Nocturne Heavyweight Zippered Hoodie",
      slug: "nocturne-heavyweight-zippered-hoodie",
      description: "Relaxed unisex zip hoodie in 460 GSM combed cotton fleece with two-way RiRi antique gold zippers and ribbed contour paneling.",
      basePrice: 6900,
      sku: "MN-ZIP-030",
      gender: "UNISEX",
      categorySlug: "streetwear",
      collectionSlug: "streetwear",
      isFeatured: true,
      fabricDetails: "100% Combed Cotton Fleece, 460 GSM",
      careInstructions: "Machine wash cold inside out. Hang dry.",
      fitInfo: "Unisex relaxed fit. Women recommended to size down one size.",
      images: [
        { url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 14 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 22 },
        { size: "L", colorName: "Royal Noir", colorHex: "#121212", stock: 18 },
        { size: "XL", colorName: "Royal Noir", colorHex: "#121212", stock: 10 },
      ],
    },
    {
      name: "Heavyweight Boxy Graphic Longsleeve",
      slug: "heavyweight-boxy-graphic-longsleeve",
      description: "Heavy 280 GSM cotton jersey with ribbed cuffs and subtle archival typography screen-printed in matte gold discharge ink.",
      basePrice: 4600,
      sku: "MN-LNG-031",
      gender: "UNISEX",
      categorySlug: "streetwear",
      collectionSlug: "streetwear",
      isFeatured: false,
      fabricDetails: "100% Compact Spun Cotton Jersey, 280 GSM",
      careInstructions: "Cold wash inside out. Do not iron directly on print.",
      fitInfo: "Wide chest with dropped shoulders.",
      images: [
        { url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop", isPrimary: true },
      ],
      variants: [
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 12 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 18 },
        { size: "L", colorName: "Royal Noir", colorHex: "#121212", stock: 14 },
      ],
    },
    {
      name: "Tailored Technical Bomber Jacket",
      slug: "tailored-technical-bomber-jacket",
      description: "Refined flight jacket crafted from Italian double-weave satin twill with a light Primaloft insulation layer and gold Swiss hardware.",
      basePrice: 16500,
      salePrice: 14200,
      sku: "MN-BMB-032",
      gender: "UNISEX",
      categorySlug: "streetwear",
      collectionSlug: "streetwear",
      isFeatured: true,
      fabricDetails: "Japanese Memory Twill Shell with 60g Primaloft Gold Insulation",
      careInstructions: "Specialist dry clean.",
      fitInfo: "Modern cropped body with elongated sleeves.",
      images: [
        { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop", isPrimary: false },
      ],
      variants: [
        { size: "S", colorName: "Royal Noir", colorHex: "#121212", stock: 10 },
        { size: "M", colorName: "Royal Noir", colorHex: "#121212", stock: 16 },
        { size: "L", colorName: "Royal Noir", colorHex: "#121212", stock: 12 },
        { size: "M", colorName: "Dark Olive", colorHex: "#353831", stock: 8 },
      ],
    },
  ];

  let totalVariants = 0;
  for (const p of products) {
    const categoryId = categories[p.categorySlug];
    const collectionId = p.collectionSlug ? collections[p.collectionSlug] : null;

    if (!categoryId) {
      console.warn(`Category ${p.categorySlug} not found for product ${p.name}`);
      continue;
    }

    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        basePrice: p.basePrice,
        salePrice: p.salePrice || null,
        sku: p.sku,
        gender: p.gender,
        fabricDetails: p.fabricDetails,
        careInstructions: p.careInstructions,
        fitInfo: p.fitInfo,
        isFeatured: p.isFeatured,
        isPublished: true,
        averageRating: 4.8 + Math.round(Math.random() * 2) / 10,
        reviewCount: Math.floor(Math.random() * 24) + 6,
        categoryId,
        collectionId,
        images: {
          create: p.images.map((img, idx) => ({
            url: img.url,
            isPrimary: img.isPrimary,
            displayOrder: idx,
            altText: `${p.name} - Luxury Clothing`,
          })),
        },
        variants: {
          create: p.variants.map((v) => ({
            size: v.size,
            colorName: v.colorName,
            colorHex: v.colorHex,
            sku: `${p.sku}-${v.size}-${v.colorName.substring(0, 3).toUpperCase()}`,
            stock: v.stock,
            isActive: true,
          })),
        },
      },
    });

    totalVariants += p.variants.length;
  }

  console.log(`✔ Seeded ${products.length} luxury clothing products with ${totalVariants} variants.`);

  // ── 6. Create Coupons ───
  await prisma.coupon.createMany({
    data: [
      {
        code: "WELCOME10",
        description: "10% off your inaugural acquisition",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderValue: 2000,
        maxDiscount: 2000,
        maxUses: 500,
        isActive: true,
      },
      {
        code: "ROYALNOIR",
        description: "Flat ₹1,500 off on orders over ₹10,000",
        discountType: "FIXED",
        discountValue: 1500,
        minOrderValue: 10000,
        maxUses: 200,
        isActive: true,
      },
    ],
  });
  console.log("✔ Created promotional coupons (WELCOME10, ROYALNOIR).");

  console.log("✨ Seeding completed successfully for MAISON NOIR!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
