import { NextResponse } from 'next/server';

/**
 * Proxy for the `/auth/signup` endpoint on the backend.
 *
 * This route receives a JSON payload containing `username`,
 * `password` and `tenant_name` and forwards it to the real backend.
 * The response from the backend is streamed back to the client
 * unchanged, including status codes and response body. This avoids
 * CORS issues because the request is executed on the server.
 */
const BACKEND_BASE = process.env.API_BACKEND_BASE || 'https://linkedin.stellaritsupport.com';

export async function POST(req: Request) {
  const body = await req.json();
  const backendRes = await fetch(`${BACKEND_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const text = await backendRes.text();
  // Forward the response with the original status code and content type.
  return new NextResponse(text, {
    status: backendRes.status,
    headers: {
      'Content-Type': backendRes.headers.get('content-type') || 'text/plain'
    }
  });
}