import Image from "next/image";
import Link from "next/link";
import { BRAND, BRAND_STORY } from "@/lib/constants";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function BrandStorySection() {
  return (
    <section className="py-24 lg:py-32 bg-ivory-light/40 border-y border-border overflow-hidden">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Imagery (5 columns) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden border border-border shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop"
                alt="MAISON NOIR Atelier"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/50 via-transparent to-transparent" />
            </div>

            {/* Overlapping gold accent card */}
            <div className="hidden sm:block absolute -bottom-6 -right-4 bg-noir text-white p-6 border border-gold/40 shadow-xl max-w-xs">
              <span className="text-label text-gold text-[9px] tracking-[0.25em] block mb-1">
                Atelier Standard
              </span>
              <p className="font-serif italic text-sm text-ivory/90 leading-snug">
                &ldquo;Where true elegance emerges from the deliberate contrast between shadow and radiance.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Narrative (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-label text-gold text-xs tracking-[0.3em] block">
              The Maison Heritage
            </span>

            <h2 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-noir">
              {BRAND_STORY.headline}
            </h2>

            <div className="gold-line-left mb-6" />

            <p className="text-body text-sm sm:text-base text-noir/80 leading-relaxed font-light">
              {BRAND_STORY.paragraph1}
            </p>

            <p className="text-body text-sm sm:text-base text-noir/70 leading-relaxed font-light">
              {BRAND_STORY.paragraph2}
            </p>

            <p className="text-body text-xs sm:text-sm text-muted leading-relaxed font-light">
              {BRAND_STORY.paragraph3}
            </p>

            {/* Quality Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-noir block">
                  320+
                </span>
                <span className="text-[10px] text-muted tracking-widest uppercase">
                  GSM Organic Cotton
                </span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-noir block">
                  Grade 6A
                </span>
                <span className="text-[10px] text-muted tracking-widest uppercase">
                  Mulberry Silk
                </span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-noir block">
                  Super 130s
                </span>
                <span className="text-[10px] text-muted tracking-widest uppercase">
                  Italian Merino
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/about" className="btn-primary">
                Read the Full Atelier Story
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
