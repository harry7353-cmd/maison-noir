"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HeartIcon,
  HeartFilledIcon,
  ShoppingBagIcon,
  ShieldIcon,
  TruckIcon,
  RefreshIcon,
  ChevronDownIcon,
  PlusIcon,
  MinusIcon,
  StarIcon,
} from "@/components/ui/Icons";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { BRAND } from "@/lib/constants";

interface ProductVariantItem {
  id: string;
  size: string;
  colorName: string;
  colorHex: string;
  sku: string;
  stock: number;
}

interface ProductDetailsClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    salePrice?: number | null;
    sku?: string | null;
    fabricDetails?: string | null;
    careInstructions?: string | null;
    fitInfo?: string | null;
    averageRating: number;
    reviewCount: number;
    category?: { name: string; slug: string } | null;
    collection?: { name: string; slug: string } | null;
    variants: ProductVariantItem[];
  };
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  // Distinct colors
  const colors = Array.from(
    new Map(product.variants.map((v) => [v.colorHex, v])).values()
  );

  const [selectedColor, setSelectedColor] = useState(
    colors[0]?.colorName || product.variants[0]?.colorName || ""
  );

  // Available sizes for chosen color
  const sizesForColor = product.variants.filter((v) => v.colorName === selectedColor);

  const [selectedSize, setSelectedSize] = useState(
    sizesForColor[0]?.size || product.variants[0]?.size || ""
  );

  // Current variant based on color and size
  const activeVariant = product.variants.find(
    (v) => v.colorName === selectedColor && v.size === selectedSize
  ) || product.variants[0];

  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState<string | null>("fabric");

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    const availableSizes = product.variants.filter((v) => v.colorName === colorName);
    if (!availableSizes.some((v) => v.size === selectedSize)) {
      setSelectedSize(availableSizes[0]?.size || "");
    }
  };

  const handleAddToCart = async () => {
    if (!activeVariant || activeVariant.stock <= 0) return;
    setAddingToCart(true);

    try {
      const success = await addToCart(activeVariant.id, quantity);
      if (success) {
        setCartSuccess(true);
        setTimeout(() => setCartSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Cart error:", e);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!activeVariant || activeVariant.stock <= 0) return;
    const success = await addToCart(activeVariant.id, quantity);
    if (success) {
      router.push("/cart");
    }
  };

  const discountPercent =
    product.salePrice && product.salePrice < product.basePrice
      ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
      : null;

  return (
    <div className="flex flex-col space-y-8">
      {/* ── Brand, Title & Rating ─── */}
      <div>
        {product.collection && (
          <span className="text-label text-gold text-[10px] tracking-[0.25em] block mb-2 font-medium">
            {product.collection.name} Series
          </span>
        )}

        <h1 className="heading-display text-2xl sm:text-3xl lg:text-4xl text-noir mb-3">
          {product.name}
        </h1>

        {/* Rating and Reviews Counter */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-gold">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} size={14} />
            ))}
          </div>
          <span className="font-semibold text-noir">
            {product.averageRating.toFixed(1)}
          </span>
          <span className="text-muted">•</span>
          <a
            href="#reviews"
            className="text-muted hover:text-gold transition-colors underline underline-offset-4"
          >
            {product.reviewCount} patron reviews
          </a>
        </div>
      </div>

      {/* ── Pricing ─── */}
      <div className="flex items-baseline gap-4 py-4 border-y border-border">
        {product.salePrice ? (
          <>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-burgundy">
              {BRAND.currencySymbol}
              {product.salePrice.toLocaleString("en-IN")}
            </span>
            <span className="font-sans text-base text-muted-light line-through">
              {BRAND.currencySymbol}
              {product.basePrice.toLocaleString("en-IN")}
            </span>
            {discountPercent && (
              <span className="bg-burgundy text-white text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 ml-2">
                Save {discountPercent}%
              </span>
            )}
          </>
        ) : (
          <span className="font-serif text-2xl sm:text-3xl font-bold text-noir">
            {BRAND.currencySymbol}
            {product.basePrice.toLocaleString("en-IN")}
          </span>
        )}
        <span className="text-[10px] text-muted tracking-wider uppercase ml-auto">
          Taxes Included
        </span>
      </div>

      {/* ── Description ─── */}
      <p className="text-body text-sm text-noir/80 leading-relaxed font-light">
        {product.description}
      </p>

      {/* ── Color Swatches ─── */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-label text-[11px] text-noir">
              Color: <strong className="font-semibold text-gold">{selectedColor}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {colors.map((c) => (
              <button
                key={c.colorHex}
                onClick={() => handleColorChange(c.colorName)}
                title={c.colorName}
                className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                  selectedColor === c.colorName
                    ? "ring-2 ring-gold ring-offset-2 border-noir scale-110"
                    : "border-border hover:scale-105"
                }`}
                style={{ backgroundColor: c.colorHex }}
              >
                {selectedColor === c.colorName && (
                  <span
                    className={`text-[10px] font-bold ${
                      c.colorHex.toLowerCase() === "#ffffff" || c.colorHex.toLowerCase() === "#f5f0e6"
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

      {/* ── Size Selector & Size Guide Trigger ─── */}
      {sizesForColor.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-label text-[11px] text-noir">
              Size: <strong className="font-semibold text-gold">{selectedSize}</strong>
            </span>
            <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-xs text-muted hover:text-gold underline underline-offset-4 tracking-wider uppercase transition-colors"
            >
              Size Guide
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {sizesForColor.map((v) => {
              const isSelected = v.size === selectedSize;
              const isOutOfStock = v.stock <= 0;

              return (
                <button
                  key={v.id}
                  disabled={isOutOfStock}
                  onClick={() => setSelectedSize(v.size)}
                  className={`py-3 text-xs font-medium border text-center transition-all ${
                    isSelected
                      ? "bg-noir text-white border-noir ring-1 ring-noir shadow-sm"
                      : isOutOfStock
                      ? "bg-ivory/50 text-muted-light border-border cursor-not-allowed line-through"
                      : "bg-white text-noir border-border hover:border-gold"
                  }`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Stock Availability ─── */}
      <div className="flex items-center gap-2 text-xs">
        {activeVariant && activeVariant.stock > 0 ? (
          <>
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-noir font-medium">
              In Stock
              {activeVariant.stock < 10 && (
                <span className="text-warning font-semibold ml-1.5">
                  — Only {activeVariant.stock} remaining in atelier
                </span>
              )}
            </span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-error" />
            <span className="text-error font-medium">
              Currently Unavailable in this selection
            </span>
          </>
        )}
      </div>

      {/* ── Quantity & Add to Cart Actions ─── */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          {/* Quantity selector */}
          <div className="flex items-center border border-border h-12">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="px-3 text-muted hover:text-noir disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <MinusIcon size={14} />
            </button>
            <span className="px-4 text-xs font-semibold text-noir w-10 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(activeVariant?.stock || 1, quantity + 1))}
              disabled={!activeVariant || quantity >= activeVariant.stock}
              className="px-3 text-muted hover:text-noir disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <PlusIcon size={14} />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || !activeVariant || activeVariant.stock <= 0}
            className="btn-primary flex-1 !h-12 !py-0 disabled:opacity-40"
          >
            <ShoppingBagIcon size={16} />
            {addingToCart
              ? "Adding to Cart..."
              : cartSuccess
              ? "Added to Bag ✓"
              : "Add to Bag"}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() =>
              toggleWishlist({
                id: product.id,
                name: product.name,
                slug: product.slug,
                basePrice: product.basePrice,
                salePrice: product.salePrice,
                images: [],
                category: product.category,
                collection: product.collection,
                variants: product.variants,
              })
            }
            className="w-12 h-12 border border-border flex items-center justify-center text-noir hover:text-gold hover:border-gold transition-colors flex-shrink-0"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? (
              <HeartFilledIcon size={18} className="text-burgundy" />
            ) : (
              <HeartIcon size={18} />
            )}
          </button>
        </div>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={addingToCart || !activeVariant || activeVariant.stock <= 0}
          className="btn-gold w-full !h-12 !py-0 disabled:opacity-40"
        >
          Acquire Now (Direct Checkout)
        </button>

        {cartSuccess && (
          <p className="text-xs text-success text-center font-medium animate-fadeIn">
            Piece successfully placed in your shopping bag.
          </p>
        )}
      </div>

      {/* ── Trust Badges ─── */}
      <div className="grid grid-cols-3 gap-2 py-6 border-y border-border text-center text-muted">
        <div className="flex flex-col items-center">
          <TruckIcon size={18} className="text-gold mb-1" />
          <span className="text-[10px] tracking-wider uppercase text-noir font-medium">
            White-Glove Delivery
          </span>
          <span className="text-[9px] text-muted">Complimentary &gt; ₹2,999</span>
        </div>
        <div className="flex flex-col items-center">
          <RefreshIcon size={18} className="text-gold mb-1" />
          <span className="text-[10px] tracking-wider uppercase text-noir font-medium">
            14-Day Exchanges
          </span>
          <span className="text-[9px] text-muted">Doorstep Pickup</span>
        </div>
        <div className="flex flex-col items-center">
          <ShieldIcon size={18} className="text-gold mb-1" />
          <span className="text-[10px] tracking-wider uppercase text-noir font-medium">
            Certified Authentic
          </span>
          <span className="text-[9px] text-muted">Master Mill Textile</span>
        </div>
      </div>

      {/* ── Collapsible Information Accordions ─── */}
      <div className="space-y-3 pt-2">
        {/* Fabric & Material */}
        {product.fabricDetails && (
          <div className="border-b border-border pb-3">
            <button
              onClick={() => toggleAccordion("fabric")}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <span className="text-xs font-semibold tracking-wider uppercase text-noir">
                Material &amp; Craftsmanship
              </span>
              <ChevronDownIcon
                size={16}
                className={`transition-transform duration-200 ${
                  openAccordion === "fabric" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openAccordion === "fabric" && (
              <div className="pt-2 pb-3 text-xs text-muted leading-relaxed font-light">
                {product.fabricDetails}
              </div>
            )}
          </div>
        )}

        {/* Fit Information */}
        {product.fitInfo && (
          <div className="border-b border-border pb-3">
            <button
              onClick={() => toggleAccordion("fit")}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <span className="text-xs font-semibold tracking-wider uppercase text-noir">
                Silhouette &amp; Fit Guide
              </span>
              <ChevronDownIcon
                size={16}
                className={`transition-transform duration-200 ${
                  openAccordion === "fit" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openAccordion === "fit" && (
              <div className="pt-2 pb-3 text-xs text-muted leading-relaxed font-light">
                {product.fitInfo}
              </div>
            )}
          </div>
        )}

        {/* Care Instructions */}
        {product.careInstructions && (
          <div className="border-b border-border pb-3">
            <button
              onClick={() => toggleAccordion("care")}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <span className="text-xs font-semibold tracking-wider uppercase text-noir">
                Garment Care
              </span>
              <ChevronDownIcon
                size={16}
                className={`transition-transform duration-200 ${
                  openAccordion === "care" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openAccordion === "care" && (
              <div className="pt-2 pb-3 text-xs text-muted leading-relaxed font-light">
                {product.careInstructions}
              </div>
            )}
          </div>
        )}

        {/* Shipping & Returns */}
        <div className="border-b border-border pb-3">
          <button
            onClick={() => toggleAccordion("shipping")}
            className="flex items-center justify-between w-full py-2 text-left"
          >
            <span className="text-xs font-semibold tracking-wider uppercase text-noir">
              Complimentary Shipping &amp; Returns
            </span>
            <ChevronDownIcon
              size={16}
              className={`transition-transform duration-200 ${
                openAccordion === "shipping" ? "rotate-180" : ""
              }`}
            />
          </button>
          {openAccordion === "shipping" && (
            <div className="pt-2 pb-3 text-xs text-muted leading-relaxed font-light space-y-2">
              <p>
                • <strong>Express Delivery:</strong> Delivered within 2–4 business days across metro cities in signature Maison Noir packaging.
              </p>
              <p>
                • <strong>Frictionless Returns:</strong> Enjoy 14-day doorstep returns and complimentary size exchanges.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Size Guide Modal ─── */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        categoryName={product.category?.name || "Garment"}
      />
    </div>
  );
}
