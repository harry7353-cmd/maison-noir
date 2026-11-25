export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/account/orders — Retrieve patron's historical orders
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: true,
        payment: {
          select: {
            provider: true,
            paymentStatus: true,
            transactionId: true,
          },
        },
        shipment: {
          select: {
            carrier: true,
            trackingNumber: true,
            status: true,
            estimatedDelivery: true,
          },
        },
        coupon: {
          select: {
            code: true,
            discountType: true,
            discountValue: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET /api/account/orders error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve order archives" },
      { status: 500 }
    );
  }
}
