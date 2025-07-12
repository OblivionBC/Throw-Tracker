import { apiCall } from "./config";
import useCacheStore from "../stores/cacheStore";

// Training Periods API functions with caching
export const trainingPeriodsApi = {
  // Get all training periods (with caching)
  getAll: async (forceRefresh = false) => {
    const cacheStore = useCacheStore.getState();
    const cacheKey = "trainingPeriods";

    // Check cache first (unless force refresh)
    if (!forceRefresh && cacheStore.isCacheValid(cacheKey)) {
      const cachedData = cacheStore.getCachedData(cacheKey);
      if (cachedData) {
        console.log("Using cached training periods data");
        return cachedData;
      }
    }

    try {
      console.log("Fetching training periods from API");
      const response = await apiCall(`/training-periods`);

      // Cache the response
      cacheStore.setCachedData(cacheKey, response);

      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get training periods"
      );
    }
  },

  // Get training periods for current person
  getAllForPerson: async () => {
    return await apiCall(`/training-periods/person`);
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
    const response = await apiCall("/training-periods", {
      method: "POST",
      body: JSON.stringify(trainingPeriodData),
    });

    // Invalidate training periods cache when new period is created
    useCacheStore.getState().invalidateCache("trainingPeriods");

    return response;
  },

  // Update training period
  update: async (trpe_rk, trainingPeriodData) => {
    const response = await apiCall(`/training-periods/${trpe_rk}`, {
      method: "PUT",
      body: JSON.stringify(trainingPeriodData),
    });

    // Invalidate training periods cache when period is updated
    useCacheStore.getState().invalidateCache("trainingPeriods");

    return response;
  },

  // Delete training period
  delete: async (trpe_rk) => {
    const response = await apiCall(`/training-periods/${trpe_rk}`, {
      method: "DELETE",
    });

    // Invalidate training periods cache when period is deleted
    useCacheStore.getState().invalidateCache("trainingPeriods");

    return response;
  },

  // Invalidate training periods cache (useful for manual cache management)
  invalidateTrainingPeriodsCache: () => {
    useCacheStore.getState().invalidateCache("trainingPeriods");
  },
};
