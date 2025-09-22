import { apiCall } from "./config";
import Logger from "../utils/logger";

// Helper function for direct API calls (no authentication)
const directApiCall = async (endpoint, options = {}) => {
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Include cookies for CORS
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      Logger.log("🔍 Raw error response:", errorData);

      // Extract the actual error message from the backend response
      const errorMessage =
        errorData.error?.message ||
        errorData.message ||
        `HTTP error! status: ${response.status}`;

      Logger.log("🔍 Extracted error message:", errorMessage);
      throw new Error(errorMessage);
    } catch (parseError) {
      Logger.log("🔍 Parse error:", parseError);
      Logger.log("🔍 Response status:", response.status);
      Logger.log("🔍 Response headers:", response.headers);

      // If we can't parse the error response, use a generic message
      throw new Error(parseError);
    }
  }

  return response.json();
};

// Auth API functions
export const authApi = {
  // Login
  login: async (loginData) => {
    Logger.log("Attempting from API");
    let call = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
    Logger.log(call);
    return call;
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
    return await directApiCall("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  forgotPassword: async (email) => {
    return await directApiCall("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // OTP functions
  requestOTP: async (userData) => {
    return await directApiCall("/auth/request-otp", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  verifyOTP: async (otpData) => {
    return await directApiCall("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(otpData),
    });
  },

  resetPassword: async (resetData) => {
    return await directApiCall("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(resetData),
    });
  },
};
