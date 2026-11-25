"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SearchIcon, CloseIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { BRAND } from "@/lib/constants";

interface SearchResultItem {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number | null;
  images: Array<{ url: string }>;
  category?: { name: string };
  collection?: { name: string };
}

interface LiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Cashmere",
  "Mulberry Silk",
  "Selvedge Denim",
  "French Terry Hoodie",
  "Tuxedo Blazer",
  "Giza Cotton",
];

export function LiveSearchModal({ isOpen, onClose }: LiveSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error("Live search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleFullSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFullSearch(query);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-start">
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-noir/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="relative z-10 w-full bg-white border-b border-border shadow-2xl">
        <div className="container-luxury py-8">
          {/* Top Search Input Row */}
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <SearchIcon size={24} className="text-gold flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by garment, fabric (e.g. Cashmere, Silk, Denim), or style..."
              className="w-full text-lg sm:text-2xl font-serif bg-transparent border-none outline-none placeholder:text-muted-light text-noir"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-muted hover:text-noir text-xs tracking-wider uppercase p-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:text-gold transition-colors flex-shrink-0"
              aria-label="Close search"
            >
              <CloseIcon size={24} />
            </button>
          </div>

          {/* Quick Suggestions or Live Results */}
          <div className="py-6">
            {!query.trim() ? (
              <div>
                <span className="text-label text-[10px] text-muted tracking-[0.25em] block mb-3">
                  Trending Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        handleFullSearch(term);
                      }}
                      className="px-4 py-2 bg-ivory text-xs text-noir font-medium hover:bg-gold hover:text-white transition-colors border border-border/60"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : loading ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="text-[11px] text-muted tracking-widest uppercase">
                  Searching the Atelier...
                </span>
              </div>
            ) : results.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-label text-[10px] text-gold tracking-[0.25em]">
                    Suggested Pieces ({results.length})
                  </span>
                  <button
                    onClick={() => handleFullSearch(query)}
                    className="inline-flex items-center gap-1.5 text-xs text-noir font-semibold hover:text-gold transition-colors"
                  >
                    <span>View all results for &ldquo;{query}&rdquo;</span>
                    <ArrowRightIcon size={14} />
                  </button>
                </div>

                {/* Live Result Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="group flex flex-col p-2 border border-transparent hover:border-gold hover:bg-ivory-light/50 transition-all"
                    >
                      <div className="relative aspect-[3/4] w-full bg-ivory-light overflow-hidden mb-2">
                        {product.images[0]?.url && (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, 16vw"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <span className="text-[9px] text-muted tracking-wider uppercase truncate">
                        {product.category?.name}
                      </span>
                      <h4 className="text-xs font-medium text-noir group-hover:text-gold transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <span className="text-xs font-semibold text-noir mt-1">
                        {BRAND.currencySymbol}
                        {(product.salePrice || product.basePrice).toLocaleString("en-IN")}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-noir mb-1">
                  No matching garments found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-muted">
                  Try searching for fabrics like <strong className="text-noir font-medium">Cashmere</strong>, <strong className="text-noir font-medium">Silk</strong>, or silhouettes like <strong className="text-noir font-medium">Blazer</strong>, <strong className="text-noir font-medium">Hoodie</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
