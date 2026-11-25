import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetailsClient } from "@/components/product/ProductDetailsClient";
import { ProductReviewsSection } from "@/components/product/ProductReviewsSection";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronRightIcon, SparklesIcon, ShieldIcon, TruckIcon } from "@/components/ui/Icons";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// ── Dynamic SEO & OpenGraph Metadata ───
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      category: true,
      collection: true,
    },
  });

  if (!product) {
    return {
      title: "Garment Not Found | MAISON NOIR",
    };
  }

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    "";

  return {
    title: `${product.name} | MAISON NOIR`,
    description:
      product.description.slice(0, 155) ||
      "Bespoke luxury clothing handcrafted with uncompromising fabric discipline.",
    openGraph: {
      title: `${product.name} — MAISON NOIR`,
      description: product.description,
      images: primaryImage ? [{ url: primaryImage, alt: product.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — MAISON NOIR`,
      description: product.description.slice(0, 155),
      images: primaryImage ? [primaryImage] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // 1. Fetch primary product with all relational dependencies
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      collection: true,
      images: {
        orderBy: { displayOrder: "asc" },
      },
      variants: {
        where: { isActive: true },
        orderBy: { size: "asc" },
      },
      reviews: {
        where: { isApproved: true },
        include: {
          user: {
            select: {
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // 2. Fetch curated related garments
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isPublished: true,
    },
    take: 4,
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      variants: { where: { isActive: true } },
      category: true,
    },
  });

  // If category has fewer than 4 items, backfill with other published products
  let curatedRelated = [...relatedProducts];
  if (curatedRelated.length < 4) {
    const additional = await prisma.product.findMany({
      where: {
        id: { notIn: [product.id, ...curatedRelated.map((p) => p.id)] },
        isPublished: true,
      },
      take: 4 - curatedRelated.length,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { isActive: true } },
        category: true,
      },
    });
    curatedRelated = [...curatedRelated, ...additional];
  }

  const discountPercent =
    product.salePrice && product.salePrice < product.basePrice
      ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
      : null;

  return (
    <div className="bg-white min-h-screen">
      
      {/* ── Breadcrumb Navigation ─── */}
      <nav
        aria-label="Breadcrumbs"
        className="border-b border-border bg-ivory-light/40 py-3.5 px-4 sm:px-6 lg:px-8 text-xs text-muted"
      >
        <div className="max-w-7xl mx-auto flex items-center space-x-2">
          <Link
            href="/"
            className="hover:text-gold transition-colors tracking-wide uppercase font-light text-[11px]"
          >
            Home
          </Link>
          <ChevronRightIcon size={12} className="text-border" />
          <Link
            href="/collections"
            className="hover:text-gold transition-colors tracking-wide uppercase font-light text-[11px]"
          >
            Collections
          </Link>
          {product.category && (
            <>
              <ChevronRightIcon size={12} className="text-border" />
              <Link
                href={`/collections/${product.category.slug}`}
                className="hover:text-gold transition-colors tracking-wide uppercase font-light text-[11px]"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRightIcon size={12} className="text-border" />
          <span className="text-noir font-medium tracking-wide truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </div>
      </nav>

      {/* ── Main Product Display Grid ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* Left Column: Gallery & Zoom Lens */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
              discountPercent={discountPercent}
            />
          </div>

          {/* Right Column: Pricing, Variant Matrix & Actions */}
          <div className="lg:col-span-5">
            <ProductDetailsClient
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                basePrice: product.basePrice,
                salePrice: product.salePrice,
                sku: product.sku,
                fabricDetails: product.fabricDetails,
                careInstructions: product.careInstructions,
                fitInfo: product.fitInfo,
                averageRating: product.averageRating,
                reviewCount: product.reviewCount,
                category: product.category,
                collection: product.collection,
                variants: product.variants,
              }}
            />
          </div>

        </div>
      </main>

      {/* ── The Art of the Garment (Editorial Highlights) ─── */}
      <section className="bg-noir text-ivory py-16 lg:py-24 border-t border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-label text-gold text-xs tracking-[0.3em] uppercase block mb-3 font-medium">
              Sartorial Philosophy
            </span>
            <h2 className="heading-display text-2xl sm:text-3xl lg:text-4xl text-ivory">
              The Art of the Garment
            </h2>
            <p className="text-ivory/60 text-sm mt-3 font-light leading-relaxed">
              Every curve, stitch, and fiber is meticulously calculated to deliver unprecedented distinction and comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="border border-gold/20 p-8 bg-noir-light/40 hover:border-gold/60 transition-all duration-300">
              <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold mb-6">
                <SparklesIcon size={20} />
              </div>
              <h3 className="font-serif text-lg text-ivory mb-2 font-medium">
                Ethical Luxury Provenance
              </h3>
              <p className="text-xs text-ivory/70 leading-relaxed font-light">
                {product.fabricDetails ||
                  "Spun from top-tier fibers sourced directly from sustainable heritage mills in Biella and Kyoto."}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border border-gold/20 p-8 bg-noir-light/40 hover:border-gold/60 transition-all duration-300">
              <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold mb-6">
                <ShieldIcon size={20} />
              </div>
              <h3 className="font-serif text-lg text-ivory mb-2 font-medium">
                Uncompromising Tailoring
              </h3>
              <p className="text-xs text-ivory/70 leading-relaxed font-light">
                {product.fitInfo ||
                  "Engineered with anatomical precision, blind-hem stitchery, and double-reinforced stress zones."}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border border-gold/20 p-8 bg-noir-light/40 hover:border-gold/60 transition-all duration-300">
              <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold mb-6">
                <TruckIcon size={20} />
              </div>
              <h3 className="font-serif text-lg text-ivory mb-2 font-medium">
                Signature Presentation
              </h3>
              <p className="text-xs text-ivory/70 leading-relaxed font-light">
                Encased inside an archival matte noir presentation case with hand-tied satin ribbons and a signed certificate of origin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Patron Reviews & Accolades Section ─── */}
      <ProductReviewsSection
        productId={product.id}
        productSlug={product.slug}
        initialReviews={product.reviews}
        averageRating={product.averageRating}
        reviewCount={product.reviewCount}
      />

      {/* ── Curated Recommendations ("You May Also Admire") ─── */}
      {curatedRelated.length > 0 && (
        <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <span className="text-label text-gold text-xs tracking-[0.3em] uppercase block mb-2 font-medium">
                Complementary Ensembles
              </span>
              <h2 className="heading-display text-2xl sm:text-3xl text-noir">
                You May Also Admire
              </h2>
            </div>
            <Link
              href="/collections"
              className="text-xs uppercase tracking-[0.2em] text-noir hover:text-gold font-medium transition-colors inline-flex items-center gap-2 group"
            >
              Explore Complete Wardrobe
              <ChevronRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {curatedRelated.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                slug={item.slug}
                basePrice={item.basePrice}
                salePrice={item.salePrice}
                images={item.images}
                category={item.category}
                variants={item.variants}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
