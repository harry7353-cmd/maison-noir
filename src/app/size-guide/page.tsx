import { Metadata } from "next";
import { SparklesIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Haute Couture Size Guide | MAISON NOIR",
  description: "Accurate garment sizing, chest, waist, and length measurements for Maison Noir ready-to-wear collections.",
};

export default function SizeGuidePage() {
  const readyToWear = [
    { size: "XS", chest: "36 in / 91 cm", waist: "29 in / 74 cm", shoulder: "17.0 in / 43 cm", length: "27.5 in / 70 cm" },
    { size: "S", chest: "38 in / 96 cm", waist: "31 in / 79 cm", shoulder: "17.5 in / 44.5 cm", length: "28.0 in / 71 cm" },
    { size: "M", chest: "40 in / 102 cm", waist: "33 in / 84 cm", shoulder: "18.0 in / 46 cm", length: "28.5 in / 72 cm" },
    { size: "L", chest: "42 in / 107 cm", waist: "35 in / 89 cm", shoulder: "18.5 in / 47 cm", length: "29.0 in / 74 cm" },
    { size: "XL", chest: "44 in / 112 cm", waist: "37 in / 94 cm", shoulder: "19.0 in / 48.5 cm", length: "29.5 in / 75 cm" },
    { size: "XXL", chest: "46 in / 117 cm", waist: "39 in / 99 cm", shoulder: "19.5 in / 49.5 cm", length: "30.0 in / 76 cm" },
    { size: "3XL", chest: "48 in / 122 cm", waist: "41 in / 104 cm", shoulder: "20.0 in / 51 cm", length: "30.5 in / 77 cm" },
  ];

  const denim = [
    { waist: "28", hip: "36 in / 91 cm", thigh: "21 in / 53 cm", inseam: "32 in / 81 cm" },
    { waist: "30", hip: "38 in / 96 cm", thigh: "22 in / 56 cm", inseam: "32 in / 81 cm" },
    { waist: "32", hip: "40 in / 102 cm", thigh: "23 in / 58 cm", inseam: "32 in / 81 cm" },
    { waist: "34", hip: "42 in / 107 cm", thigh: "24 in / 61 cm", inseam: "34 in / 86 cm" },
    { waist: "36", hip: "44 in / 112 cm", thigh: "25 in / 63 cm", inseam: "34 in / 86 cm" },
    { waist: "38", hip: "46 in / 117 cm", thigh: "26 in / 66 cm", inseam: "34 in / 86 cm" },
  ];

  return (
    <div className="bg-noir text-ivory min-h-screen py-16 lg:py-24">
      <div className="container-luxury max-w-5xl space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2">
            <SparklesIcon className="w-3.5 h-3.5" /> Tailoring Precision
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ivory">
            Size & Silhouette Guide
          </h1>
          <p className="text-xs sm:text-sm text-ivory/60 leading-relaxed font-light">
            All Maison Noir silhouettes are designed with a sovereign, tailored drape. Consult the precise imperial measurements below before placing your order.
          </p>
        </div>

        {/* Ready-to-Wear Table */}
        <div className="bg-surface/30 border border-border/20 p-6 sm:p-8 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border/20 pb-4">
            <div>
              <h2 className="font-serif text-2xl text-ivory font-light">
                Ready-to-Wear Garments
              </h2>
              <p className="text-xs text-ivory/50">Outerwear, Blousons, Silk Shirts, Hoodies & Knits</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-gold font-mono border border-gold/30 px-2 py-0.5">
              Standard Fit
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-noir/60 text-ivory/50 uppercase tracking-wider text-[10px] border-b border-border/10">
                <tr>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Chest</th>
                  <th className="py-3 px-4">Waist</th>
                  <th className="py-3 px-4">Shoulder Span</th>
                  <th className="py-3 px-4">Back Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {readyToWear.map((r) => (
                  <tr key={r.size} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-gold">{r.size}</td>
                    <td className="py-3.5 px-4 text-ivory/80">{r.chest}</td>
                    <td className="py-3.5 px-4 text-ivory/80">{r.waist}</td>
                    <td className="py-3.5 px-4 text-ivory/80">{r.shoulder}</td>
                    <td className="py-3.5 px-4 text-ivory/80">{r.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Denim & Trousers Table */}
        <div className="bg-surface/30 border border-border/20 p-6 sm:p-8 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border/20 pb-4">
            <div>
              <h2 className="font-serif text-2xl text-ivory font-light">
                Denim & Tailored Trousers
              </h2>
              <p className="text-xs text-ivory/50">Selvedge Denim, Pleated Pants & Cargo Silhouettes</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-gold font-mono border border-gold/30 px-2 py-0.5">
              Waist Inseam
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-noir/60 text-ivory/50 uppercase tracking-wider text-[10px] border-b border-border/10">
                <tr>
                  <th className="py-3 px-4">Waist Size</th>
                  <th className="py-3 px-4">Hip Circumference</th>
                  <th className="py-3 px-4">Thigh</th>
                  <th className="py-3 px-4">Inseam Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {denim.map((d) => (
                  <tr key={d.waist} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-gold">{d.waist}</td>
                    <td className="py-3.5 px-4 text-ivory/80">{d.hip}</td>
                    <td className="py-3.5 px-4 text-ivory/80">{d.thigh}</td>
                    <td className="py-3.5 px-4 text-ivory/80">{d.inseam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Measure Instructions */}
        <div className="border border-border/20 bg-noir/40 p-8 space-y-4">
          <h3 className="font-serif text-xl text-ivory">Anatomy of Measurement</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-ivory/70 leading-relaxed">
            <div>
              <p className="font-semibold text-gold uppercase tracking-wider text-[11px] mb-1">1. Chest</p>
              <p>Wrap the tape around the fullest part of your chest, keeping the tape level under your arms and across your shoulder blades.</p>
            </div>
            <div>
              <p className="font-semibold text-gold uppercase tracking-wider text-[11px] mb-1">2. Natural Waist</p>
              <p>Measure around your natural waistline, where your trousers naturally sit. Keep one finger between the tape and your body for ease.</p>
            </div>
            <div>
              <p className="font-semibold text-gold uppercase tracking-wider text-[11px] mb-1">3. Inseam</p>
              <p>Measure from the highest point of your inner thigh down along the inside of your leg to the bottom of the ankle bone.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
