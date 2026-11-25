import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth";

// PATCH /api/account/profile — Update patron personal details & password
export async function PATCH(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "Patron record not found" }, { status: 404 });
    }

    const updateData: {
      name?: string;
      phone?: string;
      passwordHash?: string;
    } = {};

    if (typeof name === "string") {
      updateData.name = name.trim();
    }

    if (typeof phone === "string") {
      updateData.phone = phone.trim();
    }

    // Password change verification
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password required to authenticate this alteration" },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "New password must contain at least 8 characters" },
          { status: 400 }
        );
      }

      if (user.passwordHash) {
        const isValid = await verifyPassword(currentPassword, user.passwordHash);
        if (!isValid) {
          return NextResponse.json(
            { error: "The provided current password does not correspond with our records" },
            { status: 400 }
          );
        }
      }

      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Patron credentials updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("PATCH /api/account/profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile credentials" },
      { status: 500 }
    );
  }
}
