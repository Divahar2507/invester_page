import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Send, MoreHorizontal, Paperclip, Smile, ShieldCheck, Sparkles, Loader2, User } from 'lucide-react';
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
        avatar: <Sparkles size={24} />,
        avatarBg: 'bg-indigo-600',
        isAi: true
    });

    const [contacts, setContacts] = useState([
        {
            id: 'venturebot',
            name: 'VentureBot',
            role: 'AI Analyst Co-pilot',
            avatar: <Sparkles size={24} />,
            avatarBg: 'bg-indigo-600',
            isAi: true
        }
    ]);

    const scrollRef = useRef(null);

    // Initialize DB and User
    useEffect(() => {
        const init = async () => {
            try {
                const user = await api.getMe();
                setCurrentUser(user);

                db.init();
                // Load segregated messages
                const userMsgs = db.getMessages(user.email);

                // Load segregated contacts (Local)
                let localContacts = db.getContacts(user.email);

                // Fetch Real Connections from API
                let realContacts = [];
                try {
                    const connections = await api.getMyConnections();
                    realContacts = connections.map(c => ({
                        // The ID should be the OTHER user's ID to match message filtering if we used that.
                        // But current message filtering uses 'contactId' which matches 'activeContact.id'.
                        // Local storage contacts use `startup-{timestamp}` or specific IDs.
                        // We should probably use stable IDs. 
                        // Connection object has `requester_id` and `receiver_id`. 
                        // We need the partner ID. 
                        // The backend 'get_my_connections' logic I wrote sets `requester_id` as the original requester.
                        // Wait, I need to know which one is the Partner.
                        // My backend logic for `get_my_connections` returned `requester_name` as the Partner Name.
                        // And I didn't return a clear "partner_id". 
                        // Let's deduce partner_id: if c.requester_id === user.id ? c.receiver_id : c.requester_id.
                        id: c.requester_id === user.id ? c.receiver_id : c.requester_id,
                        name: c.requester_name,
                        role: c.requester_role === 'investor' ? 'Investor' : 'Founder',
                        avatar: <User size={24} />,
                        avatarBg: 'bg-emerald-600',
                        isAi: false
                    }));
                } catch (err) {
                    console.warn("Could not fetch real connections", err);
                }

                // Merge: VentureBot + Real Connections + Local Contacts (deduplicated)
                const vb = {
                    id: 'venturebot',
                    name: 'VentureBot',
                    role: 'AI Analyst Co-pilot',
                    avatar: <Sparkles size={24} />,
                    avatarBg: 'bg-indigo-600',
                    isAi: true
                };

                const allContacts = [vb, ...realContacts];

                // Add local contacts only if not already present by name
                localContacts.forEach(lc => {
                    if (!allContacts.find(ac => ac.name === lc.name) && lc.id !== 'venturebot') {
                        allContacts.push(lc);
                    }
                });

                setContacts(allContacts);
                setActiveContact(allContacts[0]);
                setMessages(userMsgs);
            } catch (e) {
                console.error("Failed to load user for messages", e);
            }
        };
        init();
    }, []);

    // Handle incoming startup context
    useEffect(() => {
        if (!currentUser) return; // Wait for user to be loaded

        if (location.state?.conversationStart) {
            const startupName = location.state.conversationStart;

            // Check if contact already exists in CURRENT list
            const existing = contacts.find(c => c.name === startupName);
            if (existing) {
                setActiveContact(existing);
            } else {
                const newContact = {
                    id: `startup-${Date.now()}`,
                    name: startupName,
                    role: 'Founder',
                    avatar: <User size={24} />, // Note: Icons might not persist well in JSON. We might need a serializer.
                    // For now, let's store a string type and render dynamically, 
                    // or just accept that re-rendering from local storage might lose the React Component.
                    // Better approach: Store 'type': 'ai' | 'user' and render icon based on that.
                    avatarType: 'user',
                    avatarBg: 'bg-blue-600',
                    isAi: false
                };

                const updatedContacts = db.addContact(currentUser.email, newContact);
                setContacts(updatedContacts);
                setActiveContact(newContact);
            }
        }
    }, [location.state, currentUser]); // Removed 'contacts' dependency to avoid loops, rely on updated from db

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim() || !currentUser) return;

        const userMsg = {
            id: Date.now().toString(),
            sender: currentUser.name || 'Investor',
            role: 'Investor',
            content: inputValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            avatar: 'https://ui-avatars.com/api/?name=' + (currentUser.name || 'User'),
            contactId: activeContact.id // track who this msg is for (in a real app)
        };

        // For this mock DB, let's just push to one array
        const newMsgs = db.addMessage(currentUser.email, userMsg);
        setMessages([...newMsgs]); // In real app, filter by contactId
        setInputValue('');

        setIsTyping(true);

        // Response logic
        try {
            let responseContent;
            let senderName = activeContact.name;
            let senderRole = activeContact.role;

            if (activeContact.isAi) {
                // Use AI Service
                const history = messages.map(m => ({
                    role: m.isMe ? 'user' : 'model',
                    content: m.content
                }));
                responseContent = await aiService.chat(history, inputValue);
            } else {
                // Simulate Startup Founder Response
                // Simple delay for "human" feel
                await new Promise(r => setTimeout(r, 2000));

                // Simple mock logic for responses
                const lowerInput = inputValue.toLowerCase();
                if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
                    responseContent = `Hi Alex, thanks for reaching out! Great to connect.`;
                } else if (lowerInput.includes('update') || lowerInput.includes('progress')) {
                    responseContent = `Things are going great at ${activeContact.name}. We just closed a new partnership deal. I'll send over the monthly update shortly.`;
                } else if (lowerInput.includes('meeting') || lowerInput.includes('call')) {
                    responseContent = "I'd love to hop on a call. How does next Tuesday look for you?";
                } else {
                    responseContent = "Received, thanks! I'll get back to you on this asap.";
                }
            }

            const replyMsg = {
                id: (Date.now() + 1).toString(),
                sender: senderName,
                role: senderRole,
                content: responseContent || "I'm sorry, I couldn't process that.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: false,
                avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png', // Generic avatar for now
                contactId: activeContact.id
            };

            const finalMsgs = db.addMessage(currentUser.email, replyMsg); // Add to user's storage
            setMessages([...finalMsgs]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] flex overflow-hidden">
            {/* Sidebar - Contacts */}
            <div className="w-96 border-r border-slate-200 bg-white flex flex-col">
                <div className="p-6 pb-2">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
                        <button className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 px-3">
                    {contacts.map(contact => (
                        <div
                            key={contact.id}
                            onClick={() => setActiveContact(contact)}
                            className={`p-4 rounded-2xl cursor-pointer flex gap-4 transition-all mb-2 ${activeContact.id === contact.id
                                ? 'bg-blue-50 border border-blue-100 shadow-sm'
                                : 'hover:bg-slate-50 border border-transparent'
                                }`}
                        >
                            <div className="relative shrink-0">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${contact.avatarBg}`}>
                                    {contact.isAi ? <Sparkles size={24} /> : <User size={24} />}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className={`text-sm font-bold truncate ${activeContact.id === contact.id ? 'text-blue-900' : 'text-slate-900'}`}>{contact.name}</h3>
                                    <span className="text-[10px] text-slate-400 font-bold">Live</span>
                                </div>
                                <p className={`text-xs truncate font-bold ${activeContact.id === contact.id ? 'text-blue-600' : 'text-slate-500'}`}>{contact.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-slate-50 flex flex-col">
                {/* Chat Header */}
                <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${activeContact.avatarBg}`}>
                            {activeContact.isAi ? <Sparkles size={24} /> : <User size={24} />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold text-slate-900">{activeContact.name}</h2>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                                    <ShieldCheck size={10} /> Active
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">{activeContact.role}</p>
                        </div>
                    </div>
                </div>

                {/* Chat Content */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
                    {messages.filter(msg => msg.contactId === activeContact.id).map((msg) => (
                        <div key={msg.id} className={`flex gap-4 max-w-2xl ${msg.isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                            {!msg.isMe && (
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white mt-1 ${activeContact.avatarBg}`}>
                                    {activeContact.isAi ? <Sparkles size={18} /> : <User size={18} />}
                                </div>
                            )}
                            <div className="space-y-1">
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                    }`}>
                                    {msg.content}
                                </div>
                                <p className={`text-[10px] font-bold text-slate-400 ${msg.isMe ? 'text-right' : ''}`}>{msg.timestamp}</p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-4">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white mt-1 ${activeContact.avatarBg}`}>
                                <Loader2 size={18} className="animate-spin" />
                            </div>
                            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-1 shadow-sm">
                                <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${activeContact.isAi ? 'bg-indigo-400' : 'bg-blue-400'}`}></div>
                                <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s] ${activeContact.isAi ? 'bg-indigo-400' : 'bg-blue-400'}`}></div>
                                <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s] ${activeContact.isAi ? 'bg-indigo-400' : 'bg-blue-400'}`}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Bar */}
                <div className="p-6 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-2 px-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Paperclip size={20} /></button>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={`Message ${activeContact.name}...`}
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2"
                        />
                        <button onClick={handleSend} className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all active:scale-95">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
