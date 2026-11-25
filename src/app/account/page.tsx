"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  ShieldIcon,
  MapPinIcon,
  TruckIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  ArrowRightIcon,
  CloseIcon,
} from "@/components/ui/Icons";

interface AddressItem {
  id: string;
  fullName: string;
  phone: string;
  streetLine1: string;
  streetLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: string;
}

interface OrderItemSnapshot {
  id: string;
  productName: string;
  productSlug: string;
  size: string;
  colorName: string;
  sku: string;
  imageUrl?: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  createdAt: string;
  shippingFullName: string;
  shippingCity: string;
  shippingState: string;
  items: OrderItemSnapshot[];
  shipment?: {
    carrier: string;
    trackingNumber: string;
    status: string;
    estimatedDelivery?: string | null;
  } | null;
  payment?: {
    provider: string;
    paymentStatus: string;
  } | null;
}

export default function AccountPage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const { summary: cartSummary } = useCart();
  const { totalWishlist } = useWishlist();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses" | "security">("overview");

  // Address state
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    streetLine1: "",
    streetLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });
  const [addressSubmitting, setAddressSubmitting] = useState(false);
  const [addressFeedback, setAddressFeedback] = useState<string | null>(null);

  // Orders state
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile / Security state
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Authentication check
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      setProfileForm((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, [user, loading, router]);

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingAddresses(true);
      const res = await fetch("/api/account/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (e) {
      console.error("Address fetch error:", e);
    } finally {
      setLoadingAddresses(false);
    }
  }, [user]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingOrders(true);
      const res = await fetch("/api/account/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error("Orders fetch error:", e);
    } finally {
      setLoadingOrders(false);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "addresses") fetchAddresses();
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "overview") {
      fetchAddresses();
      fetchOrders();
    }
  }, [activeTab, fetchAddresses, fetchOrders]);

  // Address Handlers
  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSubmitting(true);
    setAddressFeedback(null);

    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });

      const data = await res.json();
      if (res.ok) {
        setIsAddressModalOpen(false);
        setAddressForm({
          fullName: "",
          phone: "",
          streetLine1: "",
          streetLine2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
          isDefault: false,
        });
        fetchAddresses();
      } else {
        setAddressFeedback(data.error || "Failed to record address");
      }
    } catch {
      setAddressFeedback("Network error recording address");
    } finally {
      setAddressSubmitting(false);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const res = await fetch("/api/account/addresses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isDefault: true }),
      });
      if (res.ok) fetchAddresses();
    } catch (e) {
      console.error("Default address error:", e);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you certain you wish to remove this delivery residence?")) return;
    try {
      const res = await fetch(`/api/account/addresses?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchAddresses();
    } catch (e) {
      console.error("Delete address error:", e);
    }
  };

  // Profile / Password Handlers
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSubmitting(true);
    setProfileFeedback(null);

    if (profileForm.newPassword) {
      if (profileForm.newPassword !== profileForm.confirmPassword) {
        setProfileFeedback({
          type: "error",
          message: "New password and confirmation do not correspond.",
        });
        setProfileSubmitting(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileForm.name,
          phone: profileForm.phone,
          currentPassword: profileForm.currentPassword || undefined,
          newPassword: profileForm.newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfileFeedback({
          type: "success",
          message: "Your credentials have been successfully updated.",
        });
        setProfileForm((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        if (refreshUser) refreshUser();
      } else {
        setProfileFeedback({
          type: "error",
          message: data.error || "Failed to update credentials",
        });
      }
    } catch {
      setProfileFeedback({
        type: "error",
        message: "Network error updating credentials",
      });
    } finally {
      setProfileSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-muted tracking-widest uppercase">
            Accessing Sovereign Portal...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  return (
    <div className="min-h-screen bg-ivory-light/30 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 mb-8 border-b border-border gap-4">
          <div>
            <span className="text-label text-gold text-xs tracking-[0.25em] block mb-1">
              My Account
            </span>
            <h1 className="heading-display text-3xl sm:text-4xl text-noir">
              {user.name || "Client"}
            </h1>
            <p className="text-xs text-muted mt-1">
              Account Email: <span className="font-mono text-noir">{user.email}</span> • Status:{" "}
              <span className="font-semibold text-gold tracking-widest uppercase">
                {user.role === "ADMIN" ? "Administrator" : "VIP Member"}
              </span>
            </p>
          </div>

          <button
            onClick={logout}
            className="btn-secondary !py-2.5 !px-6 text-xs uppercase tracking-wider font-semibold hover:border-gold hover:text-gold transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar (3 Cols) */}
          <aside className="lg:col-span-3 space-y-2">
            {[
              { id: "overview", label: "Account Overview", icon: ShieldIcon },
              { id: "orders", label: `My Orders (${orders.length})`, icon: ShoppingBagIcon },
              { id: "addresses", label: `Saved Addresses (${addresses.length})`, icon: MapPinIcon },
              { id: "security", label: "Password & Security", icon: UserIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-xs tracking-wider uppercase font-medium text-left transition-all ${
                    isActive
                      ? "bg-noir text-ivory shadow-sm font-semibold"
                      : "bg-white hover:bg-ivory text-noir border border-border"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-gold" : "text-muted"} />
                  {tab.label}
                </button>
              );
            })}

            <Link
              href="/wishlist"
              className="w-full flex items-center justify-between px-5 py-3.5 text-xs tracking-wider uppercase font-medium bg-white hover:bg-ivory text-noir border border-border transition-colors block"
            >
              <div className="flex items-center gap-3">
                <HeartIcon size={16} className="text-muted" />
                <span>My Wishlist</span>
              </div>
              {totalWishlist > 0 && (
                <span className="bg-gold text-noir text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {totalWishlist}
                </span>
              )}
            </Link>

            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="w-full flex items-center gap-3 px-5 py-3.5 text-xs tracking-wider uppercase font-medium bg-gold text-white hover:bg-gold-dark transition-colors block mt-4 shadow-sm"
              >
                <ShieldIcon size={16} />
                Admin Dashboard
              </Link>
            )}
          </aside>

          {/* Tab Content Panel (9 Cols) */}
          <main className="lg:col-span-9 bg-white border border-border p-6 sm:p-10 shadow-luxury">
            
            {/* ── TAB 1: OVERVIEW ─── */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <span className="text-label text-gold text-xs tracking-widest uppercase block mb-1">
                    At a Glance
                  </span>
                  <h2 className="heading-display text-2xl text-noir">
                    Account Overview
                  </h2>
                </div>

                {/* VIP Tier Banner */}
                <div className="p-6 sm:p-8 bg-noir text-ivory border border-gold/30 relative overflow-hidden">
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <span className="text-label text-gold text-[10px] tracking-[0.25em] uppercase block mb-1">
                        Membership Level
                      </span>
                      <h3 className="font-serif text-2xl text-ivory font-medium">
                        {user.role === "ADMIN" ? "Administrator Account" : "VIP Member"}
                      </h3>
                      <p className="text-xs text-ivory/70 mt-1 font-light">
                        Enjoy complimentary express delivery and priority customer support.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 border border-gold text-gold text-[11px] uppercase tracking-wider font-medium">
                        <CheckIcon size={14} /> Active Account
                      </span>
                    </div>
                  </div>
                </div>

                {/* KPI Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-ivory-light/40 border border-border text-center">
                    <span className="text-xs text-muted uppercase tracking-wider block mb-1">
                      Cart Items
                    </span>
                    <span className="font-serif text-2xl text-noir font-semibold">
                      {cartSummary.totalItems}
                    </span>
                  </div>

                  <div className="p-4 bg-ivory-light/40 border border-border text-center">
                    <span className="text-xs text-muted uppercase tracking-wider block mb-1">
                      Wishlist Items
                    </span>
                    <span className="font-serif text-2xl text-noir font-semibold">
                      {totalWishlist}
                    </span>
                  </div>

                  <div className="p-4 bg-ivory-light/40 border border-border text-center">
                    <span className="text-xs text-muted uppercase tracking-wider block mb-1">
                      Total Orders
                    </span>
                    <span className="font-serif text-2xl text-noir font-semibold">
                      {orders.length}
                    </span>
                  </div>

                  <div className="p-4 bg-ivory-light/40 border border-border text-center">
                    <span className="text-xs text-muted uppercase tracking-wider block mb-1">
                      Saved Addresses
                    </span>
                    <span className="font-serif text-2xl text-noir font-semibold">
                      {addresses.length}
                    </span>
                  </div>
                </div>

                {/* Primary Residence Preview */}
                <div className="border border-border p-6 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPinIcon size={16} className="text-gold" />
                      <h4 className="font-serif text-base text-noir font-medium">
                        Default Shipping Address
                      </h4>
                    </div>
                    <button
                      onClick={() => setActiveTab("addresses")}
                      className="text-xs text-gold hover:underline uppercase tracking-wider font-medium"
                    >
                      Manage Addresses →
                    </button>
                  </div>

                  {defaultAddress ? (
                    <div className="text-xs text-muted space-y-1">
                      <p className="font-medium text-noir text-sm">{defaultAddress.fullName}</p>
                      <p>{defaultAddress.streetLine1} {defaultAddress.streetLine2 || ""}</p>
                      <p>{defaultAddress.city}, {defaultAddress.state} — {defaultAddress.postalCode}</p>
                      <p>{defaultAddress.country} • Phone: {defaultAddress.phone}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted font-light">
                      No shipping address saved yet. Add an address to speed up your checkout.
                    </p>
                  )}
                </div>

                {/* Quick Collection CTA */}
                <div className="flex items-center justify-between p-6 bg-ivory border border-border">
                  <div>
                    <h4 className="font-serif text-base text-noir font-medium">
                      Continue Shopping
                    </h4>
                    <p className="text-xs text-muted mt-0.5">
                      Explore our newest arrivals and trending styles.
                    </p>
                  </div>
                  <Link
                    href="/collections"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-noir text-ivory text-xs uppercase tracking-[0.15em] font-medium hover:bg-gold hover:text-noir transition-colors"
                  >
                    Shop Now
                    <ArrowRightIcon size={12} />
                  </Link>
                </div>
              </div>
            )}

            {/* ── TAB 2: ORDERS ─── */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div>
                  <span className="text-label text-gold text-xs tracking-widest uppercase block mb-1">
                    Order History
                  </span>
                  <h2 className="heading-display text-2xl text-noir">
                    Your Orders & Tracking
                  </h2>
                </div>

                {loadingOrders ? (
                  <div className="py-16 text-center text-xs text-muted uppercase tracking-wider">
                    Loading your orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-12 text-center border border-border bg-ivory-light/20">
                    <ShoppingBagIcon size={32} className="mx-auto text-gold mb-3" />
                    <h3 className="font-serif text-lg text-noir mb-1">No Orders Found</h3>
                    <p className="text-xs text-muted max-w-sm mx-auto mb-6">
                      You haven&apos;t placed any orders yet. Once you make a purchase, it will appear here.
                    </p>
                    <Link
                      href="/collections"
                      className="px-6 py-2.5 bg-noir text-ivory text-xs uppercase tracking-wider font-medium hover:bg-gold hover:text-noir transition-colors"
                    >
                      Browse Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-border bg-white divide-y divide-border shadow-sm"
                      >
                        {/* Order Header */}
                        <div className="p-5 bg-ivory-light/40 flex flex-wrap items-center justify-between gap-4 text-xs">
                          <div>
                            <span className="text-muted block text-[10px] uppercase tracking-wider">
                              Order Number
                            </span>
                            <Link
                              href={`/orders/${order.orderNumber}`}
                              className="font-mono font-semibold text-noir text-sm hover:text-gold transition-colors underline underline-offset-2"
                            >
                              {order.orderNumber}
                            </Link>
                          </div>

                          <div>
                            <span className="text-muted block text-[10px] uppercase tracking-wider">
                              Date Placed
                            </span>
                            <span className="text-noir">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          <div>
                            <span className="text-muted block text-[10px] uppercase tracking-wider">
                              Total Price
                            </span>
                            <span className="font-mono font-semibold text-noir">
                              ₹{order.totalAmount.toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div>
                            <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-wider font-semibold border ${
                              order.status === "DELIVERED"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : order.status === "SHIPPED"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-5 divide-y divide-border">
                          {order.items.map((item) => (
                            <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                {item.imageUrl && (
                                  <div className="relative w-14 h-18 flex-shrink-0 bg-ivory-light border border-border overflow-hidden">
                                    <Image
                                      src={item.imageUrl}
                                      alt={item.productName}
                                      fill
                                      className="object-cover"
                                      sizes="56px"
                                    />
                                  </div>
                                )}
                                <div>
                                  <Link
                                    href={`/products/${item.productSlug}`}
                                    className="font-serif text-sm text-noir hover:text-gold transition-colors font-medium"
                                  >
                                    {item.productName}
                                  </Link>
                                  <div className="text-[11px] text-muted flex gap-2 mt-0.5">
                                    <span>Size: {item.size}</span>
                                    <span>•</span>
                                    <span>Color: {item.colorName}</span>
                                    <span>•</span>
                                    <span>Qty: {item.quantity}</span>
                                  </div>
                                </div>
                              </div>

                              <span className="font-mono text-xs font-semibold text-noir">
                                ₹{item.subtotal.toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Shipment & Footer */}
                        {order.shipment && (
                          <div className="p-4 bg-ivory text-xs flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-noir">
                              <TruckIcon size={14} className="text-gold" />
                              <span>
                                Courier: <strong>{order.shipment.carrier}</strong> (Tracking #{order.shipment.trackingNumber})
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] uppercase tracking-wider text-muted font-medium">
                                Status: {order.shipment.status}
                              </span>
                              <Link
                                href={`/orders/${order.orderNumber}`}
                                className="text-xs text-gold hover:underline uppercase tracking-wider font-medium"
                              >
                                Track Order →
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: ADDRESSES ─── */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-label text-gold text-xs tracking-widest uppercase block mb-1">
                      Saved Addresses
                    </span>
                    <h2 className="heading-display text-2xl text-noir">
                      Saved Delivery Addresses
                    </h2>
                  </div>

                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-noir text-ivory text-xs uppercase tracking-wider font-medium hover:bg-gold hover:text-noir transition-colors self-start sm:self-auto"
                  >
                    <PlusIcon size={14} />
                    Add New Address
                  </button>
                </div>

                {loadingAddresses ? (
                  <div className="py-16 text-center text-xs text-muted uppercase tracking-wider">
                    Loading your addresses...
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="p-12 text-center border border-border bg-ivory-light/20">
                    <MapPinIcon size={32} className="mx-auto text-gold mb-3" />
                    <h3 className="font-serif text-lg text-noir mb-1">No Addresses Saved</h3>
                    <p className="text-xs text-muted max-w-sm mx-auto mb-6">
                      Add a shipping address to make checkout faster and easier.
                    </p>
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="px-6 py-2.5 bg-noir text-ivory text-xs uppercase tracking-wider font-medium hover:bg-gold hover:text-noir transition-colors"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-5 border relative flex flex-col justify-between ${
                          addr.isDefault
                            ? "border-gold ring-1 ring-gold/40 bg-ivory-light/20"
                            : "border-border bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-serif font-medium text-noir text-sm">
                              {addr.fullName}
                            </span>
                            {addr.isDefault && (
                              <span className="bg-gold text-noir text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5">
                                Primary
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-muted space-y-1">
                            <p>{addr.streetLine1}</p>
                            {addr.streetLine2 && <p>{addr.streetLine2}</p>}
                            <p>{addr.city}, {addr.state} — {addr.postalCode}</p>
                            <p>{addr.country}</p>
                            <p className="pt-1 text-noir font-mono text-[11px]">Phone: {addr.phone}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs">
                          {!addr.isDefault ? (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-gold hover:underline text-[11px] uppercase tracking-wider"
                            >
                              Set As Primary
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-800 font-medium">
                              ✓ Default Destination
                            </span>
                          )}

                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-muted hover:text-red-700 transition-colors p-1"
                            title="Remove address"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 4: SECURITY & PROFILE ─── */}
            {activeTab === "security" && (
              <div className="space-y-8">
                <div>
                  <span className="text-label text-gold text-xs tracking-widest uppercase block mb-1">
                    Patron Registry
                  </span>
                  <h2 className="heading-display text-2xl text-noir">
                    Credentials & Password Security
                  </h2>
                </div>

                {profileFeedback && (
                  <div
                    className={`p-3 text-xs border ${
                      profileFeedback.type === "success"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : "bg-red-50 border-red-200 text-red-900"
                    }`}
                  >
                    {profileFeedback.message}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                  {/* Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-noir font-medium mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                    />
                  </div>

                  {/* Email (Readonly) */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted font-medium mb-1.5">
                      Email Address (Cannot be changed)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-3 py-2 text-xs border border-border bg-ivory-light text-muted cursor-not-allowed"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-noir font-medium mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                    />
                  </div>

                  {/* Password section */}
                  <div className="pt-4 border-t border-border space-y-4">
                    <h3 className="font-serif text-base text-noir font-medium">
                      Change Password
                    </h3>
                    <p className="text-xs text-muted font-light">
                      Leave blank if you do not want to change your password.
                    </p>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-noir font-medium mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={profileForm.currentPassword}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, currentPassword: e.target.value })
                        }
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-noir font-medium mb-1.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={profileForm.newPassword}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, newPassword: e.target.value })
                          }
                          placeholder="••••••••••••"
                          className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-noir font-medium mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={profileForm.confirmPassword}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, confirmPassword: e.target.value })
                          }
                          placeholder="••••••••••••"
                          className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={profileSubmitting}
                    className="px-6 py-3 bg-noir text-ivory text-xs uppercase tracking-[0.2em] font-medium hover:bg-gold hover:text-noir transition-colors disabled:opacity-50"
                  >
                    {profileSubmitting ? "Saving Changes..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

          </main>
        </div>

      </div>

      {/* ── Address Modal ─── */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-noir/70 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full p-8 shadow-2xl border border-border relative">
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute top-5 right-5 text-muted hover:text-noir text-xl transition-colors"
            >
              <CloseIcon size={18} />
            </button>

            <span className="text-label text-gold text-[10px] tracking-[0.25em] uppercase block mb-1">
              Shipping Address
            </span>
            <h3 className="heading-display text-2xl text-noir mb-6">
              Add New Address
            </h3>

            {addressFeedback && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-900 text-xs">
                {addressFeedback}
              </div>
            )}

            <form onSubmit={handleCreateAddress} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullName: e.target.value })
                  }
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.streetLine1}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, streetLine1: e.target.value })
                  }
                  placeholder="Flat / House No., Street, Area..."
                  className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                  Apartment, Suite, Unit (Optional)
                </label>
                <input
                  type="text"
                  value={addressForm.streetLine2}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, streetLine2: e.target.value })
                  }
                  placeholder="Apartment, building, floor..."
                  className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    placeholder="Mumbai"
                    className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    placeholder="Maharashtra"
                    className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.postalCode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, postalCode: e.target.value })
                    }
                    placeholder="400001"
                    className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-noir font-medium mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, country: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-border focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="defaultAddressCheck"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, isDefault: e.target.checked })
                  }
                  className="rounded border-border text-noir focus:ring-gold"
                />
                <label htmlFor="defaultAddressCheck" className="text-xs text-noir">
                  Set as default shipping address
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-muted hover:text-noir"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressSubmitting}
                  className="px-6 py-2.5 bg-noir text-ivory text-xs uppercase tracking-[0.15em] font-medium hover:bg-gold hover:text-noir transition-colors disabled:opacity-50"
                >
                  {addressSubmitting ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
