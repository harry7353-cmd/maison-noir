import { Metadata } from "next";
import Link from "next/link";
import { SparklesIcon, ShieldIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Atelier Careers & Artisanship | MAISON NOIR",
  description: "Explore career opportunities, artisan apprenticeships, and atelier positions at Maison Noir.",
};

const roles = [
  {
    title: "Senior Pattern Master — Outerwear",
    department: "Atelier Haute Couture",
    location: "Paris / Mumbai",
    type: "Full-Time",
    description:
      "Lead architectural silhouette drafting for heavyweight wool overcoats and structured tailoring. 8+ years in luxury tailoring required.",
  },
  {
    title: "Textile Sourcing & Provenance Director",
    department: "Materials & Supply Chain",
    location: "Milan / Remote",
    type: "Full-Time",
    description:
      "Curate relationships with family-owned Italian wool mills, Japanese selvedge denim looms, and mulberry silk weavers.",
  },
  {
    title: "Private Client Concierge Advisor",
    department: "Patron Experience",
    location: "Mumbai Flagship",
    type: "Full-Time",
    description:
      "Deliver white-glove styling, private showroom tours, and bespoke fitting sessions to our Grand Sovereign VIP clientele.",
  },
  {
    title: "Atelier Junior Tailor (Apprenticeship)",
    department: "Couture Production",
    location: "Mumbai Atelier",
    type: "Fellowship",
    description:
      "Understudy our Master Tailors in hand-basting, bullion embroidery, and canvassing techniques. Fine arts or fashion diploma required.",
  },
];

export default function CareersPage() {
  return (
    <div className="bg-noir text-ivory min-h-screen py-16 lg:py-24">
      <div className="container-luxury max-w-4xl space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2">
            <SparklesIcon className="w-3.5 h-3.5" /> House of Craftsmen
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ivory">
            Atelier Artisanship & Careers
          </h1>
          <p className="text-xs sm:text-sm text-ivory/60 leading-relaxed font-light">
            We are always seeking visionaries, master cutters, and client directors who share our uncompromising devotion to sartorial perfection.
          </p>
        </div>

        {/* Culture Strip */}
        <div className="border border-border/20 bg-surface/30 p-8 sm:p-10 space-y-4">
          <ShieldIcon className="w-6 h-6 text-gold" />
          <h2 className="font-serif text-2xl text-ivory font-light">
            The Atelier Ethos
          </h2>
          <p className="text-xs sm:text-sm text-ivory/70 leading-relaxed">
            At Maison Noir, we reject fast-fashion velocity in favor of timeless mastery. Every garment is treated as a sculptural artifact. We offer competitive sovereign compensation, international atelier exchanges between Paris and Mumbai, and a culture of continuous artisanship.
          </p>
        </div>

        {/* Open Roles */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl text-ivory font-light border-b border-border/20 pb-4">
            Current Appointments
          </h2>

          <div className="space-y-4">
            {roles.map((r) => (
              <div
                key={r.title}
                className="bg-surface/30 border border-border/20 p-6 sm:p-8 space-y-4 hover:border-gold/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold font-mono">
                      {r.department} • {r.location}
                    </span>
                    <h3 className="font-serif text-xl text-ivory mt-0.5">{r.title}</h3>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-ivory/50 border border-border/30 px-3 py-1 self-start sm:self-auto font-mono">
                    {r.type}
                  </span>
                </div>

                <p className="text-xs text-ivory/70 leading-relaxed">{r.description}</p>

                <div className="pt-2">
                  <a
                    href="mailto:careers@maisonnoir.com?subject=Application:%20"
                    className="inline-block text-xs uppercase tracking-widest text-gold hover:text-gold-light transition-colors font-medium"
                  >
                    Transmit Portfolio & Dossier →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Speculative Application */}
        <div className="border border-gold/30 bg-gold/5 p-8 text-center space-y-4">
          <h3 className="font-serif text-xl text-ivory">Unlisted Expertise?</h3>
          <p className="text-xs text-ivory/70 max-w-md mx-auto leading-relaxed">
            If your craftsmanship transcends our listed roles, transmit a speculative portfolio and introduction to our Chief Creative Chamber.
          </p>
          <a
            href="mailto:careers@maisonnoir.com"
            className="inline-block px-6 py-2.5 bg-gold text-noir text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-all"
          >
            careers@maisonnoir.com
          </a>
        </div>
      </div>
    </div>
  );
}
