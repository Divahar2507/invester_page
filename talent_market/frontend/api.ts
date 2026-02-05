import axios from 'axios';
import { User, Project, Message, Interview, HiredMember, HiringStats, JobApplication } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8008';

const api = axios.create({
    baseURL: API_URL,
});

export const authApi = {
    login: async (email: string, role?: string) => {
        const response = await api.post<User>('/login/', { email, role });
        return response.data;
    },
};

export const projectApi = {
    list: async () => {
        const response = await api.get<Project[]>('/projects/');
        return response.data;
    },
    create: async (project: any, userId: string) => {
        const response = await api.post<Project>(`/projects/?user_id=${userId}`, project);
        return response.data;
    },
};

export const talentApi = {
    list: async () => {
        const response = await api.get<User[]>('/talent/');
        return response.data;
    },
};

export const messageApi = {
    getByUser: async (userId: string) => {
        const response = await api.get<Message[]>(`/messages/${userId}`);
        return response.data;
    },
    send: async (message: { recipient_id: string, text: string }, senderId: string) => {
        const response = await api.post<Message>(`/messages/?sender_id=${senderId}`, message);
        return response.data;
    },
};

export const interviewApi = {
    list: async (userId: string) => {
        const response = await api.get<Interview[]>(`/interviews/${userId}`);
        return response.data;
    },
    schedule: async (interview: any, userId: string) => {
        const response = await api.post<Interview>(`/interviews/?user_id=${userId}`, interview);
        return response.data;
    },
};

export const hiredApi = {
    list: async (employerId: string) => {
        const response = await api.get<HiredMember[]>(`/hired/${employerId}`);
        return response.data;
    },
    hire: async (member: any, employerId: string) => {
        const response = await api.post<HiredMember>(`/hired/?employer_id=${employerId}`, member);
        return response.data;
    },
};


export const statsApi = {
    get: async (userId: string) => {
        const response = await api.get<HiringStats>(`/stats/${userId}`);
        return response.data;
    },
};

export const userApi = {
    update: async (userId: string, data: Partial<User>) => {
        const response = await api.put<User>(`/users/${userId}`, data);
        return response.data;
    }
};

export const applicationApi = {
    apply: async (application: { job_id: string, message?: string, resume_link?: string }, talentId: string) => {
        const response = await api.post<JobApplication>(`/applications/?talent_id=${talentId}`, application);
        return response.data;
    },
    listByJob: async (jobId: string) => {
        const response = await api.get<JobApplication[]>(`/applications/job/${jobId}`);
        return response.data;
    },
    listByTalent: async (talentId: string) => {
        const response = await api.get<JobApplication[]>(`/applications/talent/${talentId}`);
        return response.data;
    },
    updateStatus: async (applicationId: string, status: string) => {
        const response = await api.put<JobApplication>(`/applications/${applicationId}`, { status });
        return response.data;
    }
};

export default api;
