const API_URL = import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000';

export const api = {
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return response.json();
    },

    register: async (email, password, role, full_name) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role, full_name }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Registration failed');
        }

        return response.json();
    },

    forgotPassword: async (email) => {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Failed to send reset email');
        }
        return response.json();
    },

    resetPassword: async (token, newPassword) => {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, new_password: newPassword }),
        });

        if (!response.ok) {
            throw new Error('Failed to reset password');
        }
        return response.json();
    },

    googleLogin: async (token, role) => {
        const response = await fetch(`${API_URL}/auth/google-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, role }),
        });

        if (!response.ok) {
            throw new Error('Google Login failed');
        }
        return response.json();
    },

    getMe: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch user profile');
        return response.json();
    },

    getPitchFeed: async (industry = 'All', stage = 'All', query = '', status = null, sortBy = 'newest') => {
        let url = `${API_URL}/pitches/feed?skip=0&limit=50`;

        // Only append params if they have valid values
        if (industry && industry !== 'All') url += `&industry=${encodeURIComponent(industry)}`;
        if (stage && stage !== 'All') url += `&stage=${encodeURIComponent(stage)}`;
        if (query) url += `&query=${encodeURIComponent(query)}`;
        if (status) url += `&status=${encodeURIComponent(status)}`;
        if (sortBy) url += `&sort_by=${encodeURIComponent(sortBy)}`;

        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        console.log("Fetching pitch feed:", url); // Debugging

        const response = await fetch(url, { headers });
        if (!response.ok) {
            const err = await response.text();
            console.error("Pitch feed error:", err);
            throw new Error('Failed to fetch pitch feed');
        }
        return response.json();
    },

    getPitch: async (pitchId) => {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${API_URL}/pitches/${pitchId}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch pitch');
        return response.json();
    },

    recordDecision: async (pitchId, decision) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/pitches/${pitchId}/decision`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ decision })
        });

        if (!response.ok) throw new Error('Failed to record decision');
        return response.json();
    },

    // Social Logic (Comments & Meetings)
    getComments: async (pitchId) => {
        // Prevent calling with dummy IDs to avoid 422s
        if (typeof pitchId === 'string' && pitchId.startsWith('d')) return [];

        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${API_URL}/pitches/${pitchId}/comments`, { headers });
        if (!response.ok) throw new Error('Failed to fetch comments');
        return response.json();
    },

    postComment: async (data) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const { pitch_id, ...commentData } = data;

        // Prevent dummy IDs
        if (typeof pitch_id === 'string' && pitch_id.startsWith('d')) {
            throw new Error('Cannot comment on demo pitch');
        }

        const response = await fetch(`${API_URL}/pitches/${pitch_id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(commentData)
        });
        if (!response.ok) throw new Error('Failed to post comment');
        return response.json();
    },

    async getInvestmentStats() {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch(`${API_URL}/investments/stats`, {
            headers: headers
        });
        if (!response.ok) {
            // Fallback for new users
            return {
                capital_deployed: '$0',
                active_startups: 0,
                portfolio_growth: '0%',
                avg_equity: '0%'
            };
        }
        return response.json();
    },

    scheduleMeeting: async (data) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/social/meetings/schedule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const err = await response.text();
            console.error("Schedule meeting error:", err);
            throw new Error('Failed to schedule meeting');
        }
        return response.json();
    },

    getMeetings: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/social/meetings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch meetings');
        return response.json();
    },

    // Documents (Data Room)
    getDocuments: async (pitchId) => {
        // Prevent dummy IDs
        if (typeof pitchId === 'string' && pitchId.startsWith('d')) return { documents: [] };

        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/pitches/${pitchId}/data-room`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch documents');
        return response.json();
    },

    searchUsers: async (query) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        // We'll use a new search endpoint or reuse filter endpoint
        // Assuming backend has /users/search or similar. 
        // If not, we'll try to implement it or use a workaround.
        // Actually, let's implement the backend route for this next if needed.
        // For now, let's assume /users/search exists or create it.
        const response = await fetch(`${API_URL}/messages/users/search?q=${encodeURIComponent(query)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Search failed');
        return response.json();
    },

    getInvestments: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/investments/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch investments');
        return response.json();
    },

    createInvestment: async (investmentData) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const formData = new FormData();
        Object.keys(investmentData).forEach(key => {
            if (investmentData[key] !== null && investmentData[key] !== undefined) {
                formData.append(key, investmentData[key]);
            }
        });

        const response = await fetch(`${API_URL}/investments/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error("Investment Error Details:", JSON.stringify(error));

            const errorMessage = error.detail || error.message || 'Failed to log investment';
            const errObj = new Error(errorMessage);
            errObj.status = response.status;
            throw errObj;
        }
        return response.json();
    },

    // Connection APIs
    sendConnectionRequest: async (receiverId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/connections/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ receiver_id: receiverId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to send connection request');
        }
        return response.json();
    },

    getIncomingRequests: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/connections/requests`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch requests');
        return response.json();
    },

    respondToRequest: async (connectionId, action) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/connections/respond`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ connection_id: connectionId, action })
        });

        if (!response.ok) throw new Error('Failed to respond to request');
        return response.json();
    },

    checkConnectionStatus: async (userId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/connections/check?user_id=${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to check status');
        return response.json();
    },

    getMyConnections: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/connections/my`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch connections');
        return response.json();
    },

    updateStartupProfile: async (data) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/startup/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to update startup profile');
        return response.json();
    },

    getMyStartupProfile: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/startup/profile/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch startup profile');
        return response.json();
    },

    updateInvestorProfile: async (data) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/investors/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to update investor profile');
        return response.json();
    },

    getMyInvestorProfile: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/investors/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch investor profile');
        return response.json();
    },

    // Watchlist
    getWatchlist: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/watchlist/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch watchlist');
        return response.json();
    },

    addToWatchlist: async (startupId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/watchlist/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ startup_id: startupId })
        });
        if (!response.ok) throw new Error('Failed to add to watchlist');
        return response.json();
    },

    removeFromWatchlist: async (startupId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/watchlist/remove/${startupId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to remove from watchlist');
        return response.json();
    },

    // Tasks (Action Registry)
    getTasks: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/tasks/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    createTask: async (task) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/tasks/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },

    updateTask: async (taskId, updates) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    deleteTask: async (taskId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete task');
        return response.json();
    },

    // Notifications
    getNotifications: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/notifications/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch notifications');
        return response.json();
    },

    markNotificationAsRead: async (notificationId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to mark notification as read');
        return response.json();
    },

    // Messaging
    getConversations: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/messages/conversations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch conversations');
        return response.json();
    },

    sendMessage: async (receiverId, content, file = null) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        // Ensure receiverId is a valid integer
        const rId = parseInt(receiverId, 10);
        if (isNaN(rId)) {
            throw new Error(`Invalid Receiver ID: ${receiverId}`);
        }

        const formData = new FormData();
        formData.append('receiver_id', rId);
        formData.append('content', content);
        if (file) {
            formData.append('file', file);
        }

        const response = await fetch(`${API_URL}/messages/send`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || 'Failed to send message');
        }
        return response.json();
    },

    getMessages: async (userId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/messages/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch messages');
        return response.json();
    }
};
