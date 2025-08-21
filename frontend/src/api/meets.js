import { apiCall } from "./config";

// Meets API functions
export const meetsApi = {
  // Get all meets
  getAll: async () => {
    return await apiCall("/meets");
  },

  // Get meet by ID
  getById: async (meet_rk) => {
    return await apiCall(`/meets/${meet_rk}`);
  },

  // Create new meet
  create: async (meetData) => {
    return await apiCall("/meets", {
      method: "POST",
      body: JSON.stringify(meetData),
    });
  },

  // Update meet
  update: async (meet_rk, meetData) => {
    return await apiCall(`/meets/${meet_rk}`, {
      method: "PUT",
      body: JSON.stringify(meetData),
    });
  },

  // Delete meet
  delete: async (meet_rk) => {
    return await apiCall(`/meets/${meet_rk}`, {
      method: "DELETE",
    });
  },

  // Get meets for coach's organization
  getForCoachOrg: async () => {
    return await apiCall("/meets/coach-org");
  },
};
