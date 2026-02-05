
import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Send, CheckCheck, Paperclip, Smile, Video, Star, Handshake } from 'lucide-react';
import { User, Conversation, ChatMessage, UserRole } from '../types';

interface MessagesProps {
  user: User;
  conversations: Conversation[];
  onSendMessage: (conversationId: string, text: string) => void;
  onScheduleInterview: (participant: { name: string; avatar: string }) => void;
  onMakeCollaboration: (participant: { name: string; avatar: string; id: string; role?: UserRole }) => void;
  activeConversationId?: string;
}

const Messages: React.FC<MessagesProps> = ({ user, conversations, onSendMessage, onScheduleInterview, onMakeCollaboration, activeConversationId }) => {
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

  const isStartup = user.role === UserRole.STARTUP;

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
              <div className="relative">
                <img src={conv.participantAvatar} className="w-12 h-12 rounded-xl object-cover" alt="" />
                {conv.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {conv.unreadCount}
                  </div>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{conv.participantName}</h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{conv.lastTimestamp}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                {conv.isHired && (
                  <span className="text-[8px] font-black bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded uppercase mt-1 inline-block tracking-tighter">Collaborating</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedConv ? (
        <div className="flex-1 flex flex-col bg-slate-50/30">
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={selectedConv.participantAvatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{selectedConv.participantName}</h3>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Now</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isStartup && !selectedConv.isHired && (
                <>
                  <button 
                    onClick={() => onMakeCollaboration({ name: selectedConv.participantName, avatar: selectedConv.participantAvatar, id: selectedConv.id, role: selectedConv.participantRole })}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                  >
                    <Handshake size={16} />
                    Make Collaboration
                  </button>
                  <button 
                    onClick={() => onScheduleInterview({ name: selectedConv.participantName, avatar: selectedConv.participantAvatar })}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    <Video size={16} />
                    Schedule
                  </button>
                </>
              )}
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                <Star size={20} />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {selectedConv.messages.map((msg) => {
              const isMe = msg.senderId === user.id;
              const isSystem = msg.senderId === 'system';
              
              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-4">
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                      {msg.text}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm ${
                      isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{msg.timestamp}</span>
                      {isMe && <CheckCheck size={12} className="text-blue-500" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input */}
          <div className="p-6 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex items-center gap-3">
              <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                <Paperclip size={20} />
              </button>
              <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                <Smile size={20} />
              </button>
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message here..." 
                className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:shadow-none"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30 text-center p-12">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-sm border border-slate-100 mb-6">
            <Send size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Your Inbox</h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm">Select a conversation from the left to start collaborating with talent and partners.</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
