import Link from "next/link";
import { ProductCard, ProductCardProps } from "@/components/product/ProductCard";
import { ArrowRightIcon } from "@/components/ui/Icons";

interface CuratedCollectionProps {
  title: string;
  subtitle?: string;
  label?: string;
  viewAllHref?: string;
  products: ProductCardProps[];
}

export function CuratedCollection({
  title,
  subtitle,
  label = "Curated Selection",
  viewAllHref = "/collections/new-arrivals",
  products,
}: CuratedCollectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 lg:py-24 bg-white border-t border-border/50">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-label text-gold text-xs tracking-[0.3em] block mb-2">
              {label}
            </span>
            <h2 className="heading-section text-2xl sm:text-4xl text-noir">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted mt-2 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-noir hover:text-gold transition-colors group"
          >
            <span>View All Pieces</span>
            <ArrowRightIcon
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
