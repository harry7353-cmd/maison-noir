"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  CloseIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  ShieldIcon,
  CheckIcon,
} from "@/components/ui/Icons";

export function CartDrawer() {
  const {
    items,
    summary,
    isDrawerOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const progressPercent = Math.min(
    100,
    Math.round((summary.subtotal / summary.freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* ── Dark Backdrop ─── */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-noir/70 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-white border-l border-border flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out"
        >
          {/* ── Top Header ─── */}
          <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-ivory-light/50">
            <div className="flex items-center gap-2">
              <span className="text-label text-gold text-xs tracking-[0.25em] uppercase font-medium">
                Sovereign Bag
              </span>
              <span className="text-xs text-muted">
                ({summary.totalItems} {summary.totalItems === 1 ? "garment" : "garments"})
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-muted hover:text-noir transition-colors focus:outline-none"
              aria-label="Close bag"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          {/* ── Complimentary Shipping Progress Bar ─── */}
          <div className="px-6 py-3.5 bg-ivory border-b border-border text-xs">
            {summary.amountNeededForFreeShipping === 0 && summary.subtotal > 0 ? (
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <CheckIcon size={14} className="text-emerald-700" />
                <span>You have unlocked Complimentary Concierge Shipping</span>
              </div>
            ) : (
              <div>
                <p className="text-noir/80 mb-1.5">
                  Acquire{" "}
                  <strong className="text-noir font-semibold">
                    ₹{summary.amountNeededForFreeShipping.toLocaleString("en-IN")}
                  </strong>{" "}
                  more for Complimentary Shipping
                </p>
                <div className="w-full h-1.5 bg-border overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Drawer Body: Cart Items ─── */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border scrollbar-thin">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center text-gold mb-4">
                  <ShoppingBagIcon size={28} />
                </div>
                <h3 className="heading-display text-lg text-noir mb-2">
                  Your Bag is Currently Empty
                </h3>
                <p className="text-xs text-muted max-w-xs mb-6 font-light leading-relaxed">
                  Discover our inaugural releases and bespoke silhouettes tailored for modern royalty.
                </p>
                <Link
                  href="/collections"
                  onClick={closeCart}
                  className="px-6 py-3 bg-noir text-ivory text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold hover:text-noir transition-all duration-300"
                >
                  Explore Collections
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const imgUrl =
                  item.variant.product.images[0]?.url ||
                  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800";
                const unitPrice =
                  item.variant.price ??
                  item.variant.product.salePrice ??
                  item.variant.product.basePrice;
                const lineTotal = unitPrice * item.quantity;

                return (
                  <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                    {/* Thumbnail Image */}
                    <div className="relative w-20 h-24 flex-shrink-0 bg-ivory-light border border-border overflow-hidden">
                      <Image
                        src={imgUrl}
                        alt={item.variant.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/products/${item.variant.product.slug}`}
                            onClick={closeCart}
                            className="font-serif text-sm text-noir hover:text-gold transition-colors font-medium line-clamp-1"
                          >
                            {item.variant.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted hover:text-red-700 transition-colors p-1"
                            title="Remove garment"
                            aria-label="Remove item"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>

                        {/* Variant Badges */}
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-muted">
                          <span className="inline-flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-border/80"
                              style={{ backgroundColor: item.variant.colorHex }}
                            />
                            {item.variant.colorName}
                          </span>
                          <span>•</span>
                          <span className="font-mono text-noir font-medium">
                            Size {item.variant.size}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper & Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-border bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-muted hover:text-noir transition-colors focus:outline-none"
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon size={12} />
                          </button>
                          <span className="px-2.5 py-1 text-xs font-mono text-noir min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.variant.stock}
                            className="px-2 py-1 text-muted hover:text-noir transition-colors focus:outline-none disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <PlusIcon size={12} />
                          </button>
                        </div>

                        <span className="font-mono text-xs font-semibold text-noir">
                          ₹{lineTotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Sticky Bottom Checkout Actions ─── */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-ivory-light/40 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Garments Subtotal</span>
                  <span className="font-mono text-noir">
                    ₹{summary.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Concierge Shipping</span>
                  <span className="font-mono">
                    {summary.shippingFee === 0 ? (
                      <span className="text-emerald-800 font-medium uppercase tracking-wider text-[10px]">
                        Complimentary
                      </span>
                    ) : (
                      `₹${summary.shippingFee.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>
                {summary.discountAmount > 0 && (
                  <div className="flex justify-between text-gold font-medium">
                    <span>Promotional Deduction</span>
                    <span className="font-mono">
                      -₹{summary.discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold text-noir pt-2 border-t border-border">
                  <span>Grand Total</span>
                  <span className="font-mono text-base text-gold">
                    ₹{summary.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-noir text-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold hover:text-noir transition-all duration-300 shadow-md"
                >
                  <ShieldIcon size={14} />
                  Proceed to Sovereign Checkout
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center py-2.5 border border-border text-noir text-xs uppercase tracking-[0.15em] font-medium hover:border-noir hover:bg-white transition-all duration-300"
                >
                  Inspect Full Bag
                </Link>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] text-muted tracking-wider uppercase pt-1">
                <span>Authentic Provenance</span>
                <span>•</span>
                <span>Complimentary Returns</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
