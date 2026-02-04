
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

import { projectApi, messageApi, hiredApi, statsApi, interviewApi, userApi } from './api';
import { useEffect } from 'react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [hiredMembers, setHiredMembers] = useState<HiredMember[]>([]);
  const [hiringStats, setHiringStats] = useState<HiringStats>({
    activeInterns: 0,
    agencyLeads: 0,
    hiredStudents: 0,
    leadsTaken: 0
  });

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);
  const [detailsModal, setDetailsModal] = useState<{ open: boolean, title: string, roleFilter?: UserRole | 'lead' } | null>(null);
  const [activeModalType, setActiveModalType] = useState<ProjectType>('execution');
  const [schedulingWith, setSchedulingWith] = useState<{ name: string, avatar: string, id: string, role?: UserRole } | null>(null);

  // Fetch initial data
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [projectsData, hiredData, statsData, interviewsData, messagesData] = await Promise.all([
            projectApi.list(),
            hiredApi.list(user.id),
            statsApi.get(user.id),
            interviewApi.list(user.id),
            messageApi.getByUser(user.id)
          ]);

          setProjects(projectsData);
          setHiredMembers(hiredData);
          setHiringStats(statsData);
          setInterviews(interviewsData);

          // Process messages into conversations
          const convMap: { [key: string]: Conversation } = {};
          messagesData.forEach(msg => {
            const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
            if (!convMap[otherUserId]) {
              convMap[otherUserId] = {
                id: otherUserId,
                participantName: 'User', // Generic placeholder, real names should be fetched or included in msg
                participantAvatar: `https://picsum.photos/seed/${otherUserId}/100/100`,
                lastMessage: msg.text,
                lastTimestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unreadCount: 0,
                messages: []
              };
            }
            convMap[otherUserId].messages.push({
              id: msg.id,
              senderId: msg.sender_id,
              text: msg.text,
              timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: msg.status as any
            });
            convMap[otherUserId].lastMessage = msg.text;
            convMap[otherUserId].lastTimestamp = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          });
          setConversations(Object.values(convMap));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [user]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const handlePostProject = (type: ProjectType) => {
    setActiveModalType(type);
    setIsProjectModalOpen(true);
  };

  const handleSendMessage = async (conversationId: string, text: string, isSystem: boolean = false) => {
    try {
      const newMessage = await messageApi.send({ recipient_id: conversationId, text }, user.id);

      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          const processedMsg: ChatMessage = {
            id: newMessage.id,
            senderId: newMessage.sender_id,
            text: newMessage.text,
            timestamp: new Date(newMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: newMessage.status as any
          };
          return {
            ...conv,
            lastMessage: text,
            lastTimestamp: processedMsg.timestamp,
            messages: [...conv.messages, processedMsg]
          };
        }
        return conv;
      }));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleConnect = async (id: string, name: string) => {
    const existing = conversations.find(c => c.id === id);
    if (!existing) {
      try {
        const text = `Hello! Excited to connect regarding your opportunity.`;
        const newMessage = await messageApi.send({ recipient_id: id, text }, user.id);

        const newConv: Conversation = {
          id,
          participantName: name,
          participantAvatar: `https://picsum.photos/seed/${id}/100/100`,
          lastMessage: text,
          lastTimestamp: 'Just now',
          unreadCount: 0,
          messages: [{
            id: newMessage.id,
            senderId: newMessage.sender_id,
            text: newMessage.text,
            timestamp: new Date(newMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: newMessage.status as any
          }]
        };
        setConversations([newConv, ...conversations]);
      } catch (error) {
        console.error("Error connecting:", error);
      }
    }
    setActiveChatId(id);
    setCurrentView(AppView.MESSAGES);
  };

  const handleScheduleInterview = (participant: { name: string; avatar: string, id: string, role?: UserRole }) => {
    setSchedulingWith(participant);
    setIsInterviewModalOpen(true);
  };

  const handleMakeCollaboration = async (participant: { name: string; avatar: string; id: string; role?: UserRole }) => {
    // Check if already collaborated
    const existing = hiredMembers.find(m => m.name === participant.name);
    if (existing) return;

    try {
      const memberData = {
        name: participant.name,
        avatar: participant.avatar,
        role: participant.role || UserRole.FREELANCER,
        start_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        project: 'Direct Tie-up / Collaboration',
        organization: participant.name.split('(')[0].trim() || 'N/A'
      };

      const newMember = await hiredApi.hire(memberData, user.id);
      setHiredMembers(prev => [newMember, ...prev]);

      // Update Stats
      const updatedStats = await statsApi.get(user.id);
      setHiringStats(updatedStats);

      // Mark Conversation as Collaborating
      setConversations(prev => prev.map(c =>
        c.id === participant.id ? { ...c, isHired: true } : c
      ));

      // Notify in Chat
      await handleSendMessage(participant.id, `🤝 COLLABORATION ACCEPTED! ${user.name} has accepted the tie-up request. Welcome to the workspace!`, true);
    } catch (error) {
      console.error("Error making collaboration:", error);
    }
  };

  const onScheduleConfirm = async (interviewData: Omit<Interview, 'id'>) => {
    try {
      const newInterview = await interviewApi.schedule(interviewData, user.id);
      setInterviews([newInterview, ...interviews]);
      setIsInterviewModalOpen(false);

      await handleSendMessage(interviewData.participantId, `I've scheduled our interview for ${interviewData.date} at ${interviewData.time}. Talk soon!`);
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  const handleHire = async (interview: Interview) => {
    try {
      // 1. Add to Hired Members
      const memberData = {
        name: interview.participantName,
        avatar: interview.participantAvatar,
        role: interview.participantRole,
        start_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        project: interview.topic,
        organization: conversations.find(c => c.id === interview.participantId)?.participantName.split('(')[0].trim() || 'N/A'
      };

      const newMember = await hiredApi.hire(memberData, user.id);
      setHiredMembers(prev => [newMember, ...prev]);

      // 2. Update Hiring Stats
      const updatedStats = await statsApi.get(user.id);
      setHiringStats(updatedStats);

      // 3. Mark Conversation as Hired
      setConversations(prev => prev.map(c =>
        c.id === interview.participantId ? { ...c, isHired: true } : c
      ));

      // 4. Send automated system message
      await handleSendMessage(interview.participantId, `🎉 CONGRATULATIONS! You have been HIRED by ${user.name} for the ${interview.topic} opportunity!`, true);

      // 5. Remove Interview from list
      setInterviews(prev => prev.filter(i => i.id !== interview.id));
      setIsUpcomingModalOpen(false);
    } catch (error) {
      console.error("Error hiring member:", error);
    }
  };

  const handleDirectHire = async (data: { name: string, avatar: string, role: UserRole, topic: string, participantId: string }) => {
    if (!user) return;
    try {
      // 1. Add to Hired Members
      const memberData = {
        name: data.name,
        avatar: data.avatar,
        role: data.role,
        start_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        project: data.topic,
        organization: conversations.find(c => c.id === data.participantId)?.participantName.split('(')[0].trim() || 'N/A'
      };

      const newMember = await hiredApi.hire(memberData, user.id);
      setHiredMembers(prev => [newMember, ...prev]);

      // 2. Update Hiring Stats
      const updatedStats = await statsApi.get(user.id);
      setHiringStats(updatedStats);

      // 3. Mark Conversation as Hired
      setConversations(prev => prev.map(c =>
        c.id === data.participantId ? { ...c, isHired: true } : c
      ));

      // 4. Send automated system message
      await handleSendMessage(data.participantId, `🎉 CONGRATULATIONS! You have been HIRED by ${user.name} for the ${data.topic} opportunity!`, true);
    } catch (error) {
      console.error("Error direct hiring member:", error);
    }
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
        return (
          <ProjectBoard
            user={user}
            projects={projects}
            onConnect={handleConnect}
            onScheduleInterview={handleScheduleInterview}
            onHire={handleDirectHire}
          />
        );
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
            onUpdateUser={async (updatedUser) => {
              try {
                const result = await userApi.update(user.id, updatedUser);
                setUser(result);
              } catch (error) {
                console.error("Failed to update user:", error);
                setUser(updatedUser); // Optimistic fallback
              }
            }}
          />
        );
      default:
        return <Dashboard user={user} interviews={interviews} hiringStats={hiringStats} onViewInterviews={() => setIsUpcomingModalOpen(true)} onViewInterns={() => { }} onViewAgencyLeads={() => { }} onPostProject={handlePostProject} />;
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
          onSave={async (data) => {
            try {
              const projectData = {
                title: data.title || 'New Opportunity',
                description: data.description || '',
                budget: data.budget || 'Negotiable',
                category: data.category || 'Freelance',
                type: activeModalType,
                skills: data.skills || []
              };

              const newProject = await projectApi.create(projectData, user.id);
              setProjects([newProject, ...projects]);
              setIsProjectModalOpen(false);
              setCurrentView(AppView.PROJECT_BOARD);
            } catch (error) {
              console.error("Error creating project:", error);
            }
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
