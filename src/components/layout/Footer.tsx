"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import {
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  PinterestIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";
import { BRAND, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsSubmitting(true);
      setStatusMessage(null);
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage(data.message || "Thank you for joining the House of Maison Noir.");
        setEmail("");
      } else {
        setStatusMessage(data.error || "Subscription error. Please try again.");
      }
    } catch {
      setStatusMessage("An unexpected network interruption occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-noir text-white/80">
      {/* ── Newsletter Section ─── */}
      <div className="border-b border-white/10">
        <div className="container-luxury py-16 lg:py-20">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="heading-section text-white text-2xl lg:text-3xl mb-3">
              Join the House
            </h3>
            <p className="text-sm text-white/50 mb-8 leading-relaxed">
              Be the first to discover new collections, exclusive offers,
              and stories from MAISON NOIR.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-3.5 bg-white/5 border border-white/20 text-white text-sm
                  placeholder:text-white/30 focus:outline-none focus:border-gold
                  transition-colors duration-300"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3.5 bg-gold text-noir text-xs font-semibold tracking-[0.15em] uppercase
                  hover:bg-gold-light transition-colors duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                <span className="hidden sm:inline">
                  {isSubmitting ? "Inscribing..." : "Subscribe"}
                </span>
                <ArrowRightIcon size={16} />
              </button>
            </form>
            {statusMessage && (
              <p className="text-xs text-gold mt-3 tracking-wide font-light">
                {statusMessage}
              </p>
            )}
            <p className="text-[10px] text-white/30 mt-3 tracking-wide">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Footer ─── */}
      <div className="container-luxury py-14 lg:py-18">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Logo variant="light" size="md" showTagline className="mb-6" />
            <p className="text-sm text-white/40 leading-relaxed max-w-xs mb-6">
              {BRAND.shortDescription}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-gold transition-colors duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={BRAND.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-gold transition-colors duration-300"
                aria-label="Twitter"
              >
                <TwitterIcon size={18} />
              </a>
              <a
                href={BRAND.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-gold transition-colors duration-300"
                aria-label="Facebook"
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href={BRAND.social.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-gold transition-colors duration-300"
                aria-label="Pinterest"
              >
                <PinterestIcon size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-label text-[10px] text-gold tracking-[0.2em] mb-5">
              Shop
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.footer.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-label text-[10px] text-gold tracking-[0.2em] mb-5">
              Help
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.footer.help.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-label text-[10px] text-gold tracking-[0.2em] mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.footer.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─── */}
      <div className="border-t border-white/10">
        <div className="container-luxury py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/30 tracking-wider">
            © {currentYear} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {NAV_LINKS.footer.legal.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] text-white/30 hover:text-white/60 transition-colors tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
