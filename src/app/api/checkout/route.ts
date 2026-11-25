import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getOrCreateCart, calculateCartSummary, PopulatedCartItem } from "@/lib/cart";

// POST /api/checkout — Transcribe and finalize order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      shippingAddress, // { fullName, phone, streetLine1, streetLine2, city, state, postalCode, country }
      guestEmail,
      paymentProvider = "SANDBOX", // "SANDBOX" | "RAZORPAY" | "STRIPE" | "COD"
      deliveryTier = "EXPRESS", // "EXPRESS" | "SAME_DAY"
      couponCode,
      notes,
    } = body;

    const currentUser = await getCurrentUser();

    // 1. Resolve Cart
    const cart = await getOrCreateCart();
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Your bag is empty. Please select garments before checkout." },
        { status: 400 }
      );
    }

    // 2. Validate Shipping Address
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.streetLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return NextResponse.json(
        { error: "Complete delivery address specifications are required." },
        { status: 400 }
      );
    }

    const email = currentUser?.email || guestEmail;
    if (!email) {
      return NextResponse.json(
        { error: "Contact email is required for acquisition dispatch." },
        { status: 400 }
      );
    }

    // 3. Real-Time Stock & Inventory Verification
    const cartItems = cart.items as unknown as PopulatedCartItem[];
    for (const item of cartItems) {
      const currentVariant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
      });

      if (!currentVariant || !currentVariant.isActive) {
        return NextResponse.json(
          {
            error: `Garment silhouette ${item.variant.product.name} (${item.variant.size}) is no longer accessible.`,
          },
          { status: 400 }
        );
      }

      if (currentVariant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient atelier stock for ${item.variant.product.name} (${item.variant.size}). Only ${currentVariant.stock} remaining.`,
          },
          { status: 400 }
        );
      }
    }

    // 4. Calculate Financials & Discounts
    let discountAmount = 0;
    let validCouponId: string | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        validCouponId = coupon.id;
        const { subtotal } = calculateCartSummary(cartItems);

        if (subtotal >= coupon.minOrderValue) {
          if (coupon.discountType === "PERCENTAGE") {
            discountAmount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else {
            discountAmount = coupon.discountValue;
          }

          // Increment coupon usage count
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    const summary = calculateCartSummary(cartItems, discountAmount);

    let finalShippingFee = summary.shippingFee;
    if (deliveryTier === "SAME_DAY") {
      finalShippingFee += 500; // Royal Same-Day courier fee
    }

    const totalAmount = Math.max(0, summary.subtotal - discountAmount + finalShippingFee);

    // 5. Generate Order Unique Number
    const timestamp = Date.now().toString().slice(-6);
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MN-2026-${timestamp}-${randomHex}`;

    // 6. Transact Stock Decrements & Order In Database
    const order = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: currentUser?.id || null,
          guestEmail: !currentUser ? email : null,
          status: paymentProvider === "COD" ? "CONFIRMED" : "PAID",
          subtotal: summary.subtotal,
          discountAmount,
          shippingFee: finalShippingFee,
          taxAmount: 0,
          totalAmount,
          couponId: validCouponId,
          shippingFullName: shippingAddress.fullName.trim(),
          shippingPhone: shippingAddress.phone.trim(),
          shippingStreet1: shippingAddress.streetLine1.trim(),
          shippingStreet2: shippingAddress.streetLine2 ? shippingAddress.streetLine2.trim() : null,
          shippingCity: shippingAddress.city.trim(),
          shippingState: shippingAddress.state.trim(),
          shippingPostalCode: shippingAddress.postalCode.trim(),
          shippingCountry: shippingAddress.country || "India",
          notes: notes || null,
          items: {
            create: cartItems.map((item) => {
              const unitPrice =
                item.variant.price ??
                item.variant.product.salePrice ??
                item.variant.product.basePrice;
              return {
                variantId: item.variantId,
                productName: item.variant.product.name,
                productSlug: item.variant.product.slug,
                size: item.variant.size,
                colorName: item.variant.colorName,
                sku: item.variant.sku,
                imageUrl: item.variant.product.images[0]?.url || null,
                unitPrice,
                quantity: item.quantity,
                subtotal: unitPrice * item.quantity,
              };
            }),
          },
        },
      });

      // Decrement stock & record InventoryLog for each variant
      for (const item of cartItems) {
        const updatedVariant = await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        await tx.inventoryLog.create({
          data: {
            variantId: item.variantId,
            changeQty: -item.quantity,
            balanceAfter: updatedVariant.stock,
            reason: "PURCHASE",
            performedBy: currentUser ? currentUser.email : `GUEST:${email}`,
          },
        });
      }

      // Record Payment
      const transactionId = `TXN_${paymentProvider}_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          provider: paymentProvider,
          transactionId,
          paymentStatus: paymentProvider === "COD" ? "PENDING" : "COMPLETED",
          amount: totalAmount,
          currency: "INR",
          paidAt: paymentProvider === "COD" ? null : new Date(),
        },
      });

      // Record Courier Shipment
      const carriers = ["Delhivery Express", "BlueDart Apex", "DHL Imperial"];
      const chosenCarrier = carriers[Math.floor(Math.random() * carriers.length)];
      const trackingNumber = `MN${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + (deliveryTier === "SAME_DAY" ? 1 : 3));

      await tx.shipment.create({
        data: {
          orderId: newOrder.id,
          carrier: chosenCarrier,
          trackingNumber,
          status: "MANIFESTED",
          estimatedDelivery: deliveryDate,
        },
      });

      // Clear the Cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      message: "Order placed and archived successfully.",
      orderNumber: order.orderNumber,
      orderId: order.id,
      totalAmount,
    });
  } catch (error) {
    console.error("POST /api/checkout error:", error);
    return NextResponse.json(
      { error: "Failed to finalize acquisition. Please try again." },
      { status: 500 }
    );
  }
}
