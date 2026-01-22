import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Search, Filter, Loader2, Briefcase, Linkedin, Mail, Check, Clock, UserPlus } from 'lucide-react';

const BrowseInvestors = () => {
    const [investors, setInvestors] = useState([]);
    const [connections, setConnections] = useState({}); // userId -> status
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [investorsData, connectionsData] = await Promise.all([
                api.getAllInvestors(),
                api.getMyConnections()
            ]);

            setInvestors(investorsData);

            // Map connections for easy lookup: receiver_id -> status
            const connMap = {};
            connectionsData.forEach(conn => {
                // If I am the requester, the other is receiver_id
                // If I am the receiver, the other is requester_id (but requests I receive usually aren't "pending" in a way that blocks me from connecting unless we are already connected? Actually if connected, it matters.)
                // Let's assume for "Browse Investors", we care about:
                // 1. Have I sent a request? (pending)
                // 2. Are we connected? (accepted)

                // For simplicity, regardless of who asked, if we are related, store status.
                // The `getMyConnections` returns `requester_id` and `receiver_id`.
                // We need to know which one is the "other" person.
                // But `getMyConnections` doesn't explicitly tell me "my" ID unless I decode token or make another call.
                // However, the backend `getMyConnections` returns a list where I am one of the parties.
                // Actually, the backend `getMyConnections` logic I read (lines 154-180 in connections.py) returns objects with `requester_name` mapped to the OTHER person, but `requester_id` and `receiver_id` are redundant raw fields.
                // To properly map to the investor user_id, I need to know which ID is the investor.
                // Since I am browsing investors, the `inv.user_id` is the one I want to check against.
                // So I will store both requester_id and receiver_id in the map pointing to status.

                connMap[conn.requester_id] = conn.status;
                connMap[conn.receiver_id] = conn.status;
            });
            setConnections(connMap);

        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (investorUserId) => {
        try {
            await api.sendConnectionRequest(investorUserId);
            // Update local state to 'pending'
            setConnections(prev => ({
                ...prev,
                [investorUserId]: 'pending'
            }));
        } catch (error) {
            console.error("Failed to send connection request", error);
            alert("Failed to send connection request: " + error.message);
        }
    };

    const filteredInvestors = investors.filter(inv => {
        const search = searchTerm.toLowerCase();
        return (
            (inv.focus_industries && inv.focus_industries.toLowerCase().includes(search)) ||
            (inv.user_id && inv.user_id.toString().includes(search))
        );
    });

    const getConnectionStatus = (userId) => {
        return connections[userId] || 'none';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto font-['Plus Jakarta Sans']">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Browse Investors</h1>
                    <p className="text-slate-500 mt-1">Find the right partners for your journey.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by focus or ID..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredInvestors.map((inv) => {
                    const status = getConnectionStatus(inv.user_id);
                    const isPending = status === 'pending';
                    const isConnected = status === 'accepted' || status === 'connected'; // 'accepted' is standard from backend

                    return (
                        <div key={inv.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                                    {inv.user_id}
                                </div>
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {inv.investor_type || 'Angel'}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                                {inv.firm_name ? inv.firm_name : `Investor #${inv.id}`}
                            </h3>
                            <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
                                <Briefcase size={14} />
                                <span>{inv.focus_industries || 'General Tech'}</span>
                            </div>

                            <p className="text-sm text-slate-600 line-clamp-3 mb-6 min-h-[60px]">
                                {inv.bio || "No bio available."}
                            </p>

                            <div className="pt-4 border-t border-slate-50 flex gap-2">
                                {isConnected ? (
                                    <button disabled className="flex-1 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium flex items-center justify-center gap-2 cursor-default">
                                        <Check size={16} />
                                        Connected
                                    </button>
                                ) : isPending ? (
                                    <button disabled className="flex-1 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-sm font-medium flex items-center justify-center gap-2 cursor-default">
                                        <Clock size={16} />
                                        Pending
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleConnect(inv.user_id)}
                                        className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition flex items-center justify-center gap-2"
                                    >
                                        <UserPlus size={16} />
                                        Connect
                                    </button>
                                )}

                                <button className="p-2 border border-slate-200 text-slate-400 rounded-lg hover:text-blue-600 hover:border-blue-200 transition">
                                    <Mail size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredInvestors.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-slate-400 text-lg">No investors found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default BrowseInvestors;
