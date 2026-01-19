import { getToken, clearAuth } from "./auth.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";
const MAIN_API_URL = "http://localhost:8000";

async function request(path, { method = "GET", body } = {}, baseUrl = API_URL) {
  const token = getToken();

  const res = await fetch(`${baseUrl}${path}`, {
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
    // If it's the main login check, maybe don't clear immediately or handle gracefully
    // But generally 401 means session dead.
    // clearAuth();
    // throw new Error(data?.detail || "Unauthorized or expired session. Please sign in again.");
  }

  if (!res.ok) {
    const msg = data?.detail?.[0]?.msg || data?.detail || data || "Error";
    throw new Error(msg);
  }
  return data;
}

// Helper for Main Backend calls
const mainRequest = (path, options) => request(path, options, MAIN_API_URL);

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),

  // Settings / profile (Startup Backend)
  me: async () => {
    const user = await request("/me");
    // Attempt to merge company name if missing
    try {
      const profile = await request("/me/profile");
      if (profile && profile.company_name) {
        user.company_name = profile.company_name;
        user.name = profile.company_name; // Use company name as display name
      }
    } catch (e) { /* ignore */ }
    return user;
  },
  updateMe: (payload) => request("/me", { method: "PATCH", body: payload }),
  changePassword: (payload) => request("/me/change-password", { method: "POST", body: payload }),
  contactSales: (payload) => request("/contact-sales", { method: "POST", body: payload }),
  confirmEnterprise: (payload) => request("/enterprise/confirm", { method: "POST", body: payload }),
  getEnterpriseSuccess: () => request("/enterprise/success-details"),
  shareProfile: (payload) => request("/company/share", { method: "POST", body: payload }),

  // Company profile (Startup Backend)
  getProfile: () => request("/me/profile"),
  updateProfile: (payload) => request("/me/profile", { method: "PATCH", body: payload }),
  inviteTeamMember: (payload) => request("/team/invite", { method: "POST", body: payload }),

  // --- Community & Networking (Main Backend - Port 8000) ---

  // Investors
  getInvestors: () => mainRequest("/investors/"),
  searchUsers: (query) => mainRequest(`/messages/users/search?q=${query}`),
  getInvestor: (id) => mainRequest(`/investors/${id}`),

  // Connections
  getConnections: () => mainRequest("/connections/my"),
  getIncomingRequests: () => mainRequest("/connections/requests"),
  sendConnectionRequest: (receiverId) => mainRequest("/connections/request", { method: "POST", body: { receiver_id: receiverId } }),
  respondToConnection: (connId, action) => mainRequest("/connections/respond", { method: "POST", body: { connection_id: connId, action } }), // action: 'accept' or 'reject'
  checkConnection: (userId) => mainRequest(`/connections/check?user_id=${userId}`),

  // Messaging
  getConversations: () => mainRequest("/messages/conversations"),
  getMessages: (userId) => mainRequest(`/messages/${userId}`),
  sendMessage: (receiverId, content) => mainRequest("/messages/send", { method: "POST", body: { receiver_id: receiverId, content } }),
};