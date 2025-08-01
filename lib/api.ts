import { authenticator } from "otplib";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://linkedin.stellaritsupport.com";

// ----- Auth / Signup -----
export interface MFASetupResponse {
  secret: string;
  provisioning_uri: string;
}

export async function signUp(
  username: string,
  password: string,
  tenantName: string
): Promise<MFASetupResponse> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, tenant_name: tenantName }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function generateTotp(secret: string): string {
  return authenticator.generate(secret);
}

// ----- Login -----
export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function login(
  username: string,
  password: string,
  totp: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, totp_code: totp }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ----- Helper for authenticated calls -----
async function authFetch(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res;
}

// ----- LinkedIn OAuth -----
export async function getOauthUrl(token: string): Promise<any> {
  const res = await authFetch("/linkedin/oauth_url", token);
  return res.json();
}

// ----- LinkedIn Credentials -----
export async function getCredentialsStatus(token: string): Promise<any> {
  const res = await authFetch("/linkedin/credentials/status", token);
  return res.json();
}

// ----- LinkedIn Schedule -----
export interface SchedulePostRequest {
  company_id: string;
  content: string;
  scheduled_time: string;
}

export async function schedulePost(
  token: string,
  companyId: string,
  content: string,
  scheduledTime: string
): Promise<any> {
  const body: SchedulePostRequest = {
    company_id: companyId,
    content,
    scheduled_time: scheduledTime,
  };
  const res = await authFetch("/linkedin/schedule", token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// ----- LinkedIn Scheduled Posts -----
export async function getScheduledPosts(token: string): Promise<any[]> {
  const res = await authFetch("/linkedin/scheduled", token);
  return res.json();
}

// ----- LinkedIn Organizations -----
export async function getOrganizations(token: string): Promise<any> {
  const res = await authFetch("/linkedin/organizations", token);
  return res.json();
}
