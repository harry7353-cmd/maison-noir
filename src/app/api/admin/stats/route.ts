export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/admin/stats — Executive Dashboard Metrics
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 1. Financials & Counts
    const [
      ordersAggregate,
      totalOrders,
      totalPatrons,
      totalProducts,
      lowStockVariants,
      recentOrders,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { totalAmount: true },
        _avg: { totalAmount: true },
      }),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count(),
      prisma.productVariant.findMany({
        where: { stock: { lte: 5 }, isActive: true },
        include: {
          product: {
            select: { name: true, slug: true },
          },
        },
        orderBy: { stock: "asc" },
        take: 6,
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          user: {
            select: { name: true, email: true },
          },
        },
      }),
    ]);

    const grossRevenue = ordersAggregate._sum.totalAmount || 0;
    const averageOrderValue = ordersAggregate._avg.totalAmount || 0;

    return NextResponse.json({
      success: true,
      stats: {
        grossRevenue,
        averageOrderValue,
        totalOrders,
        totalPatrons,
        totalProducts,
        lowStockCount: lowStockVariants.length,
      },
      lowStockVariants,
      recentOrders,
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Failed to generate metrics" }, { status: 500 });
  }
}
