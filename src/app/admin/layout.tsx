import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/ui/Logo";
import {
  ShieldIcon,
  ShoppingBagIcon,
  UserIcon,
  PackageIcon,
  ArrowRightIcon,
  StarIcon,
} from "@/components/ui/Icons";

export const metadata = {
  title: "Imperial Admin Chamber | MAISON NOIR",
  description: "Executive control panel for Maison Noir catalog, orders, and patron registry.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Strict role-based protection
  if (!user || user.role !== "ADMIN") {
    redirect("/login?redirect=/admin");
  }

  const navItems = [
    { href: "/admin", label: "Executive Overview", icon: ShieldIcon },
    { href: "/admin/products", label: "Garment Catalog & Stock", icon: PackageIcon },
    { href: "/admin/orders", label: "Orders & Fulfillment", icon: ShoppingBagIcon },
    { href: "/admin/coupons", label: "Promotional Vouchers", icon: StarIcon },
    { href: "/admin/customers", label: "Patron Registry", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-ivory flex flex-col">
      {/* ── Top Executive Bar ─── */}
      <header className="border-b border-border/20 bg-noir px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo size="sm" showTagline={false} />
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-gold border border-gold/40 px-2 py-0.5">
              Imperial Chamber
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="hidden sm:flex items-center gap-2 text-ivory/60">
            <span>Sovereign Admin:</span>
            <span className="font-mono text-gold font-medium">{user.email}</span>
          </div>

          <Link
            href="/"
            className="text-[11px] uppercase tracking-wider text-ivory/80 hover:text-gold transition-colors inline-flex items-center gap-1.5"
          >
            <span>Client Storefront</span>
            <ArrowRightIcon size={12} />
          </Link>
        </div>
      </header>

      {/* ── Admin Workspace Frame ─── */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 border-r border-border/20 bg-noir/80 p-4 md:p-6 flex-shrink-0 space-y-1">
          <span className="text-label text-gold/80 text-[10px] tracking-[0.25em] uppercase block mb-3 px-3">
            Atelier Governance
          </span>

          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-3 text-ivory/70 hover:text-gold hover:bg-noir-light/60 transition-all font-medium uppercase tracking-wider rounded-sm"
                >
                  <Icon size={16} className="text-gold" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-8 mt-8 border-t border-border/20 px-3 text-[11px] text-ivory/40 space-y-1">
            <p>Maison Noir CMS v2.6</p>
            <p>SQLite Engine Active</p>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
