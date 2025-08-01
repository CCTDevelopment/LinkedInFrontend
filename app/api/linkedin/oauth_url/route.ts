import { NextRequest, NextResponse } from "next/server";
const BACKEND_BASE = process.env.API_BACKEND_BASE || "https://linkedin.stellaritsupport.com";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!token) {
    return NextResponse.json({ error: "Missing Authorization" }, { status: 401 });
  }
  const backendRes = await fetch(`${BACKEND_BASE}/linkedin/oauth_url`, {
    headers: { Authorization: token }
  });
  const text = await backendRes.text();
  try {
    return NextResponse.json(JSON.parse(text), { status: backendRes.status });
  } catch {
    return new NextResponse(text, {
      status: backendRes.status,
      headers: {
        "Content-Type": backendRes.headers.get("content-type") || "text/plain"
      }
    });
  }
}
