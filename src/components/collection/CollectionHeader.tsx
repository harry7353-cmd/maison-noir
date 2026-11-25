import Link from "next/link";
import Image from "next/image";

interface CollectionHeaderProps {
  title: string;
  tagline?: string | null;
  description?: string | null;
  bannerUrl?: string | null;
  breadcrumbs: Array<{ label: string; href?: string }>;
}

export function CollectionHeader({
  title,
  tagline,
  description,
  bannerUrl,
  breadcrumbs,
}: CollectionHeaderProps) {
  return (
    <div className="relative w-full overflow-hidden bg-noir text-white py-16 lg:py-24">
      {/* Optional Background Banner */}
      {bannerUrl && (
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src={bannerUrl}
            alt={title}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/60 to-noir/40" />
        </div>
      )}

      <div className="relative z-10 container-luxury">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/50 mb-6">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              <span>/</span>
              {b.href ? (
                <Link href={b.href} className="hover:text-gold transition-colors">
                  {b.label}
                </Link>
              ) : (
                <span className="text-gold font-medium">{b.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Title & Narrative */}
        <div className="max-w-3xl">
          {tagline && (
            <span className="text-label text-gold text-xs tracking-[0.3em] block mb-2">
              {tagline}
            </span>
          )}
          <h1 className="heading-display text-3xl sm:text-5xl lg:text-6xl text-white mb-4">
            {title}
          </h1>
          <div className="gold-line-left mb-4" />
          {description && (
            <p className="text-body text-white/70 text-xs sm:text-sm md:text-base leading-relaxed font-light">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
