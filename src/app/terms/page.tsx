import { Metadata } from "next";
import { ShieldIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Terms of Service & Acquisition | MAISON NOIR",
  description: "Maison Noir terms of service, bespoke acquisition conditions, and legal agreements.",
};

export default function TermsPage() {
  return (
    <div className="bg-noir text-ivory min-h-screen py-16 lg:py-24">
      <div className="container-luxury max-w-3xl space-y-12">
        <div className="border-b border-border/20 pb-8 space-y-3">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-medium flex items-center gap-2">
            <ShieldIcon className="w-3.5 h-3.5" /> Legal Framework
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ivory">
            Terms of Acquisition
          </h1>
          <p className="text-xs text-ivory/50">Effective Date: November 25, 2026</p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-ivory/70 leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-ivory font-normal">1. The Contract of Acquisition</h2>
            <p>
              By transmitting an acquisition through the Maison Noir platform, you enter into a binding covenant governed by the laws of India. An acquisition is considered executed only upon authorization of payment and generation of an official Certificate of Acquisition identifier.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-ivory font-normal">2. Pricing & Taxation</h2>
            <p>
              All prices displayed on the platform are in Indian Rupees (₹) and are inclusive of Goods and Services Tax (GST) as mandated by applicable statutes. In the rare event of a pricing typographical discrepancy, the House reserves the prerogative to contact the patron or revoke the transaction before shipment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-ivory font-normal">3. Intellectual Property</h2>
            <p>
              All visual silhouettes, brand photography, logos, editorial typography, and garment designs are the exclusive intellectual property of MAISON NOIR. Unauthorized commercial reproduction, adaptation, or digital redistribution is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-ivory font-normal">4. Jurisdiction & Inquiries</h2>
            <p>
              Any disputes arising from transactions conducted on this platform shall fall within the exclusive jurisdiction of the competent courts of Mumbai, India. Direct legal inquiries may be addressed to <span className="font-mono text-gold">legal@maisonnoir.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
