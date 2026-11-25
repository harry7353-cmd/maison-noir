import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { BRAND } from "@/lib/constants";

export function HeroCampaign() {
  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-[92vh] flex items-center justify-center bg-noir text-white overflow-hidden">
      {/* Background Campaign Imagery with Luxury Dark Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="MAISON NOIR Campaign"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 scale-105 animate-pulse"
          style={{ animationDuration: "12s" }}
        />
        {/* Editorial Royal Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-noir/80 via-transparent to-noir/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container-luxury max-w-4xl mx-auto text-center px-6 py-20 flex flex-col items-center">
        {/* Collection Sub-heading */}
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="w-10 h-[1px] bg-gold" />
          <span className="text-label text-gold text-[11px] tracking-[0.35em] uppercase font-medium">
            Inaugural Haute Campaign 2026
          </span>
          <span className="w-10 h-[1px] bg-gold" />
        </div>

        {/* Brand Display Title */}
        <h1 className="heading-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 uppercase">
          {BRAND.name}
        </h1>

        {/* Editorial Subtitle */}
        <p className="heading-editorial text-xl sm:text-2xl md:text-3xl text-ivory/90 max-w-2xl mb-8 font-light italic">
          &ldquo;{BRAND.tagline}&rdquo;
        </p>

        {/* Description */}
        <p className="text-body text-white/70 max-w-xl text-xs sm:text-sm md:text-base mb-10 leading-relaxed font-light">
          Where architectural modern silhouettes meet nocturnal opulence. Bespoke clothing
          crafted for everyday living, streetwear rebellion, and black-tie grandeur.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/collections/men"
            className="btn-gold w-full sm:w-auto shadow-gold"
          >
            Explore Men
            <ArrowRightIcon size={16} />
          </Link>
          <Link
            href="/collections/women"
            className="btn-secondary !text-white !border-white/40 hover:!border-gold hover:!bg-white/10 w-full sm:w-auto"
          >
            Explore Women
          </Link>
          <Link
            href="/collections/streetwear"
            className="btn-primary !border-white/20 !bg-noir/80 hover:!border-gold w-full sm:w-auto"
          >
            Streetwear Atelier
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[9px] font-sans text-white/60 tracking-[0.25em] uppercase">
          Scroll to Discover
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
