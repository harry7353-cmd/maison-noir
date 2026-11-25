import { Metadata } from "next";
import { SparklesIcon, ShieldIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Conscious Permanence & Noble Provenance | MAISON NOIR",
  description: "Maison Noir environmental commitment, micro-batch tailoring, organic raw fibers, and circular luxury.",
};

export default function SustainabilityPage() {
  return (
    <div className="bg-noir text-ivory min-h-screen py-16 lg:py-24">
      <div className="container-luxury max-w-4xl space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2">
            <SparklesIcon className="w-3.5 h-3.5" /> Noble Provenance
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ivory">
            Conscious Permanence
          </h1>
          <p className="text-xs sm:text-sm text-ivory/60 leading-relaxed font-light">
            True luxury does not consume the world; it creates heirloom garments designed to outlive ephemeral seasons and endure for generations.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface/30 border border-border/20 p-8 space-y-4">
            <ShieldIcon className="w-8 h-8 text-gold" />
            <h3 className="font-serif text-xl text-ivory">Regulated Micro-Batches</h3>
            <p className="text-xs text-ivory/70 leading-relaxed">
              We produce in strictly calculated micro-editions to prevent deadstock overproduction. When an edition is acquired, no excess inventory is incinerated or landfilled.
            </p>
          </div>

          <div className="bg-surface/30 border border-border/20 p-8 space-y-4">
            <SparklesIcon className="w-8 h-8 text-gold" />
            <h3 className="font-serif text-xl text-ivory">Organic & Natural Fibers</h3>
            <p className="text-xs text-ivory/70 leading-relaxed">
              Over 94% of our textiles are 100% natural and biodegradable: structured virgin wool, natural mulberry silks, organic Giza cotton, and raw unwashed selvedge denim.
            </p>
          </div>

          <div className="bg-surface/30 border border-border/20 p-8 space-y-4">
            <ShieldIcon className="w-8 h-8 text-gold" />
            <h3 className="font-serif text-xl text-ivory">100% Plastic-Free Boxes</h3>
            <p className="text-xs text-ivory/70 leading-relaxed">
              Our presentation coffrets are manufactured from FSC-certified recycled rigid cardboard, wrapped in biodegradable pH-neutral archival tissue, and sealed with organic wax.
            </p>
          </div>
        </div>

        {/* Lifetime Repairs */}
        <div className="border border-gold/30 bg-gold/5 p-8 sm:p-10 space-y-4 text-center">
          <h2 className="font-serif text-2xl text-ivory font-light">
            The Atelier Lifetime Repair Guarantee
          </h2>
          <p className="text-xs sm:text-sm text-ivory/70 max-w-xl mx-auto leading-relaxed">
            Every Maison Noir outerwear piece and suit is eligible for complimentary repair and alteration at our salons. A torn lining, a loose button, or a seam reinforcement will be lovingly restored by our master craftsmen.
          </p>
        </div>
      </div>
    </div>
  );
}
