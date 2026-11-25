import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const categorySlug = searchParams.get("category");
    const collectionSlug = searchParams.get("collection");
    const gender = searchParams.get("gender");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    // Build Prisma where clause
    const where: Prisma.ProductWhereInput = {
      isPublished: true,
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (collectionSlug) {
      where.collection = { slug: collectionSlug };
    }

    if (gender && (gender === "MEN" || gender === "WOMEN" || gender === "UNISEX")) {
      where.gender = gender;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { fabricDetails: { contains: q } },
      ];
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "price-asc") {
      orderBy = { basePrice: "asc" };
    } else if (sort === "price-desc") {
      orderBy = { basePrice: "desc" };
    } else if (sort === "popular") {
      orderBy = { averageRating: "desc" };
    }

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { displayOrder: "asc" },
          },
          variants: {
            where: { isActive: true },
          },
          category: {
            select: { name: true, slug: true, gender: true },
          },
          collection: {
            select: { name: true, slug: true },
          },
        },
      }),
      db.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { message: "Failed to fetch products." },
      { status: 500 }
    );
  }
}
