import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ArrowRightIcon } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-noir flex flex-col items-center justify-center text-center px-6 py-20">
      <div className="max-w-md space-y-6">
        <Logo size="lg" showTagline className="justify-center" />

        <div className="space-y-2 pt-4">
          <span className="font-mono text-gold text-xs tracking-[0.3em] uppercase">
            Error 404 — Void of Shadow
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-ivory">
            Silhouette Not Found
          </h1>
          <p className="text-xs sm:text-sm text-ivory/60 leading-relaxed font-light">
            The royal archive you seek has vanished into darkness or has been moved to an exclusive salon.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-gold text-noir text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-all shadow-md"
          >
            Return to Entrance
          </Link>
          <Link
            href="/collections"
            className="w-full sm:w-auto px-6 py-3 border border-border/30 text-ivory text-xs uppercase tracking-widest hover:border-gold hover:text-gold transition-all inline-flex items-center justify-center gap-2"
          >
            Explore Catalog <ArrowRightIcon size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
