import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/admin/customers — List all patrons with financial totals
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const customers = await prisma.user.findMany({
      include: {
        addresses: {
          where: { isDefault: true },
          take: 1,
        },
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const enriched = customers.map((c) => {
      const validOrders = c.orders.filter((o) => o.status !== "CANCELLED");
      const totalSpent = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      // VIP classification: > 50k = Sovereign, > 20k = Elite, else Patron
      let vipTier = "Noir Patron";
      if (c.role === "ADMIN") {
        vipTier = "Imperial Administrator";
      } else if (totalSpent >= 50000) {
        vipTier = "Grand Sovereign VIP";
      } else if (totalSpent >= 20000) {
        vipTier = "Noir Elite Member";
      }

      return {
        id: c.id,
        name: c.name || "Anonymous Patron",
        email: c.email,
        phone: c.phone,
        role: c.role,
        vipTier,
        orderCount: c.orders.length,
        totalSpent,
        primaryCity: c.addresses[0]?.city || "Unspecified",
        createdAt: c.createdAt,
      };
    });

    return NextResponse.json({ success: true, customers: enriched });
  } catch (error) {
    console.error("GET /api/admin/customers error:", error);
    return NextResponse.json({ error: "Failed to fetch patrons" }, { status: 500 });
  }
}
