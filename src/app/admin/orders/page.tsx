"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBagIcon,
  TruckIcon,
  CheckIcon,
  CloseIcon,
  MapPinIcon,
} from "@/components/ui/Icons";

interface OrderItem {
  id: string;
  productName: string;
  size: string;
  colorName: string;
  quantity: number;
  subtotal: number;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  shippingFullName: string;
  shippingPhone: string;
  shippingCity: string;
  shippingState: string;
  user?: { name: string | null; email: string } | null;
  guestEmail?: string | null;
  items: OrderItem[];
  shipment?: {
    id: string;
    carrier: string;
    trackingNumber: string;
    status: string;
  } | null;
  payment?: {
    provider: string;
    paymentStatus: string;
  } | null;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Fulfill Modal State
  const [activeFulfillOrder, setActiveFulfillOrder] = useState<AdminOrder | null>(null);
  const [fulfillCarrier, setFulfillCarrier] = useState("Delhivery Express");
  const [fulfillTracking, setFulfillTracking] = useState("");
  const [fulfilling, setFulfilling] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url =
        selectedStatus && selectedStatus !== "ALL"
          ? `/api/admin/orders?status=${selectedStatus}`
          : "/api/admin/orders";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error("Orders error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) fetchOrders();
    } catch (e) {
      console.error("Status update error:", e);
    }
  };

  const handleFulfillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFulfillOrder) return;

    setFulfilling(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: activeFulfillOrder.id,
          status: "SHIPPED",
          carrier: fulfillCarrier,
          trackingNumber:
            fulfillTracking.trim() ||
            `MN${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`,
        }),
      });

      if (res.ok) {
        setActiveFulfillOrder(null);
        fetchOrders();
      }
    } catch (e) {
      console.error("Fulfill error:", e);
    } finally {
      setFulfilling(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border/20 gap-4">
        <div>
          <span className="text-label text-gold text-xs tracking-[0.25em] uppercase block mb-1">
            Fulfillment & Logistics
          </span>
          <h1 className="heading-display text-3xl sm:text-4xl text-ivory font-medium">
            Acquisitions & Order Management
          </h1>
          <p className="text-xs text-ivory/60 mt-1 font-light">
            Monitor client acquisitions, update fulfillment stages, and dispatch courier manifests.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2.5 border border-border/40 text-ivory/80 text-xs uppercase tracking-wider hover:border-gold hover:text-gold transition-colors self-start sm:self-auto"
        >
          Refresh Feed
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/20 pb-4 text-xs">
        {["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 uppercase tracking-wider font-medium transition-all ${
                selectedStatus === status
                  ? "bg-gold text-noir font-semibold"
                  : "bg-noir-light/40 text-ivory/60 hover:text-ivory border border-border/20"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-ivory/50 uppercase tracking-widest">
          Consulting Acquisition Ledger...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center border border-border/20 bg-noir-light/30">
          <p className="text-xs text-ivory/50">
            No acquisitions recorded under &ldquo;{selectedStatus}&rdquo; status.
          </p>
        </div>
      ) : (
        <div className="border border-border/20 bg-noir-light/30 overflow-x-auto">
          <table className="w-full text-left text-xs text-ivory/80">
            <thead className="bg-noir border-b border-border/20 text-[10px] uppercase tracking-wider text-ivory/50">
              <tr>
                <th className="py-3 px-4">Order Registry</th>
                <th className="py-3 px-4">Patron Identity</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Appraisal Sum</th>
                <th className="py-3 px-4">Courier Dispatch</th>
                <th className="py-3 px-4">Regulate Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-noir-light/50 transition-colors">
                  {/* Order number & items count */}
                  <td className="py-4 px-4">
                    <Link
                      href={`/orders/${ord.orderNumber}`}
                      target="_blank"
                      className="font-mono text-sm text-gold hover:underline font-semibold block"
                    >
                      {ord.orderNumber}
                    </Link>
                    <span className="text-[10px] text-ivory/50">
                      {new Date(ord.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      • {ord.items.length} garments
                    </span>
                  </td>

                  {/* Patron */}
                  <td className="py-4 px-4">
                    <span className="font-serif text-ivory block font-medium">
                      {ord.user?.name || ord.shippingFullName}
                    </span>
                    <span className="text-[10px] text-ivory/50">
                      {ord.user?.email || ord.guestEmail}
                    </span>
                  </td>

                  {/* Destination */}
                  <td className="py-4 px-4 text-ivory/70">
                    <span className="block truncate max-w-[150px]">
                      {ord.shippingCity}, {ord.shippingState}
                    </span>
                    <span className="font-mono text-[10px] text-ivory/40">
                      {ord.shippingPhone}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="py-4 px-4 font-mono font-medium text-ivory">
                    ₹{ord.totalAmount.toLocaleString("en-IN")}
                  </td>

                  {/* Courier details */}
                  <td className="py-4 px-4 text-[11px]">
                    {ord.shipment ? (
                      <div>
                        <span className="font-medium text-ivory block">
                          {ord.shipment.carrier}
                        </span>
                        <span className="font-mono text-[10px] text-gold">
                          #{ord.shipment.trackingNumber}
                        </span>
                      </div>
                    ) : (
                      <span className="text-ivory/40 italic">Awaiting carrier</span>
                    )}
                  </td>

                  {/* Stage Dropdown */}
                  <td className="py-4 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                      className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider border bg-noir focus:outline-none ${
                        ord.status === "DELIVERED"
                          ? "text-emerald-400 border-emerald-800"
                          : ord.status === "SHIPPED"
                          ? "text-blue-400 border-blue-800"
                          : "text-amber-400 border-amber-800"
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right space-x-2">
                    {ord.status !== "SHIPPED" && ord.status !== "DELIVERED" && (
                      <button
                        onClick={() => {
                          setActiveFulfillOrder(ord);
                          setFulfillCarrier(ord.shipment?.carrier || "Delhivery Express");
                          setFulfillTracking(ord.shipment?.trackingNumber || "");
                        }}
                        className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-gold text-noir font-semibold hover:bg-gold-light transition-colors"
                      >
                        Dispatch
                      </button>
                    )}
                    <Link
                      href={`/orders/${ord.orderNumber}`}
                      target="_blank"
                      className="px-2.5 py-1 text-[10px] uppercase tracking-wider border border-border/40 text-ivory/70 hover:text-gold hover:border-gold transition-colors inline-block"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Fulfill & Dispatch Modal ─── */}
      {activeFulfillOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-border/40 max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveFulfillOrder(null)}
              className="absolute top-4 right-4 text-ivory/50 hover:text-ivory"
            >
              <CloseIcon size={18} />
            </button>

            <span className="text-label text-gold text-[10px] tracking-[0.25em] uppercase block mb-1">
              Logistics Dispatch
            </span>
            <h2 className="heading-display text-xl text-ivory mb-4 font-medium">
              Manifest Courier Shipment
            </h2>

            <p className="text-xs text-ivory/60 mb-4 font-light">
              Order: <span className="font-mono text-gold font-semibold">{activeFulfillOrder.orderNumber}</span>
            </p>

            <form onSubmit={handleFulfillSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-ivory/70 mb-1">
                  Courier Partner
                </label>
                <select
                  value={fulfillCarrier}
                  onChange={(e) => setFulfillCarrier(e.target.value)}
                  className="w-full px-3 py-2 bg-noir border border-border/40 text-ivory focus:border-gold focus:outline-none"
                >
                  <option value="Delhivery Express">Delhivery Express</option>
                  <option value="BlueDart Apex">BlueDart Apex</option>
                  <option value="DHL Imperial Courier">DHL Imperial Courier</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-ivory/70 mb-1">
                  Airway Tracking Number (Leave empty to auto-generate)
                </label>
                <input
                  type="text"
                  value={fulfillTracking}
                  onChange={(e) => setFulfillTracking(e.target.value)}
                  placeholder="e.g. MN98765432"
                  className="w-full px-3 py-2 bg-noir border border-border/40 text-ivory focus:border-gold focus:outline-none font-mono"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/20">
                <button
                  type="button"
                  onClick={() => setActiveFulfillOrder(null)}
                  className="px-4 py-2 uppercase tracking-wider text-ivory/50 hover:text-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={fulfilling}
                  className="px-5 py-2.5 bg-gold text-noir uppercase tracking-[0.15em] font-semibold hover:bg-gold-light transition-all disabled:opacity-50"
                >
                  {fulfilling ? "Dispatching..." : "Dispatch Shipment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
