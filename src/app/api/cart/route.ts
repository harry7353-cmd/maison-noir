import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateCart, calculateCartSummary, PopulatedCartItem } from "@/lib/cart";

// GET /api/cart
export async function GET() {
  try {
    const cart = await getOrCreateCart();
    if (!cart) {
      return NextResponse.json({ error: "Failed to access cart" }, { status: 500 });
    }

    const summary = calculateCartSummary(cart.items as unknown as PopulatedCartItem[]);

    return NextResponse.json({
      success: true,
      cartId: cart.id,
      items: cart.items,
      summary,
    });
  } catch (error) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json({ error: "Failed to load shopping cart" }, { status: 500 });
  }
}

// POST /api/cart — Add variant to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { variantId, quantity = 1 } = body;

    if (!variantId || typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json(
        { error: "Valid variantId and positive quantity are required" },
        { status: 400 }
      );
    }

    // 1. Check variant existence and stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: true,
      },
    });

    if (!variant || !variant.isActive) {
      return NextResponse.json(
        { error: "The chosen garment silhouette is no longer accessible" },
        { status: 404 }
      );
    }

    const cart = await getOrCreateCart();
    if (!cart) {
      return NextResponse.json({ error: "Failed to resolve cart session" }, { status: 500 });
    }

    // 2. Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });

    const newQuantity = (existingItem?.quantity || 0) + quantity;

    if (newQuantity > variant.stock) {
      return NextResponse.json(
        {
          error: `Only ${variant.stock} units of this tailored size remain in our vault.`,
          availableStock: variant.stock,
        },
        { status: 400 }
      );
    }

    // 3. Upsert Cart Item
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
        },
      });
    }

    // 4. Return updated cart
    const updatedCart = await prisma.cart.findUnique({
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

    const summary = calculateCartSummary(updatedCart?.items as unknown as PopulatedCartItem[]);

    return NextResponse.json({
      success: true,
      message: `${variant.product.name} (${variant.size}) added to your collection.`,
      items: updatedCart?.items || [],
      summary,
    });
  } catch (error) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to append garment to cart" },
      { status: 500 }
    );
  }
}

// PATCH /api/cart — Update quantity
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || typeof quantity !== "number") {
      return NextResponse.json(
        { error: "Valid itemId and quantity are required" },
        { status: 400 }
      );
    }

    const cart = await getOrCreateCart();
    if (!cart) {
      return NextResponse.json({ error: "Cart session not found" }, { status: 404 });
    }

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { variant: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found in your cart" }, { status: 404 });
    }

    if (quantity <= 0) {
      // Remove item
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      // Check stock limit
      if (quantity > item.variant.stock) {
        return NextResponse.json(
          {
            error: `Only ${item.variant.stock} units are currently available.`,
            availableStock: item.variant.stock,
          },
          { status: 400 }
        );
      }

      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
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

    const summary = calculateCartSummary(updatedCart?.items as unknown as PopulatedCartItem[]);

    return NextResponse.json({
      success: true,
      items: updatedCart?.items || [],
      summary,
    });
  } catch (error) {
    console.error("PATCH /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to adjust garment quantity" },
      { status: 500 }
    );
  }
}

// DELETE /api/cart — Remove item or clear cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    const cart = await getOrCreateCart();
    if (!cart) {
      return NextResponse.json({ error: "Cart session not found" }, { status: 404 });
    }

    if (itemId) {
      // Remove single item
      await prisma.cartItem.deleteMany({
        where: { id: itemId, cartId: cart.id },
      });
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
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

    const summary = calculateCartSummary(updatedCart?.items as unknown as PopulatedCartItem[]);

    return NextResponse.json({
      success: true,
      message: itemId ? "Item removed from your bag" : "Bag cleared",
      items: updatedCart?.items || [],
      summary,
    });
  } catch (error) {
    console.error("DELETE /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to delete item from bag" },
      { status: 500 }
    );
  }
}
