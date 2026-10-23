import { NextResponse } from "next/server";

const WA_GATEWAY_URL = process.env.WA_GATEWAY_URL || "http://localhost:3001";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(`${WA_GATEWAY_URL}/api/qr`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({
      success: false,
      data: { status: "DISCONNECTED", qrDataUrl: null },
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      data: { status: "DISCONNECTED", qrDataUrl: null },
    });
  }
}
