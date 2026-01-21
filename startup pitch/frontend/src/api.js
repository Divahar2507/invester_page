import { getToken, clearAuth } from "./auth.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"; // Point to Main Backend
const MAIN_API_URL = "http://localhost:8000";

async function request(path, { method = "GET", body } = {}, baseUrl = API_URL) {
  const token = getToken();

  // Handle path mapping for Main Backend migration
  let finalPath = path;

  // Mapping logic
  if (path === "/me") finalPath = "/auth/me";
  if (path === "/me/profile") finalPath = "/startup/profile/me";
  if (path === "/investors") finalPath = "/investors/"; // Backend adds slash often

  const res = await fetch(`${baseUrl}${finalPath}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Try to parse JSON but fall back to plain text
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = undefined;
  }

  if (res.status === 401) {
    // Session expired
    // clearAuth(); 
  }

  if (!res.ok) {
    const msg = data?.detail?.[0]?.msg || data?.detail || data || "Error";
    throw new Error(msg);
  }
  return data;
}

// Helper for Main Backend calls (now same as request)
const mainRequest = (path, options) => request(path, options, MAIN_API_URL);

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),

  // Settings / profile
  me: async () => {
    const user = await request("/me"); // Mapped to /auth/me
    // Main backend /auth/me returns {id, email, role, name...}
    // Startup Profile might need to be fetched separately to get company name if not in user object
    if (!user.name || user.name === user.email) {
      try {
        const profile = await request("/me/profile"); // Mapped to /startup/profile/me
        if (profile && profile.company_name) {
          user.company_name = profile.company_name;
          user.name = profile.company_name;
          user.id = profile.user_id; // Ensure ID matches
        }
      } catch (e) { /* ignore */ }
    }
    return user;
  },

  updateMe: (payload) => request("/startup/profile", { method: "PUT", body: payload }), // Updated path from /me
  changePassword: (payload) => request("/auth/reset-password", { method: "POST", body: payload }), // Approximation

  // Enterprise / Sales (Mock or map to existing)
  contactSales: (payload) => Promise.resolve({ success: true }),
  confirmEnterprise: (payload) => Promise.resolve({ success: true }),
  getEnterpriseSuccess: () => Promise.resolve({}),
  shareProfile: (payload) => Promise.resolve({ success: true }),

  // Company profile
  getProfile: () => request("/me/profile"),
  updateProfile: (payload) => request("/startup/profile", { method: "PUT", body: payload }),
  inviteTeamMember: (payload) => Promise.resolve({ success: true }),

  // --- Community & Networking ---

  // Investors
  getInvestors: () => mainRequest("/investors/"),
  searchUsers: (query) => mainRequest(`/messages/users/search?q=${encodeURIComponent(query)}`),
  getInvestor: (id) => mainRequest(`/investors/${id}`),

  // Connections
  getConnections: () => mainRequest("/connections/my"),
  getIncomingRequests: () => mainRequest("/connections/requests"),
  sendConnectionRequest: (receiverId) => mainRequest("/connections/request", { method: "POST", body: { receiver_id: receiverId } }),
  respondToConnection: (connId, action) => mainRequest("/connections/respond", { method: "POST", body: { connection_id: connId, action } }), // action: 'accept' or 'reject'
  checkConnection: (userId) => mainRequest(`/connections/check?user_id=${userId}`),

  // Messaging
  getConversations: () => mainRequest("/messages/conversations"),
  // getMessages: (userId) => mainRequest(`/messages/${userId}`), // Deprecated
  getMessageHistory: (partnerId) => {
    let path = "/messages/history";
    if (partnerId) path += `?partner_id=${partnerId}`;
    return mainRequest(path);
  },
  sendMessage: async (receiverId, content, file = null) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('receiver_id', parseInt(receiverId));
    formData.append('content', content);
    if (file) {
      formData.append('file', file);
    }

    const res = await fetch(`${MAIN_API_URL}/messages/send`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) {
      let errorDetail = 'Failed to send message';
      try {
        const error = await res.json();
        errorDetail = error.detail || JSON.stringify(error);
      } catch (e) {
        const text = await res.text();
        errorDetail = `Status ${res.status}: ${text.substring(0, 100)}`;
      }
      console.error("SendMessage Error:", errorDetail);
      throw new Error(errorDetail);
    }
    return res.json();
  },

  deleteConversation: (partnerId) => mainRequest(`/messages/conversations/${partnerId}`, { method: "DELETE" }),

  // Notifications
  getNotifications: () => mainRequest("/notifications/"),
  markNotificationAsRead: (id) => mainRequest(`/notifications/${id}/read`, { method: "PUT" }),
};