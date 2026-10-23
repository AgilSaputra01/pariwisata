import { NextResponse } from "next/server";

const WA_GATEWAY_URL = process.env.WA_GATEWAY_URL || "http://localhost:3001";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(`${WA_GATEWAY_URL}/api/status`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({
      success: false,
      data: {
        status: "DISCONNECTED",
        isReady: false,
        lastError: `Gateway responded with status ${res.status}`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      data: {
        status: "DISCONNECTED",
        isReady: false,
        lastError: "WhatsApp Gateway service offline (Run 'npm run whatsapp:bot' to start)",
      },
    });
  }
}
