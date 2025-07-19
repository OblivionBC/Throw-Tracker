import { apiCall } from "./config";

// Training Periods API functions (no caching)
export const trainingPeriodsApi = {
  // Get all training periods (no caching)
  getAll: async () => {
    try {
      const response = await apiCall(`/training-periods`);
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get training periods"
      );
    }
  },

  // Get training periods for current person or a specific athlete (no caching)
  getAllForPerson: async (prsn_rk) => {
    try {
      if (prsn_rk) {
        return await apiCall(`/training-periods/person?prsn_rk=${prsn_rk}`);
      }
      return await apiCall(`/training-periods/person`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to get training periods for person"
      );
    }
  },

  // Get training period by ID (no caching)
  getById: async (trpe_rk) => {
    try {
      return await apiCall(`/training-periods/${trpe_rk}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get training period by ID"
      );
    }
  },

  // Get end date of most recent training period (no caching)
  getEndDateMostRecent: async () => {
    try {
      return await apiCall("/training-periods/recent/end-date");
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to get end date of most recent training period"
      );
    }
  },

  // Create new training period (no caching)
  create: async (trainingPeriodData) => {
    try {
      const response = await apiCall("/training-periods", {
        method: "POST",
        body: JSON.stringify(trainingPeriodData),
      });
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create training period"
      );
    }
  },

  // Update training period (no caching)
  update: async (trpe_rk, trainingPeriodData) => {
    try {
      const response = await apiCall(`/training-periods/${trpe_rk}`, {
        method: "PUT",
        body: JSON.stringify(trainingPeriodData),
      });
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update training period"
      );
    }
  },

  // Delete training period (no caching)
  delete: async (trpe_rk) => {
    try {
      const response = await apiCall(`/training-periods/${trpe_rk}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete training period"
      );
    }
  },

  // Invalidate training periods cache (no-op)
  invalidateTrainingPeriodsCache: () => {},
};
