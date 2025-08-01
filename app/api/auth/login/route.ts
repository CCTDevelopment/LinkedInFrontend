import { NextRequest, NextResponse } from "next/server";
const BACKEND_BASE = process.env.API_BACKEND_BASE || "https://linkedin.stellaritsupport.com";

export async function GET() {
  return NextResponse.json({ ok: true, msg: "login route GET works" });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const backendRes = await fetch(`${BACKEND_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const text = await backendRes.text();
  try {
    return NextResponse.json(JSON.parse(text), { status: backendRes.status });
  } catch {
    return new NextResponse(text, {
      status: backendRes.status,
      headers: {
        "Content-Type": backendRes.headers.get("content-type") || "text/plain",
      },
    });
  }
}
