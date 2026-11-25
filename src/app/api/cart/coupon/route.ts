import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateCart, calculateCartSummary, PopulatedCartItem } from "@/lib/cart";

// POST /api/cart/coupon — Apply discount coupon
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "A valid coupon code is required" },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Fetch Coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { error: "The provided promotional credential is invalid or has expired." },
        { status: 400 }
      );
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This promotional credential has expired." },
        { status: 400 }
      );
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { error: "This promotional voucher has reached its maximum quota." },
        { status: 400 }
      );
    }

    // 2. Fetch Cart Subtotal to test minOrderValue
    const cart = await getOrCreateCart();
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Your bag is empty. Please select garments before applying a voucher." },
        { status: 400 }
      );
    }

    const { subtotal } = calculateCartSummary(cart.items as unknown as PopulatedCartItem[]);

    if (subtotal < coupon.minOrderValue) {
      return NextResponse.json(
        {
          error: `This credential requires an acquisition minimum of ₹${coupon.minOrderValue.toLocaleString("en-IN")}. Current subtotal: ₹${subtotal.toLocaleString("en-IN")}.`,
        },
        { status: 400 }
      );
    }

    // 3. Calculate Discount
    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    const summary = calculateCartSummary(
      cart.items as unknown as PopulatedCartItem[],
      discount
    );

    return NextResponse.json({
      success: true,
      message: `Promotional code ${coupon.code} successfully authenticated.`,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discount,
      },
      summary,
    });
  } catch (error) {
    console.error("POST /api/cart/coupon error:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon code" },
      { status: 500 }
    );
  }
}
