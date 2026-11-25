"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackageIcon, ArrowRightIcon } from "@/components/ui/Icons";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = orderNumber.trim();
    if (clean) {
      router.push(`/orders/${encodeURIComponent(clean)}`);
    }
  };

  return (
    <div className="bg-noir text-ivory min-h-[75vh] flex items-center justify-center py-16 px-6">
      <div className="max-w-md w-full bg-surface/30 border border-border/20 p-8 sm:p-10 backdrop-blur-sm text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center mx-auto">
          <PackageIcon className="w-6 h-6" />
        </div>

        <div>
          <span className="text-gold text-[10px] uppercase tracking-[0.25em] font-semibold">
            Concierge Logistics
          </span>
          <h1 className="font-serif text-3xl font-light text-ivory mt-1">
            Track Your Acquisition
          </h1>
          <p className="text-xs text-ivory/60 mt-2 leading-relaxed">
            Enter your sovereign acquisition identifier (e.g. <span className="font-mono text-gold">MN-2026-0001</span>) to access real-time courier dispatch status.
          </p>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <input
            type="text"
            required
            placeholder="e.g. MN-2026-0001"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            className="w-full bg-noir border border-border/30 px-4 py-3 text-center text-sm font-mono tracking-widest text-gold placeholder:text-ivory/30 focus:border-gold outline-none"
          />

          <button
            type="submit"
            className="w-full py-3.5 bg-gold text-noir text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-all flex items-center justify-center gap-2 shadow-md"
          >
            Track Acquisition <ArrowRightIcon size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
