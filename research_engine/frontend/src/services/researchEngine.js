
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

export const addResearchNote = async (id, data) => {
    const response = await fetch(`${API_URL}/research-engine/startups/${id}/research-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};
