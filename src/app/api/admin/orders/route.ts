import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/admin/orders — List all orders with filters
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: status && status !== "ALL" ? { status } : undefined,
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true } },
        shipment: true,
        payment: true,
        coupon: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// PATCH /api/admin/orders — Update fulfillment status & tracking
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, status, carrier, trackingNumber } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId and status required" }, { status: 400 });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { shipment: true },
    });

    // Update or create shipment details
    if (updatedOrder.shipment) {
      const shipmentStatus =
        status === "DELIVERED"
          ? "DELIVERED"
          : status === "SHIPPED"
          ? "IN_TRANSIT"
          : updatedOrder.shipment.status;

      await prisma.shipment.update({
        where: { id: updatedOrder.shipment.id },
        data: {
          status: shipmentStatus,
          carrier: carrier || updatedOrder.shipment.carrier,
          trackingNumber: trackingNumber || updatedOrder.shipment.trackingNumber,
          deliveredAt: status === "DELIVERED" ? new Date() : undefined,
          shippedAt: status === "SHIPPED" ? new Date() : undefined,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}.`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("PATCH /api/admin/orders error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
