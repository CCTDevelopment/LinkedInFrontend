import { NextResponse } from 'next/server';

/**
 * Proxy for the `/linkedin/schedule` endpoint on the backend.
 *
 * The dashboard submits a JSON payload containing `company_id`,
 * `content` and `scheduled_time`. We forward that along with the
 * Authorization header to the remote service. Errors from the
 * backend are propagated back to the client.
 */
const BACKEND_BASE = process.env.API_BACKEND_BASE || 'https://linkedin.stellaritsupport.com';

export async function POST(req: Request) {
  const body = await req.json();
  const authHeader = req.headers.get('authorization') || undefined;
  const backendRes = await fetch(`${BACKEND_BASE}/linkedin/schedule`, {
    method: 'POST',
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {}),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const text = await backendRes.text();
  return new NextResponse(text, {
    status: backendRes.status,
    headers: {
      'Content-Type': backendRes.headers.get('content-type') || 'text/plain'
    }
  });
}