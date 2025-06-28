import { apiCall } from "./config";

// Practices API functions
export const practicesApi = {
  // Get all practices
  getAll: async () => {
    return await apiCall("/practices");
  },

  // Get practice by ID
  getById: async (prac_rk) => {
    return await apiCall(`/practices/${prac_rk}`);
  },

  // Get last practice
  getLast: async () => {
    return await apiCall("/practices/last");
  },

  // Get practices in training period
  getInTrainingPeriod: async (trainingPeriodData) => {
    return await apiCall("/practices/training-period", {
      method: "POST",
      body: JSON.stringify(trainingPeriodData),
    });
  },

  // Create new practice
  create: async (practiceData) => {
    return await apiCall("/practices", {
      method: "POST",
      body: JSON.stringify(practiceData),
    });
  },

  // Update practice
  update: async (prac_rk, practiceData) => {
    return await apiCall(`/practices/${prac_rk}`, {
      method: "PUT",
      body: JSON.stringify(practiceData),
    });
  },

  // Delete practice
  delete: async (prac_rk) => {
    return await apiCall(`/practices/${prac_rk}`, {
      method: "DELETE",
    });
  },
};
