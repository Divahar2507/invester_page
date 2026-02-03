
export enum AppView {
  DASHBOARD = 'dashboard',
  TALENT_POOL = 'talent_pool',
  PROJECT_BOARD = 'project_board',
  MESSAGES = 'messages',
  SETTINGS = 'settings'
}

export enum UserRole {
  STARTUP = 'startup',
  AGENCY = 'agency',
  INSTITUTION = 'institution',
  FREELANCER = 'freelancer'
}

export type ProjectType = 'execution' | 'recruitment';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  organization?: string;
  email?: string;
  bio?: string;
}

export interface Interview {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: UserRole;
  date: string;
  time: string;
  topic: string;
}

export interface HiredMember {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  startDate: string;
  project: string;
  organization?: string;
}

export interface HiringStats {
  activeInterns: number;
  agencyLeads: number;
  hiredStudents: number;
  leadsTaken: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: string;
  postedBy: string;
  postedById: string;
  category: 'Full-time' | 'Freelance' | 'Internship';
  type: ProjectType;
  status: 'Open' | 'In Progress' | 'Completed';
  skills: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read' | 'system';
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantRole?: UserRole;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
  isHired?: boolean;
}

export interface Stat {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  subtext: string;
  icon: any;
}

export interface PartnerCard {
  id: string;
  role: UserRole;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  tags: string[];
  verified: boolean;
}

export interface ProjectConcept {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  maturity: number;
  maturityLabel: string;
  rating: number;
  author: {
    name: string;
    avatar: string;
  };
}
