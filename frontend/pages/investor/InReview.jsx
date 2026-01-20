import * as React from 'react';
import { Search, ChevronRight, MessageCircle, MoreVertical, Star, XCircle, Loader2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const InReview = () => {
    const [startups, setStartups] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            console.log("InReview: Starting data load...");

            // Fetch User
            let me = null;
            try {
                me = await api.getMe();
                console.log("InReview: Me:", me);
            } catch (err) {
                console.error("InReview: Failed to fetch Me", err);
                // If we can't get 'me', we can't compute realId for connections properly, but let's proceed
            }

            // Fetch Requests
            let requests = [];
            try {
                requests = await api.getIncomingRequests();
                console.log("InReview: Requests:", requests);
            } catch (err) {
                console.error("InReview: Failed to fetch Requests", err);
            }

            // Fetch Connections
            let connections = [];
            try {
                connections = await api.getConnections();
                console.log("InReview: Connections:", connections);
            } catch (err) {
                console.error("InReview: Failed to fetch Connections", err);
            }

            // Fetch Watchlist
            let watchlist = [];
            try {
                watchlist = await api.getWatchlist();
                console.log("InReview: Watchlist:", watchlist);
            } catch (err) {
                console.error("InReview: Failed to fetch Watchlist", err);
            }

            // Map incoming requests to pipeline items
            const requestItems = requests.map(req => ({
                id: `req-${req.id}`,
                realId: req.requester_id,
                name: req.requester_name || "Startup Request",
                stage: "Seed",
                description: "Incoming connection request",
                logo: (req.requester_name || 'S').charAt(0),
                reviewStatus: 'Pending Request',
                reviewProgress: 10,
                type: 'request'
            }));

            // Map active connections to pipeline items
            const connectionItems = connections.map(conn => {
                // Safely determine realId
                let rId = conn.receiver_id;
                if (me && conn.receiver_id === me.id) {
                    rId = conn.requester_id;
                } else if (!me) {
                    // Fallback heuristics if 'me' failed? 
                    // We might not know who is the 'other' person if we don't know who 'we' are.
                    // But usually getConnections returns 'requester_name' as the *other* person's name 
                    // (if my backend logic was: "name = other_user...").
                    // Let's assume the backend already standardized `requester_name` as the display name.
                }

                return {
                    id: `conn-${conn.id}`,
                    realId: rId,
                    name: conn.requester_name || "Connected Startup", // This field from backend seems to hold the partner name based on my previous read of connections.py
                    stage: "Series A",
                    description: "Connected Portfolio/Pipeline",
                    logo: (conn.requester_name || 'C').charAt(0),
                    reviewStatus: 'In Discussion',
                    reviewProgress: 40,
                    type: 'connection'
                };
            });

            // Map watchlist items to pipeline items
            const watchlistItems = watchlist.map(item => ({
                id: `watch-${item.id}`,
                realId: item.startup_id,
                name: item.startup_name || "Watched Startup",
                stage: item.stage || "Early",
                description: "Bookmarked for Review",
                logo: (item.startup_name || 'W').charAt(0),
                reviewStatus: 'In Review',
                reviewProgress: 25,
                type: 'watchlist',
                pitchId: item.pitch_id
            }));

            const allItems = [...requestItems, ...connectionItems, ...watchlistItems];
            console.log("InReview: Combined Items:", allItems);
            setStartups(allItems);

        } catch (e) {
            console.error("InReview: Critical Error in loadData", e);
            setStartups([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white font-['Plus Jakarta Sans']">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="animate-spin text-blue-600" size={60} strokeWidth={3} />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] animate-pulse">Syncing Active Pipelines...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 font-['Plus Jakarta Sans']">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Due Diligence</h1>
                    <p className="text-slate-500 mt-1 text-base">Manage startups currently under review and screening.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-all">
                    <Star size={16} className="text-blue-500" />
                    Export Report
                </button>
            </div>

            {/* Pipeline Aggregates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Under Review', value: startups.length.toString(), color: 'blue', desc: 'Active diligence cycles' },
                    { label: 'Awaiting Info', value: '2', color: 'orange', desc: 'Pending founder response' },
                    { label: 'Avg. Time', value: '8.4d', color: 'indigo', desc: 'Average decision time' }
                ].map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full group pb-8">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{card.value}</p>
                        </div>
                        <p className="text-xs font-medium text-slate-400 mt-4">{card.desc}</p>
                    </div>
                ))}
            </div>

            {/* Pipeline Table Module */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4">
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search pipeline..."
                            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button className="px-6 py-1.5 text-xs font-bold bg-white text-slate-900 rounded-lg shadow-sm transition-all">Active</button>
                        <button className="px-6 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 rounded-lg transition-all">Archive</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Startup</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {startups.map((startup) => (
                                <tr key={startup.id} className="hover:bg-slate-50 transition-all duration-200">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-600 text-lg">
                                                {startup.logo}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-slate-900 text-base">{startup.name}</h3>
                                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md border border-blue-100">{startup.stage}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-xs">{startup.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-48 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-blue-600">{startup.reviewProgress}% Complete</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${startup.reviewProgress}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            <span className="text-xs font-semibold text-slate-700">{startup.reviewStatus}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3">
                                            {startup.type === 'request' ? (
                                                <>
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const connId = startup.id.split('-')[1];
                                                                await api.respondToRequest(connId, 'accept');
                                                                loadData();
                                                            } catch (e) { alert("Failed: " + e.message); }
                                                        }}
                                                        className="px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-sm">
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (!window.confirm("Reject connection request?")) return;
                                                            try {
                                                                const connId = startup.id.split('-')[1];
                                                                await api.respondToRequest(connId, 'reject');
                                                                loadData();
                                                            } catch (e) { alert("Failed: " + e.message); }
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Reject Request">
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {startup.pitchId ? (
                                                        <Link to={`/pitch/${startup.pitchId}`} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all shadow-sm">
                                                            Review
                                                        </Link>
                                                    ) : (
                                                        startup.type !== 'connection' && (
                                                            <button className="px-4 py-2 bg-slate-200 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed">
                                                                No Pitch
                                                            </button>
                                                        )
                                                    )}

                                                    {startup.type === 'watchlist' && (
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    await api.removeFromWatchlist(startup.realId);
                                                                    loadData();
                                                                } catch (e) { alert("Failed: " + e.message); }
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                            title="Remove from Watchlist"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InReview;
