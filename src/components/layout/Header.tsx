"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  ShoppingBagIcon,
  MenuIcon,
  CloseIcon,
  ChevronDownIcon,
} from "@/components/ui/Icons";
import { NAV_LINKS, NavItem, NavChildItem } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { LiveSearchModal } from "@/components/layout/LiveSearchModal";

export function Header() {
  const { user } = useAuth();
  const { summary, openCart } = useCart();
  const { totalWishlist } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`
        sticky top-0 z-50 w-full transition-all duration-500
        ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-white border-b border-transparent"
        }
      `}
    >
      <div className="container-luxury">
        <div className="flex items-center justify-between h-18 lg:h-20">
          {/* ── Left: Mobile menu + Search ─── */}
          <div className="flex items-center gap-3 lg:gap-4 w-1/4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1 hover:text-gold transition-colors"
              aria-label="Open menu"
            >
              <MenuIcon size={22} />
            </button>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1 hover:text-gold transition-colors"
              aria-label="Search"
            >
              <SearchIcon size={20} />
            </button>
          </div>

          {/* ── Center: Logo ─── */}
          <div className="flex justify-center w-1/2">
            <Logo
              variant="dark"
              size="lg"
              className="transition-transform duration-300"
            />
          </div>

          {/* ── Right: Account, Wishlist, Cart ─── */}
          <div className="flex items-center justify-end gap-3 lg:gap-4 w-1/4">
            <Link
              href={user ? "/account" : "/login"}
              className="hidden sm:flex items-center gap-1.5 p-1 hover:text-gold transition-colors"
              aria-label={user ? `Account (${user.name || "Client"})` : "Sign In"}
            >
              <div className="relative">
                <UserIcon size={20} />
                {user && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gold rounded-full" />
                )}
              </div>
              {user && (
                <span className="text-[11px] font-medium tracking-wider text-noir max-w-[80px] truncate">
                  {user.name?.split(" ")[0] || "Client"}
                </span>
              )}
            </Link>
            <Link
              href="/wishlist"
              className="relative hidden sm:block p-1 hover:text-gold transition-colors"
              aria-label="Wishlist"
            >
              <HeartIcon size={20} />
              {totalWishlist > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-burgundy text-white text-[9px] font-semibold rounded-full flex items-center justify-center animate-fade-in">
                  {totalWishlist}
                </span>
              )}
            </Link>
            <button
              onClick={openCart}
              className="relative p-1 hover:text-gold transition-colors focus:outline-none"
              aria-label="Shopping bag"
            >
              <ShoppingBagIcon size={20} />
              {summary.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-white text-[9px] font-semibold rounded-full flex items-center justify-center animate-fade-in">
                  {summary.totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Desktop Navigation ─── */}
        <nav className="hidden lg:block border-t border-border/50">
          <ul className="flex items-center justify-center gap-8 py-3">
            {NAV_LINKS.main.map((item: NavItem) => (
              <li
                key={item.label}
                className="relative group"
                onMouseEnter={() =>
                  item.children && setOpenDropdown(item.label)
                }
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`
                    text-label text-[11px] tracking-[0.18em] py-2 inline-flex items-center gap-1
                    hover:text-gold transition-colors duration-300
                    ${item.label === "Sale" ? "text-burgundy font-semibold" : "text-noir"}
                  `}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDownIcon
                      size={12}
                      className="transition-transform duration-200 group-hover:rotate-180"
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                    <div className="bg-white border border-border shadow-lg min-w-[220px] py-3">
                      <div className="px-4 pb-2 mb-2 border-b border-border/50">
                        <Link
                          href={item.href}
                          className="text-label text-[10px] text-gold tracking-[0.2em]"
                        >
                          View All {item.label}
                        </Link>
                      </div>
                      {item.children.map((child: NavChildItem) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-noir/80 hover:text-gold hover:bg-ivory/50 transition-colors duration-200"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* ── Live Search Overlay Modal ─── */}
      <LiveSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* ── Mobile Menu Overlay ─── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-noir/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu panel */}
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white overflow-y-auto">
            {/* Menu header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <Logo variant="dark" size="sm" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 hover:text-gold transition-colors"
                aria-label="Close menu"
              >
                <CloseIcon size={22} />
              </button>
            </div>

            {/* Menu links */}
            <nav className="py-4">
              {NAV_LINKS.main.map((item: NavItem) => (
                <div key={item.label} className="border-b border-border/30">
                  {item.children ? (
                    <details className="group">
                      <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                        <span
                          className={`text-sm font-medium tracking-widest uppercase ${
                            item.label === "Sale"
                              ? "text-burgundy"
                              : "text-noir"
                          }`}
                        >
                          {item.label}
                        </span>
                        <ChevronDownIcon
                          size={16}
                          className="transition-transform duration-200 group-open:rotate-180"
                        />
                      </summary>
                      <div className="pb-3 bg-ivory/30">
                        <Link
                          href={item.href}
                          className="block px-8 py-2.5 text-xs font-medium tracking-[0.15em] uppercase text-gold"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          View All
                        </Link>
                        {item.children.map((child: NavChildItem) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-8 py-2.5 text-sm text-noir/70 hover:text-gold transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block px-6 py-4 text-sm font-medium tracking-widest uppercase ${
                        item.label === "Sale" ? "text-burgundy" : "text-noir"
                      } hover:text-gold transition-colors`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile menu footer */}
            <div className="px-6 py-6 border-t border-border space-y-4">
              <Link
                href={user ? "/account" : "/login"}
                className="flex items-center gap-3 text-sm text-noir/70 hover:text-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserIcon size={18} />
                {user ? `Account (${user.name?.split(" ")[0] || "Client"})` : "Sign In / Join"}
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 text-sm text-noir/70 hover:text-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <HeartIcon size={18} />
                Wishlist
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
