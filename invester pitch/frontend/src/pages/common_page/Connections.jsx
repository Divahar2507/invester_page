import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, UserPlus, Clock, Check, MessageCircle, X, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Connections = () => {
    const navigate = useNavigate();
    const [connections, setConnections] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [myConns, requests] = await Promise.all([
                api.getMyConnections(),
                api.getIncomingConnectionRequests()
            ]);
            setConnections(myConns);
            setIncomingRequests(requests);
        } catch (error) {
            console.error("Failed to fetch connections", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (connectionId, action) => {
        try {
            await api.respondToConnectionRequest(connectionId, action);
            if (action === 'accept') {
                // Refresh both lists
                fetchData();
            } else {
                setIncomingRequests(prev => prev.filter(r => r.id !== connectionId));
            }
        } catch (error) {
            console.error(error);
            alert("Action failed");
        }
    };

    const filteredConnections = connections.filter(conn =>
        conn.requester_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-slate-500 font-medium">Syncing your network...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 font-['Plus Jakarta Sans'] animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Network</h1>
                    <p className="text-slate-500 mt-1">Manage your professional connections and requests.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search connections..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Pending Requests Section */}
            {incomingRequests.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        Pending Invitations
                        <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">{incomingRequests.length}</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {incomingRequests.map((req) => (
                            <div key={req.id} className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full"></div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                        {req.requester_name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-slate-900 truncate">{req.requester_name}</h4>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">{req.requester_role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleRespond(req.id, 'accept')}
                                        className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleRespond(req.id, 'reject')}
                                        className="flex-1 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors"
                                    >
                                        Ignore
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Connected Section */}
            <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    All Connections ({connections.filter(c => c.status === 'accepted').length})
                </h2>

                {filteredConnections.filter(c => c.status === 'accepted').length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="text-slate-300" size={32} />
                        </div>
                        <h3 className="font-bold text-slate-900">Build your network</h3>
                        <p className="text-slate-400 text-sm mt-1 mb-6">Discover {api.role === 'startup' ? 'investors' : 'startups'} to connect with.</p>
                        <button
                            onClick={() => navigate(api.role === 'startup' ? '/browse-investors' : '/browse')}
                            className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg"
                        >
                            Start Browsing
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredConnections.filter(c => c.status === 'accepted').map((conn) => (
                            <div key={conn.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-bold text-xl border border-slate-50 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-sm">
                                            {conn.requester_name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{conn.requester_name}</h4>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">{conn.requester_role}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-slate-50">
                                    <button
                                        onClick={() => navigate('/messages', { state: { partnerId: conn.requester_id === api.userId ? conn.receiver_id : conn.requester_id } })}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all"
                                    >
                                        <MessageCircle size={14} />
                                        Message
                                    </button>
                                    <button className="px-3 py-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-red-500 hover:border-red-100 transition-colors shadow-sm">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sent / Pending Requests Section (Optional) */}
            {connections.filter(c => c.status === 'pending' && c.requester_id === api.userId).length > 0 && (
                <div className="pt-8 border-t border-slate-100">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Sent Requests</h2>
                    <div className="flex flex-wrap gap-4">
                        {connections.filter(c => c.status === 'pending' && c.requester_id === api.userId).map(c => (
                            <div key={c.id} className="bg-slate-50 px-4 py-2 rounded-full border border-slate-100 flex items-center gap-3">
                                <Clock size={14} className="text-amber-500" />
                                <span className="text-sm font-bold text-slate-600">{c.requester_name}</span>
                                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-slate-400 font-black uppercase">Pending</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Connections;
