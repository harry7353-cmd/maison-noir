"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductCard, ProductCardProps } from "@/components/product/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon, ShoppingBagIcon } from "@/components/ui/Icons";

interface ProductCatalogGridProps {
  products: ProductCardProps[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export function ProductCatalogGrid({
  products,
  total,
  currentPage,
  totalPages,
}: ProductCatalogGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-border bg-ivory-light/30 p-12">
        <ShoppingBagIcon size={40} className="text-muted-light mx-auto mb-4" />
        <h3 className="heading-section text-xl text-noir mb-2">
          No Bespoke Pieces Found
        </h3>
        <p className="text-xs text-muted max-w-sm mx-auto mb-6">
          No garments currently match your selected filters. Please adjust your criteria or explore our permanent collections.
        </p>
        <button
          onClick={() => router.push(pathname)}
          className="btn-secondary !py-2.5 !px-6 text-xs"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* ── Product Grid ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* ── Pagination Controls ─── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16 pt-8 border-t border-border">
          {/* Previous Page */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 border border-border text-noir hover:border-gold disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeftIcon size={16} />
          </button>

          {/* Page numbers */}
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-9 h-9 text-xs font-medium tracking-wider border transition-colors ${
                  pageNum === currentPage
                    ? "bg-noir text-white border-noir"
                    : "bg-white text-noir border-border hover:border-gold"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Page */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 border border-border text-noir hover:border-gold disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Next page"
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
