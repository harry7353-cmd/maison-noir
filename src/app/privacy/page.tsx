import { Metadata } from "next";
import { ShieldIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Patron Privacy Charter | MAISON NOIR",
  description: "Maison Noir patron confidentiality, encrypted transaction protocols, and privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-noir text-ivory min-h-screen py-16 lg:py-24">
      <div className="container-luxury max-w-3xl space-y-12">
        <div className="border-b border-border/20 pb-8 space-y-3">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-medium flex items-center gap-2">
            <ShieldIcon className="w-3.5 h-3.5" /> Confidentiality Protocol
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ivory">
            Patron Privacy Charter
          </h1>
          <p className="text-xs text-ivory/50">Effective Date: November 25, 2026</p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-ivory/70 leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-ivory font-normal">1. Preamble on Patron Discretion</h2>
            <p>
              At MAISON NOIR (&ldquo;the House&rdquo;), we recognize that discretion is the cornerstone of true luxury. We do not sell, rent, monetize, or publicly disclose our patrons&apos; personal dossiers or acquisition histories under any circumstances.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-ivory font-normal">2. Data Entrusted to the House</h2>
            <p>
              When you interact with our salon, register a patron profile, or place an acquisition, we collect the minimum necessary data to fulfill our obligations:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-ivory/60">
              <li>Identity & Contact: Full name, royal dispatch email address, telephone contact.</li>
              <li>Delivery Residences: Street addresses, postal codes, and concierge delivery notes.</li>
              <li>Acquisition Archives: Transaction records, garment sizes, and tracking numbers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-ivory font-normal">3. Payment & Cryptographic Security</h2>
            <p>
              All financial settlements are processed through PCI-DSS Level 1 compliant gateways (Razorpay, Stripe). Maison Noir servers never store, log, or have access to raw credit card numbers or banking credentials. Sessions are protected using industry-standard JOSE JSON Web Tokens and encrypted HTTP-only cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-ivory font-normal">4. Your Sovereign Rights</h2>
            <p>
              Patrons maintain absolute authority over their personal dossiers. You may request a complete export of your account data or the permanent erasure of your profile at any time by contacting <span className="font-mono text-gold">privacy@maisonnoir.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
