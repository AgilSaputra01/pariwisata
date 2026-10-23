import { NextRequest, NextResponse } from "next/server";
import { BookingFormData } from "@/types";
import { generateBookingId, buildWhatsAppLink, WHATSAPP_OPERATOR_PHONE } from "@/lib/whatsapp";
import { BookingStore } from "@/lib/bookings-store";

const WA_GATEWAY_URL = process.env.WA_GATEWAY_URL || "http://localhost:3001";

export async function GET() {
  const bookings = BookingStore.getAllBookings();
  return NextResponse.json({
    success: true,
    data: bookings,
  });
}

export async function POST(req: NextRequest) {
  try {
    const data: BookingFormData = await req.json();

    if (!data.customerName || !data.customerPhone) {
      return NextResponse.json(
        { success: false, error: "Nama dan nomor WhatsApp pelanggan wajib diisi." },
        { status: 400 }
      );
    }

    const bookingId = generateBookingId();
    const newBooking = BookingStore.createBooking(data, bookingId);

    // Build fallback direct wa.me link
    const fallbackWaLink = buildWhatsAppLink(data, bookingId, WHATSAPP_OPERATOR_PHONE);

    let gatewayResult = {
      dispatched: false,
      sentToAdmin: false,
      sentToCustomer: false,
      message: "Gateway unreachable or offline",
    };

    // Forward to WhatsApp Gateway service (whatsapp-web.js 1.34.7)
    try {
      const waResponse = await fetch(`${WA_GATEWAY_URL}/api/send-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          bookingId,
          operatorPhone: WHATSAPP_OPERATOR_PHONE,
        }),
        signal: AbortSignal.timeout(5000), // 5 seconds timeout
      });

      if (waResponse.ok) {
        const json = await waResponse.json();
        if (json.gatewayReady && json.results) {
          gatewayResult = {
            dispatched: true,
            sentToAdmin: json.results.sentToAdmin || false,
            sentToCustomer: json.results.sentToCustomer || false,
            message: "WhatsApp notification dispatched successfully via whatsapp-web.js",
          };

          BookingStore.updateDeliveryStatus(bookingId, {
            dispatchedViaGateway: true,
            sentToAdmin: json.results.sentToAdmin,
            sentToCustomer: json.results.sentToCustomer,
          });
        } else {
          gatewayResult.message = json.message || "WhatsApp gateway is not ready (need QR pairing)";
        }
      }
    } catch (err: any) {
      console.warn("WhatsApp Gateway not reachable:", err.message);
      gatewayResult.message = `Gateway connection error: ${err.message}`;
    }

    return NextResponse.json({
      success: true,
      bookingId,
      booking: newBooking,
      gateway: gatewayResult,
      fallbackWaLink,
    });
  } catch (error: any) {
    console.error("Booking submission error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
