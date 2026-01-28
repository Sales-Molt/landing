"use client";

import { useState, useEffect } from "react";

interface EmailRecord {
  id: number;
  to: string;
  name: string;
  company: string;
  subject: string;
  resendId: string;
  status: "sent" | "delivered" | "bounced" | "opened" | "replied";
  sentAt: string;
  content?: string;
}

interface DashboardData {
  emails: EmailRecord[];
  stats: {
    total: number;
    delivered: number;
    bounced: number;
    opened: number;
    replied: number;
  };
  lastUpdated: string;
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    
    if (res.ok) {
      setAuthenticated(true);
      fetchData();
    } else {
      setError("Invalid password");
    }
    setLoading(false);
  };

  const fetchData = async () => {
    const res = await fetch("/api/admin/dashboard");
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
  };

  useEffect(() => {
    // Check if already authenticated (session)
    fetch("/api/admin/auth").then(res => {
      if (res.ok) {
        setAuthenticated(true);
        fetchData();
      }
    });
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            🔐 SalesMolt Admin
          </h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition"
            >
              {loading ? "..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">📊 SalesMolt Dashboard</h1>
          <span className="text-gray-400 text-sm">
            Last updated: {data?.lastUpdated || "Loading..."}
          </span>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Total Sent</p>
            <p className="text-3xl font-bold text-white">{data?.stats.total || 0}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Delivered</p>
            <p className="text-3xl font-bold text-green-400">{data?.stats.delivered || 0}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Bounced</p>
            <p className="text-3xl font-bold text-red-400">{data?.stats.bounced || 0}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Opened</p>
            <p className="text-3xl font-bold text-blue-400">{data?.stats.opened || 0}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Replied</p>
            <p className="text-3xl font-bold text-emerald-400">{data?.stats.replied || 0}</p>
          </div>
        </div>

        {/* Email Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Recipient</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Subject</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Sent</th>
              </tr>
            </thead>
            <tbody>
              {data?.emails.map((email, i) => (
                <tr key={email.id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{email.name || "Team"}</p>
                    <p className="text-xs text-gray-400">{email.to}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">{email.company}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 max-w-xs truncate">
                    {email.subject}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      email.status === "sent" ? "bg-gray-600 text-gray-200" :
                      email.status === "delivered" ? "bg-green-900 text-green-300" :
                      email.status === "bounced" ? "bg-red-900 text-red-300" :
                      email.status === "opened" ? "bg-blue-900 text-blue-300" :
                      "bg-emerald-900 text-emerald-300"
                    }`}>
                      {email.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{email.sentAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          Powered by Eric 🤖 AI Sales Agent
        </footer>
      </div>
    </div>
  );
}
