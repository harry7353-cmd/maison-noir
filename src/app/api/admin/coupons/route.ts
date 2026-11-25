import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/admin/coupons — List all promotional credentials
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error("GET /api/admin/coupons error:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

// POST /api/admin/coupons — Create new voucher code
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const {
      code,
      description,
      discountType = "PERCENTAGE", // "PERCENTAGE" | "FIXED"
      discountValue,
      minOrderValue = 0,
      maxDiscount,
      maxUses,
    } = body;

    if (!code || !discountValue) {
      return NextResponse.json(
        { error: "Voucher code and discount value are required." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const existing = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Credential code ${cleanCode} already exists.` },
        { status: 400 }
      );
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        description: description || null,
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderValue: parseFloat(minOrderValue) || 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Voucher ${newCoupon.code} minted successfully.`,
      coupon: newCoupon,
    });
  } catch (error) {
    console.error("POST /api/admin/coupons error:", error);
    return NextResponse.json({ error: "Failed to mint voucher" }, { status: 500 });
  }
}

// PATCH /api/admin/coupons — Toggle voucher active status
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { id, isActive } = body;

    if (!id || typeof isActive !== "boolean") {
      return NextResponse.json({ error: "id and isActive required" }, { status: 400 });
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({
      success: true,
      message: `Voucher is now ${isActive ? "active" : "deactivated"}.`,
      coupon: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/coupons error:", error);
    return NextResponse.json({ error: "Failed to toggle coupon" }, { status: 500 });
  }
}

// DELETE /api/admin/coupons — Remove voucher
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 });
    }

    await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Voucher deleted." });
  } catch (error) {
    console.error("DELETE /api/admin/coupons error:", error);
    return NextResponse.json({ error: "Failed to delete voucher" }, { status: 500 });
  }
}
