import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const collections = await db.collection.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ collections });
  } catch (error) {
    console.error("Collections API error:", error);
    return NextResponse.json(
      { message: "Failed to fetch collections." },
      { status: 500 }
    );
  }
}
