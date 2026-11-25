import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import { FilterSidebar } from "@/components/collection/FilterSidebar";
import { ProductCatalogGrid } from "@/components/collection/ProductCatalogGrid";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { Prisma } from "@prisma/client";

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{
    category?: string;
    size?: string;
    color?: string;
    sort?: string;
    inStock?: string;
    page?: string;
  }>;
}

export default async function CollectionsIndexPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 12;
  const skip = (page - 1) * limit;

  // Build filter query
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
  };

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.size) {
    where.variants = {
      some: {
        size: params.size,
        stock: params.inStock === "true" ? { gt: 0 } : undefined,
      },
    };
  }

  if (params.color) {
    where.variants = {
      some: {
        colorName: params.color,
        stock: params.inStock === "true" ? { gt: 0 } : undefined,
      },
    };
  }

  if (params.inStock === "true" && !params.size && !params.color) {
    where.variants = {
      some: {
        stock: { gt: 0 },
      },
    };
  }

  // Sort
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (params.sort === "price-asc") orderBy = { basePrice: "asc" };
  else if (params.sort === "price-desc") orderBy = { basePrice: "desc" };
  else if (params.sort === "popular") orderBy = { averageRating: "desc" };

  // Fetch collections, categories, colors, and products in parallel
  const [collections, categories, rawVariants, products, total] = await Promise.all([
    db.collection.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    db.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true, gender: true },
      orderBy: { displayOrder: "asc" },
    }),
    db.productVariant.findMany({
      where: { isActive: true },
      select: { colorName: true, colorHex: true },
      distinct: ["colorHex"],
    }),
    db.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { isActive: true } },
        category: { select: { name: true, slug: true } },
        collection: { select: { name: true, slug: true } },
      },
    }),
    db.product.count({ where }),
  ]);

  const availableColors = rawVariants.map((v) => ({
    name: v.colorName,
    hex: v.colorHex,
  }));

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="w-full pb-24">
      {/* ── Collection Header ─── */}
      <CollectionHeader
        title="The Complete Wardrobe"
        tagline="The Permanent Catalogue"
        description="Explore the full spectrum of MAISON NOIR. From architectural evening wear to relaxed streetwear and tailored everyday essentials."
        breadcrumbs={[{ label: "Collections" }]}
      />

      {/* ── Collections Featured Showcase Bar ─── */}
      <div className="bg-ivory-light/50 border-b border-border py-12">
        <div className="container-luxury">
          <span className="text-label text-gold text-[10px] tracking-[0.25em] block mb-6">
            Featured Collections
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="group relative aspect-[16/10] overflow-hidden bg-noir border border-border block"
              >
                {col.bannerUrl && (
                  <Image
                    src={col.bannerUrl}
                    alt={col.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover object-center opacity-70 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/30 to-transparent p-5 flex flex-col justify-end text-white">
                  <h3 className="heading-section text-base text-white group-hover:text-gold-light transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-[10px] text-white/60 tracking-wider">
                    {col._count.products} Garments • Explore
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Catalog Layout ─── */}
      <div className="container-luxury pt-10">
        <FilterSidebar
          categories={categories}
          availableColors={availableColors}
          totalProducts={total}
        />

        <div className="flex gap-10">
          {/* Desktop Filter Sidebar (in-page space) */}
          <div className="hidden lg:block w-64 flex-shrink-0" />

          {/* Product Grid */}
          <ProductCatalogGrid
            products={products}
            total={total}
            currentPage={page}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}
