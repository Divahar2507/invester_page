const API_BASE_URL = "http://localhost:8004";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const createQueryString = (params) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
            searchParams.append(key, params[key]);
        }
    });
    return searchParams.toString();
};

const request = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || "API Request Failed");
    }

    return response.json();
};

export const api = {
    login: async (username, password) => {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        const response = await fetch(`${API_BASE_URL}/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Login failed");
        }
        return response.json();
    },

    register: async (username, email, password) => {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Registration failed");
        }
        return response.json();
    },

    getMe: async () => {
        return request(`/users/me`, {
            headers: getHeaders(),
        });
    },

    getDashboardStats: async () => {
        return request(`/api/dashboard/stats`, {
            headers: getHeaders(),
        });
    },

    getStartups: async (params = {}) => {
        const queryString = createQueryString(params);
        return request(`/api/startups?${queryString}`, {
            headers: getHeaders(),
        });
    },

    getInvestors: async (params = {}) => {
        const queryString = createQueryString(params);
        return request(`/api/investors?${queryString}`, {
            headers: getHeaders(),
        });
    },

    getEvents: async (params = {}) => {
        const queryString = createQueryString(params);
        return request(`/api/events?${queryString}`, {
            headers: getHeaders(),
        });
    },

    getLeads: async (params = {}) => {
        const queryString = createQueryString(params);
        return request(`/api/leads?${queryString}`, {
            headers: getHeaders(),
        });
    },

    getHealth: async () => {
        return request(`/api/health`, {
            headers: getHeaders(),
        });
    }
};
