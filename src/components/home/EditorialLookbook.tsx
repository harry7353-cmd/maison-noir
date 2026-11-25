import Image from "next/image";
import { InstagramIcon } from "@/components/ui/Icons";
import { BRAND } from "@/lib/constants";

const LOOKBOOK_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
    caption: "The Overcoat Silhouette — Nocturne Series",
  },
  {
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    caption: "Architectural Organza & Silk",
  },
  {
    url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop",
    caption: "Streetwear Atelier Drop IV",
  },
  {
    url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    caption: "Midnight Velvet Smoking Jacket",
  },
  {
    url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
    caption: "Bias-Cut Mulberry Silk Gown",
  },
  {
    url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
    caption: "Giza Cotton 320 GSM Heavyweight Tee",
  },
];

export function EditorialLookbook() {
  return (
    <section className="py-20 lg:py-24 bg-ivory-light/40 border-t border-border">
      <div className="container-luxury">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-label text-gold text-xs tracking-[0.3em] block mb-2">
              Visual Editorial
            </span>
            <h2 className="heading-section text-2xl sm:text-4xl text-noir">
              #MaisonNoirStudio
            </h2>
          </div>

          <a
            href={BRAND.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-noir hover:text-gold transition-colors"
          >
            <InstagramIcon size={16} />
            <span>Follow the House</span>
          </a>
        </div>

        {/* 6-Photo Editorial Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {LOOKBOOK_IMAGES.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-[3/4] overflow-hidden bg-noir border border-border"
            >
              <Image
                src={img.url}
                alt={img.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-noir/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="text-[10px] text-white font-medium leading-tight">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
