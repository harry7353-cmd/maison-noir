"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useWishlist, WishlistProduct } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import {
  HeartFilledIcon,
  ShoppingBagIcon,
  TrashIcon,
  ArrowRightIcon,
  CheckIcon,
} from "@/components/ui/Icons";

export default function WishlistPage() {
  const { items, totalWishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [movingId, setMovingId] = useState<string | null>(null);
  const [movedId, setMovedId] = useState<string | null>(null);

  const handleMoveToBag = async (product: WishlistProduct) => {
    // Pick first available in-stock variant
    const variant = product.variants?.find((v) => v.stock > 0) || product.variants?.[0];
    if (!variant) return;

    setMovingId(product.id);
    const success = await addToCart(variant.id, 1);
    if (success) {
      setMovedId(product.id);
      setTimeout(async () => {
        await removeFromWishlist(product.id);
        setMovedId(null);
      }, 1200);
    }
    setMovingId(null);
  };

  return (
    <div className="bg-ivory-light/30 min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-border pb-6 mb-8 lg:mb-12 gap-4">
          <div>
            <span className="text-label text-gold text-xs tracking-[0.3em] uppercase block mb-2 font-medium">
              Private Curations
            </span>
            <h1 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-noir">
              Vault of Desires
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-2 font-light">
              {totalWishlist} {totalWishlist === 1 ? "garment" : "garments"} preserved for your consideration
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs uppercase tracking-wider text-muted hover:text-red-700 transition-colors self-start sm:self-auto"
            >
              Clear Entire Vault
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-border p-12 lg:p-20 text-center max-w-2xl mx-auto shadow-luxury">
            <div className="w-20 h-20 rounded-full border border-gold/40 flex items-center justify-center text-gold mx-auto mb-6">
              <HeartFilledIcon size={32} className="text-gold" />
            </div>
            <h2 className="heading-display text-2xl text-noir mb-3">
              Your Vault is Unoccupied
            </h2>
            <p className="text-muted text-sm max-w-md mx-auto mb-8 font-light leading-relaxed">
              Preserve garments of interest by tapping the silhouette heart emblem as you explore our bespoke collections.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-noir text-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold hover:text-noir transition-all duration-300"
            >
              Explore Wardrobe
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {items.map((product) => {
              const primaryImage =
                product.images?.find((img) => img.isPrimary)?.url ||
                product.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800";

              const discountPercent =
                product.salePrice && product.salePrice < product.basePrice
                  ? Math.round(
                      ((product.basePrice - product.salePrice) / product.basePrice) * 100
                    )
                  : null;

              const isMoved = movedId === product.id;
              const isMoving = movingId === product.id;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-border flex flex-col group relative transition-shadow hover:shadow-luxury"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory-light">
                    <Link href={`/products/${product.slug}`} className="block w-full h-full">
                      <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
                      />
                    </Link>

                    {/* Discount badge */}
                    {discountPercent && (
                      <span className="absolute top-3 left-3 bg-burgundy text-white text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5">
                        -{discountPercent}%
                      </span>
                    )}

                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-muted hover:text-red-700 transition-colors z-10"
                      title="Remove from vault"
                      aria-label="Remove item"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      {product.category && (
                        <span className="text-label text-gold text-[10px] tracking-widest uppercase block mb-1">
                          {product.category.name}
                        </span>
                      )}
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-serif text-base text-noir hover:text-gold transition-colors font-medium line-clamp-1 block"
                      >
                        {product.name}
                      </Link>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mt-2">
                        {product.salePrice ? (
                          <>
                            <span className="font-mono text-sm font-semibold text-burgundy">
                              ₹{product.salePrice.toLocaleString("en-IN")}
                            </span>
                            <span className="font-mono text-xs text-muted line-through">
                              ₹{product.basePrice.toLocaleString("en-IN")}
                            </span>
                          </>
                        ) : (
                          <span className="font-mono text-sm font-semibold text-noir">
                            ₹{product.basePrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-border mt-4 flex flex-col gap-2">
                      <button
                        onClick={() => handleMoveToBag(product)}
                        disabled={isMoving || isMoved}
                        className={`w-full py-2.5 px-3 text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                          isMoved
                            ? "bg-emerald-800 text-ivory"
                            : "bg-noir text-ivory hover:bg-gold hover:text-noir"
                        } disabled:opacity-60`}
                      >
                        {isMoved ? (
                          <>
                            <CheckIcon size={14} />
                            Transferred to Bag
                          </>
                        ) : isMoving ? (
                          "Transferring..."
                        ) : (
                          <>
                            <ShoppingBagIcon size={14} />
                            Transfer to Bag
                          </>
                        )}
                      </button>

                      <Link
                        href={`/products/${product.slug}`}
                        className="text-center text-[10px] uppercase tracking-wider text-muted hover:text-noir py-1 transition-colors"
                      >
                        Inspect Specifications
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
