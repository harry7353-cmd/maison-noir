import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/ui/Icons";

interface CategoryTile {
  title: string;
  gender: string;
  href: string;
  imageUrl: string;
  subtitle: string;
}

const CATEGORIES: CategoryTile[] = [
  {
    title: "Men's Tailoring & Casual",
    gender: "Men",
    href: "/collections/men",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    subtitle: "Italian wool blazers, Giza tees & selvedge denim",
  },
  {
    title: "Women's Ready-to-Wear",
    gender: "Women",
    href: "/collections/women",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
    subtitle: "Mulberry silk gowns, structured blazers & crepe trousers",
  },
  {
    title: "Streetwear Atelier",
    gender: "Unisex",
    href: "/collections/streetwear",
    imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop",
    subtitle: "Heavyweight hoodies, technical cargos & boxy layers",
  },
  {
    title: "Leather & Bespoke Accessories",
    gender: "Accessories",
    href: "/collections/accessories",
    imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop",
    subtitle: "Calfskin cardholders, brass buckle belts & lambswool",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-label text-gold text-xs tracking-[0.3em] block mb-2">
            The Portfolios
          </span>
          <h2 className="heading-section text-3xl sm:text-4xl text-noir">
            Shop by Wardrobe
          </h2>
          <div className="gold-line mx-auto mt-4 mb-4" />
          <p className="text-sm text-muted">
            Curated categories tailored from the world&apos;s finest mills for discerning modern lifestyles.
          </p>
        </div>

        {/* 4-Tile Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative aspect-[3/4] overflow-hidden bg-noir block border border-border"
            >
              {/* Category Background Image */}
              <Image
                src={cat.imageUrl}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 opacity-75 group-hover:opacity-60"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/30 to-transparent" />

              {/* Content Card */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-label text-gold text-[10px] tracking-[0.25em] mb-1">
                  {cat.gender}
                </span>
                <h3 className="heading-section text-lg sm:text-xl text-white mb-1 group-hover:text-gold-light transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-white/60 mb-4 line-clamp-2 leading-relaxed">
                  {cat.subtitle}
                </p>

                <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-gold group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ArrowRightIcon size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
