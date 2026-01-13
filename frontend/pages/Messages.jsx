import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Send, MoreHorizontal, Paperclip, Smile, ShieldCheck, Sparkles, Loader2, User, Phone, Video } from 'lucide-react';
import { db } from '../services/db';
import { aiService } from '../services/aiService';
import { api } from '../services/api';

const Messages = () => {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Default contact is VentureBot
    const [activeContact, setActiveContact] = useState({
        id: 'venturebot',
        name: 'VentureBot',
        role: 'AI Analyst Co-pilot',
        avatar: <Sparkles size={20} />,
        avatarBg: 'bg-indigo-600',
        isAi: true
    });

    const [contacts, setContacts] = useState([
        {
            id: 'venturebot',
            name: 'VentureBot',
            role: 'AI Analyst Co-pilot',
            avatar: <Sparkles size={20} />,
            avatarBg: 'bg-indigo-600',
            isAi: true
        }
    ]);

    const scrollRef = useRef(null);

    const fetchData = async () => {
        try {
            // Get user if not already set (optimize)
            const user = currentUser || await api.getMe();
            if (!currentUser) setCurrentUser(user);

            db.init();
            const localMsgs = db.getMessages(user.email).map(m => ({
                ...m,
                contactId: 'venturebot'
            })); // VentureBot msgs

            // Fetch Conversations from API (New Efficient Method)
            let conversationContacts = [];
            try {
                const convs = await api.getConversations();
                conversationContacts = convs.map(c => ({
                    id: c.id,
                    name: c.name || 'Unknown User',
                    role: (c.role === 'startup' || (c.id === 'api-' + user.id && false)) // Logic correction
                        ? (c.extra || 'Startup')
                        : (c.role === 'investor' ? 'Investor' : 'Professional'),
                    avatar: <User size={20} />,
                    avatarBg: c.role === 'startup' ? 'bg-emerald-600' : 'bg-slate-500',
                    isAi: false,
                    lastMessage: c.last_message,
                    lastTime: new Date(c.last_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    lastTimestampRaw: new Date(c.last_time)
                }));
            } catch (err) { console.warn("Could not fetch conversations", err); }

            // Fetch Messages (Still needed for chat history view)
            let apiMsgs = [];
            try {
                const backendMsgs = await api.getMessages(user.id);
                apiMsgs = backendMsgs.map(m => {
                    const isMe = m.sender_id === user.id;
                    const contactId = isMe ? m.receiver_id : m.sender_id;
                    return {
                        id: `api-${m.id}`,
                        sender: m.sender_name,
                        role: 'Professional',
                        content: m.content,
                        timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isMe: isMe,
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.sender_name || 'User')}`,
                        contactId: contactId,
                        attachment_url: m.attachment_url,
                        attachment_type: m.attachment_type,
                        attachment: m.attachment_url ? { url: m.attachment_url, type: m.attachment_type, name: 'Attachment' } : null
                    };
                });
            } catch (err) { console.warn("Could not fetch messages", err); }

            // Merge Messages & Deduplicate
            const rawMsgs = [...localMsgs, ...apiMsgs];
            const uniqueMsgsMap = new Map();
            rawMsgs.forEach(msg => {
                uniqueMsgsMap.set(msg.id, msg);
            });
            const allMsgs = Array.from(uniqueMsgsMap.values()).sort((a, b) => {
                // Sort by timestamp if possible, else generic
                if (a.timestamp && b.timestamp) {
                    // Simple string comparison for standard time format might be enough for UI sort,
                    // but ideally we use raw timestamp if available. 
                    // For now, rely on insertion order preservation of Map for stable sort if dates equal.
                    return 0;
                }
                return 0;
            });

            // Setup Contacts
            const vb = {
                id: 'venturebot',
                name: 'VentureBot',
                role: 'AI Analyst Co-pilot',
                avatar: <Sparkles size={20} />,
                avatarBg: 'bg-indigo-600',
                isAi: true,
                lastMessage: localMsgs.length > 0 ? localMsgs[localMsgs.length - 1].content : 'Ready to help.',
                lastTime: localMsgs.length > 0 ? localMsgs[localMsgs.length - 1].timestamp : '',
                lastTimestampRaw: localMsgs.length > 0 ? new Date() : 0
            };

            // Merge VentureBot + Real Conversations
            let finalContacts = [vb, ...conversationContacts];

            // Handle Incoming Navigation (e.g. from Portfolio)
            // Only if we haven't selected a contact yet to avoid overriding user selection on refresh
            if (location.state?.conversationStart && !activeContact.id) {
                const targetName = location.state.conversationStart;
                const existing = conversationContacts.find(c => c.name === targetName);

                if (existing) {
                    setActiveContact(existing);
                } else {
                    // Check if we need to resolve it 
                    // Create temporary to start chat if not found in history
                    const newContact = {
                        id: `temp-${Date.now()}`,
                        name: targetName,
                        role: 'Startup',
                        avatar: <User size={20} />,
                        avatarBg: 'bg-blue-600',
                        isAi: false,
                        isTemp: true
                    };
                    finalContacts = [newContact, ...finalContacts]; // Add to top temporarily
                    setActiveContact(newContact);
                }
            } else if (!activeContact.id || activeContact.id === 'venturebot') { // Only set default if not already set or is default
                // Default to first real conversation if available, else VentureBot
                if (conversationContacts.length > 0 && !location.state?.conversationStart) {
                    setActiveContact(conversationContacts[0]);
                } else if (!activeContact.id) {
                    setActiveContact(vb);
                }
            }

            // Sort final contacts
            finalContacts.sort((a, b) => {
                if (a.id === 'venturebot') return -1;
                if (b.id === 'venturebot') return 1;
                return (b.lastTimestampRaw || 0) - (a.lastTimestampRaw || 0);
            });

            setContacts(finalContacts);
            setMessages(allMsgs); // Keep messages for chat history rendering
        } catch (e) {
            console.error("Failed to load messages", e);
        }
    };

    // Initialize Data & Live Polling
    useEffect(() => {
        fetchData(); // Initial load

        const intervalId = setInterval(() => {
            fetchData();
        }, 8000); // Poll every 8 seconds

        return () => clearInterval(intervalId);
    }, [location.state]);

    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // ... (Scroll effect unchanged)

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSend = async () => {
        if ((!inputValue.trim() && !selectedFile) || !currentUser) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Optimistic UI Update
        const optimisticMsg = {
            id: `temp-${Date.now()}`,
            sender: currentUser.name || 'Investor',
            role: 'Investor',
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
        setInputValue('');
        const fileToSend = selectedFile; // Capture for async
        setSelectedFile(null); // Clear immediately
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsTyping(true);

        if (activeContact.isAi) {
            // AI Logic (Local/Service) - No file support yet for AI
            db.addMessage(currentUser.email, optimisticMsg);

            try {
                const history = messages.filter(m => m.contactId === 'venturebot').map(m => ({
                    role: m.isMe ? 'user' : 'model',
                    content: m.content
                }));
                const responseContent = await aiService.chat(history, inputValue);

                const replyMsg = {
                    id: (Date.now() + 1).toString(),
                    sender: 'VentureBot',
                    role: 'AI',
                    content: responseContent,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isMe: false,
                    avatar: '',
                    contactId: 'venturebot'
                };

                db.addMessage(currentUser.email, replyMsg);
                setMessages(prev => [...prev, replyMsg]);
            } catch (e) {
                console.error(e);
            } finally {
                setIsTyping(false);
            }
        } else {
            // Real Backend Message
            let targetId = activeContact.id;

            // Resolve Temporary ID
            if (activeContact.isTemp || (typeof targetId === 'string' && targetId.startsWith('temp-'))) {
                try {
                    // Try to resolve user by name
                    const users = await api.searchUsers(activeContact.name);
                    const found = users.find(u => u.name === activeContact.name) || users[0];
                    if (found) {
                        targetId = found.id;
                        // Update active contact with real ID
                        setActiveContact(prev => ({ ...prev, id: found.id, isTemp: false }));
                    } else {
                        throw new Error("User not found in directory. Cannot message unless they are registered.");
                    }
                } catch (e) {
                    console.error("Resolution failed", e);
                    alert(e.message);
                    setIsTyping(false);
                    return;
                }
            }

            try {
                // Ensure activeContact.id is integer (it might be if it came from realContacts)
                await api.sendMessage(targetId, inputValue, fileToSend);
                // Refresh list to show new message/new contact at top
                fetchData();
            } catch (e) {
                console.error("Failed to send message", e);
                alert("Failed to send message: " + e.message);
            } finally {
                setIsTyping(false);
            }
        }
    };

    const renderAttachment = (msg) => {
        if (!msg.attachment_url && !msg.attachment) return null;

        const url = msg.attachment_url
            ? (msg.attachment_url.startsWith('http') ? msg.attachment_url : `${api.API_URL || 'http://localhost:8000'}${msg.attachment_url}`)
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
                <div className="bg-slate-200 p-1.5 rounded text-slate-500">
                    <Paperclip size={16} />
                </div>
                <div className="flex-1 min-w-0">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:underline truncate block">
                        {fileName}
                    </a>
                    <p className="text-[10px] text-slate-400">Document</p>
                </div>
            </div>
        );
    };

    return (
        <div className="h-[calc(100vh-64px)] flex overflow-hidden font-['Plus Jakarta Sans'] bg-white">
            {/* Sidebar - Contacts */}
            <div className="w-80 border-r border-slate-200 bg-white flex flex-col">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h1 className="text-xl font-bold text-slate-900">Messages</h1>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2 space-y-1">
                    {contacts.map(contact => (
                        <div
                            key={contact.id}
                            onClick={() => setActiveContact(contact)}
                            className={`p-3 rounded-xl cursor-pointer flex gap-3 transition-all ${activeContact.id === contact.id
                                ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-600'
                                : 'hover:bg-slate-50 text-slate-700'
                                }`}
                        >
                            <div className="relative shrink-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${contact.avatarBg}`}>
                                    {contact.isAi ? <Sparkles size={18} /> :
                                        contact.name ? <span className="font-bold text-xs">{contact.name.charAt(0)}</span> : <User size={18} />}
                                </div>
                                {contact.isAi && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex items-center justify-between">
                                    <h3 className={`text-sm font-semibold truncate ${activeContact.id === contact.id ? 'text-blue-900' : 'text-slate-900'}`}>{contact.name}</h3>
                                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{contact.lastTime || ''}</span>
                                </div>
                                <p className={`text-xs truncate ${activeContact.id === contact.id ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                                    {contact.lastMessage || contact.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-[#e4e5e7] flex flex-col relative w-full" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat', backgroundSize: '400px' }}>
                {/* Chat Header */}
                <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm ${activeContact.avatarBg}`}>
                            {activeContact.isAi ? <Sparkles size={18} /> :
                                activeContact.name ? <span className="font-bold text-xs">{activeContact.name.charAt(0)}</span> : <User size={18} />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold text-slate-900">{activeContact.name}</h2>
                                {activeContact.isAi && <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded">AI</span>}
                            </div>
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                {activeContact.role}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Removed Call Buttons per request */}
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                </div>

                {/* Chat Content */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-opacity-90 bg-[#e4e5e7]/90">
                    <div className="flex justify-center pb-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-200/80 px-3 py-1 rounded shadow-sm">Today</span>
                    </div>

                    {messages.filter(msg => String(msg.contactId) === String(activeContact.id)).map((msg) => (
                        <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                            <div className={`space-y-1 ${msg.isMe ? 'items-end flex flex-col' : ''}`}>
                                <div className={`px-3 py-2 text-sm leading-relaxed shadow-sm relative group ${msg.isMe
                                    ? 'bg-[#dcf8c6] text-slate-900 rounded-lg rounded-tr-none'
                                    : 'bg-white text-slate-900 rounded-lg rounded-tl-none'
                                    }`}>
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

                    {isTyping && (
                        <div className="flex gap-3 max-w-[85%]">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 mt-1 shadow-sm ${activeContact.avatarBg}`}>
                                <Sparkles size={14} />
                            </div>
                            <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-[#f0f2f5] border-t border-slate-200 sticky bottom-0 z-20 shadow-lg">
                    {selectedFile && (
                        <div className="flex items-center gap-2 bg-white p-2 rounded-t-lg border-b border-slate-100 mx-14">
                            <div className="bg-blue-50 p-1 rounded text-blue-600"><Paperclip size={14} /></div>
                            <span className="text-xs truncate flex-1">{selectedFile.name}</span>
                            <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-red-500">×</button>
                        </div>
                    )}
                    <div className="max-w-4xl mx-auto flex items-end gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                        <button onClick={() => fileInputRef.current?.click()} className="mb-2 p-2 text-slate-500 hover:text-slate-700 transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <div className="flex-1 bg-white rounded-lg px-4 py-2 shadow-sm border border-white focus-within:border-white flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent border-none focus:outline-none text-sm py-1 placeholder:text-slate-400"
                            />
                        </div>
                        <button onClick={handleSend} className={`mb-2 p-2 rounded-full shadow-sm transition-all active:scale-95 ${!inputValue.trim() && !selectedFile ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`} disabled={!inputValue.trim() && !selectedFile}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Messages;
