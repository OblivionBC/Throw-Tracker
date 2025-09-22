import { apiCall } from "./config";

// Training Periods API functions (no caching)
export const trainingPeriodsApi = {
  // Get all training periods (no caching)
  getAll: async () => {
    return await apiCall(`/training-periods`);
  },

  // Get training periods for current person or a specific athlete (no caching)
  getAllForPerson: async (prsn_rk) => {
    if (prsn_rk) {
      return await apiCall(`/training-periods/person?prsn_rk=${prsn_rk}`);
    }
    return await apiCall(`/training-periods/person`);
  },

  // Get training period by ID (no caching)
  getById: async (trpe_rk) => {
    return await apiCall(`/training-periods/${trpe_rk}`);
  },

  // Get end date of most recent training period (no caching)
  getEndDateMostRecent: async () => {
    return await apiCall("/training-periods/recent/end-date");
  },

  // Create new training period (no caching)
  create: async (trainingPeriodData) => {
    return await apiCall("/training-periods", {
      method: "POST",
      body: JSON.stringify(trainingPeriodData),
    });
  },

  // Update training period (no caching)
  update: async (trpe_rk, trainingPeriodData) => {
    return await apiCall(`/training-periods/${trpe_rk}`, {
      method: "PUT",
      body: JSON.stringify(trainingPeriodData),
    });
  },

  // Delete training period (no caching)
  delete: async (trpe_rk) => {
    return await apiCall(`/training-periods/${trpe_rk}`, {
      method: "DELETE",
    });
  },

  // Invalidate training periods cache (no-op)
  invalidateTrainingPeriodsCache: () => {},
};
