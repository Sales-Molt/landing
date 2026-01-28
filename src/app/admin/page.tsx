"use client";

import { useState, useEffect } from "react";

interface EmailRecord {
  id: number;
  to: string;
  name: string;
  company: string;
  subject: string;
  resendId: string;
  status: string;
  sentAt: string;
  content?: string;
  source?: string;
  sourceUrl?: string;
  emailSource?: string;
  personRationale?: string;
  companyRationale?: string;
  emailRationale?: string;
}

interface DashboardData {
  emails: EmailRecord[];
  stats: {
    total: number;
    sent: number;
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
  const [selectedEmail, setSelectedEmail] = useState<EmailRecord | null>(null);

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
    setLoading(true);
    const res = await fetch("/api/admin/dashboard");
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch("/api/admin/auth").then(res => {
      if (res.ok) {
        setAuthenticated(true);
        fetchData();
      }
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-900 text-green-300";
      case "bounced": return "bg-red-900 text-red-300";
      case "opened": return "bg-blue-900 text-blue-300";
      case "replied": return "bg-emerald-900 text-emerald-300";
      case "clicked": return "bg-purple-900 text-purple-300";
      default: return "bg-gray-600 text-gray-200";
    }
  };

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
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Main Content */}
      <div className={`flex-1 p-8 transition-all ${selectedEmail ? "mr-96" : ""}`}>
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">📊 SalesMolt Dashboard</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
              >
                {loading ? "⏳" : "🔄"} Refresh
              </button>
              <span className="text-gray-400 text-sm">
                {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : "Loading..."}
              </span>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-3xl font-bold text-white">{data?.stats.total || 0}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Sent</p>
              <p className="text-3xl font-bold text-yellow-400">{data?.stats.sent || 0}</p>
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
                  <tr 
                    key={email.id} 
                    className={`border-t border-gray-700 cursor-pointer transition ${
                      selectedEmail?.id === email.id 
                        ? "bg-gray-700" 
                        : "hover:bg-gray-750"
                    }`}
                    onClick={() => setSelectedEmail(email)}
                  >
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
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(email.status)}`}>
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

      {/* Right Panel - Email Content */}
      {selectedEmail && (
        <div className="fixed right-0 top-0 h-full w-96 bg-gray-800 shadow-xl border-l border-gray-700 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold">Email Details</h2>
              <button 
                onClick={() => setSelectedEmail(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase">To</p>
                <p className="text-sm">{selectedEmail.name} &lt;{selectedEmail.to}&gt;</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400 uppercase">Company</p>
                <p className="text-sm">{selectedEmail.company}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400 uppercase">Subject</p>
                <p className="text-sm font-medium">{selectedEmail.subject}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400 uppercase">Status</p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedEmail.status)}`}>
                  {selectedEmail.status}
                </span>
              </div>
              
              <div>
                <p className="text-xs text-gray-400 uppercase">Sent At</p>
                <p className="text-sm">{selectedEmail.sentAt}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400 uppercase">Resend ID</p>
                <p className="text-xs font-mono text-gray-500 break-all">{selectedEmail.resendId}</p>
              </div>

              {/* Rationale Section */}
              <div className="border-t border-gray-700 pt-4 mt-4">
                <p className="text-xs text-emerald-400 uppercase font-bold mb-3">📋 Rationale</p>
                
                {selectedEmail.source && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400">Source</p>
                    <p className="text-sm">{selectedEmail.source}</p>
                    {selectedEmail.sourceUrl && (
                      <a href={selectedEmail.sourceUrl} target="_blank" rel="noopener noreferrer" 
                         className="text-xs text-blue-400 hover:underline">{selectedEmail.sourceUrl}</a>
                    )}
                  </div>
                )}

                {selectedEmail.emailSource && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400">How I found the email</p>
                    <p className="text-sm text-gray-300">{selectedEmail.emailSource}</p>
                  </div>
                )}

                {selectedEmail.personRationale && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400">Why this person</p>
                    <p className="text-sm text-gray-300">{selectedEmail.personRationale}</p>
                  </div>
                )}

                {selectedEmail.companyRationale && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400">Why this company</p>
                    <p className="text-sm text-gray-300">{selectedEmail.companyRationale}</p>
                  </div>
                )}

                {selectedEmail.emailRationale && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400">Email strategy</p>
                    <p className="text-sm text-gray-300">{selectedEmail.emailRationale}</p>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-700 pt-4 mt-4">
                <p className="text-xs text-gray-400 uppercase mb-2">📧 Email Content</p>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap font-sans text-gray-300">
                    {selectedEmail.content || "Content not available"}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
