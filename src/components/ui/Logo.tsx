// ═══════════════════════════════════════════════════════════
// MAISON NOIR — Logo Component
// Typographic logo with gold accent
// ═══════════════════════════════════════════════════════════

import Link from "next/link";

interface LogoProps {
  variant?: "dark" | "light" | "gold";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
};

const taglineSizes = {
  sm: "text-[8px]",
  md: "text-[9px]",
  lg: "text-[10px]",
  xl: "text-xs",
};

export function Logo({
  variant = "dark",
  size = "md",
  showTagline = false,
  className = "",
}: LogoProps) {
  const colorClasses = {
    dark: "text-noir",
    light: "text-white",
    gold: "text-gold",
  };

  const taglineColors = {
    dark: "text-muted",
    light: "text-white/60",
    gold: "text-gold-muted",
  };

  const accentColors = {
    dark: "bg-gold",
    light: "bg-gold-light",
    gold: "bg-gold",
  };

  return (
    <Link href="/" className={`group inline-flex flex-col items-center ${className}`}>
      {/* Main brand name */}
      <div className="relative">
        <span
          className={`
            font-serif font-bold tracking-[0.25em] uppercase
            ${sizeClasses[size]} ${colorClasses[variant]}
            transition-colors duration-300
          `}
        >
          MAISON{" "}
          <span className="font-normal italic tracking-[0.15em]">NOIR</span>
        </span>

        {/* Gold accent underline — appears on hover */}
        <span
          className={`
            absolute -bottom-1 left-1/2 -translate-x-1/2
            h-[1px] w-0 group-hover:w-full
            ${accentColors[variant]}
            transition-all duration-500 ease-out
          `}
        />
      </div>

      {/* Optional tagline */}
      {showTagline && (
        <span
          className={`
            mt-1.5 font-sans font-normal tracking-[0.3em] uppercase
            ${taglineSizes[size]} ${taglineColors[variant]}
          `}
        >
          The Art of Darkness
        </span>
      )}
    </Link>
  );
}
