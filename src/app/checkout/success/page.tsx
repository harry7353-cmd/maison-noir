"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldIcon,
  TruckIcon,
  CheckIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "MN-2026-RECENT";
  const [copied, setCopied] = useState(false);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-ivory-light/30 min-h-screen py-12 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Certificate Card */}
        <div className="bg-white border border-border p-8 sm:p-14 shadow-2xl text-center space-y-8 relative overflow-hidden">
          
          {/* Gold Decorative Corner Borders */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold pointer-events-none" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold pointer-events-none" />

          {/* Crest / Check emblem */}
          <div className="w-20 h-20 rounded-full border-2 border-gold flex items-center justify-center text-gold mx-auto shadow-sm">
            <CheckIcon size={36} className="text-gold" />
          </div>

          <div>
            <span className="text-label text-gold text-xs tracking-[0.3em] uppercase block mb-2 font-medium">
              Certificate of Acquisition
            </span>
            <h1 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-noir">
              Acquisition Confirmed & Archived
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-3 max-w-lg mx-auto font-light leading-relaxed">
              Your garments have been claimed from our inventory vault. Our atelier tailors are currently performing final garment inspection and hand-tying the archival presentation ribbons.
            </p>
          </div>

          {/* Order Details Badge */}
          <div className="p-6 bg-ivory-light/50 border border-border max-w-lg mx-auto space-y-3 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-muted uppercase tracking-wider text-[10px]">
                Archival Order Registry
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-noir text-sm">
                  {orderNumber}
                </span>
                <button
                  onClick={handleCopyOrderNumber}
                  className="text-[10px] uppercase tracking-wider text-gold hover:underline"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted">Estimated Courier Handover</span>
              <span className="text-noir font-medium">
                Within 2 to 3 Business Days
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted">Dispatch Method</span>
              <span className="text-emerald-800 font-medium">
                White-Glove Insured Courier
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`/orders/${orderNumber}`}
              className="w-full sm:w-auto px-8 py-3.5 bg-gold text-noir text-xs uppercase tracking-[0.2em] font-semibold hover:bg-noir hover:text-ivory transition-all duration-300 shadow-md inline-flex items-center justify-center gap-2"
            >
              <TruckIcon size={14} />
              Live Courier Tracking
            </Link>

            <Link
              href="/account"
              className="w-full sm:w-auto px-8 py-3.5 bg-noir text-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold hover:text-noir transition-all duration-300 shadow-md inline-flex items-center justify-center gap-2"
            >
              <ShieldIcon size={14} />
              Review in Patron Portal
            </Link>

            <Link
              href="/collections"
              className="w-full sm:w-auto px-8 py-3.5 border border-border text-noir text-xs uppercase tracking-[0.15em] font-medium hover:bg-white hover:border-noir transition-colors inline-flex items-center justify-center gap-2"
            >
              Curate More Ensembles
              <ArrowRightIcon size={14} />
            </Link>
          </div>

          {/* Dispatch Notice */}
          <div className="pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-muted">
            <TruckIcon size={16} className="text-gold" />
            <span>
              Real-time dispatch tracking notifications will be communicated via your registered credentials.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-xs uppercase tracking-wider text-muted">
          Loading acquisition certificate...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
