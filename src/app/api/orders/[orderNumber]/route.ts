export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ orderNumber: string }>;
}

// GET /api/orders/[orderNumber] — Public tracking lookup
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { orderNumber } = await params;

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        shipment: true,
        payment: {
          select: {
            provider: true,
            paymentStatus: true,
            amount: true,
            currency: true,
            paidAt: true,
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
    });

    if (!order) {
      return NextResponse.json(
        { error: "Acquisition record not located in our archives." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        shippingFee: order.shippingFee,
        totalAmount: order.totalAmount,
        notes: order.notes,
        createdAt: order.createdAt,
        shippingAddress: {
          fullName: order.shippingFullName,
          phone: order.shippingPhone,
          streetLine1: order.shippingStreet1,
          streetLine2: order.shippingStreet2,
          city: order.shippingCity,
          state: order.shippingState,
          postalCode: order.shippingPostalCode,
          country: order.shippingCountry,
        },
        items: order.items,
        shipment: order.shipment,
        payment: order.payment,
        coupon: order.coupon,
      },
    });
  } catch (error) {
    console.error("GET /api/orders/[orderNumber] error:", error);
    return NextResponse.json(
      { error: "Failed to locate order" },
      { status: 500 }
    );
  }
}
