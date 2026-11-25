export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid royal dispatch email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email: cleanEmail },
          data: { isActive: true },
        });
        return NextResponse.json({
          success: true,
          message: "Welcome back to the House of Maison Noir.",
        });
      }
      return NextResponse.json({
        success: true,
        message: "You are already inscribed in the House registry.",
      });
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "You have been inscribed into the Maison Noir dispatches.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to record subscription. Please try again." },
      { status: 500 }
    );
  }
}
