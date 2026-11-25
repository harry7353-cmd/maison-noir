"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Maison Noir Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] bg-noir flex flex-col items-center justify-center text-center px-6 py-20">
      <div className="max-w-md space-y-6">
        <span className="font-mono text-gold text-xs tracking-[0.3em] uppercase">
          Chamber Disturbance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-ivory">
          An Unexpected Shadow Has Fallen
        </h1>
        <p className="text-xs sm:text-sm text-ivory/60 leading-relaxed font-light">
          A delicate disruption occurred in the salon engine. Our atelier technical directors have been notified.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 bg-gold text-noir text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-all shadow-md"
          >
            Restore Chamber
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 border border-border/30 text-ivory text-xs uppercase tracking-widest hover:border-gold hover:text-gold transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
