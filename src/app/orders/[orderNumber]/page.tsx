import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  ShieldIcon,
  TruckIcon,
  CheckIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";

interface OrderTrackingPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({
  params,
}: OrderTrackingPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Acquisition Tracker — ${orderNumber} | MAISON NOIR`,
    description: `Track real-time courier logistics and archival details for order ${orderNumber}.`,
  };
}

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      shipment: true,
      payment: true,
      coupon: true,
    },
  });

  if (!order) {
    notFound();
  }

  // Calculate tracking stages
  // Stages:
  // 1: Order Confirmed
  // 2: Atelier Inspection & Packaging
  // 3: Dispatched & In Transit
  // 4: Delivered
  const isDelivered =
    order.status === "DELIVERED" || order.shipment?.status === "DELIVERED";
  const isDispatched =
    isDelivered ||
    order.status === "SHIPPED" ||
    order.shipment?.status === "IN_TRANSIT" ||
    order.shipment?.status === "OUT_FOR_DELIVERY";
  const isProcessing =
    isDispatched ||
    order.status === "CONFIRMED" ||
    order.status === "PAID" ||
    order.shipment?.status === "MANIFESTED";

  const stages = [
    {
      title: "Acquisition Sealed",
      desc: "Order transcribed & vault inventory reserved",
      completed: true,
      date: new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    },
    {
      title: "Atelier Inspection",
      desc: "Garment hand-checked & boxed in matte noir casing",
      completed: isProcessing,
      date: isProcessing ? "Completed" : "Pending",
    },
    {
      title: "Courier Transit",
      desc: `${order.shipment?.carrier || "Express Courier"} scheduled for delivery`,
      completed: isDispatched,
      date: isDispatched ? "In Transit" : "Awaiting Dispatch",
    },
    {
      title: "Signed Handover",
      desc: "White-glove delivery to your designated residence",
      completed: isDelivered,
      date: isDelivered
        ? "Delivered"
        : order.shipment?.estimatedDelivery
        ? `Est. ${new Date(order.shipment.estimatedDelivery).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}`
        : "Pending",
    },
  ];

  return (
    <div className="bg-ivory-light/30 min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-muted mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gold uppercase tracking-wider">
            Home
          </Link>
          <span>/</span>
          <Link href="/account" className="hover:text-gold uppercase tracking-wider">
            Patron Portal
          </Link>
          <span>/</span>
          <span className="text-noir font-mono font-medium truncate">
            {order.orderNumber}
          </span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white border border-border p-6 sm:p-10 shadow-luxury mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
            <div>
              <span className="text-label text-gold text-xs tracking-[0.25em] uppercase block mb-1">
                Archival Order Certificate
              </span>
              <h1 className="heading-display text-2xl sm:text-3xl lg:text-4xl text-noir font-mono">
                {order.orderNumber}
              </h1>
              <p className="text-xs text-muted mt-1.5 font-light">
                Recorded on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border ${
                  order.status === "DELIVERED"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : order.status === "SHIPPED"
                    ? "bg-blue-50 text-blue-800 border-blue-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                Status: {order.status}
              </span>

              <button
                onClick={() => {}}
                className="px-4 py-1.5 border border-border text-xs uppercase tracking-wider text-noir hover:bg-ivory hover:border-noir transition-colors print:hidden"
              >
                Print Receipt
              </button>
            </div>
          </div>

          {/* 4-Stage Visual Courier Stepper */}
          <div className="pt-8">
            <span className="text-xs uppercase tracking-wider text-muted font-medium block mb-6">
              Courier Dispatch Progression
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
              {stages.map((stage, idx) => (
                <div key={idx} className="relative flex flex-col items-start text-left">
                  {/* Circle Indicator */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-3 transition-colors ${
                      stage.completed
                        ? "bg-noir text-gold border-2 border-gold"
                        : "bg-white text-muted border border-border"
                    }`}
                  >
                    {stage.completed ? <CheckIcon size={16} /> : idx + 1}
                  </div>

                  <span className="font-serif font-medium text-sm text-noir">
                    {stage.title}
                  </span>
                  <span className="text-[11px] text-muted font-light mt-1 leading-relaxed">
                    {stage.desc}
                  </span>
                  <span className="text-[10px] font-mono text-gold font-medium mt-2">
                    {stage.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two-Column Order Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Courier Details & Items (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Courier Tracking Card */}
            {order.shipment && (
              <div className="bg-white border border-border p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <TruckIcon size={18} className="text-gold" />
                  <h3 className="font-serif text-base text-noir font-medium">
                    White-Glove Courier Logistics
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider">
                      Assigned Carrier
                    </span>
                    <span className="font-medium text-noir text-sm mt-0.5 block">
                      {order.shipment.carrier}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider">
                      Tracking Identification
                    </span>
                    <span className="font-mono font-semibold text-noir text-sm mt-0.5 block">
                      {order.shipment.trackingNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted block text-[10px] uppercase tracking-wider">
                      Estimated Handover
                    </span>
                    <span className="text-noir font-medium text-sm mt-0.5 block">
                      {order.shipment.estimatedDelivery
                        ? new Date(order.shipment.estimatedDelivery).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )
                        : "2–3 Business Days"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Destination Card */}
            <div className="bg-white border border-border p-6 shadow-sm space-y-3 text-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <MapPinIcon size={18} className="text-gold" />
                <h3 className="font-serif text-base text-noir font-medium">
                  Delivery Destination
                </h3>
              </div>

              <div className="space-y-1 text-muted">
                <p className="font-medium text-noir text-sm">{order.shippingFullName}</p>
                <p>{order.shippingStreet1} {order.shippingStreet2 || ""}</p>
                <p>{order.shippingCity}, {order.shippingState} — {order.shippingPostalCode}</p>
                <p>{order.shippingCountry}</p>
                <p className="pt-1 text-noir font-mono">Contact: {order.shippingPhone}</p>
                {order.notes && (
                  <p className="pt-2 text-gold italic">
                    Concierge Note: &ldquo;{order.notes}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Line Items Card */}
            <div className="bg-white border border-border shadow-sm divide-y divide-border">
              <div className="p-6 bg-ivory-light/40 flex items-center justify-between text-xs text-muted uppercase tracking-wider font-medium">
                <span>Acquired Garments ({order.items.length})</span>
                <span>Subtotal</span>
              </div>

              <div className="p-6 divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {item.imageUrl && (
                        <div className="relative w-16 h-20 flex-shrink-0 bg-ivory-light border border-border overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/products/${item.productSlug}`}
                          className="font-serif text-sm text-noir hover:text-gold transition-colors font-medium"
                        >
                          {item.productName}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted mt-1">
                          <span>Size: {item.size}</span>
                          <span>•</span>
                          <span>Color: {item.colorName}</span>
                          <span>•</span>
                          <span className="font-mono text-[10px]">SKU: {item.sku}</span>
                        </div>
                        <span className="text-xs font-mono text-noir mt-1 block">
                          ₹{item.unitPrice.toLocaleString("en-IN")} × {item.quantity}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-sm font-semibold text-noir">
                      ₹{item.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Appraisal & Financials (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Order Appraisal Card */}
            <div className="bg-white border border-border p-6 sm:p-8 shadow-luxury space-y-6">
              <h3 className="heading-display text-xl text-noir border-b border-border pb-4">
                Financial Appraisal
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Garments Subtotal</span>
                  <span className="font-mono text-noir">
                    ₹{order.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-muted">
                  <span>Courier Logistics</span>
                  <span className="font-mono">
                    {order.shippingFee === 0 ? (
                      <span className="text-emerald-800 font-medium uppercase text-[10px]">
                        Complimentary
                      </span>
                    ) : (
                      `₹${order.shippingFee.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-gold font-medium">
                    <span>
                      Voucher Deduction {order.coupon ? `(${order.coupon.code})` : ""}
                    </span>
                    <span className="font-mono">
                      -₹{order.discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-muted">
                  <span>Archival Matte Presentation</span>
                  <span className="text-emerald-800 font-medium uppercase text-[10px]">
                    Complimentary
                  </span>
                </div>

                <div className="pt-4 border-t border-border flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-semibold text-noir block">
                      Total Acquisition Sum
                    </span>
                    <span className="text-[10px] text-muted">
                      Inclusive of all tariffs & taxes
                    </span>
                  </div>
                  <span className="font-mono text-2xl font-serif text-gold font-medium">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Payment Details Box */}
              {order.payment && (
                <div className="pt-4 border-t border-border text-xs space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-muted font-medium block">
                    Settlement Record
                  </span>
                  <div className="flex justify-between">
                    <span className="text-muted">Gateway Provider:</span>
                    <span className="font-semibold text-noir">
                      {order.payment.provider}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Settlement Status:</span>
                    <span className="text-emerald-800 font-medium uppercase text-[11px]">
                      {order.payment.paymentStatus}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Concierge Assistance Card */}
            <div className="p-6 bg-white border border-border space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <ShieldIcon size={18} className="text-gold" />
                <h4 className="font-serif text-base text-noir font-medium">
                  Maison Concierge Support
                </h4>
              </div>

              <p className="text-muted leading-relaxed font-light">
                For bespoke modifications, specialized delivery timing, or immediate courier routing requests, our client advisors are at your service.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="mailto:concierge@maisonnoir.com"
                  className="w-full py-2.5 border border-border text-center text-noir uppercase tracking-wider text-[11px] hover:border-gold hover:text-gold transition-colors"
                >
                  Contact Concierge Desk
                </a>

                <Link
                  href="/collections"
                  className="w-full py-2.5 bg-noir text-ivory text-center uppercase tracking-wider text-[11px] hover:bg-gold hover:text-noir transition-colors flex items-center justify-center gap-1.5"
                >
                  Explore Collection
                  <ArrowRightIcon size={12} />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
