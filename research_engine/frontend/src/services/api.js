
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchStats = async () => {
    const response = await fetch(`${API_URL}/ecosystem/stats`);
    return response.json();
};

export const fetchResearch = async () => {
    const response = await fetch(`${API_URL}/ecosystem/research`);
    return response.json();
};

export const fetchMentors = async () => {
    const response = await fetch(`${API_URL}/ecosystem/mentors`);
    return response.json();
};

export const fetchSeminars = async () => {
    const response = await fetch(`${API_URL}/ecosystem/seminars`);
    return response.json();
};

export const fetchTechParks = async () => {
    const response = await fetch(`${API_URL}/ecosystem/techparks`);
    return response.json();
};

// --- Research Engine APIs ---

export const fetchStartups = async () => {
    const response = await fetch(`${API_URL}/research-engine/startups`);
    return response.json();
};

export const fetchStartupResearch = async (id) => {
    const response = await fetch(`${API_URL}/research-engine/startups/${id}/research`);
    return response.json();
};

export const createStartup = async (data) => {
    const response = await fetch(`${API_URL}/research-engine/startups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const updateMarketSize = async (id, data) => {
    const response = await fetch(`${API_URL}/research-engine/startups/${id}/market-size`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const updateProblemSolution = async (id, data) => {
    const response = await fetch(`${API_URL}/research-engine/startups/${id}/problem-solution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const addCompetitor = async (id, data) => {
    const response = await fetch(`${API_URL}/research-engine/startups/${id}/competitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const addCustomer = async (id, data) => {
    const response = await fetch(`${API_URL}/research-engine/startups/${id}/target-customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};
