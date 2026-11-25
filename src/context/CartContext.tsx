"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PopulatedCartItem, CartCalculation } from "@/lib/cart";

interface CouponState {
  code: string;
  description?: string | null;
  discountType: string;
  discountValue: number;
  discountAmount: number;
}

interface CartContextType {
  items: PopulatedCartItem[];
  summary: CartCalculation;
  coupon: CouponState | null;
  isDrawerOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (variantId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  clearCart: () => Promise<void>;
}

const initialSummary: CartCalculation = {
  subtotal: 0,
  shippingFee: 0,
  freeShippingThreshold: 5000,
  amountNeededForFreeShipping: 5000,
  totalItems: 0,
  discountAmount: 0,
  total: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<PopulatedCartItem[]>([]);
  const [summary, setSummary] = useState<CartCalculation>(initialSummary);
  const [coupon, setCoupon] = useState<CouponState | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Cart from server on mount
  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setSummary(data.summary || initialSummary);
      }
    } catch (e) {
      console.error("Cart refresh error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const openCart = () => setIsDrawerOpen(true);
  const closeCart = () => setIsDrawerOpen(false);

  // 2. Add To Cart
  const addToCart = async (variantId: string, quantity: number = 1): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add garment to cart");
      }

      setItems(data.items || []);
      setSummary(data.summary || initialSummary);
      setIsDrawerOpen(true); // Open drawer immediately on add
      return true;
    } catch (err) {
      console.error("Add to cart error:", err);
      alert(err instanceof Error ? err.message : "Error adding to bag");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Update Quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });

      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setSummary(data.summary || initialSummary);
      } else {
        alert(data.error || "Could not adjust quantity");
      }
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  // 4. Remove Item
  const removeFromCart = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart?itemId=${itemId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setSummary(data.summary || initialSummary);
      }
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  // 5. Apply Coupon
  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (res.ok) {
        setCoupon(data.coupon);
        setSummary(data.summary);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || "Invalid coupon" };
      }
    } catch {
      return { success: false, message: "Network error validating credential" };
    }
  };

  // 6. Remove Coupon
  const removeCoupon = () => {
    setCoupon(null);
    refreshCart();
  };

  // 7. Clear Entire Cart
  const clearCart = async () => {
    try {
      await fetch("/api/cart", { method: "DELETE" });
      setItems([]);
      setSummary(initialSummary);
      setCoupon(null);
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        coupon,
        isDrawerOpen,
        isLoading,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
