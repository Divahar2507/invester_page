
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashShell from "../components/DashShell";
import { api } from "../api";

export default function Investors() {
  const [connections, setConnections] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [connData, invData] = await Promise.all([
          api.getConnections(),
          api.getInvestors()
        ]);
        setConnections(connData); // Store all connections (pending, accepted, rejected)
        setInvestors(invData);
      } catch (e) {
        console.error("Failed to load investors", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleConnect = async (investorId) => {
    try {
      await api.sendConnectionRequest(investorId);
      // Optimistically add to connections
      setConnections(prev => [...prev, {
        id: "temp-" + Date.now(),
        requester_id: "me", // Placeholder
        receiver_id: investorId,
        status: "pending",
        created_at: new Date().toISOString(),
        requester_name: "Me"
      }]);
    } catch (e) {
      alert("Failed to connect: " + e.message);
    }
  };

  const handleMessage = (investor) => {
    if (investor.user_id) {
      navigate("/messages", { state: { recipient: investor.user_id, name: investor.firm_name } });
      return;
    }
  };

  // Helper to check connection status
  const getConnectionStatus = (investorUserId) => {
    const conn = connections.find(c => c.requester_id === investorUserId || c.receiver_id === investorUserId);
    return conn ? conn.status : null;
  };

  return (
    <DashShell>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">My Investors</h1>
          <p className="text-slate-500 text-lg">Manage your cap table and view investor details.</p>
        </div>

        {/* Invested Investors (Cap Table) - Only Accepted */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-black">✓</span>
            Current Investors (Connections)
          </h2>

          {loading ? <div className="text-slate-500">Loading connections...</div> :
            connections.filter(c => c.status === 'accepted').length === 0 ? <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500">No active investor connections yet.</div> :

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connections.filter(c => c.status === 'accepted').map(conn => (
                  <div key={conn.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <img src={`https://ui-avatars.com/api/?name=${conn.requester_name || 'Investor'}&background=random`} alt={conn.requester_name} className="w-12 h-12 rounded-lg object-contain border border-slate-100 p-1" />
                        <div>
                          <h3 className="font-bold text-slate-900">{conn.requester_name || 'Investor'}</h3>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">Investor</span>
                        </div>
                      </div>
                      <span className="text-green-600 font-semibold text-xs px-2 py-1 bg-green-50 rounded">Connected</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4">
                      <p className="text-sm text-slate-500">
                        Connection established on {new Date(conn.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
          }
        </section>

        {/* Potential Matches - All Investors */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-black">MP</span>
              Matched Potential Investors
            </h2>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-800">Browse All</button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                  <th className="px-6 py-4">Investor Name</th>
                  <th className="px-6 py-4">Focus</th>
                  <th className="px-6 py-4">Check Size</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {investors.map(inv => {
                  const status = getConnectionStatus(inv.user_id);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${inv.firm_name}&background=random`} alt={inv.firm_name} className="w-8 h-8 rounded object-contain border border-slate-200" />
                          <span className="font-bold text-slate-900">{inv.firm_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{inv.focus_industries || "General"}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {inv.min_check_size ? `$${inv.min_check_size}k - ` : ""}{inv.max_check_size ? `$${inv.max_check_size}k` : "Negotiable"}
                      </td>
                      <td className="px-6 py-4">
                        {status === 'accepted' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                            Connected
                          </span>
                        )}
                        {status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold border border-yellow-100">
                            Pending
                          </span>
                        )}
                        {!status && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                            Match
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {status === 'accepted' ? (
                          <button
                            onClick={() => handleMessage(inv)}
                            className="px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                          >
                            Message
                          </button>
                        ) : status === 'pending' ? (
                          <button
                            disabled
                            className="px-4 py-2 bg-slate-100 border border-transparent rounded-lg text-sm font-bold text-slate-500 cursor-not-allowed"
                          >
                            Request Sent
                          </button>
                        ) : (
                          <button
                            onClick={() => handleConnect(inv.user_id)}
                            className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
                          >
                            Connect
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {investors.length === 0 && !loading && (
              <div className="p-8 text-center text-slate-500">No investors found to match with at the moment.</div>
            )}
          </div>
        </section>
      </div>
    </DashShell>
  );
}
