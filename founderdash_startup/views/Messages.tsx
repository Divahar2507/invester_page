
import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Phone, Video, Send, CheckCheck, Paperclip, Smile } from 'lucide-react';
import { User, Conversation, ChatMessage } from '../types';

interface MessagesProps {
  user: User;
  conversations: Conversation[];
  onSendMessage: (conversationId: string, text: string) => void;
  activeConversationId?: string;
}

const Messages: React.FC<MessagesProps> = ({ user, conversations, onSendMessage, activeConversationId }) => {
  const [selectedConvId, setSelectedConvId] = useState<string | undefined>(activeConversationId || conversations[0]?.id);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeConversationId) {
      setSelectedConvId(activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedConvId, conversations]);

  const selectedConv = conversations.find(c => c.id === selectedConvId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvId) return;
    onSendMessage(selectedConvId, inputText);
    setInputText('');
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Sidebar - Chat List */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-white">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Messages</h2>
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            <MoreVertical size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConvId(conv.id)}
              className={`w-full flex items-center gap-4 p-4 transition-colors ${
                selectedConvId === conv.id ? 'bg-blue-50 border-r-4 border-blue-600' : 'hover:bg-slate-50'
              }`}
            >
              <div className="relative shrink-0">
                <img src={conv.participantAvatar} className="w-12 h-12 rounded-full border border-slate-100" alt="" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{conv.participantName}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{conv.lastTimestamp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                  {conv.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col bg-[#f0f2f5] relative">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <img src={selectedConv.participantAvatar} className="w-10 h-10 rounded-full" alt="" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-none">{selectedConv.participantName}</h3>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-1">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"><Phone size={20} /></button>
                <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"><Video size={20} /></button>
                <div className="w-px h-6 bg-slate-100 mx-2"></div>
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
              style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundOpacity: 0.1 }}
            >
              {selectedConv.messages.map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm relative group ${
                      isMe 
                        ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-none' 
                        : 'bg-white text-slate-800 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed pr-8">{msg.text}</p>
                      <div className="flex items-center gap-1 absolute bottom-1 right-2">
                        <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                        {isMe && <CheckCheck size={12} className="text-blue-400" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Footer */}
            <div className="p-4 bg-white">
              <form onSubmit={handleSend} className="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl">
                <button type="button" className="p-2 text-slate-400 hover:text-slate-600"><Smile size={24} /></button>
                <button type="button" className="p-2 text-slate-400 hover:text-slate-600"><Paperclip size={24} /></button>
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 bg-transparent border-none outline-none text-sm p-2"
                />
                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  className={`p-3 rounded-xl transition-all ${inputText.trim() ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400'}`}
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <Send size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Nexus Connection Hub</h3>
            <p className="text-slate-500 max-w-sm">Connect with partners, agencies, and freelancers instantly. Select a chat to start negotiating your next lead.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
