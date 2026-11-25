export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await db.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: {
          where: { isActive: true },
          orderBy: { size: "asc" },
        },
        category: true,
        collection: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!product || !product.isPublished) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    // Related products in the same category
    const relatedProducts = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isPublished: true,
      },
      take: 4,
      include: {
        images: {
          where: { isPrimary: true },
        },
      },
    });

    return NextResponse.json({
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error("Product detail API error:", error);
    return NextResponse.json(
      { message: "Failed to fetch product details." },
      { status: 500 }
    );
  }
}
