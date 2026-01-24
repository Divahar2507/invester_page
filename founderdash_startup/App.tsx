
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import TalentPool from './views/TalentPool';
import ProjectBoard from './views/ProjectBoard';
import Messages from './views/Messages';
import Login from './views/Login';
import ChatOverlay from './components/ChatOverlay';
import ProjectModal from './components/ProjectModal';
import { AppView, User, UserRole, Project, ProjectType, Conversation, ChatMessage } from './types';

const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', title: 'React Native Expert Needed', description: 'Build a cross-platform mobile app for our fintech platform.', budget: '₹3.5L - ₹5L', postedBy: 'FinFlow', postedById: 'u1', category: 'Freelance', type: 'execution', status: 'Open', skills: ['React Native', 'TypeScript'] },
  { id: 'p2', title: 'Summer Internship Cohort', description: 'Looking for 10 engineering students for a 3-month product sprint.', budget: 'Stipend: ₹15k/mo', postedBy: 'Nexus AI', postedById: 'u2', category: 'Internship', type: 'recruitment', status: 'Open', skills: ['Python', 'Cloud'] },
  { id: 'p3', title: 'Senior Backend Developer', description: 'Full-time role for scaling our infrastructure.', budget: '₹24L - ₹32L /yr', postedBy: 'SecureVault', postedById: 'u3', category: 'Full-time', type: 'recruitment', status: 'Open', skills: ['Go', 'Kubernetes'] },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'u1',
    participantName: 'Sarah Chen (Recruiter)',
    participantAvatar: 'https://picsum.photos/seed/u1/100/100',
    lastMessage: 'I have shared the candidate list.',
    lastTimestamp: '10:45 AM',
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'u1', text: 'Hi Alex! I saw your post for a React Native developer.', timestamp: '10:30 AM' },
      { id: 'm2', senderId: 'u1', text: 'I have shared the candidate list.', timestamp: '10:45 AM' },
    ]
  },
  {
    id: 'u2',
    participantName: 'Nexus Global Agency',
    participantAvatar: 'https://picsum.photos/seed/u2/100/100',
    lastMessage: 'Will get back by EOD.',
    lastTimestamp: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'm3', senderId: 'me', text: 'Can we discuss the lead details?', timestamp: '4:00 PM' },
      { id: 'm4', senderId: 'u2', text: 'Will get back by EOD.', timestamp: '4:15 PM' },
    ]
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [activeModalType, setActiveModalType] = useState<ProjectType>('execution');

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const handlePostProject = (type: ProjectType) => {
    setActiveModalType(type);
    setIsProjectModalOpen(true);
  };

  const handleSendMessage = (conversationId: string, text: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          senderId: user.id,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent'
        };
        return {
          ...conv,
          lastMessage: text,
          lastTimestamp: newMessage.timestamp,
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));
  };

  const handleConnect = (id: string, name: string) => {
    const existing = conversations.find(c => c.id === id);
    if (!existing) {
      const newConv: Conversation = {
        id,
        participantName: name,
        participantAvatar: `https://picsum.photos/seed/${id}/100/100`,
        lastMessage: 'Connection started',
        lastTimestamp: 'Just now',
        unreadCount: 0,
        messages: [{ id: 'init', senderId: id, text: `Hello! Excited to connect regarding your opportunity.`, timestamp: 'Just now' }]
      };
      setConversations([newConv, ...conversations]);
    }
    setActiveChatId(id);
    setCurrentView(AppView.MESSAGES);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard user={user} onPostProject={handlePostProject} />;
      case AppView.AGENCIES:
        return <TalentPool initialFilter="Agencies" onConnect={handleConnect} />;
      case AppView.INSTITUTIONS:
        return <TalentPool initialFilter="Institutions" onConnect={handleConnect} />;
      case AppView.FREELANCERS:
        return <TalentPool initialFilter="Freelancers" onConnect={handleConnect} />;
      case AppView.PROJECT_BOARD:
        return <ProjectBoard user={user} projects={projects} onConnect={handleConnect} />;
      case AppView.MESSAGES:
        return (
          <Messages 
            user={user} 
            conversations={conversations} 
            onSendMessage={handleSendMessage} 
            activeConversationId={activeChatId || undefined} 
          />
        );
      default:
        return <Dashboard user={user} onPostProject={handlePostProject} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar 
        currentView={currentView} 
        onNavigate={(view) => {
          setCurrentView(view);
          if (view !== AppView.MESSAGES) setActiveChatId(null);
        }} 
        userRole={user.role}
        onLogout={() => setUser(null)}
      />
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title={currentView.replace('_', ' ')} user={user} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>

      {activeChatId && currentView !== AppView.MESSAGES && (
        <ChatOverlay 
          recipient={conversations.find(c => c.id === activeChatId) || { id: activeChatId, name: 'User' }} 
          onClose={() => setActiveChatId(null)} 
          currentUser={user}
        />
      )}

      {isProjectModalOpen && (
        <ProjectModal 
          type={activeModalType} 
          onClose={() => setIsProjectModalOpen(false)} 
          onSave={(data) => {
            const newProject: Project = {
              id: `p${Date.now()}`,
              title: data.title || 'New Opportunity',
              description: data.description || '',
              budget: data.budget || 'Negotiable',
              postedBy: user.organization || user.name,
              postedById: user.id,
              category: data.category || 'Freelance',
              type: activeModalType,
              status: 'Open',
              skills: data.skills || []
            };
            setProjects([newProject, ...projects]);
            setIsProjectModalOpen(false);
            setCurrentView(AppView.PROJECT_BOARD);
          }} 
        />
      )}
    </div>
  );
};

export default App;
