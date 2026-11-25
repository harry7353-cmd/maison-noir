import Image from "next/image";
import { StarIcon } from "@/components/ui/Icons";

const REVIEWS = [
  {
    quote:
      "The drape of the Nocturne Heavyweight Hoodie is unlike anything in contemporary streetwear. The weight, the subtle gold hardware, and the stitch density rival the best Paris ateliers.",
    author: "Rohan V.",
    title: "Private Client, Mumbai",
    verified: true,
  },
  {
    quote:
      "I wore the Mulberry Silk Column Gown to the Royal Opera Gala. The movement of the bias cut is hypnotic. True understated luxury without screaming logos.",
    author: "Elena Rostova",
    title: "Patron, London",
    verified: true,
  },
  {
    quote:
      "The Double-Breasted Cashmere Overcoat has an architectural presence that commands every room. Unrivaled tailoring and white-glove packaging.",
    author: "Vikramaditya S.",
    title: "Client, New Delhi",
    verified: true,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="container-luxury">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-label text-gold text-xs tracking-[0.3em] block mb-2">
            Client Voices
          </span>
          <h2 className="heading-section text-3xl sm:text-4xl text-noir">
            The Patron Experience
          </h2>
          <div className="gold-line mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="p-8 border border-border bg-ivory-light/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-gold mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <StarIcon key={idx} size={14} />
                  ))}
                </div>
                <p className="font-serif italic text-sm text-noir/90 leading-relaxed mb-6">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border/60">
                <span className="text-xs font-semibold text-noir block">
                  {r.author}
                </span>
                <span className="text-[10px] text-muted tracking-wider uppercase">
                  {r.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
