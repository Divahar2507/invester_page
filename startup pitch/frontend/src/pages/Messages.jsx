import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import DashShell from "../components/DashShell.jsx";
import { api } from "../api.js";

export default function Messages() {
    const location = useLocation();
    const [selectedThread, setSelectedThread] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [threads, setThreads] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const [myId, setMyId] = useState(null);

    // Get My ID
    useEffect(() => {
        api.me().then(u => setMyId(u.id)).catch(e => console.error(e));
    }, []);

    // Initial Load & Polling for Threads
    useEffect(() => {
        loadConversations();
        const interval = setInterval(loadConversations, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    // Check for "start conversation" intent from other pages (e.g. Investors list)
    useEffect(() => {
        if (location.state?.recipient && threads.length > 0) {
            const recipientId = parseInt(location.state.recipient);
            const existingThread = threads.find(t => t.id === recipientId);
            if (existingThread) {
                setSelectedThread(existingThread.id);
            } else {
                // Check if specific name passed to mock a new thread entry
                if (location.state.name) {
                    const newTempThread = {
                        id: recipientId,
                        name: location.state.name,
                        avatar: `https://ui-avatars.com/api/?name=${location.state.name}`,
                        last_message: "New Conversation",
                        last_time: new Date().toISOString(),
                        unread: 0,
                        isNew: true
                    };
                    setThreads(prev => {
                        // Avoid duplicate if already added
                        if (prev.find(t => t.id === recipientId)) return prev;
                        return [newTempThread, ...prev];
                    });
                    setSelectedThread(recipientId);
                }
            }
        } else if (location.state?.recipient && threads.length === 0 && location.state.name) {
            // Handle case where threads empty but we want to start one
            const recipientId = parseInt(location.state.recipient);
            const newTempThread = {
                id: recipientId,
                name: location.state.name,
                avatar: `https://ui-avatars.com/api/?name=${location.state.name}`,
                last_message: "New Conversation",
                last_time: new Date().toISOString(),
                unread: 0,
                isNew: true
            };
            setThreads([newTempThread]);
            setSelectedThread(recipientId);
        }
    }, [location.state, threads]);

    // Load Messages when Thread Selected
    useEffect(() => {
        if (selectedThread) {
            loadMessages(selectedThread);
            const interval = setInterval(() => loadMessages(selectedThread), 5000); // Poll active chat faster
            return () => clearInterval(interval);
        }
    }, [selectedThread]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function loadConversations() {
        try {
            const data = await api.getConversations();
            setThreads(data.map(d => ({
                ...d,
                avatar: `https://ui-avatars.com/api/?name=${d.name}&background=random`
            })));
        } catch (e) {
            console.error("Failed to load conversations", e);
        }
    }

    async function loadMessages(partnerId) {
        try {
            const data = await api.getMessages(partnerId);
            // API returns DESC (newest at index 0).
            // We want ASC for chat history (top to bottom).
            setMessages([...data].reverse());
        } catch (e) {
            console.error("Failed to load messages", e);
        }
    }

    async function handleSend() {
        if (!messageInput.trim() || !selectedThread) return;
        setSending(true);
        try {
            await api.sendMessage(selectedThread, messageInput);
            setMessageInput("");
            loadMessages(selectedThread); // Reload immediately
            loadConversations(); // Update list preview
        } catch (e) {
            alert("Failed to send message: " + e.message);
        } finally {
            setSending(false);
        }
    }

    const activeThread = threads.find(t => t.id === selectedThread);

    return (
        <DashShell>
            <div className="flex h-[calc(100vh-100px)] border bg-white rounded-xl overflow-hidden shadow-sm m-6">
                {/* Sidebar List */}
                <div className="w-1/3 border-r flex flex-col">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">Messages</h2>
                        <button onClick={loadConversations} className="text-xs text-blue-600 hover:underline">Refresh</button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {threads.length === 0 && <div className="p-4 text-center text-gray-500 text-sm">No conversations yet.</div>}
                        {threads.map((thread) => (
                            <div
                                key={thread.id}
                                onClick={() => setSelectedThread(thread.id)}
                                className={`flex items-center gap-3 p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${selectedThread === thread.id ? "bg-blue-50" : ""
                                    }`}
                            >
                                <img
                                    src={thread.avatar}
                                    alt={thread.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {thread.name}
                                        </h3>
                                        <span className="text-xs text-gray-500">{new Date(thread.last_time || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">
                                        {thread.last_message}
                                    </p>
                                </div>
                                {thread.unread > 0 && (
                                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {thread.unread}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-slate-50/50">
                    {activeThread ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={activeThread.avatar}
                                        alt="User"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {activeThread.name}
                                        </h3>
                                        <span className="text-xs text-green-500 font-medium">
                                            {activeThread.extra || "Online"}
                                        </span>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <span className="text-xl">⋮</span>
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                                {messages.map((msg) => {
                                    // Determine if message is from Me.
                                    // msg.sender_id is available. 
                                    // activeThread.id is the Partner's ID.
                                    // If msg.sender_id != activeThread.id, it must be me.
                                    const isMe = msg.sender_id !== activeThread.id;

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${isMe
                                                    ? "bg-blue-600 text-white rounded-br-none"
                                                    : "bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm"
                                                    }`}
                                            >
                                                {msg.content}
                                                <div className={`text-[10px] mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 bg-white border-t">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                    className="flex items-center gap-3"
                                >
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                                        disabled={sending}
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !messageInput.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <p className="font-medium text-lg">Select a conversation or start a new one from Investors page</p>
                        </div>
                    )}
                </div>
            </div>
        </DashShell>
    );
}
