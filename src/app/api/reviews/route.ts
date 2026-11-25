export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/reviews?productId=... or ?slug=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const slug = searchParams.get("slug");

    let targetProductId = productId;

    if (!targetProductId && slug) {
      const prod = await prisma.product.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (prod) {
        targetProductId = prod.id;
      }
    }

    if (!targetProductId) {
      return NextResponse.json(
        { error: "productId or slug parameter is required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId: targetProductId,
        isApproved: true,
      },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve patron reviews" },
      { status: 500 }
    );
  }
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, productSlug, rating, title, comment, userName } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: "Product ID, rating (1-5), and reflections are required" },
        { status: 400 }
      );
    }

    const numericRating = Math.max(1, Math.min(5, Math.round(Number(rating))));

    // Determine user: check JWT session
    const currentUser = await getCurrentUser();
    let userId: string;

    if (currentUser) {
      userId = currentUser.id;
    } else {
      // For guest evaluations, find or assign default guest patron
      const patron = await prisma.user.findFirst({
        where: { email: "client@maisonnoir.com" },
      });

      if (patron) {
        userId = patron.id;
      } else {
        // Create an anonymous patron profile if not existing
        const newPatron = await prisma.user.create({
          data: {
            email: `patron-${Date.now()}@maisonnoir.com`,
            name: userName || "Anonymous Patron",
            passwordHash: "GUEST_EVALUATION",
            role: "CUSTOMER",
          },
        });
        userId = newPatron.id;
      }
    }

    // Upsert review to satisfy unique constraint @@unique([productId, userId])
    const review = await prisma.review.upsert({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
      update: {
        rating: numericRating,
        title: title || null,
        comment,
        isApproved: true,
      },
      create: {
        productId,
        userId,
        rating: numericRating,
        title: title || null,
        comment,
        isVerifiedPurchase: true,
        isApproved: true,
      },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update product overall rating metric in database
    const aggregate = await prisma.review.aggregate({
      where: { productId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: aggregate._avg.rating || 5.0,
        reviewCount: aggregate._count.rating || 1,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Patron review successfully recorded",
      review,
    });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to record evaluation. Please try again." },
      { status: 500 }
    );
  }
}
