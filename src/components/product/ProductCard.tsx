"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HeartIcon, HeartFilledIcon, ShoppingBagIcon } from "@/components/ui/Icons";
import { useWishlist } from "@/context/WishlistContext";
import { BRAND } from "@/lib/constants";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number | null;
  images: Array<{
    url: string;
    isPrimary: boolean;
    altText?: string | null;
  }>;
  category?: {
    name: string;
    slug: string;
  } | null;
  collection?: {
    name: string;
    slug: string;
  } | null;
  variants?: Array<{
    id: string;
    size: string;
    colorName: string;
    colorHex: string;
    stock: number;
  }>;
}

export function ProductCard({
  id,
  name,
  slug,
  basePrice,
  salePrice,
  images,
  category,
  collection,
  variants = [],
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = images.find((img) => img.isPrimary)?.url || images[0]?.url || "";
  const hoverImage = images.find((img) => !img.isPrimary)?.url || primaryImage;

  // Distinct color swatches
  const uniqueColors = Array.from(
    new Map(variants.map((v) => [v.colorHex, v])).values()
  ).slice(0, 4);

  const discountPercent =
    salePrice && salePrice < basePrice
      ? Math.round(((basePrice - salePrice) / basePrice) * 100)
      : null;

  return (
    <div
      className="group flex flex-col relative product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Image Container ─── */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory-light">
        <Link href={`/products/${slug}`} className="block w-full h-full">
          <Image
            src={isHovered && hoverImage ? hoverImage : primaryImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
            priority={false}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent && (
            <span className="bg-burgundy text-white text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5">
              -{discountPercent}%
            </span>
          )}
          {collection && (
            <span className="bg-noir/80 backdrop-blur-sm text-gold text-[8px] font-medium tracking-widest uppercase px-2 py-0.5">
              {collection.name}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist({
              id,
              name,
              slug,
              basePrice,
              salePrice,
              images,
              category,
              collection,
              variants,
            });
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm text-noir hover:text-gold transition-colors z-10"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? (
            <HeartFilledIcon size={16} className="text-burgundy" />
          ) : (
            <HeartIcon size={16} />
          )}
        </button>

        {/* Quick View / Details Reveal */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-noir/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/products/${slug}`}
            className="w-full py-2 bg-white text-noir text-[10px] font-semibold tracking-widest uppercase text-center hover:bg-gold hover:text-white transition-colors duration-200 flex items-center justify-center gap-1.5"
          >
            <ShoppingBagIcon size={12} />
            View Bespoke Details
          </Link>
        </div>
      </div>

      {/* ── Product Info ─── */}
      <div className="pt-3 pb-2 flex flex-col flex-1">
        {/* Category tag */}
        {category && (
          <span className="text-label text-[9px] text-muted tracking-[0.2em] mb-1">
            {category.name}
          </span>
        )}

        {/* Product Name */}
        <Link
          href={`/products/${slug}`}
          className="text-xs font-medium text-noir hover:text-gold transition-colors line-clamp-1 mb-1.5"
        >
          {name}
        </Link>

        {/* Color swatches */}
        {uniqueColors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            {uniqueColors.map((color) => (
              <span
                key={color.colorHex}
                title={color.colorName}
                className="w-2.5 h-2.5 rounded-full border border-border"
                style={{ backgroundColor: color.colorHex }}
              />
            ))}
          </div>
        )}

        {/* Price display */}
        <div className="flex items-center gap-2 mt-auto">
          {salePrice ? (
            <>
              <span className="text-xs font-semibold text-burgundy">
                {BRAND.currencySymbol}
                {salePrice.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-muted-light line-through">
                {BRAND.currencySymbol}
                {basePrice.toLocaleString("en-IN")}
              </span>
            </>
          ) : (
            <span className="text-xs font-semibold text-noir">
              {BRAND.currencySymbol}
              {basePrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
