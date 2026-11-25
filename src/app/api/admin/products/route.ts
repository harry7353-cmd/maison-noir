export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/admin/products — List all products with variant inventory
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const products = await prisma.product.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { sku: { contains: search } },
            ],
          }
        : undefined,
      include: {
        category: { select: { id: true, name: true } },
        collection: { select: { id: true, name: true } },
        images: { orderBy: { displayOrder: "asc" } },
        variants: { orderBy: { size: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    const enriched = products.map((p) => {
      const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
      return {
        ...p,
        totalStock,
      };
    });

    return NextResponse.json({ success: true, products: enriched });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/admin/products — Create luxury product with initial variants
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      basePrice,
      salePrice,
      sku,
      gender = "UNISEX",
      categoryId,
      collectionId,
      fabricDetails,
      careInstructions,
      fitInfo,
      imageUrl,
      variants = [], // [{ size, colorName, colorHex, stock }]
    } = body;

    if (!name || !slug || !description || !basePrice || !categoryId) {
      return NextResponse.json(
        { error: "Name, unique slug, description, price, and category are required." },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
        description,
        basePrice: parseFloat(basePrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        sku: sku || `MN-${Date.now().toString().slice(-6)}`,
        gender,
        categoryId,
        collectionId: collectionId || null,
        fabricDetails,
        careInstructions,
        fitInfo,
        images: imageUrl
          ? {
              create: [
                {
                  url: imageUrl,
                  isPrimary: true,
                  displayOrder: 0,
                },
              ],
            }
          : undefined,
        variants: {
          create: variants.map((v: any) => ({
            size: v.size || "M",
            colorName: v.colorName || "Royal Noir",
            colorHex: v.colorHex || "#121212",
            sku: `${sku || "MN"}-${v.size || "M"}-${(v.colorName || "NOIR").slice(0, 3).toUpperCase()}`,
            stock: parseInt(v.stock) || 10,
            isActive: true,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${newProduct.name} registered into atelier archives.`,
      product: newProduct,
    });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// PATCH /api/admin/products — Adjust variant inventory or product status
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { variantId, stockDelta, setStock, reason = "RESTOCK" } = body;

    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
      });

      if (!variant) {
        return NextResponse.json({ error: "Variant not located" }, { status: 404 });
      }

      const newStock =
        typeof setStock === "number"
          ? Math.max(0, setStock)
          : Math.max(0, variant.stock + (stockDelta || 0));

      const updated = await prisma.productVariant.update({
        where: { id: variantId },
        data: { stock: newStock },
      });

      await prisma.inventoryLog.create({
        data: {
          variantId,
          changeQty: newStock - variant.stock,
          balanceAfter: newStock,
          reason,
          performedBy: user.email,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Inventory level adjusted.",
        variant: updated,
      });
    }

    return NextResponse.json({ error: "Missing variantId" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/admin/products error:", error);
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
  }
}

// DELETE /api/admin/products — Remove garment
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Garment excised from catalog." });
  } catch (error) {
    console.error("DELETE /api/admin/products error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
