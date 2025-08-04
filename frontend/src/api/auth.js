import { apiCall } from "./config";

// Auth API functions
export const authApi = {
  // Login
  login: async (loginData) => {
    return await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
  },

  // Logout
  logout: async () => {
    return await apiCall("/auth/logout", {
      method: "POST",
    });
  },

  // Refresh token
  refreshToken: async () => {
    return await apiCall("/auth/refresh", {
      method: "POST",
    });
  },

  // Check token status
  checkTokenStatus: async () => {
    return await apiCall("/auth/token-status", {
      method: "GET",
    });
  },

  // Revoke all sessions (admin function)
  revokeAllSessions: async () => {
    return await apiCall("/auth/revoke-all-sessions", {
      method: "POST",
    });
  },

  signup: async (userData) => {
    const response = await apiCall("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return response;
  },

  forgotPassword: async (email) => {
    const response = await apiCall("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return response;
  },
};
