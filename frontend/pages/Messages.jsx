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

    // Initialize Data
    useEffect(() => {
        const init = async () => {
            try {
                const user = await api.getMe();
                setCurrentUser(user);

                db.init();
                const localMsgs = db.getMessages(user.email); // VentureBot msgs

                // Fetch Real Connections
                let realContacts = [];
                try {
                    const connections = await api.getMyConnections();
                    realContacts = connections.map(c => ({
                        id: c.requester_id === user.id ? c.receiver_id : c.requester_id,
                        name: c.requester_name === user.name ? c.receiver_name : c.requester_name,
                        role: 'Professional', // heuristic
                        avatar: <User size={20} />,
                        avatarBg: 'bg-emerald-600',
                        isAi: false
                    }));
                } catch (err) { console.warn("Could not fetch connections", err); }

                // Fetch Real Messages
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
                            timestampRaw: new Date(m.timestamp) // for sorting
                        };
                    });
                } catch (err) { console.warn("Could not fetch messages", err); }

                // Combine and Deduplicate Interactions to form Contacts list if missing (optional, but good)
                // ... (Logic to ensure contacts from messages exist in contact list)

                // Merge Messages
                const allMsgs = [...localMsgs, ...apiMsgs].sort((a, b) => {
                    // specific sort logic if needed, localMsgs might strictly rely on insertion order in basic array
                    // but let's just Append apiMsgs for now or interleave if we had precise timestamps for local
                    return 0;
                });

                // Setup Contacts
                const vb = {
                    id: 'venturebot',
                    name: 'VentureBot',
                    role: 'AI Analyst Co-pilot',
                    avatar: <Sparkles size={20} />,
                    avatarBg: 'bg-indigo-600',
                    isAi: true
                };

                setContacts([vb, ...realContacts]);
                setMessages(allMsgs);

                if (!location.state?.conversationStart) {
                    setActiveContact(vb);
                }
            } catch (e) {
                console.error("Failed to load messages", e);
            }
        };
        init();
    }, [location.state]);


    // ... (Scroll effect unchanged)

    const handleSend = async () => {
        if (!inputValue.trim() || !currentUser) return;

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
            contactId: activeContact.id
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setInputValue('');
        setIsTyping(true);

        if (activeContact.isAi) {
            // AI Logic (Local/Service)
            db.addMessage(currentUser.email, optimisticMsg); // Persist local AI chat

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
            try {
                // Ensure activeContact.id is integer (it might be if it came from realContacts)
                await api.sendMessage(activeContact.id, inputValue);
                // Success - the optimistic message is fine to stay, or replace it with real one if needed.
                // Re-fetch or just leave it.
            } catch (e) {
                console.error("Failed to send message", e);
                alert("Failed to send message: " + e.message);
            } finally {
                setIsTyping(false);
            }
        }
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
                                ? 'bg-blue-50 text-blue-900'
                                : 'hover:bg-slate-50 text-slate-700'
                                }`}
                        >
                            <div className="relative shrink-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${contact.avatarBg}`}>
                                    {contact.isAi ? <Sparkles size={18} /> :
                                        contact.name ? <span className="font-bold text-xs">{contact.name.charAt(0)}</span> : <User size={18} />}
                                </div>
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex items-center justify-between">
                                    <h3 className={`text-sm font-semibold truncate ${activeContact.id === contact.id ? 'text-blue-900' : 'text-slate-900'}`}>{contact.name}</h3>
                                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">12:30 PM</span>
                                </div>
                                <p className={`text-xs truncate ${activeContact.id === contact.id ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                                    {contact.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-slate-50 flex flex-col relative w-full">
                {/* Chat Header */}
                <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
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
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                Active now
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <Phone size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <Video size={18} />
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                </div>

                {/* Chat Content */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="flex justify-center pb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Today</span>
                    </div>

                    {messages.filter(msg => msg.contactId === activeContact.id).map((msg) => (
                        <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                            {!msg.isMe && (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 mt-1 shadow-sm ${activeContact.avatarBg}`}>
                                    {activeContact.isAi ? <Sparkles size={14} /> :
                                        activeContact.name ? <span className="font-bold text-[10px]">{activeContact.name.charAt(0)}</span> : <User size={14} />}
                                </div>
                            )}
                            <div className={`space-y-1 ${msg.isMe ? 'items-end flex flex-col' : ''}`}>
                                <div className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.isMe
                                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none'
                                    : 'bg-white text-slate-700 rounded-2xl rounded-tl-none border border-slate-100'
                                    }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[10px] font-medium text-slate-400 px-1">{msg.timestamp}</span>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-3 max-w-[85%]">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 mt-1 shadow-sm ${activeContact.avatarBg}`}>
                                <Sparkles size={14} />
                            </div>
                            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Bar */}
                <div className="p-4 bg-white border-t border-slate-200 sticky bottom-0 z-20">
                    <div className="max-w-4xl mx-auto flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 pl-4 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors p-1"><Paperclip size={18} /></button>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={`Message ${activeContact.name}...`}
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2 placeholder:text-slate-400"
                        />
                        <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!inputValue.trim()}>
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
