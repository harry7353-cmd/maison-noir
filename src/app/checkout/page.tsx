"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  ShieldIcon,
  TruckIcon,
  CheckIcon,
  ShoppingBagIcon,
  MapPinIcon,
  PlusIcon,
} from "@/components/ui/Icons";

interface AddressOption {
  id: string;
  fullName: string;
  phone: string;
  streetLine1: string;
  streetLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, summary, coupon, applyCoupon, removeCoupon, clearCart } = useCart();

  // Steps: 1: Address -> 2: Logistics -> 3: Payment
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Saved Addresses (for authenticated patrons)
  const [savedAddresses, setSavedAddresses] = useState<AddressOption[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "NEW">("NEW");

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    streetLine1: "",
    streetLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  // Delivery logistics option
  const [deliveryTier, setDeliveryTier] = useState<"EXPRESS" | "SAME_DAY">("EXPRESS");

  // Payment option
  const [paymentProvider, setPaymentProvider] = useState<"SANDBOX" | "RAZORPAY" | "STRIPE" | "COD">("SANDBOX");

  // Simulated Card Inputs
  const [cardForm, setCardForm] = useState({
    cardNumber: "4242 •••• •••• 4242",
    cardHolder: user?.name || "Lord Julian Vance",
    expiry: "12/28",
    cvv: "888",
  });

  // Notes
  const [notes, setNotes] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState("");

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      // Allow brief loading grace period
      const timer = setTimeout(() => {
        if (items.length === 0) {
          router.push("/cart");
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [items, router, isSubmitting]);

  // Fetch saved addresses if logged in
  useEffect(() => {
    if (user) {
      fetch("/api/account/addresses")
        .then((res) => res.json())
        .then((data) => {
          if (data.addresses && data.addresses.length > 0) {
            setSavedAddresses(data.addresses);
            const def = data.addresses.find((a: AddressOption) => a.isDefault) || data.addresses[0];
            setSelectedAddressId(def.id);
            setAddressForm({
              fullName: def.fullName,
              email: user.email,
              phone: def.phone,
              streetLine1: def.streetLine1,
              streetLine2: def.streetLine2 || "",
              city: def.city,
              state: def.state,
              postalCode: def.postalCode,
              country: def.country,
            });
          } else {
            setAddressForm((prev) => ({
              ...prev,
              fullName: user.name || "",
              email: user.email,
              phone: user.phone || "",
            }));
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const handleSelectSavedAddress = (addr: AddressOption) => {
    setSelectedAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName,
      email: user?.email || addressForm.email,
      phone: addr.phone,
      streetLine1: addr.streetLine1,
      streetLine2: addr.streetLine2 || "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    });
  };

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = await applyCoupon(couponCode);
    setCouponMsg(res.message);
    if (res.success) setCouponCode("");
  };

  const handlePlaceOrder = async () => {
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: {
            fullName: addressForm.fullName,
            phone: addressForm.phone,
            streetLine1: addressForm.streetLine1,
            streetLine2: addressForm.streetLine2 || undefined,
            city: addressForm.city,
            state: addressForm.state,
            postalCode: addressForm.postalCode,
            country: addressForm.country,
          },
          guestEmail: addressForm.email,
          paymentProvider,
          deliveryTier,
          couponCode: coupon?.code,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to finalize acquisition.");
      }

      // Clear client cart
      await clearCart();

      // Redirect to confirmation success screen
      router.push(`/checkout/success?orderNumber=${data.orderNumber}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Acquisition error";
      setErrorMsg(msg);
      setIsSubmitting(false);
    }
  };

  const finalShippingFee =
    summary.shippingFee + (deliveryTier === "SAME_DAY" ? 500 : 0);
  const grandTotal = Math.max(
    0,
    summary.subtotal - summary.discountAmount + finalShippingFee
  );

  return (
    <div className="bg-ivory-light/30 min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator Header */}
        <div className="border-b border-border pb-6 mb-8 lg:mb-12">
          <span className="text-label text-gold text-xs tracking-[0.3em] uppercase block mb-2 font-medium">
            Sovereign Acquisition
          </span>
          <h1 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-noir">
            Checkout & Final Appraisal
          </h1>

          {/* Stepper pills */}
          <div className="flex items-center gap-3 sm:gap-6 mt-6 text-xs uppercase tracking-wider">
            {[
              { step: 1, label: "1. Delivery Destination" },
              { step: 2, label: "2. Logistics Tier" },
              { step: 3, label: "3. Sovereign Payment" },
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => {
                  if (s.step < currentStep) setCurrentStep(s.step as any);
                }}
                className={`flex items-center gap-2 pb-1 border-b-2 transition-colors ${
                  currentStep === s.step
                    ? "border-gold text-noir font-semibold"
                    : currentStep > s.step
                    ? "border-emerald-600 text-emerald-800"
                    : "border-transparent text-muted"
                }`}
              >
                {currentStep > s.step && <CheckIcon size={12} />}
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-900 text-xs">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Multi-Step Forms (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-border p-6 sm:p-10 shadow-luxury space-y-8">
            
            {/* ── STEP 1: DELIVERY RESIDENCE ─── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <span className="text-label text-gold text-xs tracking-widest uppercase block mb-1">
                    Step 1 of 3
                  </span>
                  <h2 className="heading-display text-2xl text-noir">
                    Recipient & Delivery Residence
                  </h2>
                </div>

                {/* If user has saved addresses, display selector */}
                {savedAddresses.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-xs uppercase tracking-wider text-muted font-medium block">
                      Select From Registered Residences:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`p-4 border cursor-pointer transition-all text-xs ${
                            selectedAddressId === addr.id
                              ? "border-gold ring-1 ring-gold bg-ivory-light/30"
                              : "border-border hover:border-noir/40"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-serif font-medium text-noir">
                              {addr.fullName}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[9px] uppercase tracking-wider bg-gold text-noir px-1.5 py-0.5 font-bold">
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="text-muted line-clamp-1">{addr.streetLine1}</p>
                          <p className="text-muted">
                            {addr.city}, {addr.state} — {addr.postalCode}
                          </p>
                          <p className="text-muted">Phone: {addr.phone}</p>
                        </div>
                      ))}

                      <div
                        onClick={() => {
                          setSelectedAddressId("NEW");
                          setAddressForm({
                            fullName: user?.name || "",
                            email: user?.email || "",
                            phone: user?.phone || "",
                            streetLine1: "",
                            streetLine2: "",
                            city: "",
                            state: "",
                            postalCode: "",
                            country: "India",
                          });
                        }}
                        className={`p-4 border border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors text-xs text-center ${
                          selectedAddressId === "NEW"
                            ? "border-gold bg-ivory-light/30 text-gold font-medium"
                            : "border-border text-muted hover:border-noir"
                        }`}
                      >
                        <PlusIcon size={16} className="mb-1" />
                        <span>Deliver to Another Address</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Form Inputs */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCurrentStep(2);
                  }}
                  className="space-y-4 pt-2 border-t border-border"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                        Recipient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.fullName}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, fullName: e.target.value })
                        }
                        placeholder="e.g. Lord Julian Vance"
                        className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={addressForm.email}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, email: e.target.value })
                        }
                        placeholder="client@maisonnoir.com"
                        className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                      Direct Telephone Contact *
                    </label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                      Street Residence Line 1 *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.streetLine1}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, streetLine1: e.target.value })
                      }
                      placeholder="Estate name, building, street..."
                      className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                      Street Residence Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressForm.streetLine2}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, streetLine2: e.target.value })
                      }
                      placeholder="Apartment, suite, tower..."
                      className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, city: e.target.value })
                        }
                        placeholder="Mumbai"
                        className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                        State / Province *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, state: e.target.value })
                        }
                        placeholder="Maharashtra"
                        className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.postalCode}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, postalCode: e.target.value })
                        }
                        placeholder="400001"
                        className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.country}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, country: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-noir text-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold hover:text-noir transition-all"
                    >
                      Proceed to Logistics Tier →
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── STEP 2: LOGISTICS TIER ─── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="text-label text-gold text-xs tracking-widest uppercase block mb-1">
                    Step 2 of 3
                  </span>
                  <h2 className="heading-display text-2xl text-noir">
                    Bespoke Courier Logistics
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Tier 1: Express */}
                  <label
                    onClick={() => setDeliveryTier("EXPRESS")}
                    className={`block p-5 border cursor-pointer transition-all ${
                      deliveryTier === "EXPRESS"
                        ? "border-gold ring-1 ring-gold bg-ivory-light/40"
                        : "border-border hover:border-noir/40 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TruckIcon size={20} className="text-gold" />
                        <div>
                          <span className="font-serif font-medium text-noir text-sm block">
                            White-Glove Domestic Express
                          </span>
                          <span className="text-xs text-muted font-light">
                            2–3 business days via Delhivery Apex or BlueDart. Insured and signed handover.
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-noir">
                        {summary.shippingFee === 0 ? "Complimentary" : "₹250"}
                      </span>
                    </div>
                  </label>

                  {/* Tier 2: Same Day Sovereign */}
                  <label
                    onClick={() => setDeliveryTier("SAME_DAY")}
                    className={`block p-5 border cursor-pointer transition-all ${
                      deliveryTier === "SAME_DAY"
                        ? "border-gold ring-1 ring-gold bg-ivory-light/40"
                        : "border-border hover:border-noir/40 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldIcon size={20} className="text-gold" />
                        <div>
                          <span className="font-serif font-medium text-noir text-sm block">
                            Imperial Same-Day Sovereign Courier
                          </span>
                          <span className="text-xs text-muted font-light">
                            Guaranteed direct dispatch within 8 hours. Available across tier-1 metropolitan sectors.
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-gold">
                        +₹500
                      </span>
                    </div>
                  </label>
                </div>

                {/* Special Delivery Notes */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1.5">
                    Concierge Handover Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Leave with private reception desk, announce arrival beforehand..."
                    className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-border">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs uppercase tracking-wider text-muted hover:text-noir"
                  >
                    ← Alter Destination
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-3.5 bg-noir text-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold hover:text-noir transition-all"
                  >
                    Proceed to Sovereign Payment →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: SOVEREIGN PAYMENT ─── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="text-label text-gold text-xs tracking-widest uppercase block mb-1">
                    Step 3 of 3
                  </span>
                  <h2 className="heading-display text-2xl text-noir">
                    Sovereign Payment Gateway
                  </h2>
                </div>

                {/* Payment Provider Selection */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "SANDBOX", label: "Maison Sandbox" },
                    { id: "RAZORPAY", label: "Razorpay UPI" },
                    { id: "STRIPE", label: "Stripe Cards" },
                    { id: "COD", label: "Handover COD" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentProvider(p.id as any)}
                      className={`p-3 text-xs uppercase tracking-wider border font-medium text-center transition-all ${
                        paymentProvider === p.id
                          ? "bg-noir text-ivory border-noir font-semibold"
                          : "bg-white text-muted border-border hover:border-noir/40"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Provider Details View */}
                {paymentProvider === "SANDBOX" && (
                  <div className="p-6 bg-ivory-light/40 border border-gold/40 space-y-4 text-xs">
                    <div className="flex items-center gap-2 text-gold font-medium">
                      <ShieldIcon size={16} />
                      <span className="uppercase tracking-wider text-[11px]">
                        Atelier Sandbox Test Authentication
                      </span>
                    </div>
                    <p className="text-muted leading-relaxed">
                      This environment operates in simulated production mode. Your card credentials below are pre-approved for instant order verification and inventory reservation.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-muted mb-1">
                          Test Black Card Number
                        </label>
                        <input
                          type="text"
                          value={cardForm.cardNumber}
                          onChange={(e) =>
                            setCardForm({ ...cardForm, cardNumber: e.target.value })
                          }
                          className="w-full px-3 py-2 font-mono text-xs border border-border bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-muted mb-1">
                            Validity
                          </label>
                          <input
                            type="text"
                            value={cardForm.expiry}
                            onChange={(e) =>
                              setCardForm({ ...cardForm, expiry: e.target.value })
                            }
                            className="w-full px-3 py-2 font-mono text-xs border border-border bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-muted mb-1">
                            Security Key (CVV)
                          </label>
                          <input
                            type="text"
                            value={cardForm.cvv}
                            onChange={(e) =>
                              setCardForm({ ...cardForm, cvv: e.target.value })
                            }
                            className="w-full px-3 py-2 font-mono text-xs border border-border bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentProvider === "RAZORPAY" && (
                  <div className="p-6 bg-blue-50/50 border border-blue-200 text-xs text-blue-900 space-y-2">
                    <strong className="block font-medium">Razorpay Gateway Simulation</strong>
                    <p>
                      Supports Google Pay, PhonePe, Paytm UPI QR, along with all sovereign Indian banking institutions. Verified via 256-bit AES encryption.
                    </p>
                  </div>
                )}

                {paymentProvider === "STRIPE" && (
                  <div className="p-6 bg-purple-50/50 border border-purple-200 text-xs text-purple-900 space-y-2">
                    <strong className="block font-medium">Stripe Global Clearing</strong>
                    <p>
                      Multi-currency settlement via Visa, Mastercard, and American Express Centurion. Encrypted through Stripe Elements.
                    </p>
                  </div>
                )}

                {paymentProvider === "COD" && (
                  <div className="p-6 bg-amber-50/50 border border-amber-200 text-xs text-amber-900 space-y-2">
                    <strong className="block font-medium">Cash on White-Glove Handover</strong>
                    <p>
                      Remit the exact appraisal sum to the uniformed courier agent upon package inspection and signature verification.
                    </p>
                  </div>
                )}

                {/* Final Order Trigger */}
                <div className="pt-4 flex items-center justify-between border-t border-border">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs uppercase tracking-wider text-muted hover:text-noir"
                  >
                    ← Alter Logistics
                  </button>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="px-10 py-4 bg-noir text-ivory text-xs uppercase tracking-[0.2em] font-semibold hover:bg-gold hover:text-noir transition-all duration-300 shadow-xl disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Transcribing Sovereign Order..."
                      : `Place Sovereign Order (₹${grandTotal.toLocaleString("en-IN")})`}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Order Appraisal Summary (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            <div className="bg-white border border-border p-6 sm:p-8 shadow-luxury space-y-6">
              <h3 className="heading-display text-xl text-noir border-b border-border pb-4 flex items-center justify-between">
                <span>Appraisal Summary</span>
                <span className="text-xs font-mono font-normal text-muted">
                  {summary.totalItems} garments
                </span>
              </h3>

              {/* Items Scroll Rail */}
              <div className="max-h-60 overflow-y-auto divide-y divide-border pr-2 scrollbar-thin">
                {items.map((item) => {
                  const img =
                    item.variant.product.images[0]?.url ||
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800";
                  const unitPrice =
                    item.variant.price ??
                    item.variant.product.salePrice ??
                    item.variant.product.basePrice;
                  const lineTotal = unitPrice * item.quantity;

                  return (
                    <div key={item.id} className="py-3 flex gap-3 first:pt-0 last:pb-0 items-center">
                      <div className="relative w-12 h-16 flex-shrink-0 bg-ivory-light border border-border overflow-hidden">
                        <Image
                          src={img}
                          alt={item.variant.product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-serif text-xs text-noir font-medium truncate block">
                          {item.variant.product.name}
                        </span>
                        <span className="text-[10px] text-muted block">
                          Size {item.variant.size} • {item.variant.colorName} • Qty {item.quantity}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-noir">
                        ₹{lineTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Voucher Code Form */}
              <div className="pt-2 border-t border-border">
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Credential code..."
                    className="flex-1 px-3 py-2 text-xs border border-border uppercase tracking-wider font-mono focus:border-gold focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-noir text-ivory text-xs uppercase tracking-wider font-medium hover:bg-gold hover:text-noir transition-colors"
                  >
                    Verify
                  </button>
                </form>

                {couponMsg && (
                  <p className="text-[11px] mt-1 text-gold">{couponMsg}</p>
                )}

                {/* Quick Voucher Chips */}
                <div className="mt-2 flex gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => applyCoupon("WELCOME10")}
                    className="px-2 py-0.5 bg-ivory border border-border hover:border-gold font-mono"
                  >
                    WELCOME10
                  </button>
                  <button
                    type="button"
                    onClick={() => applyCoupon("ROYALNOIR")}
                    className="px-2 py-0.5 bg-ivory border border-border hover:border-gold font-mono"
                  >
                    ROYALNOIR
                  </button>
                </div>
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2.5 text-xs pt-4 border-t border-border">
                <div className="flex justify-between text-muted">
                  <span>Garments Subtotal</span>
                  <span className="font-mono text-noir">
                    ₹{summary.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-muted">
                  <span>Courier Logistics</span>
                  <span className="font-mono">
                    {finalShippingFee === 0 ? (
                      <span className="text-emerald-800 font-medium uppercase text-[10px]">
                        Complimentary
                      </span>
                    ) : (
                      `₹${finalShippingFee.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>

                {summary.discountAmount > 0 && (
                  <div className="flex justify-between text-gold font-medium">
                    <span>
                      Voucher Deduction ({coupon?.code})
                      <button
                        onClick={removeCoupon}
                        className="text-[10px] text-red-600 hover:underline ml-1"
                      >
                        [×]
                      </button>
                    </span>
                    <span className="font-mono">
                      -₹{summary.discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-muted">
                  <span>Archival Matte Presentation</span>
                  <span className="text-emerald-800 font-medium uppercase text-[10px]">
                    Complimentary
                  </span>
                </div>

                <div className="pt-3 border-t border-border flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-semibold text-noir block">
                      Payable Acquisition Sum
                    </span>
                    <span className="text-[10px] text-muted">
                      All taxes & duties accounted for
                    </span>
                  </div>
                  <span className="font-mono text-xl sm:text-2xl font-serif text-gold font-medium">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="p-6 bg-white border border-border space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <ShieldIcon size={16} className="text-gold flex-shrink-0" />
                <span className="text-muted">
                  Authenticity sealed with unique registration watermark.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <TruckIcon size={16} className="text-gold flex-shrink-0" />
                <span className="text-muted">
                  Fully insured white-glove courier transit with scheduled signature.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
