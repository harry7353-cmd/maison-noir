// ═══════════════════════════════════════════════════════════
// MAISON NOIR — Shopping Cart Server Utilities
// Persistent cart management for authenticated patrons & guest visitors
// ═══════════════════════════════════════════════════════════

import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const CART_COOKIE_NAME = "mn_cart_token";
export const FREE_SHIPPING_THRESHOLD = 5000; // Free shipping over ₹5,000
export const STANDARD_SHIPPING_FEE = 250;

export interface PopulatedCartItem {
  id: string;
  variantId: string;
  quantity: number;
  variant: {
    id: string;
    size: string;
    colorName: string;
    colorHex: string;
    sku: string;
    price: number | null;
    stock: number;
    product: {
      id: string;
      name: string;
      slug: string;
      basePrice: number;
      salePrice: number | null;
      images: Array<{
        id: string;
        url: string;
        isPrimary: boolean;
        altText: string | null;
      }>;
    };
  };
}

export interface CartCalculation {
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  totalItems: number;
  discountAmount: number;
  total: number;
}

// ── 1. Retrieve or Create Cart ───
export async function getOrCreateCart() {
  const cookieStore = await cookies();
  const currentUser = await getCurrentUser();
  let guestToken = cookieStore.get(CART_COOKIE_NAME)?.value;

  let cart = null;

  if (currentUser) {
    // 1. Authenticated User Cart
    cart = await prisma.cart.findUnique({
      where: { userId: currentUser.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { orderBy: { displayOrder: "asc" } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: currentUser.id },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: { orderBy: { displayOrder: "asc" } },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    // If there was a guest cart before signing in, merge it into user cart
    if (guestToken) {
      const guestCart = await prisma.cart.findUnique({
        where: { sessionToken: guestToken },
        include: { items: true },
      });

      if (guestCart && guestCart.items.length > 0) {
        for (const gItem of guestCart.items) {
          const existingUserItem = cart.items.find(
            (uItem) => uItem.variantId === gItem.variantId
          );

          if (existingUserItem) {
            await prisma.cartItem.update({
              where: { id: existingUserItem.id },
              data: { quantity: existingUserItem.quantity + gItem.quantity },
            });
          } else {
            await prisma.cartItem.create({
              data: {
                cartId: cart.id,
                variantId: gItem.variantId,
                quantity: gItem.quantity,
              },
            });
          }
        }

        // Delete migrated guest cart
        await prisma.cart.delete({ where: { id: guestCart.id } });
      }
    }

    // Refetch final consolidated user cart
    return await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: { orderBy: { displayOrder: "asc" } },
                  },
                },
              },
            },
          },
        },
      },
    });
  } else {
    // 2. Guest Visitor Cart
    if (guestToken) {
      cart = await prisma.cart.findUnique({
        where: { sessionToken: guestToken },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: { orderBy: { displayOrder: "asc" } },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    if (!cart) {
      const newGuestToken = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      cart = await prisma.cart.create({
        data: { sessionToken: newGuestToken },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: { orderBy: { displayOrder: "asc" } },
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Set cookie in browser
      cookieStore.set(CART_COOKIE_NAME, newGuestToken, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
      });
    }

    return cart;
  }
}

// ── 2. Calculate Cart Financials ───
export function calculateCartSummary(
  items: PopulatedCartItem[],
  couponDiscount: number = 0
): CartCalculation {
  let subtotal = 0;
  let totalItems = 0;

  for (const item of items) {
    const itemPrice =
      item.variant.price ??
      item.variant.product.salePrice ??
      item.variant.product.basePrice;
    subtotal += itemPrice * item.quantity;
    totalItems += item.quantity;
  }

  const shippingFee =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
      ? 0
      : STANDARD_SHIPPING_FEE;

  const amountNeededForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );

  const discountAmount = Math.min(subtotal, Math.max(0, couponDiscount));
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  return {
    subtotal,
    shippingFee,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountNeededForFreeShipping,
    totalItems,
    discountAmount,
    total,
  };
}
