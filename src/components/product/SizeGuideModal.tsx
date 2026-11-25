"use client";

import { useState } from "react";
import { CloseIcon } from "@/components/ui/Icons";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
}

export function SizeGuideModal({ isOpen, onClose, categoryName = "Garment" }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"cm" | "in">("in");

  if (!isOpen) return null;

  const dataInches = [
    { size: "XS", chest: "34 - 36", waist: "28 - 30", hips: "34 - 36" },
    { size: "S", chest: "36 - 38", waist: "30 - 32", hips: "36 - 38" },
    { size: "M", chest: "38 - 40", waist: "32 - 34", hips: "38 - 40" },
    { size: "L", chest: "40 - 42", waist: "34 - 36", hips: "40 - 42" },
    { size: "XL", chest: "42 - 44", waist: "36 - 38", hips: "42 - 44" },
    { size: "XXL", chest: "44 - 46", waist: "38 - 40", hips: "44 - 46" },
  ];

  const dataCm = [
    { size: "XS", chest: "86 - 91", waist: "71 - 76", hips: "86 - 91" },
    { size: "S", chest: "91 - 96", waist: "76 - 81", hips: "91 - 96" },
    { size: "M", chest: "96 - 101", waist: "81 - 86", hips: "96 - 101" },
    { size: "L", chest: "101 - 106", waist: "86 - 91", hips: "101 - 106" },
    { size: "XL", chest: "106 - 111", waist: "91 - 96", hips: "106 - 111" },
    { size: "XXL", chest: "111 - 117", waist: "96 - 102", hips: "111 - 117" },
  ];

  const tableData = unit === "in" ? dataInches : dataCm;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-noir/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-white border border-border p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
          <div>
            <span className="text-label text-gold text-[10px] tracking-[0.25em] block mb-1">
              Atelier Measurement Standard
            </span>
            <h3 className="heading-section text-2xl text-noir">
              {categoryName} Size Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:text-gold transition-colors"
            aria-label="Close size guide"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-muted">
            All garments are tailored according to international luxury sizing standards.
          </p>
          <div className="inline-flex border border-border">
            <button
              onClick={() => setUnit("in")}
              className={`px-3 py-1 text-xs font-medium tracking-wider uppercase transition-colors ${
                unit === "in" ? "bg-noir text-white" : "bg-white text-muted hover:text-noir"
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 text-xs font-medium tracking-wider uppercase transition-colors ${
                unit === "cm" ? "bg-noir text-white" : "bg-white text-muted hover:text-noir"
              }`}
            >
              Centimeters
            </button>
          </div>
        </div>

        {/* Size Chart Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-ivory-light/50">
                <th className="py-3 px-4 font-semibold text-noir tracking-wider uppercase">
                  Size
                </th>
                <th className="py-3 px-4 font-semibold text-noir tracking-wider uppercase">
                  Chest / Bust ({unit})
                </th>
                <th className="py-3 px-4 font-semibold text-noir tracking-wider uppercase">
                  Waist ({unit})
                </th>
                <th className="py-3 px-4 font-semibold text-noir tracking-wider uppercase">
                  Hips ({unit})
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr
                  key={row.size}
                  className="border-b border-border/50 hover:bg-ivory/30 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-gold">{row.size}</td>
                  <td className="py-3 px-4 text-noir/80">{row.chest}</td>
                  <td className="py-3 px-4 text-noir/80">{row.waist}</td>
                  <td className="py-3 px-4 text-noir/80">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Instructions */}
        <div className="p-4 bg-ivory-light/50 border border-border text-xs space-y-2 text-muted leading-relaxed">
          <strong className="text-noir block font-semibold uppercase tracking-wider text-[11px]">
            How to Measure
          </strong>
          <p>
            • <strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal under your arms.
          </p>
          <p>
            • <strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.
          </p>
          <p>
            • <strong>Hips:</strong> Measure around the fullest point of your hips with feet together.
          </p>
        </div>
      </div>
    </div>
  );
}
