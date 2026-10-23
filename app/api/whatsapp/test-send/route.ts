import { NextRequest, NextResponse } from "next/server";

const WA_GATEWAY_URL = process.env.WA_GATEWAY_URL || "http://localhost:3001";

export async function POST(req: NextRequest) {
  try {
    const { to, message } = await req.json();
    if (!to || !message) {
      return NextResponse.json(
        { success: false, error: "Nomor tujuan dan isi pesan wajib diisi." },
        { status: 400 }
      );
    }

    const res = await fetch(`${WA_GATEWAY_URL}/api/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, message }),
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: `Gagal menghubungi WhatsApp Gateway: ${err.message}` },
      { status: 500 }
    );
  }
}
