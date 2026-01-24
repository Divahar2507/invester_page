
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Phone, Video, Minus, CheckCheck, Smile, Paperclip } from 'lucide-react';
import { User, ChatMessage } from '../types';

interface ChatOverlayProps {
  recipient: { id: string; name: string; participantAvatar?: string };
  onClose: () => void;
  currentUser: User;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ recipient, onClose, currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: recipient.id, text: `Hi ${currentUser.name}! I saw your request. How can we help?`, timestamp: '10:30 AM' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="fixed bottom-0 right-8 w-96 z-50 animate-in slide-in-from-bottom-10">
      <div className="bg-white rounded-t-2xl shadow-2xl border border-slate-200 flex flex-col h-[500px]">
        {/* WhatsApp Style Header */}
        <div className="p-4 bg-[#075e54] text-white rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={recipient.participantAvatar || `https://picsum.photos/seed/${recipient.id}/40/40`} className="w-10 h-10 rounded-full border border-white/20" alt="" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#075e54] rounded-full"></div>
            </div>
            <div>
              <h4 className="font-bold text-sm leading-none">{recipient.name}</h4>
              <p className="text-[10px] opacity-80 mt-1 uppercase tracking-widest font-bold">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-white/10 rounded"><Phone size={18} /></button>
            <button className="p-1 hover:bg-white/10 rounded"><Video size={18} /></button>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded"><X size={18} /></button>
          </div>
        </div>

        {/* WhatsApp Bubbles Area */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5]"
          style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundOpacity: 0.1 }}
        >
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2 rounded-lg shadow-sm relative ${
                  isMe ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'
                }`}>
                  <p className="text-sm text-slate-800 pr-8">{msg.text}</p>
                  <div className="flex items-center gap-1 absolute bottom-1 right-1">
                    <span className="text-[8px] text-slate-400">{msg.timestamp}</span>
                    {isMe && <CheckCheck size={10} className="text-blue-400" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* WhatsApp Style Footer */}
        <div className="p-3 bg-white flex items-center gap-2">
          <button className="text-slate-400"><Smile size={20} /></button>
          <button className="text-slate-400"><Paperclip size={20} /></button>
          <form onSubmit={handleSend} className="flex-1 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message"
              className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm outline-none"
            />
            <button 
              type="submit" 
              className={`p-2 rounded-full transition-colors ${input.trim() ? 'bg-[#128c7e] text-white' : 'text-slate-300'}`}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatOverlay;
