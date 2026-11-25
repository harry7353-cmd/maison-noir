export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/wishlist — Retrieve patron's saved garments
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (currentUser) {
      // 1. Authenticated User Wishlist from Database
      let wishlist = await prisma.wishlist.findUnique({
        where: { userId: currentUser.id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { orderBy: { displayOrder: "asc" } },
                  category: true,
                  collection: true,
                  variants: { where: { isActive: true } },
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!wishlist) {
        wishlist = await prisma.wishlist.create({
          data: { userId: currentUser.id },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    images: { orderBy: { displayOrder: "asc" } },
                    category: true,
                    collection: true,
                    variants: { where: { isActive: true } },
                  },
                },
              },
            },
          },
        });
      }

      const products = wishlist.items.map((item) => ({
        ...item.product,
        wishlistDate: item.createdAt,
      }));

      return NextResponse.json({
        success: true,
        authenticated: true,
        items: products,
        productIds: products.map((p) => p.id),
      });
    }

    // 2. Guest Visitor: Hydrate from query param `ids`
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");

    if (idsParam) {
      const ids = idsParam.split(",").filter(Boolean);
      if (ids.length > 0) {
        const products = await prisma.product.findMany({
          where: {
            id: { in: ids },
            isPublished: true,
          },
          include: {
            images: { orderBy: { displayOrder: "asc" } },
            category: true,
            collection: true,
            variants: { where: { isActive: true } },
          },
        });

        return NextResponse.json({
          success: true,
          authenticated: false,
          items: products,
          productIds: products.map((p) => p.id),
        });
      }
    }

    return NextResponse.json({
      success: true,
      authenticated: false,
      items: [],
      productIds: [],
    });
  } catch (error) {
    console.error("GET /api/wishlist error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve saved garments" },
      { status: 500 }
    );
  }
}

// POST /api/wishlist — Toggle garment in/out of wishlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, syncIds } = body;

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      // Guest mode confirmation
      return NextResponse.json({
        success: true,
        authenticated: false,
        productId,
      });
    }

    // Ensure user wishlist exists
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: currentUser.id },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: currentUser.id },
      });
    }

    // Bulk sync from guest session if syncIds provided
    if (Array.isArray(syncIds) && syncIds.length > 0) {
      for (const sId of syncIds) {
        const prodExists = await prisma.product.findUnique({ where: { id: sId } });
        if (prodExists) {
          await prisma.wishlistItem.upsert({
            where: {
              wishlistId_productId: {
                wishlistId: wishlist.id,
                productId: sId,
              },
            },
            update: {},
            create: {
              wishlistId: wishlist.id,
              productId: sId,
            },
          });
        }
      }
    }

    // Single item toggle
    if (productId) {
      const existing = await prisma.wishlistItem.findUnique({
        where: {
          wishlistId_productId: {
            wishlistId: wishlist.id,
            productId,
          },
        },
      });

      if (existing) {
        // Remove from wishlist
        await prisma.wishlistItem.delete({
          where: { id: existing.id },
        });
        return NextResponse.json({
          success: true,
          action: "removed",
          productId,
        });
      } else {
        // Add to wishlist
        await prisma.wishlistItem.create({
          data: {
            wishlistId: wishlist.id,
            productId,
          },
        });
        return NextResponse.json({
          success: true,
          action: "added",
          productId,
        });
      }
    }

    return NextResponse.json({ success: true, message: "Wishlist synchronized" });
  } catch (error) {
    console.error("POST /api/wishlist error:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist — Remove item or clear
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ success: true, authenticated: false });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: currentUser.id },
    });

    if (!wishlist) {
      return NextResponse.json({ success: true });
    }

    if (productId) {
      await prisma.wishlistItem.deleteMany({
        where: {
          wishlistId: wishlist.id,
          productId,
        },
      });
    } else {
      await prisma.wishlistItem.deleteMany({
        where: { wishlistId: wishlist.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/wishlist error:", error);
    return NextResponse.json(
      { error: "Failed to remove saved garment" },
      { status: 500 }
    );
  }
}
