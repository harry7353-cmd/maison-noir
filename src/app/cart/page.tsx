"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  ShieldIcon,
  TruckIcon,
  SparklesIcon,
  CheckIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";

export default function CartPage() {
  const {
    items,
    summary,
    coupon,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setApplyingCoupon(true);
    setCouponFeedback(null);

    const result = await applyCoupon(couponCode);
    if (result.success) {
      setCouponFeedback({ type: "success", message: result.message });
      setCouponCode("");
    } else {
      setCouponFeedback({ type: "error", message: result.message });
    }
    setApplyingCoupon(false);
  };

  const handleApplyPresetCoupon = async (code: string) => {
    setCouponCode(code);
    setApplyingCoupon(true);
    setCouponFeedback(null);
    const result = await applyCoupon(code);
    if (result.success) {
      setCouponFeedback({ type: "success", message: result.message });
      setCouponCode("");
    } else {
      setCouponFeedback({ type: "error", message: result.message });
    }
    setApplyingCoupon(false);
  };

  return (
    <div className="bg-ivory-light/30 min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="border-b border-border pb-6 mb-8 lg:mb-12">
          <span className="text-label text-gold text-xs tracking-[0.3em] uppercase block mb-2 font-medium">
            Review Your Acquisitions
          </span>
          <h1 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-noir">
            Your Sovereign Bag
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2 font-light">
            {summary.totalItems} {summary.totalItems === 1 ? "garment" : "garments"} curated for your wardrobe
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Bag State */
          <div className="bg-white border border-border p-12 lg:p-20 text-center max-w-2xl mx-auto shadow-luxury">
            <div className="w-20 h-20 rounded-full border border-gold/40 flex items-center justify-center text-gold mx-auto mb-6">
              <ShoppingBagIcon size={36} />
            </div>
            <h2 className="heading-display text-2xl text-noir mb-3">
              Your Bag is as Empty as the Midnight Sky
            </h2>
            <p className="text-muted text-sm max-w-md mx-auto mb-8 font-light leading-relaxed">
              Explore our handcrafted collections and acquire tailored silhouettes engineered for royal distinction.
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
          /* Two Column Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left 7 Columns: Items List */}
            <div className="lg:col-span-8 bg-white border border-border shadow-sm">
              <div className="p-6 border-b border-border bg-ivory-light/40 flex items-center justify-between text-xs text-muted uppercase tracking-wider font-medium">
                <span>Selected Silhouettes</span>
                <span>Subtotal</span>
              </div>

              <div className="divide-y divide-border px-6">
                {items.map((item) => {
                  const imgUrl =
                    item.variant.product.images[0]?.url ||
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800";
                  const unitPrice =
                    item.variant.price ??
                    item.variant.product.salePrice ??
                    item.variant.product.basePrice;
                  const lineTotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
                    >
                      {/* Image & Title */}
                      <div className="flex gap-4 items-center">
                        <div className="relative w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 bg-ivory-light border border-border overflow-hidden">
                          <Image
                            src={imgUrl}
                            alt={item.variant.product.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>

                        <div>
                          <Link
                            href={`/products/${item.variant.product.slug}`}
                            className="font-serif text-base sm:text-lg text-noir hover:text-gold transition-colors font-medium block"
                          >
                            {item.variant.product.name}
                          </Link>

                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted">
                            <span className="inline-flex items-center gap-1.5">
                              <span
                                className="w-3 h-3 rounded-full border border-border"
                                style={{ backgroundColor: item.variant.colorHex }}
                              />
                              {item.variant.colorName}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-noir font-medium">
                              Size {item.variant.size}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-muted">
                              SKU: {item.variant.sku}
                            </span>
                          </div>

                          <div className="text-xs font-mono text-noir mt-2">
                            ₹{unitPrice.toLocaleString("en-IN")} each
                          </div>
                        </div>
                      </div>

                      {/* Stepper, Total & Remove */}
                      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                        {/* Stepper */}
                        <div className="flex items-center border border-border bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-1.5 text-muted hover:text-noir transition-colors focus:outline-none"
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon size={12} />
                          </button>
                          <span className="px-3 py-1.5 text-xs font-mono text-noir min-w-[28px] text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.variant.stock}
                            className="px-2.5 py-1.5 text-muted hover:text-noir transition-colors focus:outline-none disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <PlusIcon size={12} />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right">
                          <span className="font-mono text-sm sm:text-base font-semibold text-noir block">
                            ₹{lineTotal.toLocaleString("en-IN")}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[11px] text-muted hover:text-red-700 transition-colors inline-flex items-center gap-1 mt-1 underline underline-offset-2"
                          >
                            <TrashIcon size={11} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="p-6 border-t border-border bg-ivory-light/20 flex flex-wrap items-center justify-between gap-4">
                <Link
                  href="/collections"
                  className="text-xs uppercase tracking-[0.15em] text-noir hover:text-gold font-medium inline-flex items-center gap-1 transition-colors"
                >
                  ← Continue Wardrobe Curation
                </Link>
                <span className="text-xs text-muted">
                  Prices inclusive of all applicable luxury tariffs
                </span>
              </div>
            </div>

            {/* Right 4 Columns: Order Appraisal Card */}
            <div className="lg:col-span-4 flex flex-col space-y-6">
              
              <div className="bg-white border border-border p-6 lg:p-8 shadow-luxury space-y-6">
                <h3 className="heading-display text-xl text-noir border-b border-border pb-4">
                  Order Appraisal
                </h3>

                {/* Subtotals & Fees */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-muted">
                    <span>Garments Subtotal</span>
                    <span className="font-mono text-noir">
                      ₹{summary.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted">
                    <span>Concierge Courier Delivery</span>
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

                  {coupon && (
                    <div className="flex justify-between text-gold font-medium pt-1">
                      <span className="inline-flex items-center gap-1">
                        Credential ({coupon.code})
                        <button
                          onClick={removeCoupon}
                          className="text-[10px] text-red-600 hover:underline ml-1"
                        >
                          [Remove]
                        </button>
                      </span>
                      <span className="font-mono">
                        -₹{summary.discountAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted">
                    <span>Imperial Packaging</span>
                    <span className="text-emerald-800 font-medium uppercase tracking-wider text-[10px]">
                      Complimentary
                    </span>
                  </div>

                  {/* Grand Total */}
                  <div className="pt-4 border-t border-border flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-semibold text-noir block">
                        Grand Acquisition Total
                      </span>
                      <span className="text-[10px] text-muted">
                        Inclusive of domestic express shipping & taxes
                      </span>
                    </div>
                    <span className="font-mono text-xl sm:text-2xl font-serif text-gold font-medium">
                      ₹{summary.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Promotional Code Form */}
                <div className="pt-4 border-t border-border">
                  <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-2">
                    Promotional Credential
                  </label>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME10"
                      className="flex-1 px-3 py-2 text-xs border border-border uppercase tracking-wider font-mono focus:border-gold focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={applyingCoupon || !couponCode.trim()}
                      className="px-4 py-2 bg-noir text-ivory text-xs uppercase tracking-wider font-medium hover:bg-gold hover:text-noir transition-colors disabled:opacity-50"
                    >
                      {applyingCoupon ? "Verifying..." : "Apply"}
                    </button>
                  </form>

                  {/* Quick Preset Voucher Chips */}
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
                    <span className="text-muted">Available Credentials:</span>
                    <button
                      type="button"
                      onClick={() => handleApplyPresetCoupon("WELCOME10")}
                      className="px-2 py-0.5 bg-ivory border border-border hover:border-gold font-mono text-noir transition-colors"
                    >
                      WELCOME10 (10% off)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPresetCoupon("ROYALNOIR")}
                      className="px-2 py-0.5 bg-ivory border border-border hover:border-gold font-mono text-noir transition-colors"
                    >
                      ROYALNOIR (₹1,500 off)
                    </button>
                  </div>

                  {couponFeedback && (
                    <div
                      className={`mt-2 p-2 text-xs border ${
                        couponFeedback.type === "success"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-red-50 border-red-200 text-red-800"
                      }`}
                    >
                      {couponFeedback.message}
                    </div>
                  )}
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-noir text-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold hover:text-noir transition-all duration-300 shadow-md"
                >
                  <ShieldIcon size={16} />
                  Proceed to Sovereign Checkout
                </Link>

              </div>

              {/* Guarantees Box */}
              <div className="bg-white border border-border p-6 space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <ShieldIcon size={18} className="text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-noir font-medium">Bespoke Authenticity</strong>
                    <span className="text-muted text-[11px] font-light">
                      Each piece bears our registered hallmark and individual archival registry code.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TruckIcon size={18} className="text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-noir font-medium">Complimentary Courier Return</strong>
                    <span className="text-muted text-[11px] font-light">
                      Enjoy 30 days to review your garments with complimentary scheduled pickup.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <SparklesIcon size={18} className="text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-noir font-medium">Signature Presentation</strong>
                    <span className="text-muted text-[11px] font-light">
                      Delivered encased in our archival matte black box with hand-knotted satin ribbon.
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
