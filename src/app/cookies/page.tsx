import { Metadata } from "next";
import { ShieldIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Cookie Policy & Sovereign Transparency | MAISON NOIR",
  description: "Maison Noir cookie policy, strictly essential session storage, and zero-ad-tracker pledge.",
};

export default function CookiesPage() {
  return (
    <div className="bg-noir text-ivory min-h-screen py-16 lg:py-24">
      <div className="container-luxury max-w-3xl space-y-12">
        <div className="border-b border-border/20 pb-8 space-y-3">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-medium flex items-center gap-2">
            <ShieldIcon className="w-3.5 h-3.5" /> Client Transparency
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ivory">
            Cookie Policy
          </h1>
          <p className="text-xs text-ivory/50">Effective Date: November 25, 2026</p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-ivory/70 leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="font-serif text-xl text-ivory font-normal">1. Principles of Sovereign Tracking</h2>
            <p>
              MAISON NOIR respects your digital peace. We do not deploy invasive third-party ad retargeting pixels, cross-site trackers, or commercial surveillance software.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-ivory font-normal">2. Cookies Deployed by the Salon</h2>
            <p>We deploy only strictly essential cookies required for the cryptographic operation of the platform:</p>
            <ul className="list-disc pl-5 space-y-2 text-ivory/60">
              <li>
                <span className="font-mono text-gold font-semibold">mn_session</span>: An encrypted HTTP-only JWT token maintaining your authenticated patron or administrator state across page transitions.
              </li>
              <li>
                <span className="font-mono text-gold font-semibold">mn_cart_token</span>: A cryptographically secure random identifier allowing your shopping bag items to persist safely across visits before you sign in.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-ivory font-normal">3. Managing Your Browser State</h2>
            <p>
              You may purge or block cookies through your browser preferences at any moment. Please note that disabling essential cookies will prevent the cart and account chambers from persisting your selections.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
