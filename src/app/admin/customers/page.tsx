"use client";

import { useEffect, useState, useMemo } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { UserIcon, ShieldIcon, StarIcon } from "@/components/ui/Icons";

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "CUSTOMER" | "ADMIN";
  vipTier: string;
  orderCount: number;
  totalSpent: number;
  primaryCity: string;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");

  useEffect(() => {
    async function loadCustomers() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/customers");
        const data = await res.json();
        if (data.success) {
          setCustomers(data.customers || []);
        }
      } catch (err) {
        console.error("Error fetching patrons:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCustomers();
  }, []);

  // Filter & Search
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.primaryCity.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier =
        selectedTier === "ALL" ||
        c.vipTier === selectedTier ||
        (selectedTier === "ADMIN" && c.role === "ADMIN");

      return matchesSearch && matchesTier;
    });
  }, [customers, searchQuery, selectedTier]);

  // Metrics
  const totalValuation = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const sovereignCount = customers.filter(
    (c) => c.vipTier === "Grand Sovereign VIP" || c.vipTier === "Imperial Administrator"
  ).length;

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "Imperial Administrator":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-burgundy/30 text-rose-300 border border-burgundy/50">
            <ShieldIcon className="w-3 h-3" /> Imperial
          </span>
        );
      case "Grand Sovereign VIP":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-gold/20 text-gold border border-gold/40">
            <StarIcon className="w-3 h-3 text-gold" /> Sovereign VIP
          </span>
        );
      case "Noir Elite Member":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-ivory/10 text-ivory border border-ivory/20">
            Elite Member
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase tracking-wider bg-noir text-ivory/50 border border-border/20">
            Patron
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* ── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-6">
        <div>
          <span className="text-gold text-xs uppercase tracking-[0.25em] font-medium flex items-center gap-2">
            <UserIcon className="w-3.5 h-3.5" /> High-Society Patron Directory
          </span>
          <h1 className="font-serif text-3xl font-light tracking-wide text-ivory mt-1">
            Patron Registry
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Comprehensive dossier of registered Maison Noir patrons, acquisition valuations, and sovereign tiers.
          </p>
        </div>

        <div className="text-right sm:self-auto self-start">
          <p className="text-[10px] uppercase tracking-widest text-ivory/40">Cumulative Spend</p>
          <p className="font-serif text-2xl text-gold font-light">
            {formatCurrency(totalValuation)}
          </p>
        </div>
      </div>

      {/* ── KPI Row ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface/60 border border-border/20 p-5 backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-widest text-ivory/50">Registered Patrons</p>
          <p className="font-serif text-3xl font-light text-ivory mt-1">{customers.length}</p>
          <p className="text-[11px] text-ivory/40 mt-1">Validated accounts in dossier</p>
        </div>
        <div className="bg-surface/60 border border-border/20 p-5 backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-widest text-ivory/50">Sovereign & Imperial VIPs</p>
          <p className="font-serif text-3xl font-light text-gold mt-1">{sovereignCount}</p>
          <p className="text-[11px] text-ivory/40 mt-1">Top-tier high spenders</p>
        </div>
        <div className="bg-surface/60 border border-border/20 p-5 backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-widest text-ivory/50">Average Patron Spend</p>
          <p className="font-serif text-3xl font-light text-ivory mt-1">
            {customers.length > 0
              ? formatCurrency(totalValuation / customers.length)
              : "₹0"}
          </p>
          <p className="text-[11px] text-ivory/40 mt-1">Per registered customer</p>
        </div>
      </div>

      {/* ── Controls (Search & Filters) ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-surface/40 border border-border/20 p-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by patron name, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-noir border border-border/30 px-3.5 py-2 text-xs text-ivory placeholder:text-ivory/30 focus:border-gold outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-ivory/40">Tier:</span>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-noir border border-border/30 px-3 py-2 text-xs text-ivory focus:border-gold outline-none"
          >
            <option value="ALL">All Patrons</option>
            <option value="Grand Sovereign VIP">Grand Sovereign VIP</option>
            <option value="Noir Elite Member">Noir Elite Member</option>
            <option value="Noir Patron">Noir Patron</option>
            <option value="Imperial Administrator">Imperial Administrator</option>
          </select>
        </div>
      </div>

      {/* ── Patrons Table ─── */}
      <div className="bg-surface/40 border border-border/20 overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-4 border-b border-border/10 flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-widest text-ivory/80 font-medium">
            Patron Records ({filteredCustomers.length})
          </h2>
          <span className="text-[11px] text-ivory/40">Real-time database sync</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-ivory/50 tracking-wider">
            Accessing imperial patron registry...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-xs text-ivory/50 tracking-wider">
            No patrons found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-noir/60 text-ivory/50 uppercase tracking-wider text-[10px] border-b border-border/10">
                <tr>
                  <th className="py-3 px-6">Patron Identity</th>
                  <th className="py-3 px-6">VIP Standing</th>
                  <th className="py-3 px-6">Acquisitions</th>
                  <th className="py-3 px-6">Lifetime Valuation</th>
                  <th className="py-3 px-6">Primary City</th>
                  <th className="py-3 px-6 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10 text-ivory/80">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-surface/60 transition-colors">
                    {/* Identity */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center font-serif text-gold text-xs font-semibold">
                          {c.name ? c.name.charAt(0).toUpperCase() : "P"}
                        </div>
                        <div>
                          <p className="font-medium text-ivory">{c.name}</p>
                          <a
                            href={`mailto:${c.email}`}
                            className="text-[11px] text-gold/80 hover:text-gold transition-colors font-mono block"
                          >
                            {c.email}
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* VIP Standing */}
                    <td className="py-4 px-6">{getTierBadge(c.vipTier)}</td>

                    {/* Order count */}
                    <td className="py-4 px-6 font-mono text-ivory/80">
                      {c.orderCount} {c.orderCount === 1 ? "Order" : "Orders"}
                    </td>

                    {/* Lifetime Valuation */}
                    <td className="py-4 px-6">
                      <span className="font-serif text-sm font-medium text-gold">
                        {formatCurrency(c.totalSpent)}
                      </span>
                    </td>

                    {/* Primary City */}
                    <td className="py-4 px-6 text-ivory/70">{c.primaryCity}</td>

                    {/* Registered Date */}
                    <td className="py-4 px-6 text-right text-[11px] text-ivory/40">
                      {formatDate(c.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
