import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { SparklesIcon, ShieldIcon, StarIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "The House & Heritage | MAISON NOIR",
  description: "Discover the heritage, atelier craftsmanship, and royal noir philosophy behind MAISON NOIR.",
};

export default function AboutPage() {
  return (
    <div className="bg-noir text-ivory min-h-screen">
      {/* ── Hero Banner ─── */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden border-b border-border/20">
        <Image
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000"
          alt="Maison Noir Atelier"
          fill
          priority
          className="object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/70 to-transparent" />
        <div className="relative z-10 text-center max-w-3xl px-6 space-y-4">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2">
            <SparklesIcon className="w-3.5 h-3.5" /> Established MMXXIV
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-wide text-ivory">
            The Art of Darkness
          </h1>
          <p className="text-sm sm:text-base text-ivory/70 leading-relaxed max-w-xl mx-auto font-light">
            Born from an obsession with shadow, texture, and royal silhouettes, MAISON NOIR reimagines modern haute couture for the sovereign soul.
          </p>
        </div>
      </section>

      {/* ── The Manifesto ─── */}
      <section className="container-luxury py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6">
            <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold">
              The House Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-ivory leading-tight">
              Where Darkness Transcends Fashion Into Regal Ceremony
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-ivory/70 leading-relaxed font-light">
              <p>
                In an era of fleeting aesthetics and transient novelties, MAISON NOIR stands as a monument to permanence. We believe that black is not the absence of light, but the presence of all form, discipline, and sovereignty.
              </p>
              <p>
                Each silhouette is engineered with architectural precision—blending heavyweight Italian wools, Japanese raw selvedge, and hand-gilded bullion embroidery. To don a garment from the House is to envelop oneself in an armor of effortless majesty.
              </p>
              <blockquote className="border-l-2 border-gold pl-4 py-1 italic text-ivory/90 text-sm">
                &ldquo;We do not dress patrons for the passing season; we forge relics for the enduring evening.&rdquo;
              </blockquote>
            </div>
          </div>

          <div className="relative h-[480px] border border-gold/30 p-2 bg-surface/30">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200"
                alt="Haute Couture Craft"
                fill
                className="object-cover grayscale contrast-125 hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Three Pillars of Sovereignty ─── */}
      <section className="border-y border-border/20 bg-surface/30 py-20">
        <div className="container-luxury">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-gold text-xs uppercase tracking-[0.25em]">Guiding Standards</span>
            <h2 className="font-serif text-3xl font-light text-ivory">The Three Sovereign Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-border/20 bg-noir/50 space-y-4 hover:border-gold/40 transition-colors">
              <ShieldIcon className="w-8 h-8 text-gold" />
              <h3 className="font-serif text-xl text-ivory">Imperial Materials</h3>
              <p className="text-xs text-ivory/60 leading-relaxed">
                Exclusively sourced 450 GSM structured wools, mulberry silk linings, and hand-cast antique gold brass hardware that ages with noble patina.
              </p>
            </div>

            <div className="p-8 border border-border/20 bg-noir/50 space-y-4 hover:border-gold/40 transition-colors">
              <StarIcon className="w-8 h-8 text-gold" />
              <h3 className="font-serif text-xl text-ivory">Atelier Discipline</h3>
              <p className="text-xs text-ivory/60 leading-relaxed">
                Hand-cut pattern masteries and double-reinforced bar-tack stitching. Every seam is inspected across three sovereign checkpoints before packaging.
              </p>
            </div>

            <div className="p-8 border border-border/20 bg-noir/50 space-y-4 hover:border-gold/40 transition-colors">
              <SparklesIcon className="w-8 h-8 text-gold" />
              <h3 className="font-serif text-xl text-ivory">Numbered Editions</h3>
              <p className="text-xs text-ivory/60 leading-relaxed">
                Our pieces are manufactured in strictly regulated micro-batches. Once an acquisition quota is exhausted, the pattern is permanently vaulted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Call to Explore ─── */}
      <section className="container-luxury py-24 text-center space-y-6">
        <h2 className="font-serif text-3xl sm:text-4xl font-light text-ivory">
          Claim Your Sovereign Presence
        </h2>
        <p className="text-xs sm:text-sm text-ivory/60 max-w-md mx-auto">
          Explore our permanent archives or view current ready-to-wear collections crafted for the royal dark.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            href="/collections"
            className="px-8 py-3.5 bg-gold text-noir text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-all shadow-lg"
          >
            Explore Collections
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3.5 border border-gold/40 text-ivory text-xs uppercase tracking-widest hover:border-gold hover:text-gold transition-all"
          >
            Contact Concierge
          </Link>
        </div>
      </section>
    </div>
  );
}
