
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import TalentPool from './views/TalentPool';
import ProjectBoard from './views/ProjectBoard';
import Messages from './views/Messages';
import Settings from './views/Settings';
import Login from './views/Login';
import ChatOverlay from './components/ChatOverlay';
import ProjectModal from './components/ProjectModal';
import InterviewModal from './components/InterviewModal';
import UpcomingInterviewsModal from './components/UpcomingInterviewsModal';
import HiredDetailsModal from './components/HiredDetailsModal';
import { AppView, User, UserRole, Project, ProjectType, Conversation, ChatMessage, Interview, HiringStats, HiredMember } from './types';

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
    participantRole: UserRole.AGENCY,
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
    participantName: 'Tech University Student',
    participantAvatar: 'https://picsum.photos/seed/u3/100/100',
    participantRole: UserRole.INSTITUTION,
    lastMessage: 'Ready for the interview.',
    lastTimestamp: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'm4', senderId: 'u2', text: 'Ready for the interview.', timestamp: '4:15 PM' },
    ]
  }
];

const INITIAL_HIRED: HiredMember[] = [
  { id: 'h1', name: 'James Wilson', avatar: 'https://picsum.photos/seed/h1/100/100', role: UserRole.INSTITUTION, startDate: 'Oct 12, 2023', project: 'React Native Expert Needed', organization: 'Tech University' },
  { id: 'h2', name: 'Sarah Chen', avatar: 'https://picsum.photos/seed/u1/100/100', role: UserRole.AGENCY, startDate: 'Nov 01, 2023', project: 'Senior Backend Developer', organization: 'Global Talent' }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [hiredMembers, setHiredMembers] = useState<HiredMember[]>(INITIAL_HIRED);
  const [hiringStats, setHiringStats] = useState<HiringStats>({
    activeInterns: INITIAL_HIRED.filter(h => h.role === UserRole.INSTITUTION).length,
    agencyLeads: INITIAL_HIRED.filter(h => h.role === UserRole.AGENCY || h.role === UserRole.FREELANCER).length,
    hiredStudents: 124,
    leadsTaken: 45
  });
  
  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [detailsModal, setDetailsModal] = useState<{ open: boolean, title: string, roleFilter?: UserRole | 'lead' } | null>(null);
  const [activeModalType, setActiveModalType] = useState<ProjectType>('execution');
  const [schedulingWith, setSchedulingWith] = useState<{name: string, avatar: string, id: string, role?: UserRole} | null>(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const handlePostProject = (type: ProjectType) => {
    setActiveModalType(type);
    setIsProjectModalOpen(true);
  };

  const handleSendMessage = (conversationId: string, text: string, isSystem: boolean = false) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          senderId: isSystem ? 'system' : user.id,
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

  const handleScheduleInterview = (participant: { name: string; avatar: string, id: string, role?: UserRole }) => {
    setSchedulingWith(participant);
    setIsInterviewModalOpen(true);
  };

  const handleMakeCollaboration = (participant: { name: string; avatar: string; id: string; role?: UserRole }) => {
    // Check if already collaborated
    const existing = hiredMembers.find(m => m.name === participant.name);
    if (existing) return;

    // 1. Add to Hired/Collaborated Members
    const newMember: HiredMember = {
      id: `collaboration${Date.now()}`,
      name: participant.name,
      avatar: participant.avatar,
      role: participant.role || UserRole.FREELANCER,
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      project: 'Direct Tie-up / Collaboration',
      organization: participant.name.split('(')[0].trim() || 'N/A'
    };
    setHiredMembers(prev => [newMember, ...prev]);

    // 2. Update Stats
    setHiringStats(prev => ({
      ...prev,
      agencyLeads: prev.agencyLeads + 1,
      leadsTaken: prev.leadsTaken + 1
    }));

    // 3. Mark Conversation as Collaborating
    setConversations(prev => prev.map(c => 
      c.id === participant.id ? { ...c, isHired: true } : c
    ));

    // 4. Notify in Chat
    handleSendMessage(participant.id, `🤝 COLLABORATION ACCEPTED! ${user.name} has accepted the tie-up request. Welcome to the workspace!`, true);
  };

  const onScheduleConfirm = (interviewData: Omit<Interview, 'id'>) => {
    const newInterview: Interview = {
      ...interviewData,
      id: Date.now().toString()
    };
    setInterviews([newInterview, ...interviews]);
    setIsInterviewModalOpen(false);
    
    handleSendMessage(interviewData.participantId, `I've scheduled our interview for ${interviewData.date} at ${interviewData.time}. Talk soon!`);
  };

  const handleHire = (interview: Interview) => {
    // 1. Add to Hired Members
    const newMember: HiredMember = {
      id: `hm${Date.now()}`,
      name: interview.participantName,
      avatar: interview.participantAvatar,
      role: interview.participantRole,
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      project: interview.topic,
      organization: conversations.find(c => c.id === interview.participantId)?.participantName.split('(')[0].trim() || 'N/A'
    };
    setHiredMembers(prev => [newMember, ...prev]);

    // 2. Update Hiring Stats
    setHiringStats(prev => ({
      ...prev,
      activeInterns: interview.participantRole === UserRole.INSTITUTION ? prev.activeInterns + 1 : prev.activeInterns,
      agencyLeads: (interview.participantRole === UserRole.AGENCY || interview.participantRole === UserRole.FREELANCER) ? prev.agencyLeads + 1 : prev.agencyLeads,
      hiredStudents: interview.participantRole === UserRole.INSTITUTION ? prev.hiredStudents + 1 : prev.hiredStudents,
      leadsTaken: (interview.participantRole === UserRole.AGENCY || interview.participantRole === UserRole.FREELANCER) ? prev.leadsTaken + 1 : prev.leadsTaken,
    }));

    // 3. Mark Conversation as Hired
    setConversations(prev => prev.map(c => 
      c.id === interview.participantId ? { ...c, isHired: true } : c
    ));

    // 4. Send automated system message
    handleSendMessage(interview.participantId, `🎉 CONGRATULATIONS! You have been HIRED by ${user.name} for the ${interview.topic} opportunity!`, true);

    // 5. Remove Interview from list
    setInterviews(prev => prev.filter(i => i.id !== interview.id));
    setIsUpcomingModalOpen(false);
  };

  const handleReject = (interview: Interview) => {
    handleSendMessage(interview.participantId, `Update: ${user.name} has decided to move forward with other candidates for the ${interview.topic} role.`, true);
    setInterviews(prev => prev.filter(i => i.id !== interview.id));
    setIsUpcomingModalOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            user={user} 
            interviews={interviews}
            hiringStats={hiringStats}
            onPostProject={handlePostProject} 
            onViewInterviews={() => setIsUpcomingModalOpen(true)}
            onViewInterns={() => setDetailsModal({ open: true, title: 'Active Interns', roleFilter: UserRole.INSTITUTION })}
            onViewAgencyLeads={() => setDetailsModal({ open: true, title: 'Agency Leads', roleFilter: 'lead' })}
          />
        );
      case AppView.TALENT_POOL:
        return <TalentPool onConnect={handleConnect} />;
      case AppView.PROJECT_BOARD:
        return <ProjectBoard user={user} projects={projects} onConnect={handleConnect} />;
      case AppView.MESSAGES:
        return (
          <Messages 
            user={user} 
            conversations={conversations} 
            onSendMessage={handleSendMessage} 
            onScheduleInterview={(p) => handleScheduleInterview({ ...p, id: conversations.find(c => c.participantName === p.name)?.id || 'unknown', role: conversations.find(c => c.participantName === p.name)?.participantRole })}
            onMakeCollaboration={handleMakeCollaboration}
            activeConversationId={activeChatId || undefined} 
          />
        );
      case AppView.SETTINGS:
        return (
          <Settings 
            user={user} 
            onUpdateUser={(updatedUser) => setUser(updatedUser)} 
          />
        );
      default:
        return <Dashboard user={user} interviews={interviews} hiringStats={hiringStats} onViewInterviews={() => setIsUpcomingModalOpen(true)} onViewInterns={() => {}} onViewAgencyLeads={() => {}} onPostProject={handlePostProject} />;
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

      {isInterviewModalOpen && schedulingWith && (
        <InterviewModal 
          participant={{ name: schedulingWith.name, avatar: schedulingWith.avatar, id: schedulingWith.id, role: schedulingWith.role }} 
          onClose={() => setIsInterviewModalOpen(false)} 
          onSchedule={onScheduleConfirm} 
        />
      )}

      {isUpcomingModalOpen && (
        <UpcomingInterviewsModal 
          interviews={interviews} 
          onClose={() => setIsUpcomingModalOpen(false)} 
          onHire={handleHire}
          onReject={handleReject}
        />
      )}

      {detailsModal?.open && (
        <HiredDetailsModal 
          title={detailsModal.title}
          members={hiredMembers.filter(m => {
            if (detailsModal.roleFilter === 'lead') {
              return m.role === UserRole.AGENCY || m.role === UserRole.FREELANCER;
            }
            return m.role === detailsModal.roleFilter;
          })}
          onClose={() => setDetailsModal(null)}
        />
      )}
    </div>
  );
};

export default App;
