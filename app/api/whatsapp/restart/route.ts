import { NextResponse } from "next/server";

const WA_GATEWAY_URL = process.env.WA_GATEWAY_URL || "http://localhost:3001";

export async function POST() {
  try {
    const res = await fetch(`${WA_GATEWAY_URL}/api/restart`, {
      method: "POST",
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
