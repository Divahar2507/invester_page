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

    register: async (email, password, role, full_name, additionalData = {}) => {
        const payload = {
            email,
            password,
            role, // Backend UserCreate requires 'role'
            full_name,

            // Map common fields
            mobile_number: additionalData.mobileNumber || "",
            linkedin_url: additionalData.linkedinUrl || "",

            // Startup Specific maps
            brand_name: additionalData.brandName,
            legal_name: additionalData.legalName,
            website_url: additionalData.websiteUrl,
            startup_sector: additionalData.startupSector,
            startup_stage: additionalData.startupStage,
            city: additionalData.city,
            company_type: additionalData.companyType,
            monthly_revenue: additionalData.monthlyRevenue,
            valuation: additionalData.valuation,
            capital_to_raise: additionalData.capitalToRaise,
            incorporation_date: additionalData.incorporationDate,
            description: additionalData.description,
            is_single_founder: additionalData.isSingleFounder,

            // Investor Specific maps
            referrer: additionalData.referrer,
            referrer_name: additionalData.referrerName,

            // Legacy / Optional
            company_name: additionalData.companyName || additionalData.brandName || "Independent",
            agree_terms: true,

            ...additionalData // Pass everything else just in case, but clean up conflicts
        };

        // Remove frontend-only camelCase keys to be clean (optional but good practice)
        delete payload.mobileNumber;
        delete payload.linkedinUrl;
        delete payload.brandName;
        delete payload.legalName;
        delete payload.websiteUrl;
        delete payload.startupSector;
        delete payload.startupStage;
        delete payload.city;
        delete payload.companyType;
        delete payload.monthlyRevenue;
        delete payload.valuation;
        delete payload.capitalToRaise;
        delete payload.incorporationDate;
        delete payload.description;
        delete payload.isSingleFounder;
        delete payload.referrer;
        delete payload.referrerName;
        delete payload.companyName; // If company_name is explicitly mapped, remove original
        // Schema Config says nothing about forbidding extras, so we are safe.

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
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

    changePassword: async (currentPassword, newPassword) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to change password');
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

        // Startup Backend (8001) uses /me not /auth/me
        const response = await fetch(`${API_URL}/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch user profile');
        const user = await response.json();

        // Attempt to fetch specific profile to get `profile_photo` or other details
        try {
            let profileData = null;
            if (user.role === 'startup' || user.company_name) { // Backend user model doesn't explicitly return role 'startup', inferred from context or usage
                const startupRes = await fetch(`${API_URL}/me/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (startupRes.ok) profileData = await startupRes.json();

            } else if (user.role === 'investor') {
                const investorRes = await fetch(`${API_URL}/investors/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (investorRes.ok) profileData = await investorRes.json();
            }

            if (profileData && profileData.profile_photo) {
                user.profile_photo = profileData.profile_photo;
            }
        } catch (e) {
            console.warn("Failed to fetch extended profile details for user", e);
        }

        return user;
    },

    // ... (other methods)

    getMyStartupProfile: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/me/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch startup profile');
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

    updateStartupProfile: async (data) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/me/profile`, {
            method: 'PATCH', // Changed from PUT to PATCH
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update startup profile');
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

    createPitch: async (data) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        // Backend expects snake_case, frontend sends mixed. Data mapping handled in component? 
        // CreatePitch sends: title, description, raising_amount, equity_percentage, valuation, location, tags, status
        // Backend PitchCreate schema: title (req), description, raising_amount, equity_percentage, valuation...
        // Matches roughly.
        const response = await fetch(`${API_URL}/pitches/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to create pitch');
        }
        return response.json();
    },

    updatePitch: async (id, data) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/pitches/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to update pitch');
        }
        return response.json();
    },

    getPitch: async (id) => {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${API_URL}/pitches/${id}`, { headers });
        if (!response.ok) throw new Error('Failed to fetch pitch');
        return response.json();
    },

    getMyPitches: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/pitches/my`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch my pitches');
        return response.json();
    },

    getAllInvestors: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/investors/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch investors');
        return response.json();
    },

    // Investor Dashboard & Tools
    getNotifications: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/notifications/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch notifications');
        return response.json();
    },

    getPitchFeed: async (filters = {}) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_URL}/pitches/feed?${params}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch pitch feed');
        return response.json();
    },

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
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
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
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
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

    getWatchlist: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/watchlist/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch watchlist');
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

    getDocuments: async (pitchId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/pitches/${pitchId}/documents`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch documents');
        return response.json();
    },

    getComments: async (pitchId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/pitches/${pitchId}/comments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch comments');
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

    getInvestmentStats: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/investments/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch investment stats');
        return response.json();
    },

    createInvestment: async (data) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        // Always use FormData because backend expects Form(...) fields
        const formData = new FormData();
        formData.append('startup_name', data.startup_name);
        formData.append('amount', data.amount);
        formData.append('date', data.date);
        formData.append('round', data.round);
        if (data.equity_stake) formData.append('equity_stake', data.equity_stake);
        if (data.notes) formData.append('notes', data.notes);
        formData.append('status', 'Active');

        if (data.file) {
            formData.append('file', data.file);
        }

        const response = await fetch(`${API_URL}/investments/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }, // Content-Type is automatic with FormData
            body: formData
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || 'Failed to create investment');
        }
        return response.json();
    },

    // Messaging
    searchUsers: async (query) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/messages/users/search?q=${encodeURIComponent(query)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to search users');
        return response.json();
    },

    getConversations: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/messages/conversations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch conversations');
        return response.json();
    },

    getMessageHistory: async (partnerId = null) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const url = partnerId
            ? `${API_URL}/messages/history?partner_id=${partnerId}`
            : `${API_URL}/messages/history`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch messages');
        return response.json();
    },

    sendMessage: async (receiverId, content, file = null) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const formData = new FormData();
        formData.append('receiver_id', receiverId);
        formData.append('content', content);
        if (file) {
            formData.append('file', file);
        }

        const response = await fetch(`${API_URL}/messages/send`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (!response.ok) throw new Error('Failed to send message');
        return response.json();
    },

    deleteConversation: async (partnerId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/messages/conversations/${partnerId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete conversation');
        return response.json();
    },

    // Connections
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

    getIncomingConnectionRequests: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/connections/requests`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch requests');
        return response.json();
    },

    respondToConnectionRequest: async (connectionId, action) => {
        // action: 'accept' or 'reject'
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/connections/respond`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ connection_id: connectionId, action: action })
        });
        if (!response.ok) throw new Error('Failed to respond to request');
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

    checkConnectionStatus: async (userId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/connections/check?user_id=${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to check status');
        return response.json();
    },

    markNotificationAsRead: async (notificationId) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to mark notification as read');
        return response.json();
    }
};
