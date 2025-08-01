"use client";

import { FormEvent, useState } from "react";
import { generateTotp, login, signUp } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tenant, setTenant] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [provisioningUri, setProvisioningUri] = useState<string | null>(null);
  const [totp, setTotp] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    console.log("🚀 Signing up:", { username, tenant });

    try {
      const resp = await signUp(username, password, tenant);
      console.log("✅ Signup response:", resp);

      setSecret(resp.secret);
      setProvisioningUri(resp.provisioning_uri);

      const code = generateTotp(resp.secret);
      setTotp(code);
      setMessage("✅ Account created! Use the TOTP code below to log in.");
    } catch (err: any) {
      console.error("❌ Signup failed:", err);
      setMessage(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    if (!secret) {
      console.warn("🔒 Cannot login: no secret generated yet.");
      return;
    }

    try {
      const code = generateTotp(secret);
      setTotp(code);
      console.log("🔐 Logging in with TOTP:", code);

      const resp = await login(username, password, code);
      console.log("✅ Login response:", resp);

      if (resp.access_token) {
        localStorage.setItem("token", resp.access_token);
        setMessage("✅ Logged in successfully! Redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        throw new Error("No access_token returned");
      }
    } catch (err: any) {
      console.error("❌ Login failed:", err);
      setMessage(err.message || "Login failed");
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup} className="space-y-4 bg-white shadow p-6 rounded">
        <div className="flex flex-col">
          <label htmlFor="username" className="mb-1 font-medium">Username</label>
          <input
            id="username"
            type="text"
            className="border rounded p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 font-medium">Password</label>
          <input
            id="password"
            type="password"
            className="border rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="tenant" className="mb-1 font-medium">Tenant Name</label>
          <input
            id="tenant"
            type="text"
            className="border rounded p-2"
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-red-600 whitespace-pre-wrap">{message}</p>
      )}

      {secret && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">MFA Setup</h3>
          <p className="text-sm mb-2">Secret: <code>{secret}</code></p>

          {provisioningUri && (
            <div className="flex flex-col items-center mb-2">
              <img
                src={`https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(provisioningUri)}&chs=200x200&chld=L|0`}
                alt="MFA QR Code"
                className="w-40 h-40"
              />
              <p className="text-xs mt-1">Scan this QR code with your authenticator app</p>
            </div>
          )}

          {totp && (
            <p className="text-sm mb-2">Current TOTP Code: <code>{totp}</code></p>
          )}

          <button
            onClick={handleLogin}
            className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
          >
            Log In Now
          </button>
        </div>
      )}
    </div>
  );
}
