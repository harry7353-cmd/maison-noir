export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [userCount, productCount, categoryCount] = await Promise.all([
      db.user.count(),
      db.product.count(),
      db.category.count(),
    ]);

    return NextResponse.json({
      status: "healthy",
      brand: "MAISON NOIR",
      database: "connected",
      data: {
        users: userCount,
        products: productCount,
        categories: categoryCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Database error",
      },
      { status: 500 }
    );
  }
}
