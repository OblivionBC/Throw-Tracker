import { apiCall } from "./config";

// Training Periods API functions
export const trainingPeriodsApi = {
  // Get all training periods
  getAll: async (prsn_rk) => {
    return await apiCall(`/training-periods?prsn_rk=${prsn_rk}`);
  },

  // Get training period by ID
  getById: async (trpe_rk) => {
    return await apiCall(`/training-periods/${trpe_rk}`);
  },

  // Get end date of most recent training period
  getEndDateMostRecent: async () => {
    return await apiCall("/training-periods/recent/end-date");
  },

  // Create new training period
  create: async (trainingPeriodData) => {
    return await apiCall("/training-periods", {
      method: "POST",
      body: JSON.stringify(trainingPeriodData),
    });
  },

  // Update training period
  update: async (trpe_rk, trainingPeriodData) => {
    return await apiCall(`/training-periods/${trpe_rk}`, {
      method: "PUT",
      body: JSON.stringify(trainingPeriodData),
    });
  },

  // Delete training period
  delete: async (trpe_rk) => {
    return await apiCall(`/training-periods/${trpe_rk}`, {
      method: "DELETE",
    });
  },
};
