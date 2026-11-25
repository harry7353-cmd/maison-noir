export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/account/addresses — List patron addresses
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error("GET /api/account/addresses error:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

// POST /api/account/addresses — Add new address
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const {
      fullName,
      phone,
      streetLine1,
      streetLine2,
      city,
      state,
      postalCode,
      country = "India",
      isDefault = false,
      type = "SHIPPING",
    } = body;

    if (!fullName || !phone || !streetLine1 || !city || !state || !postalCode) {
      return NextResponse.json(
        { error: "Please provide all required address specifications" },
        { status: 400 }
      );
    }

    // If marked as default or first address, reset other addresses' default status
    const existingCount = await prisma.address.count({ where: { userId: user.id } });
    const shouldBeDefault = isDefault || existingCount === 0;

    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        fullName: fullName.trim(),
        phone: phone.trim(),
        streetLine1: streetLine1.trim(),
        streetLine2: streetLine2 ? streetLine2.trim() : null,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
        isDefault: shouldBeDefault,
        type,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Delivery residence recorded successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("POST /api/account/addresses error:", error);
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}

// PATCH /api/account/addresses — Update address or toggle default
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { id, isDefault, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: "Address ID required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        ...rest,
        ...(typeof isDefault === "boolean" ? { isDefault } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Address updated successfully",
      address: updated,
    });
  } catch (error) {
    console.error("PATCH /api/account/addresses error:", error);
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

// DELETE /api/account/addresses — Delete address
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Address ID required" }, { status: 400 });
    }

    const existing = await prisma.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });

    // If deleted address was default, make the most recent one default
    if (existing.isDefault) {
      const remaining = await prisma.address.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      if (remaining) {
        await prisma.address.update({
          where: { id: remaining.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Address removed from directory",
    });
  } catch (error) {
    console.error("DELETE /api/account/addresses error:", error);
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
