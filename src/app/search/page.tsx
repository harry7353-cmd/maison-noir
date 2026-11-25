import { db } from "@/lib/db";
import Link from "next/link";
import { FilterSidebar } from "@/components/collection/FilterSidebar";
import { ProductCatalogGrid } from "@/components/collection/ProductCatalogGrid";
import { SearchIcon } from "@/components/ui/Icons";
import { Prisma } from "@prisma/client";

export const revalidate = 60;

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    size?: string;
    color?: string;
    sort?: string;
    inStock?: string;
    page?: string;
  }>;
}

const POPULAR_SEARCHES = ["Cashmere", "Mulberry Silk", "Selvedge Denim", "Hoodie", "Blazer", "Gown"];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 12;
  const skip = (page - 1) * limit;

  // Build filter query
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
  };

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
      { fabricDetails: { contains: query } },
      { category: { name: { contains: query } } },
      { collection: { name: { contains: query } } },
    ];
  }

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

  // Queries
  const [categories, rawVariants, products, total] = await Promise.all([
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
      {/* ── Search Results Banner ─── */}
      <div className="bg-noir text-white py-14 lg:py-20 border-b border-white/10">
        <div className="container-luxury">
          <nav className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/50 mb-4">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gold font-medium">Search</span>
          </nav>

          <span className="text-label text-gold text-xs tracking-[0.3em] block mb-2">
            Catalog Search
          </span>

          <h1 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-white mb-3">
            {query ? (
              <>
                Results for &ldquo;<span className="text-gold italic">{query}</span>&rdquo;
              </>
            ) : (
              "Search the Atelier"
            )}
          </h1>
          <div className="gold-line-left mb-4" />
          <p className="text-xs sm:text-sm text-white/60">
            {total} bespoke piece{total === 1 ? "" : "s"} discovered in the House catalog
          </p>
        </div>
      </div>

      {/* ── Main Catalog Grid & Filters ─── */}
      <div className="container-luxury pt-10">
        {products.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border bg-ivory-light/40 p-12 max-w-2xl mx-auto my-8">
            <SearchIcon size={44} className="text-muted-light mx-auto mb-4" />
            <h3 className="heading-section text-2xl text-noir mb-2">
              No Pieces Matched &ldquo;{query}&rdquo;
            </h3>
            <p className="text-xs text-muted max-w-md mx-auto mb-8">
              We could not find any garments matching your exact query. Discover our recommended collections or try searching for one of our signature fabrics below.
            </p>

            <span className="text-label text-[10px] text-muted tracking-widest uppercase block mb-3">
              Suggested Searches
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {POPULAR_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-4 py-2 bg-white border border-border text-xs font-medium text-noir hover:bg-gold hover:text-white transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>

            <Link href="/collections" className="btn-primary">
              Explore All Collections
            </Link>
          </div>
        ) : (
          <>
            <FilterSidebar
              categories={categories}
              availableColors={availableColors}
              totalProducts={total}
            />

            <div className="flex gap-10">
              <div className="hidden lg:block w-64 flex-shrink-0" />
              <ProductCatalogGrid
                products={products}
                total={total}
                currentPage={page}
                totalPages={totalPages}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
