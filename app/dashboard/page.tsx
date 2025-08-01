"use client";
import { useEffect, useState } from "react";
import {
  getCredentialsStatus,
  getOauthUrl,
  getScheduledPosts,
  schedulePost,
  getOrganizations,
} from "../../lib/api";
import { useRouter } from "next/navigation";

const DEBUG = process.env.NEXT_PUBLIC_DEBUG === "true";
const FORCE_UI = false;

interface Organization {
  id: string;
  name?: string;
  vanityName?: string;
  logo?: string;
}
interface ScheduledPost {
  id: number;
  company_id: string;
  content: string;
  scheduled_time: string;
  posted: boolean | null;
  error_message: string | null;
}

function getNowDatetimeLocal() {
  const now = new Date();
  now.setSeconds(0, 0);
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  return local;
}

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [credStatus, setCredStatus] = useState<any>(null);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [content, setContent] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loadingOauth, setLoadingOauth] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [oauthWindow, setOauthWindow] = useState<Window | null>(null);
  const [pollingStatus, setPollingStatus] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    DEBUG && console.debug("Current token:", stored);
    if (!stored) {
      router.push("/login");
    } else {
      setToken(stored);
      fetchScheduled(stored);
      fetchCredStatus(stored);
      fetchOrganizations(stored);
    }
    // eslint-disable-next-line
  }, [router]);

  useEffect(() => {
    if (!pollingStatus || !token) return;
    const interval = setInterval(async () => {
      const status = await fetchCredStatus(token, { silent: true });
      if (
        status?.status === "connected" ||
        status?.authorized ||
        status?.status === "ok" ||
        status?.status === "configured"
      ) {
        setPollingStatus(false);
        if (oauthWindow) oauthWindow.close();
        setMessage("✅ LinkedIn authenticated! You can now schedule posts.");
        fetchOrganizations(token);
      }
    }, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [pollingStatus, token, oauthWindow]);

  async function fetchCredStatus(tok: string, opts: { silent?: boolean } = {}) {
    setLoadingStatus(!opts.silent);
    try {
      const status = await getCredentialsStatus(tok);
      setCredStatus(status);
      DEBUG && console.debug("🔍 Credential Status:", status);
      return status;
    } catch (err: any) {
      DEBUG && console.error("❌ Cred status error:", err, "Token used:", tok);
      if (!opts.silent) setMessage(err.message || "Failed to get credentials status");
    } finally {
      setLoadingStatus(false);
    }
  }

  async function fetchScheduled(tok: string) {
    setLoadingPosts(true);
    try {
      const data = await getScheduledPosts(tok);
      setPosts(data as ScheduledPost[]);
      DEBUG && console.debug("📆 Scheduled posts:", data);
    } catch (err: any) {
      DEBUG && console.error("❌ Scheduled post error:", err, "Token used:", tok);
      setMessage(err.message || "Failed to fetch scheduled posts");
    } finally {
      setLoadingPosts(false);
    }
  }

  async function fetchOrganizations(tok: string) {
    try {
      const data = await getOrganizations(tok);
      DEBUG && console.debug("🏢 Organizations:", data);
      setOrganizations(data.organizations || []);
      if (data.organizations?.length === 1) setCompanyId(data.organizations[0].id);
      if ((!data.organizations || data.organizations.length === 0) && DEBUG)
        alert("No LinkedIn organizations found for your account/token.");
    } catch (err) {
      DEBUG && console.error("❌ Failed to fetch organizations:", err, "Token used:", tok);
      alert("Error: " + (err as any)?.message ?? String(err));
    }
  }

  async function handleOauth() {
    if (!token) return;
    setLoadingOauth(true);
    setMessage(null);
    try {
      const { auth_url } = await getOauthUrl(token);
      DEBUG && console.debug("🔗 OAuth URL:", auth_url);
      const popup = window.open(auth_url, "_blank", "width=500,height=800");
      if (!popup) {
        setMessage("Popup was blocked. Please allow popups.");
        return;
      }
      setOauthWindow(popup);
      setMessage("Please complete the LinkedIn OAuth in the new window...");
      setPollingStatus(true);
    } catch (err: any) {
      DEBUG && console.error("❌ OAuth error:", err, "Token used:", token);
      setMessage(err.message || "Failed to get OAuth URL");
    } finally {
      setLoadingOauth(false);
    }
  }

  async function handleCheckCreds() {
    if (!token) return;
    setMessage(null);
    await fetchCredStatus(token);
  }

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setScheduling(true);
    setMessage(null);
    try {
      const isoTime = new Date(scheduledTime).toISOString();
      await schedulePost(token, companyId, content, isoTime);
      DEBUG && console.debug("✅ Post scheduled:", { companyId, content, isoTime });
      setMessage("Post scheduled successfully!");
      setCompanyId(organizations[0]?.id || "");
      setContent("");
      setScheduledTime("");
      fetchScheduled(token);
    } catch (err: any) {
      DEBUG && console.error("❌ Schedule error:", err, "Token used:", token);
      setMessage(err.message || "Failed to schedule post");
    } finally {
      setScheduling(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const isConnected = FORCE_UI
    ? true
    : !!(
        credStatus &&
        (
          credStatus.status === "connected" ||
          credStatus.status === "configured" ||
          credStatus.status === "ok" ||
          credStatus.authorized
        )
      );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>

      {message && (
        <div className="text-center">
          <span
            className={
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }
          >
            {message}
          </span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* LinkedIn Credentials Section */}
        <div className="flex-1 bg-white p-6 rounded shadow space-y-4">
          <h3 className="text-lg font-semibold mb-2">LinkedIn Connection</h3>
          <button
            onClick={handleOauth}
            disabled={loadingOauth || isConnected}
            className={`w-full ${
              isConnected
                ? "bg-green-500 text-white cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } py-2 rounded`}
          >
            {isConnected
              ? "LinkedIn Connected"
              : loadingOauth
              ? "Connecting..."
              : "Connect LinkedIn"}
          </button>
          <button
            onClick={handleCheckCreds}
            disabled={loadingStatus}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 rounded"
          >
            {loadingStatus ? "Checking..." : "Check LinkedIn Credentials Status"}
          </button>
          <div className="mt-2">
            {credStatus && (
              <pre className="p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                {JSON.stringify(credStatus, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Schedule Post Section */}
        <div className="flex-1 bg-white p-6 rounded shadow space-y-4">
          <h3 className="text-lg font-semibold mb-2">Schedule a Post</h3>
          {!isConnected && (
            <div className="text-yellow-700 bg-yellow-100 rounded px-3 py-2 mb-2 text-sm">
              <strong>Step 1:</strong> Connect your LinkedIn account before scheduling posts.
            </div>
          )}
          <form onSubmit={handleSchedule} className="space-y-3">
            <div className="flex flex-col">
              <label htmlFor="companyId" className="mb-1 font-medium">Company</label>
              <select
                id="companyId"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                disabled={!isConnected}
                className="border rounded p-2 bg-white text-black"
              >
                <option value="">Select a company</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name || org.vanityName || org.id}
                  </option>
                ))}
              </select>
              {organizations.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {organizations.map(org => (
                    <li key={org.id} className="flex items-center gap-2">
                      {org.logo && (
                        <img src={org.logo} alt={org.name} className="h-6 w-6 rounded-full" />
                      )}
                      <span>{org.name || org.vanityName || org.id}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="scheduledTime" className="mb-1 font-medium flex items-center">
                Scheduled Time
                <button
                  type="button"
                  onClick={() => setScheduledTime(getNowDatetimeLocal())}
                  disabled={!isConnected}
                  className="ml-3 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  style={{ minWidth: 48 }}
                >
                  Now
                </button>
              </label>
              <input
                id="scheduledTime"
                type="datetime-local"
                className="border rounded p-2"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
                disabled={!isConnected}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="content" className="mb-1 font-medium">Content</label>
              <textarea
                id="content"
                className="border rounded p-2 h-28"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                disabled={!isConnected}
              />
            </div>
            <button
              type="submit"
              disabled={scheduling || !isConnected}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
            >
              {scheduling ? "Scheduling..." : "Schedule Post"}
            </button>
          </form>
        </div>
      </div>

      {/* Scheduled posts list */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Scheduled Posts</h3>
          <button
            onClick={() => token && fetchScheduled(token)}
            disabled={loadingPosts}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
          >
            Refresh
          </button>
        </div>
        {loadingPosts ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No scheduled posts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Company</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Content</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Scheduled Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Posted</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="text-sm">
                    <td className="px-4 py-2 whitespace-nowrap">
                      {organizations.find(org => org.id === post.company_id)?.name || post.company_id}
                    </td>
                    <td className="px-4 py-2 whitespace-pre-wrap max-w-xs">{post.content}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(post.scheduled_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      {post.posted == null ? "Pending" : post.posted ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2 text-red-500">
                      {post.error_message || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
