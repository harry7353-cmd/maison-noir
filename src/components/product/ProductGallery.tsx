"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
    altText?: string | null;
  }>;
  productName: string;
  discountPercent?: number | null;
}

export function ProductGallery({
  images,
  productName,
  discountPercent,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const activeImage = images[selectedIndex] || images[0] || { url: "" };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 lg:gap-6">
      {/* ── Left Thumbnail Strip ─── */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] flex-shrink-0 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 bg-ivory-light border transition-all ${
                idx === selectedIndex
                  ? "border-gold ring-1 ring-gold"
                  : "border-border hover:border-noir/40 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Main Viewport with Interactive Zoom ─── */}
      <div
        className="relative flex-1 aspect-[3/4] max-h-[720px] bg-ivory-light border border-border overflow-hidden cursor-crosshair group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Main Image */}
        <Image
          src={activeImage.url}
          alt={activeImage.altText || productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover object-center transition-transform duration-200 ${
            isZoomed ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Zoomed Lens Layer */}
        {isZoomed && (
          <div
            className="absolute inset-0 bg-no-repeat pointer-events-none"
            style={{
              backgroundImage: `url(${activeImage.url})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: "220%",
            }}
          />
        )}

        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute top-4 left-4 bg-burgundy text-white text-[10px] font-semibold tracking-widest uppercase px-3 py-1 pointer-events-none">
            -{discountPercent}% Exclusive
          </span>
        )}

        {/* Zoom Instruction Hint */}
        <div className="absolute bottom-3 right-3 bg-noir/70 backdrop-blur-sm text-white/80 text-[9px] font-sans px-2.5 py-1 tracking-wider uppercase pointer-events-none opacity-70 group-hover:opacity-0 transition-opacity">
          Hover to Inspect Details
        </div>
      </div>
    </div>
  );
}
