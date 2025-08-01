"use client";
import { useState, useEffect } from "react";
import { login } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Only render login form after hydration
  }, []);

  if (!isMounted) {
    // Render a blank div or a spinner to ensure SSR and client HTML match
    return <div />;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const resp = await login(username, password, totp);
      localStorage.setItem("token", resp.access_token);
      setMessage("Logged in successfully! Redirecting...");
      router.push("/dashboard");
    } catch (err: any) {
      setMessage(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Log In</h2>
      <form onSubmit={handleLogin} className="space-y-4 bg-white shadow p-6 rounded">
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
          <label htmlFor="totp" className="mb-1 font-medium">TOTP Code</label>
          <input
            id="totp"
            type="text"
            maxLength={6}
            className="border rounded p-2"
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
    </div>
  );
}
