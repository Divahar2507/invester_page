import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreHorizontal, Paperclip, Smile, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { db } from '../services/db';
import { aiService } from '../services/aiService';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        db.init();
        setMessages(db.getMessages());
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            sender: 'Alex Morgan',
            role: 'Founder',
            content: inputValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            avatar: 'https://picsum.photos/seed/alex/100/100'
        };

        const newMsgs = db.addMessage(userMsg);
        setMessages([...newMsgs]);
        setInputValue('');

        // If it's the AI analyst contact, generate a response
        setIsTyping(true);
        try {
            const history = messages.map(m => ({
                role: m.isMe ? 'user' : 'model',
                content: m.content
            }));

            const aiResponse = await aiService.chat(history, inputValue);

            const aiMsg = {
                id: (Date.now() + 1).toString(),
                sender: 'VentureBot',
                role: 'AI Analyst',
                content: aiResponse || "I'm sorry, I couldn't process that.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: false,
                avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png'
            };

            const finalMsgs = db.addMessage(aiMsg);
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
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 px-3">
                    <div className="p-4 rounded-2xl cursor-pointer flex gap-4 transition-colors bg-blue-50 border border-blue-100">
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                <Sparkles size={24} />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-bold text-slate-900 truncate">VentureBot</h3>
                                <span className="text-[10px] text-slate-400 font-bold">Live</span>
                            </div>
                            <p className="text-xs truncate text-indigo-600 font-bold">AI Analyst Co-pilot</p>
                        </div>
                    </div>
                    {/* Other mock contacts could go here */}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-slate-50 flex flex-col">
                {/* Chat Header */}
                <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold text-slate-900">VentureBot</h2>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                                    <ShieldCheck size={10} /> Active
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">AI-Powered Deal Intelligence</p>
                        </div>
                    </div>
                </div>

                {/* Chat Content */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 max-w-2xl ${msg.isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                            {!msg.isMe && (
                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mt-1">
                                    <Sparkles size={18} />
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
                            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mt-1">
                                <Loader2 size={18} className="animate-spin" />
                            </div>
                            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-1 shadow-sm">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
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
                            placeholder="Ask VentureBot anything about investments..."
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
