import { ShieldIcon, PackageIcon, RefreshIcon, TruckIcon } from "@/components/ui/Icons";

const PILLARS = [
  {
    icon: PackageIcon,
    title: "Master Mill Textiles",
    description: "Sourced exclusively from heritage mills across Biella Italy, Kuroki Japan, and Alexandria Egypt.",
  },
  {
    icon: ShieldIcon,
    title: "Canvassed Architecture",
    description: "Natural horsehair floating chest pieces and hand-finished pick stitching across tailored blazers.",
  },
  {
    icon: TruckIcon,
    title: "White-Glove Delivery",
    description: "Signature midnight boxes with embossed antique gold foil and climate-controlled garment bags.",
  },
  {
    icon: RefreshIcon,
    title: "Guaranteed Preservation",
    description: "Complimentary 14-day doorstep size exchanges and full patron satisfaction assurance.",
  },
];

export function CraftsmanshipSection() {
  return (
    <section className="py-20 bg-noir text-white border-y border-white/10">
      <div className="container-luxury">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-label text-gold text-xs tracking-[0.3em] block mb-2">
            The Standard
          </span>
          <h2 className="heading-section text-3xl sm:text-4xl text-white">
            Atelier Integrity
          </h2>
          <div className="gold-line mx-auto mt-4 mb-4" />
          <p className="text-sm text-white/60">
            Every garment is constructed with meticulous precision, designed to endure generations rather than seasons.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-8 border border-white/10 bg-white/[0.02] hover:border-gold/60 transition-colors duration-300 flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-noir transition-colors duration-300 mb-6">
                  <Icon size={24} />
                </div>
                <h3 className="heading-section text-base text-white mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
