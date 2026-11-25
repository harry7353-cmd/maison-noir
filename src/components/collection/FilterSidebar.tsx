"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { FilterIcon, CloseIcon, ChevronDownIcon } from "@/components/ui/Icons";

interface FilterSidebarProps {
  categories: Array<{ id: string; name: string; slug: string; gender: string }>;
  availableColors: Array<{ name: string; hex: string }>;
  totalProducts: number;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38"];

export function FilterSidebar({
  categories,
  availableColors,
  totalProducts,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Active filters from URL
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSize = searchParams.get("size") || "";
  const currentColor = searchParams.get("color") || "";
  const currentInStock = searchParams.get("inStock") === "true";

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = Boolean(
    currentCategory || currentMinPrice || currentMaxPrice || currentSize || currentColor || currentInStock
  );

  return (
    <>
      {/* ── Top Bar Controls: Item Count, Mobile Filter Trigger & Sort Dropdown ─── */}
      <div className="flex items-center justify-between py-4 mb-8 border-y border-border">
        {/* Left: Mobile trigger & item count */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpenMobile(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border border-border text-xs font-medium tracking-widest uppercase hover:border-gold transition-colors"
          >
            <FilterIcon size={14} />
            <span>Filters {hasActiveFilters && "•"}</span>
          </button>
          <span className="text-xs text-muted tracking-wider">
            Showing <strong className="text-noir font-semibold">{totalProducts}</strong> bespoke piece{totalProducts === 1 ? "" : "s"}
          </span>
        </div>

        {/* Right: Sort selector */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-label text-[10px] text-muted tracking-widest uppercase">
            Sort by:
          </span>
          <select
            value={currentSort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="px-3 py-1.5 bg-white border border-border text-xs text-noir font-medium tracking-wider uppercase focus:outline-none focus:border-gold cursor-pointer"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Most Coveted</option>
          </select>
        </div>
      </div>

      {/* ── Active Filters Ribbon ─── */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-[11px] text-muted uppercase tracking-wider mr-1">
            Active Filters:
          </span>

          {currentCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-ivory text-noir text-[11px] font-medium border border-border">
              {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
              <button
                onClick={() => updateFilter("category", null)}
                className="hover:text-gold"
              >
                <CloseIcon size={12} />
              </button>
            </span>
          )}

          {currentSize && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-ivory text-noir text-[11px] font-medium border border-border">
              Size: {currentSize}
              <button
                onClick={() => updateFilter("size", null)}
                className="hover:text-gold"
              >
                <CloseIcon size={12} />
              </button>
            </span>
          )}

          {currentColor && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-ivory text-noir text-[11px] font-medium border border-border">
              Color: {currentColor}
              <button
                onClick={() => updateFilter("color", null)}
                className="hover:text-gold"
              >
                <CloseIcon size={12} />
              </button>
            </span>
          )}

          {currentInStock && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-ivory text-noir text-[11px] font-medium border border-border">
              In Stock Only
              <button
                onClick={() => updateFilter("inStock", null)}
                className="hover:text-gold"
              >
                <CloseIcon size={12} />
              </button>
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className="text-[11px] text-burgundy font-medium underline underline-offset-4 hover:text-burgundy-light ml-2 uppercase tracking-wider"
          >
            Clear All
          </button>
        </div>
      )}

      {/* ── Desktop Sidebar Content (Component used inside page layout) ─── */}
      <div className="hidden lg:block w-64 flex-shrink-0 space-y-8 pr-6">
        {/* Category filter */}
        {categories.length > 0 && (
          <div className="border-b border-border pb-6">
            <h3 className="text-label text-[11px] text-noir tracking-[0.2em] mb-4">
              Categories
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
              <button
                onClick={() => updateFilter("category", null)}
                className={`block text-xs text-left w-full transition-colors ${
                  !currentCategory ? "text-gold font-semibold" : "text-muted hover:text-noir"
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateFilter("category", c.slug === currentCategory ? null : c.slug)}
                  className={`block text-xs text-left w-full transition-colors ${
                    c.slug === currentCategory
                      ? "text-gold font-semibold"
                      : "text-muted hover:text-noir"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Filter */}
        <div className="border-b border-border pb-6">
          <h3 className="text-label text-[11px] text-noir tracking-[0.2em] mb-4">
            Size
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => updateFilter("size", s === currentSize ? null : s)}
                className={`py-2 text-xs font-medium border text-center transition-colors ${
                  s === currentSize
                    ? "bg-noir text-white border-noir"
                    : "bg-white text-noir border-border hover:border-gold"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Color Swatch Filter */}
        {availableColors.length > 0 && (
          <div className="border-b border-border pb-6">
            <h3 className="text-label text-[11px] text-noir tracking-[0.2em] mb-4">
              Color Palette
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {availableColors.map((col) => (
                <button
                  key={col.name}
                  onClick={() => updateFilter("color", col.name === currentColor ? null : col.name)}
                  title={col.name}
                  className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center ${
                    col.name === currentColor
                      ? "ring-2 ring-gold ring-offset-2 border-noir scale-110"
                      : "border-border hover:scale-105"
                  }`}
                  style={{ backgroundColor: col.hex }}
                >
                  {col.name === currentColor && (
                    <span
                      className={`text-[9px] font-bold ${
                        col.hex.toLowerCase() === "#ffffff" || col.hex.toLowerCase() === "#f5f0e6"
                          ? "text-noir"
                          : "text-white"
                      }`}
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* In Stock Toggle */}
        <div className="pb-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={currentInStock}
              onChange={(e) => updateFilter("inStock", e.target.checked ? "true" : null)}
              className="w-4 h-4 accent-gold cursor-pointer"
            />
            <span className="text-xs text-noir font-medium tracking-wider uppercase">
              In Stock Available
            </span>
          </label>
        </div>
      </div>

      {/* ── Mobile Filter Modal Drawer ─── */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-noir/50 backdrop-blur-sm"
            onClick={() => setIsOpenMobile(false)}
          />

          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <h3 className="heading-section text-lg text-noir">Filter &amp; Refine</h3>
              <button
                onClick={() => setIsOpenMobile(false)}
                className="p-1 hover:text-gold"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Mobile Categories */}
            {categories.length > 0 && (
              <div className="mb-6 pb-6 border-b border-border">
                <span className="text-label text-[11px] text-noir block mb-3">
                  Categories
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => {
                      updateFilter("category", null);
                      setIsOpenMobile(false);
                    }}
                    className={`block text-xs text-left w-full ${
                      !currentCategory ? "text-gold font-semibold" : "text-muted"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        updateFilter("category", c.slug === currentCategory ? null : c.slug);
                        setIsOpenMobile(false);
                      }}
                      className={`block text-xs text-left w-full ${
                        c.slug === currentCategory ? "text-gold font-semibold" : "text-muted"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Sizes */}
            <div className="mb-6 pb-6 border-b border-border">
              <span className="text-label text-[11px] text-noir block mb-3">
                Size
              </span>
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      updateFilter("size", s === currentSize ? null : s);
                      setIsOpenMobile(false);
                    }}
                    className={`py-2 text-xs font-medium border text-center ${
                      s === currentSize
                        ? "bg-noir text-white border-noir"
                        : "bg-white text-noir border-border"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Apply & Clear */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsOpenMobile(false)}
                className="btn-primary w-full !py-3 text-xs"
              >
                Apply Filters
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    clearAllFilters();
                    setIsOpenMobile(false);
                  }}
                  className="btn-secondary w-full !py-3 text-xs"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
