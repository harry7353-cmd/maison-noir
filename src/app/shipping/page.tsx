import { Metadata } from "next";
import Link from "next/link";
import { TruckIcon, ShieldIcon, SparklesIcon, CheckIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "White-Glove Shipping & Delivery | MAISON NOIR",
  description: "Learn about Maison Noir white-glove packaging, express courier logistics, and delivery timelines across India and globally.",
};

export default function ShippingPage() {
  return (
    <div className="bg-noir text-ivory min-h-screen py-16 lg:py-24">
      <div className="container-luxury max-w-4xl space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2">
            <TruckIcon className="w-3.5 h-3.5" /> Sovereign Logistics
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ivory">
            Shipping & White-Glove Handover
          </h1>
          <p className="text-xs sm:text-sm text-ivory/60 leading-relaxed font-light">
            Every Maison Noir acquisition is dispatched with utmost discretion, encased in our signature presentation boxes, and tracked live to your doorstep.
          </p>
        </div>

        {/* Delivery Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface/30 border border-gold/30 p-8 space-y-4">
            <span className="text-[10px] uppercase tracking-widest font-mono text-gold bg-gold/10 px-2 py-0.5 border border-gold/20">
              Domestic India
            </span>
            <h2 className="font-serif text-2xl text-ivory">Complimentary Express Handover</h2>
            <p className="text-xs text-ivory/70 leading-relaxed">
              Complimentary on all acquisitions exceeding ₹2,999. Orders below ₹2,999 incur a nominal ₹250 white-glove dispatch fee.
            </p>
            <ul className="space-y-2 text-xs text-ivory/80 pt-2 border-t border-border/10">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-3.5 h-3.5 text-gold" /> Metropolitan cities: 2 – 3 business days
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-3.5 h-3.5 text-gold" /> Rest of India: 3 – 5 business days
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-3.5 h-3.5 text-gold" /> Full courier insurance during transit
              </li>
            </ul>
          </div>

          <div className="bg-surface/30 border border-border/20 p-8 space-y-4">
            <span className="text-[10px] uppercase tracking-widest font-mono text-ivory/50 bg-noir px-2 py-0.5 border border-border/20">
              International
            </span>
            <h2 className="font-serif text-2xl text-ivory">Imperial Global Courier</h2>
            <p className="text-xs text-ivory/70 leading-relaxed">
              Dispatched via DHL Imperial Express to over 60 countries worldwide. Applicable duties, taxes, and import tariffs are calculated at checkout.
            </p>
            <ul className="space-y-2 text-xs text-ivory/80 pt-2 border-t border-border/10">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-3.5 h-3.5 text-gold" /> UK, Europe, UAE, USA: 4 – 6 business days
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-3.5 h-3.5 text-gold" /> Rest of World: 5 – 8 business days
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-3.5 h-3.5 text-gold" /> Direct signature required upon delivery
              </li>
            </ul>
          </div>
        </div>

        {/* The Presentation Box Experience */}
        <div className="border border-border/20 bg-surface/20 p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-5 h-5 text-gold" />
            <h2 className="font-serif text-2xl text-ivory font-light">
              The Presentation Experience
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-ivory/70 leading-relaxed">
            <div>
              <p className="font-semibold text-ivory uppercase tracking-wider text-[11px] mb-1">
                Rigid Magnetic Coffer
              </p>
              <p>Reinforced 1,200 GSM matte black coffret that protects structural fabrics from pressure during courier flights.</p>
            </div>
            <div>
              <p className="font-semibold text-ivory uppercase tracking-wider text-[11px] mb-1">
                Acid-Free Archival Tissue
              </p>
              <p>Garments are gently enveloped in pH-neutral archival black tissue, preventing fiber degradation and creasing.</p>
            </div>
            <div>
              <p className="font-semibold text-ivory uppercase tracking-wider text-[11px] mb-1">
                Wax Seal & Certificate
              </p>
              <p>Every order includes a personalized Certificate of Acquisition stamped with our signature gold wax emblem.</p>
            </div>
          </div>
        </div>

        {/* Tracking Callout */}
        <div className="border border-gold/30 bg-gold/5 p-8 text-center space-y-4">
          <ShieldIcon className="w-8 h-8 text-gold mx-auto" />
          <h2 className="font-serif text-2xl text-ivory font-light">
            Real-Time Courier Tracking
          </h2>
          <p className="text-xs text-ivory/70 max-w-md mx-auto leading-relaxed">
            Have your acquisition reference code (e.g. MN-2026-0001)? View current atelier status and courier GPS milestones instantly.
          </p>
          <div className="pt-2">
            <Link
              href="/track-order"
              className="inline-block px-8 py-3 bg-gold text-noir text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-all shadow-md"
            >
              Track Your Acquisition
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
