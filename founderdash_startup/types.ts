
export enum AppView {
  DASHBOARD = 'dashboard',
  AGENCIES = 'agencies',
  INSTITUTIONS = 'institutions',
  FREELANCERS = 'freelancers',
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
  status?: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface Stat {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  subtext: string;
  icon: any;
}

export interface Activity {
  id: string;
  type: 'proposal' | 'onboarding' | 'meeting';
  user: string;
  description: string;
  time: string;
  actionLabel: string;
  icon: any;
  color: string;
}

export interface PartnerCard {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  tags: string[];
  verified: boolean;
  role: UserRole;
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
