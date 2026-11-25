"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/context/AuthContext";

export interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number | null;
  images: Array<{
    id?: string;
    url: string;
    isPrimary: boolean;
    altText?: string | null;
  }>;
  category?: {
    name: string;
    slug: string;
  } | null;
  collection?: {
    name: string;
    slug: string;
  } | null;
  variants?: Array<{
    id: string;
    size: string;
    colorName: string;
    colorHex: string;
    stock: number;
  }>;
}

interface WishlistContextType {
  items: WishlistProduct[];
  itemIds: string[];
  totalWishlist: number;
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: WishlistProduct) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "maison_noir_wishlist_ids";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initial Load & Sync
  const loadWishlist = useCallback(async () => {
    try {
      setIsLoading(true);

      // Load local IDs
      let localIds: string[] = [];
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          localIds = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Local storage read error:", e);
      }

      if (user) {
        // Authenticated: Sync any existing guest IDs to backend
        if (localIds.length > 0) {
          await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ syncIds: localIds }),
          });
          // Clear local storage after sync
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }

        // Fetch user's wishlist from DB
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
          setItemIds(data.productIds || []);
        }
      } else {
        // Guest: Hydrate items from server using local IDs
        setItemIds(localIds);
        if (localIds.length > 0) {
          const res = await fetch(`/api/wishlist?ids=${localIds.join(",")}`);
          if (res.ok) {
            const data = await res.json();
            setItems(data.items || []);
          }
        } else {
          setItems([]);
        }
      }
    } catch (err) {
      console.error("Wishlist load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const isInWishlist = useCallback(
    (productId: string) => itemIds.includes(productId),
    [itemIds]
  );

  // 2. Toggle in/out
  const toggleWishlist = async (product: WishlistProduct): Promise<boolean> => {
    const isCurrentlySaved = itemIds.includes(product.id);
    let updatedIds: string[];
    let updatedItems: WishlistProduct[];

    if (isCurrentlySaved) {
      updatedIds = itemIds.filter((id) => id !== product.id);
      updatedItems = items.filter((p) => p.id !== product.id);
    } else {
      updatedIds = [...itemIds, product.id];
      updatedItems = [product, ...items];
    }

    // Optimistic UI update
    setItemIds(updatedIds);
    setItems(updatedItems);

    if (!user) {
      // Save locally for guests
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedIds));
      } catch (e) {
        console.error("Local storage save error:", e);
      }
    }

    // Background server call
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
    } catch (err) {
      console.error("Wishlist toggle server sync error:", err);
    }

    return !isCurrentlySaved;
  };

  // 3. Remove single item
  const removeFromWishlist = async (productId: string) => {
    const updatedIds = itemIds.filter((id) => id !== productId);
    const updatedItems = items.filter((p) => p.id !== productId);

    setItemIds(updatedIds);
    setItems(updatedItems);

    if (!user) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedIds));
      } catch (e) {
        console.error("Local storage save error:", e);
      }
    }

    try {
      await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Wishlist delete server sync error:", err);
    }
  };

  // 4. Clear entire wishlist
  const clearWishlist = async () => {
    setItemIds([]);
    setItems([]);

    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error("Local storage clear error:", e);
    }

    if (user) {
      try {
        await fetch("/api/wishlist", { method: "DELETE" });
      } catch (err) {
        console.error("Wishlist clear server sync error:", err);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemIds,
        totalWishlist: itemIds.length,
        isLoading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
