import { db } from "@/lib/db";
import { HeroCampaign } from "@/components/home/HeroCampaign";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CuratedCollection } from "@/components/home/CuratedCollection";
import { BrandStorySection } from "@/components/home/BrandStorySection";
import { CraftsmanshipSection } from "@/components/home/CraftsmanshipSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { EditorialLookbook } from "@/components/home/EditorialLookbook";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Direct Server-Side Database Queries
  const [featuredProducts, newArrivals] = await Promise.all([
    db.product.findMany({
      where: {
        isFeatured: true,
        isPublished: true,
      },
      take: 8,
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: {
          where: { isActive: true },
        },
        category: {
          select: { name: true, slug: true },
        },
        collection: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.product.findMany({
      where: {
        isPublished: true,
      },
      take: 8,
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: {
          where: { isActive: true },
        },
        category: {
          select: { name: true, slug: true },
        },
        collection: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <div className="w-full">
      {/* 1. Full-Width Fashion Campaign Hero */}
      <HeroCampaign />

      {/* 2. Shop by Category (Men, Women, Streetwear, Accessories) */}
      <CategoryGrid />

      {/* 3. Featured Masterpieces (From Database) */}
      <CuratedCollection
        title="Featured Masterpieces"
        label="Curated Haute Wardrobe"
        subtitle="Commanding silhouettes crafted with uncompromising fabric density and tailored lines."
        viewAllHref="/collections"
        products={featuredProducts}
      />

      {/* 4. The Brand Philosophy & Craft Story */}
      <BrandStorySection />

      {/* 5. New Arrivals (From Database) */}
      <CuratedCollection
        title="The Inaugural Drop"
        label="Fresh from the Atelier"
        subtitle="The latest arrivals designed for effortless everyday wear and midnight engagements."
        viewAllHref="/collections/new-arrivals"
        products={newArrivals}
      />

      {/* 6. Atelier Quality & Craftsmanship Standards */}
      <CraftsmanshipSection />

      {/* 7. Patron Reviews & Verified Experiences */}
      <TestimonialsSection />

      {/* 8. Visual Editorial & Lookbook Gallery */}
      <EditorialLookbook />
    </div>
  );
}
