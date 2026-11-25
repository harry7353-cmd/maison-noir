import { Metadata } from "next";
import { SparklesIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Press & Editorial Accreditation | MAISON NOIR",
  description: "Official press dispatches, editorial lookbooks, high-resolution media assets, and accreditation inquiries.",
};

const pressFeatures = [
  {
    publication: "VOGUE COUTURE",
    season: "Autumn / Winter 2026",
    quote: "Maison Noir redefines the architectural silhouette with an uncompromising black palette and bullion craftsmanship.",
  },
  {
    publication: "GQ INTERNATIONAL",
    season: "Style Monograph",
    quote: "Heavyweight 450 GSM Italian wools married with modern sovereign tailoring. An essential luxury monument.",
  },
  {
    publication: "HAUTE LIVING",
    season: "Private Client Profile",
    quote: "In an era of fleeting micro-trends, Maison Noir stands for permanence, discreet majesty, and limited micro-batches.",
  },
];

export default function PressPage() {
  return (
    <div className="bg-noir text-ivory min-h-screen py-16 lg:py-24">
      <div className="container-luxury max-w-4xl space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2">
            <SparklesIcon className="w-3.5 h-3.5" /> Editorial Corridors
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ivory">
            Press & Media Accreditation
          </h1>
          <p className="text-xs sm:text-sm text-ivory/60 leading-relaxed font-light">
            High-resolution lookbooks, collection dispatches, and VIP styling loans for verified fashion publications and stylists.
          </p>
        </div>

        {/* Editorial Citations */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl text-ivory font-light border-b border-border/20 pb-4">
            Critical Accolades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pressFeatures.map((p) => (
              <div
                key={p.publication}
                className="bg-surface/30 border border-border/20 p-6 space-y-4 hover:border-gold/30 transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="font-mono text-gold text-[10px] uppercase tracking-wider">
                    {p.season}
                  </span>
                  <h3 className="font-serif text-lg text-ivory font-semibold">{p.publication}</h3>
                </div>
                <blockquote className="text-xs text-ivory/70 leading-relaxed italic border-l border-gold/40 pl-3">
                  &ldquo;{p.quote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        </div>

        {/* Media Kit & Styling Loans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface/30 border border-border/20 p-8 space-y-4">
            <h3 className="font-serif text-2xl text-ivory font-light">Editorial Media Kit</h3>
            <p className="text-xs text-ivory/70 leading-relaxed">
              Access high-resolution campaign photography, product silhouettes on pure black/white, brand typography guidelines, and executive biographies.
            </p>
            <a
              href="mailto:press@maisonnoir.com?subject=Press%20Kit%20Request"
              className="inline-block px-5 py-2.5 bg-gold text-noir text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-all"
            >
              Request High-Res Assets
            </a>
          </div>

          <div className="bg-surface/30 border border-border/20 p-8 space-y-4">
            <h3 className="font-serif text-2xl text-ivory font-light">VIP & Red Carpet Loans</h3>
            <p className="text-xs text-ivory/70 leading-relaxed">
              We facilitate sample pulls and custom fittings for gala appearances, film premieres, and editorial photoshoots through our Paris and Mumbai showrooms.
            </p>
            <a
              href="mailto:press@maisonnoir.com?subject=Sample%20Pull%20Request"
              className="inline-block px-5 py-2.5 border border-gold/40 text-ivory text-xs uppercase tracking-widest hover:border-gold hover:text-gold transition-all"
            >
              Contact Press Office
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
