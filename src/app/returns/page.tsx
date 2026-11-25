import { Metadata } from "next";
import Link from "next/link";
import { SparklesIcon, CheckIcon, ShieldIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Concierge Returns & Exchanges | MAISON NOIR",
  description: "Maison Noir 14-day complimentary returns, exchanges, and fabric inspection policies.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-noir text-ivory min-h-screen py-16 lg:py-24">
      <div className="container-luxury max-w-4xl space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2">
            <SparklesIcon className="w-3.5 h-3.5" /> Patron Guarantee
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ivory">
            Returns & Exchanges Charter
          </h1>
          <p className="text-xs sm:text-sm text-ivory/60 leading-relaxed font-light">
            We hold our silhouettes to royal standards. If an acquisition does not meet your expectations, our concierge facilitates seamless returns and exchanges.
          </p>
        </div>

        {/* 14-Day Window */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface/30 border border-border/20 p-6 space-y-3">
            <span className="font-serif text-3xl text-gold font-light">14 Days</span>
            <h3 className="font-serif text-lg text-ivory">Complimentary Return Window</h3>
            <p className="text-xs text-ivory/60 leading-relaxed">
              You have 14 days from courier handover to request a return pickup or size exchange.
            </p>
          </div>
          <div className="bg-surface/30 border border-border/20 p-6 space-y-3">
            <span className="font-serif text-3xl text-gold font-light">Doorstep</span>
            <h3 className="font-serif text-lg text-ivory">Courier Pickup</h3>
            <p className="text-xs text-ivory/60 leading-relaxed">
              Our logistics partner will collect the parcel directly from your residence at no additional charge.
            </p>
          </div>
          <div className="bg-surface/30 border border-border/20 p-6 space-y-3">
            <span className="font-serif text-3xl text-gold font-light">3–5 Days</span>
            <h3 className="font-serif text-lg text-ivory">Refund Settlement</h3>
            <p className="text-xs text-ivory/60 leading-relaxed">
              Once inspected at our atelier, refunds are credited back to your original source of payment within 3 to 5 business days.
            </p>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="bg-surface/30 border border-border/20 p-8 space-y-6">
          <h2 className="font-serif text-2xl text-ivory font-light flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-gold" /> Return Eligibility Standards
          </h2>
          <p className="text-xs text-ivory/60 leading-relaxed">
            To preserve the sovereignty of our garments for all patrons, returns must satisfy the following conditions:
          </p>
          <ul className="space-y-3 text-xs text-ivory/80">
            <li className="flex items-start gap-2">
              <CheckIcon className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>Garments must remain in unworn, unwashed, and immaculate condition with zero signs of perfume, makeup, or creasing.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>All original security hangtags, bullion brand ribbons, and fabric care labels must remain attached and intact.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>Items must be returned within the original Maison Noir presentation coffret, including all acid-free tissue and documentation.</span>
            </li>
          </ul>
        </div>

        {/* How to Initiate Return */}
        <div className="border border-border/20 bg-surface/20 p-8 space-y-6">
          <h2 className="font-serif text-2xl text-ivory font-light">
            How to Lodge a Return or Exchange
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-ivory/70 leading-relaxed">
            <div>
              <p className="font-semibold text-gold uppercase tracking-wider text-[11px] mb-1">
                Step 1: Contact Concierge
              </p>
              <p>Email concierge@maisonnoir.com with your Order Reference (e.g. MN-2026-0001) and reason for return or desired exchange size.</p>
            </div>
            <div>
              <p className="font-semibold text-gold uppercase tracking-wider text-[11px] mb-1">
                Step 2: Courier Collection
              </p>
              <p>Our courier partner will arrive at your registered address with a pre-printed security return label.</p>
            </div>
            <div>
              <p className="font-semibold text-gold uppercase tracking-wider text-[11px] mb-1">
                Step 3: Atelier Inspection & Refund
              </p>
              <p>Upon receiving the garment at our atelier, our team verifies conditions and authorizes an immediate refund or replacement dispatch.</p>
            </div>
          </div>

          <div className="pt-4 text-center">
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-gold text-noir text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-all"
            >
              Lodge Return with Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
