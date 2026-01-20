import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Send, MoreHorizontal, Paperclip, ShieldCheck, Sparkles, Loader2, User, Trash2 } from 'lucide-react';
import DashShell from "../components/DashShell.jsx";
import { api } from '../api.js';
import { getToken } from '../auth.js';

const Messages = () => {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Default initial contact state
    const [activeContact, setActiveContact] = useState({
        id: null,
        name: '',
        role: '',
        avatar: <User size={20} />,
        avatarBg: 'bg-slate-500',
        isAi: false
    });

    // Start with empty contacts list
    const [contacts, setContacts] = useState([]);

    // Search State
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const scrollRef = useRef(null);
    const wsRef = useRef(null);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // Helper to format messages
    const formatMessage = (m, currentUserId) => {
        const isMe = m.sender_id === currentUserId;
        const contactId = isMe ? m.receiver_id : m.sender_id;
        return {
            id: m.id || `temp-${String(Date.now())}`,
            sender: m.sender_name || 'Unknown',
            role: m.sender_role || 'Professional',
            content: m.content,
            timestamp: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString(),
            isMe: isMe,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.sender_name || 'User')}`,
            contactId: contactId,
            attachment_url: m.attachment_url,
            attachment_type: m.attachment_type,
            attachment: m.attachment_url ? { url: m.attachment_url, type: m.attachment_type, name: 'Attachment' } : null
        };
    };

    const fetchData = async () => {
        try {
            const user = currentUser || await api.me();
            if (!currentUser) setCurrentUser(user);

            // Fetch Conversations from API
            let conversationContacts = [];
            try {
                const convs = await api.getConversations();
                conversationContacts = convs.map(c => ({
                    id: c.id,
                    name: c.name || 'Unknown User',
                    role: (c.role === 'investor')
                        ? 'Investor'
                        : (c.role === 'startup' ? 'Startup' : 'Professional'),
                    avatar: <User size={20} />,
                    avatarBg: c.role === 'investor' ? 'bg-blue-600' : 'bg-slate-500',
                    isAi: false,
                    lastMessage: c.last_message,
                    lastTime: new Date(c.last_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    lastTimestampRaw: new Date(c.last_time)
                }));
            } catch (err) { console.warn("Could not fetch conversations", err); }

            // Fetch History from API
            let apiMsgs = [];
            try {
                const backendMsgs = await api.getMessageHistory();
                apiMsgs = backendMsgs.map(m => formatMessage(m, user.id));
            } catch (err) { console.warn("Could not fetch messages", err); }

            setMessages(apiMsgs);

            let finalContacts = [...conversationContacts];

            // Handle Navigation State (start chat with specific user)
            if (location.state?.recipient) {
                const recipientId = parseInt(location.state.recipient);
                const recipientName = location.state.name || 'User';
                const existing = conversationContacts.find(c => c.id === recipientId);

                if (existing) {
                    setActiveContact(existing);
                } else {
                    const newContact = {
                        id: recipientId,
                        name: recipientName,
                        role: 'Investor',
                        avatar: <User size={20} />,
                        avatarBg: 'bg-blue-600',
                        isAi: false,
                        isTemp: true
                    };
                    finalContacts = [newContact, ...finalContacts];
                    setActiveContact(newContact);
                }
            } else if (location.state?.conversationStart && !activeContact.id) {
                const targetName = location.state.conversationStart;
                const existing = conversationContacts.find(c => c.name === targetName);
                if (existing) {
                    setActiveContact(existing);
                } else {
                    // Try searching or placeholder
                    const newContact = {
                        id: `temp-${String(Date.now())}`,
                        name: targetName,
                        role: 'Investor',
                        avatar: <User size={20} />,
                        avatarBg: 'bg-blue-600',
                        isAi: false,
                        isTemp: true
                    };
                    finalContacts = [newContact, ...finalContacts];
                    setActiveContact(newContact);
                }
            } else if (!activeContact.id) {
                if (conversationContacts.length > 0) {
                    setActiveContact(conversationContacts[0]);
                } else {
                    setActiveContact({ id: null, name: '', role: '', avatarBg: 'bg-slate-500' });
                }
            }

            finalContacts.sort((a, b) => {
                return (b.lastTimestampRaw || 0) - (a.lastTimestampRaw || 0);
            });

            setContacts(finalContacts);
        } catch (e) {
            console.error("Failed to load data", e);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state]);

    // WebSocket Connection
    useEffect(() => {
        if (!currentUser) return;

        const token = getToken();
        if (!token) return;

        console.log("Connecting WebSocket...");
        const wsUrl = `ws://127.0.0.1:8000/ws/chat?token=${token}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => console.log("✅ WebSocket Connected");

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'new_message') {
                    setMessages(prev => {
                        if (data.temp_id && prev.some(m => m.id === data.temp_id)) {
                            return prev.map(m => m.id === data.temp_id ? formatMessage(data, currentUser.id) : m);
                        }
                        if (prev.some(m => m.id === data.id)) return prev;
                        return [...prev, formatMessage(data, currentUser.id)];
                    });

                    setContacts(prev => {
                        const partnerId = data.sender_id === currentUser.id ? data.receiver_id : data.sender_id;
                        const existingContact = prev.find(c => c.id === partnerId);
                        const lastTime = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const rawTime = new Date(data.timestamp);

                        if (existingContact) {
                            return prev.map(c => c.id === partnerId ? {
                                ...c,
                                lastMessage: data.content,
                                lastTime: lastTime,
                                lastTimestampRaw: rawTime
                            } : c).sort((a, b) => (b.lastTimestampRaw || 0) - (a.lastTimestampRaw || 0));
                        } else {
                            const newC = {
                                id: partnerId,
                                name: data.sender_name || 'New User',
                                role: 'Investor',
                                avatar: <User size={20} />,
                                avatarBg: 'bg-slate-500',
                                isAi: false,
                                lastMessage: data.content,
                                lastTime: lastTime,
                                lastTimestampRaw: rawTime
                            };
                            return [newC, ...prev];
                        }
                    });
                }
            } catch (e) {
                console.error("WS Message Error", e);
            }
        };

        ws.onclose = () => console.log("❌ WebSocket Disconnected");

        return () => {
            ws.close();
        };
    }, [currentUser]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };
    useEffect(scrollToBottom, [messages, activeContact]);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSend = async () => {
        if ((!inputValue.trim() && !selectedFile) || !currentUser || !activeContact.id) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const optimisticId = `temp-${String(Date.now())}`;

        const optimisticMsg = {
            id: optimisticId,
            sender: currentUser.name || 'User',
            role: 'Startup',
            content: inputValue,
            timestamp: timestamp,
            isMe: true,
            avatar: 'https://ui-avatars.com/api/?name=' + (currentUser.name || 'User'),
            contactId: activeContact.id,
            attachment: selectedFile ? {
                url: URL.createObjectURL(selectedFile),
                type: selectedFile.type,
                name: selectedFile.name
            } : null
        };

        setMessages(prev => [...prev, optimisticMsg]);
        const msgToSend = inputValue;
        const fileToSend = selectedFile;
        setInputValue('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsTyping(true);

        let targetId = activeContact.id;

        // WebSocket Send
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && !fileToSend && !String(targetId).startsWith('temp-')) {
            wsRef.current.send(JSON.stringify({
                receiver_id: targetId,
                content: msgToSend,
                temp_id: optimisticId
            }));
            setIsTyping(false);
        } else {
            try {
                await api.sendMessage(targetId, msgToSend, fileToSend);
            } catch (e) {
                alert("Failed to send: " + e.message);
            } finally {
                setIsTyping(false);
            }
        }
    };

    const renderAttachment = (msg) => {
        if (!msg.attachment_url && !msg.attachment) return null;
        const url = msg.attachment_url
            ? (msg.attachment_url.startsWith('http') ? msg.attachment_url : `http://localhost:8000${msg.attachment_url}`)
            : msg.attachment.url;
        const isImage = (msg.attachment_type || msg.attachment?.type)?.startsWith('image');
        const fileName = msg.attachment?.name || 'Attachment';

        if (isImage) {
            return (
                <div className="mb-2 rounded-lg overflow-hidden border border-slate-200">
                    <img src={url} alt="attachment" className="max-w-[200px] max-h-[200px] object-cover" />
                </div>
            );
        }
        return (
            <div className="mb-2 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                <div className="bg-slate-200 p-1.5 rounded text-slate-500"><Paperclip size={16} /></div>
                <div className="flex-1 min-w-0">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:underline truncate block">{fileName}</a>
                    <p className="text-[10px] text-slate-400">Document</p>
                </div>
            </div>
        );
    };

    return (
        <DashShell>
            <div className="h-[calc(100vh-64px)] flex overflow-hidden font-['Plus Jakarta Sans'] bg-white max-w-[1600px] mx-auto rounded-xl shadow-sm border border-slate-200">
                {/* Sidebar */}
                <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Messages</h1>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"><MoreHorizontal size={20} /></button>
                        </div>
                    </div>

                    <div className="p-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search people..."
                                value={userSearchQuery}
                                onChange={async (e) => {
                                    const q = e.target.value;
                                    setUserSearchQuery(q);
                                    if (q.length > 2) {
                                        setIsSearching(true);
                                        try {
                                            const results = await api.searchUsers(q);
                                            setSearchResults(results.map(u => ({
                                                id: u.id,
                                                name: u.name || 'User ' + u.id,
                                                role: u.role === 'investor' ? 'Investor' : 'Professional',
                                                avatar: <User size={20} />,
                                                avatarBg: u.role === 'investor' ? 'bg-blue-600' : 'bg-slate-500',
                                                isAi: false,
                                                lastMessage: 'Start a new conversation',
                                                lastTime: '',
                                                isSearch: true
                                            })));
                                        } catch (err) { console.error(err); }
                                        finally { setIsSearching(false); }
                                    } else { setSearchResults([]); }
                                }}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2 space-y-1">
                        {userSearchQuery.length > 2 && (
                            <div className="mb-4">
                                <h3 className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{isSearching ? 'Searching...' : 'Search Results'}</h3>
                                {searchResults.length === 0 && !isSearching ? <p className="px-3 text-xs text-slate-400">No users found.</p> : searchResults.map(user => (
                                    <div key={`search-${user.id}`} onClick={() => {
                                        const existing = contacts.find(c => String(c.id) === String(user.id));
                                        if (existing) setActiveContact(existing);
                                        else {
                                            const newContact = { ...user, isSearch: false };
                                            setContacts(prev => [newContact, ...prev]);
                                            setActiveContact(newContact);
                                        }
                                        setUserSearchQuery('');
                                        setSearchResults([]);
                                    }} className="p-3 rounded-xl cursor-pointer flex gap-3 hover:bg-slate-50 text-slate-700 mb-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${user.avatarBg}`}>
                                            <span className="font-bold text-xs">{user.name.charAt(0)}</span>
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h3 className="text-sm font-semibold truncate text-slate-900">{user.name}</h3>
                                            <p className="text-xs text-slate-500">{user.role}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="border-b border-slate-100 my-2"></div>
                            </div>
                        )}

                        {contacts.map(contact => (
                            <div key={contact.id} onClick={() => setActiveContact(contact)} className={`p-3 rounded-xl cursor-pointer flex gap-3 transition-all ${String(activeContact.id) === String(contact.id) ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}>
                                <div className="relative shrink-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${contact.avatarBg}`}>
                                        {contact.name ? <span className="font-bold text-xs">{contact.name.charAt(0)}</span> : <User size={18} />}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex items-center justify-between">
                                        <h3 className={`text-sm font-semibold truncate ${String(activeContact.id) === String(contact.id) ? 'text-blue-900' : 'text-slate-900'}`}>{contact.name}</h3>
                                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{contact.lastTime || ''}</span>
                                    </div>
                                    <p className={`text-xs truncate ${String(activeContact.id) === String(contact.id) ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>{contact.lastMessage || contact.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-[#e4e5e7] flex flex-col relative w-full" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat', backgroundSize: '400px' }}>
                    {activeContact.id ? (
                        <>
                            <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm ${activeContact.avatarBg}`}>
                                        {activeContact.name ? <span className="font-bold text-xs">{activeContact.name.charAt(0)}</span> : <User size={18} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-sm font-bold text-slate-900">{activeContact.name}</h2>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">{activeContact.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                    {activeContact.id && (
                                        <button
                                            onClick={async () => {
                                                if (window.confirm("Are you sure you want to delete this conversation?")) {
                                                    try {
                                                        await api.deleteConversation(activeContact.id);
                                                        setContacts(prev => prev.filter(c => String(c.id) !== String(activeContact.id)));
                                                        setMessages(prev => prev.filter(m => String(m.contactId) !== String(activeContact.id)));
                                                        fetchData();
                                                    } catch (e) {
                                                        alert("Failed to delete: " + e.message);
                                                    }
                                                }
                                            }}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Conversation"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"><MoreHorizontal size={18} /></button>
                                </div>
                            </div>

                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-opacity-90 bg-[#e4e5e7]/90">
                                <div className="flex justify-center pb-4"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-200/80 px-3 py-1 rounded shadow-sm">Today</span></div>
                                {messages.filter(msg => String(msg.contactId) === String(activeContact.id)).map((msg) => (
                                    <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                                        <div className={`space-y-1 ${msg.isMe ? 'items-end flex flex-col' : ''}`}>
                                            <div className={`px-3 py-2 text-sm leading-relaxed shadow-sm relative group ${msg.isMe ? 'bg-[#dcf8c6] text-slate-900 rounded-lg rounded-tr-none' : 'bg-white text-slate-900 rounded-lg rounded-tl-none'}`}>
                                                {renderAttachment(msg)}
                                                {msg.content}
                                                <div className={`text-[9px] font-medium text-slate-400 flex justify-end gap-1 items-center mt-1`}>
                                                    {msg.timestamp}
                                                    {msg.isMe && <span className="text-blue-400">✓✓</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-3 bg-[#f0f2f5] border-t border-slate-200 sticky bottom-0 z-20 shadow-lg">
                                {selectedFile && (
                                    <div className="flex items-center gap-2 bg-white p-2 rounded-t-lg border-b border-slate-100 mx-4 sm:mx-14 mb-1">
                                        <div className="bg-blue-50 p-1 rounded text-blue-600"><Paperclip size={14} /></div>
                                        <span className="text-xs truncate flex-1 font-medium">{selectedFile.name}</span>
                                        <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-red-500 p-1">×</button>
                                    </div>
                                )}
                                <div className="max-w-4xl mx-auto flex items-end gap-2 px-2">
                                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mb-1.5 p-2.5 text-slate-500 hover:text-blue-600 hover:bg-white/50 rounded-full transition-all"
                                        title="Attach file"
                                    >
                                        <Paperclip size={22} />
                                    </button>

                                    <div className="flex-1 bg-white rounded-2xl px-4 py-2.5 shadow-sm border border-slate-200 focus-within:border-blue-400 transition-colors flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-transparent border-none focus:outline-none text-sm py-1 placeholder:text-slate-400"
                                        />
                                    </div>

                                    <button
                                        onClick={handleSend}
                                        className={`mb-1 p-3 rounded-full shadow-md transition-all active:scale-95 flex items-center justify-center ${!inputValue.trim() && !selectedFile ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'}`}
                                        disabled={!inputValue.trim() && !selectedFile}
                                    >
                                        <Send size={20} className={inputValue.trim() || selectedFile ? 'translate-x-0.5' : ''} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <Search size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Your Messages</h3>
                            <p className="font-medium text-sm max-w-xs text-center">Select a conversation from the left or search for investors to start a new chat.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashShell>
    );
};
export default Messages;
