"use client";

import { useState } from "react";
import { CloseIcon } from "@/components/ui/Icons";

interface AnnouncementBarProps {
  message?: string;
  link?: {
    text: string;
    href: string;
  };
}

export function AnnouncementBar({
  message = "Complimentary shipping on orders over ₹2,999",
  link,
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-noir text-white py-2.5 px-4 text-center">
      <div className="flex items-center justify-center gap-2">
        <p className="text-[11px] font-sans font-normal tracking-[0.2em] uppercase">
          {message}
          {link && (
            <>
              {" — "}
              <a
                href={link.href}
                className="underline underline-offset-4 hover:text-gold transition-colors duration-300"
              >
                {link.text}
              </a>
            </>
          )}
        </p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:text-gold transition-colors duration-300"
        aria-label="Close announcement"
      >
        <CloseIcon size={14} strokeWidth={1} />
      </button>
    </div>
  );
}
