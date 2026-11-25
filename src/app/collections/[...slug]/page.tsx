import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import { FilterSidebar } from "@/components/collection/FilterSidebar";
import { ProductCatalogGrid } from "@/components/collection/ProductCatalogGrid";
import { Prisma } from "@prisma/client";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{
    category?: string;
    size?: string;
    color?: string;
    sort?: string;
    inStock?: string;
    page?: string;
  }>;
}

export default async function DynamicCollectionPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const primarySlug = slug[0]?.toLowerCase() || "";
  const secondarySlug = slug[1]?.toLowerCase() || "";

  const page = Math.max(1, parseInt(search.page || "1", 10));
  const limit = 12;
  const skip = (page - 1) * limit;

  // ── Determine Context (Gender, Category, Brand Collection, or Special) ───
  let title = "Collection";
  let tagline: string | null = "MAISON NOIR";
  let description: string | null = null;
  let bannerUrl: string | null = null;
  const breadcrumbs: Array<{ label: string; href?: string }> = [
    { label: "Collections", href: "/collections" },
  ];

  const where: Prisma.ProductWhereInput = {
    isPublished: true,
  };

  // Case 1: Men's Root or Subcategory
  if (primarySlug === "men") {
    where.gender = "MEN";
    title = "Men's Collection";
    tagline = "Precision Cut Tailoring & Streetwear";
    description = "Italian wool suits, Giza cotton staples, Japanese selvedge denim, and structured outerwear.";
    bannerUrl = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop";
    breadcrumbs.push({ label: "Men", href: secondarySlug ? "/collections/men" : undefined });

    if (secondarySlug) {
      const cat = await db.category.findFirst({
        where: { slug: { contains: secondarySlug } },
      });
      if (cat) {
        where.categoryId = cat.id;
        title = cat.name;
        description = cat.description;
        breadcrumbs.push({ label: cat.name });
      }
    }
  }
  // Case 2: Women's Root or Subcategory
  else if (primarySlug === "women") {
    where.gender = "WOMEN";
    title = "Women's Collection";
    tagline = "Architectural Grace & Evening Radiance";
    description = "Mulberry silk slip gowns, sculpted hourglass blazers, palazzo crepe trousers, and cashmere outerwear.";
    bannerUrl = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1600&auto=format&fit=crop";
    breadcrumbs.push({ label: "Women", href: secondarySlug ? "/collections/women" : undefined });

    if (secondarySlug) {
      const cat = await db.category.findFirst({
        where: { slug: { contains: secondarySlug } },
      });
      if (cat) {
        where.categoryId = cat.id;
        title = cat.name;
        description = cat.description;
        breadcrumbs.push({ label: cat.name });
      }
    }
  }
  // Case 3: New Arrivals
  else if (primarySlug === "new-arrivals") {
    title = "New Arrivals";
    tagline = "The Inaugural Drop 2026";
    description = "The latest additions to the House of MAISON NOIR. Fresh from our master European and Japanese mills.";
    bannerUrl = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop";
    breadcrumbs.push({ label: "New Arrivals" });
  }
  // Case 4: Best Sellers
  else if (primarySlug === "best-sellers") {
    where.averageRating = { gte: 4.8 };
    title = "Best Sellers";
    tagline = "The Most Coveted Pieces";
    description = "Our most desired garments, celebrated for iconic silhouettes and peerless craftsmanship.";
    breadcrumbs.push({ label: "Best Sellers" });
  }
  // Case 5: Sale
  else if (primarySlug === "sale") {
    where.salePrice = { not: null };
    title = "Private Sale";
    tagline = "Archival Privileges";
    description = "Complimentary price adjustments across select seasonal wardrobe acquisitions.";
    breadcrumbs.push({ label: "Sale" });
  }
  // Case 6: Accessories
  else if (primarySlug === "accessories") {
    where.category = { slug: { contains: "accessories" } };
    title = "Leather & Bespoke Accessories";
    tagline = "The Finishing Touch";
    description = "Handcrafted full-grain Italian leather belts, box calf cardholders, and superfine lambswool scarves.";
    breadcrumbs.push({ label: "Accessories" });
  }
  // Case 7: Brand Collection (e.g. streetwear, after-dark, essentials, black-tie)
  else {
    const matchedCollection = await db.collection.findUnique({
      where: { slug: primarySlug },
    });

    if (matchedCollection) {
      where.collectionId = matchedCollection.id;
      title = matchedCollection.name;
      tagline = matchedCollection.tagline;
      description = matchedCollection.description;
      bannerUrl = matchedCollection.bannerUrl;
      breadcrumbs.push({ label: matchedCollection.name });
    } else {
      // Check category by slug
      const matchedCategory = await db.category.findUnique({
        where: { slug: primarySlug },
      });

      if (matchedCategory) {
        where.categoryId = matchedCategory.id;
        title = matchedCategory.name;
        description = matchedCategory.description;
        breadcrumbs.push({ label: matchedCategory.name });
      } else {
        notFound();
      }
    }
  }

  // ── Apply Query String Filters (category, size, color, inStock) ───
  if (search.category) {
    where.category = { slug: search.category };
  }

  if (search.size) {
    where.variants = {
      some: {
        size: search.size,
        stock: search.inStock === "true" ? { gt: 0 } : undefined,
      },
    };
  }

  if (search.color) {
    where.variants = {
      some: {
        colorName: search.color,
        stock: search.inStock === "true" ? { gt: 0 } : undefined,
      },
    };
  }

  if (search.inStock === "true" && !search.size && !search.color) {
    where.variants = {
      some: {
        stock: { gt: 0 },
      },
    };
  }

  // ── Sort ───
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (search.sort === "price-asc") orderBy = { basePrice: "asc" };
  else if (search.sort === "price-desc") orderBy = { basePrice: "desc" };
  else if (search.sort === "popular") orderBy = { averageRating: "desc" };

  // ── Parallel Execution ───
  const [categories, rawVariants, products, total] = await Promise.all([
    db.category.findMany({
      where: {
        isActive: true,
        gender: where.gender ? (where.gender as string) : undefined,
      },
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
        title={title}
        tagline={tagline}
        description={description}
        bannerUrl={bannerUrl}
        breadcrumbs={breadcrumbs}
      />

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
