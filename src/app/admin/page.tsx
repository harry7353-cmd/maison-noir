"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldIcon,
  ShoppingBagIcon,
  UserIcon,
  PackageIcon,
  TruckIcon,
  CheckIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";

interface DashboardStats {
  grossRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  totalPatrons: number;
  totalProducts: number;
  lowStockCount: number;
}

interface LowStockItem {
  id: string;
  size: string;
  colorName: string;
  stock: number;
  product: {
    name: string;
    slug: string;
  };
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user?: {
    name: string | null;
    email: string;
  } | null;
  items: Array<{ id: string }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setLowStock(data.lowStockVariants || []);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (e) {
      console.error("Admin stats error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickRestock = async (variantId: string) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, stockDelta: 15, reason: "RESTOCK" }),
      });
      if (res.ok) fetchStats();
    } catch (e) {
      console.error("Restock error:", e);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-ivory/60 tracking-widest uppercase">
          Calculating Executive Ledger...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border/20 gap-4">
        <div>
          <span className="text-label text-gold text-xs tracking-[0.25em] uppercase block mb-1">
            Executive Command
          </span>
          <h1 className="heading-display text-3xl sm:text-4xl text-ivory font-medium">
            Imperial Atelier Ledger
          </h1>
          <p className="text-xs text-ivory/60 mt-1 font-light">
            Real-time financial performance, inventory discipline, and logistics monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 bg-gold text-noir text-xs uppercase tracking-wider font-semibold hover:bg-gold-light transition-all shadow-sm"
          >
            + Register Garment
          </Link>
          <button
            onClick={fetchStats}
            className="px-4 py-2.5 border border-border/40 text-ivory/80 text-xs uppercase tracking-wider hover:border-gold hover:text-gold transition-colors"
          >
            Sync Data
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="p-6 bg-noir-light/60 border border-border/30 rounded-sm relative overflow-hidden group hover:border-gold/40 transition-colors">
          <span className="text-[11px] text-ivory/60 uppercase tracking-wider block mb-2">
            Gross Revenue
          </span>
          <div className="font-mono text-2xl lg:text-3xl font-semibold text-gold">
            ₹{stats?.grossRevenue.toLocaleString("en-IN") || "0"}
          </div>
          <span className="text-[10px] text-emerald-400 mt-2 block font-medium">
            ↑ Active Fiscal Period
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-6 bg-noir-light/60 border border-border/30 rounded-sm relative overflow-hidden group hover:border-gold/40 transition-colors">
          <span className="text-[11px] text-ivory/60 uppercase tracking-wider block mb-2">
            Acquisitions Transcribed
          </span>
          <div className="font-mono text-2xl lg:text-3xl font-semibold text-ivory">
            {stats?.totalOrders || 0}
          </div>
          <span className="text-[10px] text-ivory/50 mt-2 block">
            Avg Ticket: ₹{Math.round(stats?.averageOrderValue || 0).toLocaleString("en-IN")}
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-6 bg-noir-light/60 border border-border/30 rounded-sm relative overflow-hidden group hover:border-gold/40 transition-colors">
          <span className="text-[11px] text-ivory/60 uppercase tracking-wider block mb-2">
            Registered Patrons
          </span>
          <div className="font-mono text-2xl lg:text-3xl font-semibold text-ivory">
            {stats?.totalPatrons || 0}
          </div>
          <span className="text-[10px] text-gold/80 mt-2 block">
            Exclusive Client Register
          </span>
        </div>

        {/* Metric 4 */}
        <div className="p-6 bg-noir-light/60 border border-border/30 rounded-sm relative overflow-hidden group hover:border-gold/40 transition-colors">
          <span className="text-[11px] text-ivory/60 uppercase tracking-wider block mb-2">
            Low Stock Alerts
          </span>
          <div className={`font-mono text-2xl lg:text-3xl font-semibold ${
            (stats?.lowStockCount || 0) > 0 ? "text-amber-400" : "text-emerald-400"
          }`}>
            {stats?.lowStockCount || 0}
          </div>
          <span className="text-[10px] text-ivory/50 mt-2 block">
            Variants ≤ 5 Units
          </span>
        </div>

      </div>

      {/* Two Column Section: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Recent Orders */}
        <div className="lg:col-span-7 bg-noir-light/40 border border-border/20 p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/20">
            <div className="flex items-center gap-2">
              <ShoppingBagIcon size={16} className="text-gold" />
              <h2 className="font-serif text-lg text-ivory font-medium">
                Recent Acquisitions
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs uppercase tracking-wider text-gold hover:underline"
            >
              All Orders →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-ivory/50 py-8 text-center">
              No orders have been recorded in this fiscal ledger yet.
            </p>
          ) : (
            <div className="divide-y divide-border/20">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="py-3.5 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <Link
                      href={`/orders/${ord.orderNumber}`}
                      className="font-mono font-medium text-gold hover:underline block"
                    >
                      {ord.orderNumber}
                    </Link>
                    <span className="text-[11px] text-ivory/60">
                      {ord.user?.name || ord.user?.email || "Guest Client"} •{" "}
                      {new Date(ord.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-ivory font-medium">
                      ₹{ord.totalAmount.toLocaleString("en-IN")}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold border ${
                        ord.status === "DELIVERED"
                          ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                          : ord.status === "SHIPPED"
                          ? "bg-blue-950/60 text-blue-400 border-blue-800"
                          : "bg-amber-950/60 text-amber-400 border-amber-800"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Low Inventory Alerts */}
        <div className="lg:col-span-5 bg-noir-light/40 border border-border/20 p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/20">
            <div className="flex items-center gap-2">
              <PackageIcon size={16} className="text-amber-400" />
              <h2 className="font-serif text-lg text-ivory font-medium">
                Atelier Low Stock
              </h2>
            </div>
            <Link
              href="/admin/products"
              className="text-xs uppercase tracking-wider text-gold hover:underline"
            >
              Catalog →
            </Link>
          </div>

          {lowStock.length === 0 ? (
            <div className="py-8 text-center text-xs text-emerald-400 flex items-center justify-center gap-2">
              <CheckIcon size={16} />
              <span>All catalog variants are abundantly stocked.</span>
            </div>
          ) : (
            <div className="divide-y divide-border/20 text-xs">
              {lowStock.map((v) => (
                <div
                  key={v.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-serif text-ivory block truncate max-w-[200px]">
                      {v.product.name}
                    </span>
                    <span className="text-[10px] text-ivory/60">
                      Size: {v.size} • Color: {v.colorName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-amber-400 font-bold">
                      {v.stock} left
                    </span>
                    <button
                      onClick={() => handleQuickRestock(v.id)}
                      className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-gold/20 text-gold border border-gold/40 hover:bg-gold hover:text-noir transition-colors"
                    >
                      +15 Stock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
