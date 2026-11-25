"use client";

import { useEffect, useState, useTransition } from "react";
import { formatCurrency } from "@/lib/utils";
import { StarIcon, SparklesIcon, CheckIcon } from "@/components/ui/Icons";

interface CouponItem {
  id: string;
  code: string;
  description?: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  maxUses?: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  // Form State
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [maxUses, setMaxUses] = useState("");

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error("Error fetching coupons:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCopy = (codeToCopy: string) => {
    navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(codeToCopy);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: !currentStatus } : c))
        );
      }
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!confirm(`Are you sure you wish to rescind credential ${couponCode}? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Error deleting coupon:", err);
    }
  };

  const handleMintCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: code.trim(),
            description: description.trim(),
            discountType,
            discountValue: parseFloat(discountValue),
            minOrderValue: minOrderValue ? parseFloat(minOrderValue) : 0,
            maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
            maxUses: maxUses ? parseInt(maxUses) : null,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          setErrorMessage(data.error || "Failed to mint voucher.");
          return;
        }

        setSuccessMessage(`Privilege credential ${data.coupon.code} minted successfully.`);
        setCoupons((prev) => [data.coupon, ...prev]);
        setShowModal(false);
        // Reset form
        setCode("");
        setDescription("");
        setDiscountValue("");
        setMinOrderValue("");
        setMaxDiscount("");
        setMaxUses("");
      } catch {
        setErrorMessage("Network error while minting voucher.");
      }
    });
  };

  const totalActive = coupons.filter((c) => c.isActive).length;
  const totalRedeemed = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* ── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-6">
        <div>
          <span className="text-gold text-xs uppercase tracking-[0.25em] font-medium flex items-center gap-2">
            <StarIcon className="w-3.5 h-3.5" /> Patron Privileges & Concessions
          </span>
          <h1 className="font-serif text-3xl font-light tracking-wide text-ivory mt-1">
            Promotional Vouchers
          </h1>
          <p className="text-xs text-ivory/60 mt-1">
            Mint exclusive discount credentials, control minimum acquisition thresholds, and track redemptions.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMessage("");
            setSuccessMessage("");
            setShowModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gold text-noir text-xs uppercase tracking-widest font-semibold hover:bg-gold-light transition-all shadow-md active:scale-95 self-start sm:self-auto"
        >
          <SparklesIcon className="w-4 h-4" />
          Mint New Voucher
        </button>
      </div>

      {/* ── KPI Strip ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface/60 border border-border/20 p-5 backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-widest text-ivory/50">Active Privileges</p>
          <p className="font-serif text-3xl font-light text-gold mt-1">{totalActive}</p>
          <p className="text-[11px] text-ivory/40 mt-1">Ready for checkout redemption</p>
        </div>
        <div className="bg-surface/60 border border-border/20 p-5 backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-widest text-ivory/50">Cumulative Redemptions</p>
          <p className="font-serif text-3xl font-light text-ivory mt-1">{totalRedeemed}</p>
          <p className="text-[11px] text-ivory/40 mt-1">Total patron transactions applied</p>
        </div>
        <div className="bg-surface/60 border border-border/20 p-5 backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-widest text-ivory/50">Total Vouchers</p>
          <p className="font-serif text-3xl font-light text-ivory mt-1">{coupons.length}</p>
          <p className="text-[11px] text-ivory/40 mt-1">Minted in royal archive</p>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-gold/10 border border-gold/30 text-gold text-xs flex items-center gap-2">
          <CheckIcon className="w-4 h-4" /> {successMessage}
        </div>
      )}

      {/* ── Vouchers Table ─── */}
      <div className="bg-surface/40 border border-border/20 overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-4 border-b border-border/10 flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-widest text-ivory/80 font-medium">
            Active & Archived Credentials
          </h2>
          <span className="text-[11px] text-ivory/40">Sorted by creation date</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-ivory/50 tracking-wider">
            Loading sovereign credentials...
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-xs text-ivory/50 tracking-wider">
            No promotional credentials recorded. Mint one above to grant exclusive patron privileges.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-noir/60 text-ivory/50 uppercase tracking-wider text-[10px] border-b border-border/10">
                <tr>
                  <th className="py-3 px-6">Code & Credential</th>
                  <th className="py-3 px-6">Privilege Value</th>
                  <th className="py-3 px-6">Acquisition Terms</th>
                  <th className="py-3 px-6">Usage / Limit</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10 text-ivory/80">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-surface/60 transition-colors">
                    {/* Code & Description */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-gold bg-gold/10 border border-gold/30 px-2 py-0.5 tracking-wider">
                          {c.code}
                        </span>
                        <button
                          onClick={() => handleCopy(c.code)}
                          title="Copy voucher code"
                          className="text-ivory/40 hover:text-gold text-[10px] transition-colors"
                        >
                          {copiedCode === c.code ? (
                            <span className="text-gold font-mono text-[10px]">Copied!</span>
                          ) : (
                            "Copy"
                          )}
                        </button>
                      </div>
                      {c.description && (
                        <p className="text-[11px] text-ivory/50 mt-1 max-w-xs truncate">
                          {c.description}
                        </p>
                      )}
                    </td>

                    {/* Privilege Value */}
                    <td className="py-4 px-6">
                      <span className="font-medium text-ivory text-sm">
                        {c.discountType === "PERCENTAGE"
                          ? `${c.discountValue}% OFF`
                          : `${formatCurrency(c.discountValue)} OFF`}
                      </span>
                      {c.discountType === "PERCENTAGE" && c.maxDiscount && (
                        <span className="block text-[10px] text-ivory/40">
                          Capped at {formatCurrency(c.maxDiscount)}
                        </span>
                      )}
                    </td>

                    {/* Minimum Order */}
                    <td className="py-4 px-6 text-ivory/70">
                      {c.minOrderValue > 0 ? (
                        <span>Min. {formatCurrency(c.minOrderValue)}</span>
                      ) : (
                        <span className="text-ivory/40">No minimum spend</span>
                      )}
                    </td>

                    {/* Usage / Limit */}
                    <td className="py-4 px-6 font-mono text-ivory/70">
                      <span>{c.usedCount}</span>
                      <span className="text-ivory/40"> / {c.maxUses ? c.maxUses : "∞"}</span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(c.id, c.isActive)}
                        className={`text-[10px] uppercase tracking-wider px-2.5 py-1 font-semibold transition-all border ${
                          c.isActive
                            ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40"
                            : "bg-noir text-ivory/40 border-border/30 hover:text-ivory/70"
                        }`}
                      >
                        {c.isActive ? "● Active" : "○ Inactive"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
                        className="text-[11px] text-red-400/70 hover:text-red-300 underline uppercase tracking-wider transition-colors ml-4"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Mint Voucher Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-noir/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-gold/30 p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-gold text-[10px] uppercase tracking-[0.25em] font-semibold">
                  Imperial Decrees
                </span>
                <h3 className="font-serif text-2xl text-ivory font-light mt-0.5">
                  Mint Privilege Voucher
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-ivory/50 hover:text-ivory text-xl font-light"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleMintCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-1.5 font-medium">
                  Voucher Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NOIRGALA25"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-noir border border-border/30 px-3.5 py-2.5 text-ivory uppercase font-mono tracking-widest focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-1.5 font-medium">
                  Description / Occasion
                </label>
                <input
                  type="text"
                  placeholder="e.g. 25% Concession for Royal Gala Patrons"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-noir border border-border/30 px-3.5 py-2.5 text-ivory focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-1.5 font-medium">
                    Type *
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as "PERCENTAGE" | "FIXED")}
                    className="w-full bg-noir border border-border/30 px-3 py-2.5 text-ivory focus:border-gold outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-1.5 font-medium">
                    Value *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder={discountType === "PERCENTAGE" ? "20" : "5000"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-noir border border-border/30 px-3.5 py-2.5 text-ivory font-mono focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-1.5 font-medium">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    className="w-full bg-noir border border-border/30 px-3.5 py-2.5 text-ivory font-mono focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-1.5 font-medium">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Optional"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="w-full bg-noir border border-border/30 px-3.5 py-2.5 text-ivory font-mono focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-ivory/60 mb-1.5 font-medium">
                  Maximum Redemption Uses
                </label>
                <input
                  type="number"
                  placeholder="Unlimited if left empty"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  className="w-full bg-noir border border-border/30 px-3.5 py-2.5 text-ivory font-mono focus:border-gold outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-border/30 text-ivory/70 hover:text-ivory uppercase tracking-wider text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-gold text-noir font-semibold uppercase tracking-widest text-[11px] hover:bg-gold-light transition-all disabled:opacity-50"
                >
                  {isPending ? "Minting..." : "Enact Credential"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
