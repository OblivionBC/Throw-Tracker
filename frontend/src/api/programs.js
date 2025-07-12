import { apiCall } from "./config";
import useCacheStore from "../stores/cacheStore";

// Programs API functions with caching
export const programsApi = {
  // Get all programs for coach (with caching)
  getAll: async (forceRefresh = false) => {
    const cacheStore = useCacheStore.getState();
    const cacheKey = "programs";

    // Check cache first (unless force refresh)
    if (!forceRefresh && cacheStore.isCacheValid(cacheKey)) {
      const cachedData = cacheStore.getCachedData(cacheKey);
      if (cachedData) {
        console.log("Using cached programs data");
        return cachedData;
      }
    }

    try {
      console.log("Fetching programs from API");
      const response = await apiCall("/programs");

      // Cache the response
      cacheStore.setCachedData(cacheKey, response);

      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get programs"
      );
    }
  },

  // Get program by ID (with caching)
  getById: async (prog_rk, forceRefresh = false) => {
    const cacheStore = useCacheStore.getState();
    const cacheKey = `programDetails_${prog_rk}`;

    // Check cache first (unless force refresh)
    if (!forceRefresh && cacheStore.isCacheValid(cacheKey)) {
      const cachedData = cacheStore.getCachedData(cacheKey);
      if (cachedData) {
        console.log("Using cached program details data");
        return cachedData;
      }
    }

    try {
      console.log("Fetching program details from API");
      const response = await apiCall(`/programs/${prog_rk}`);

      // Cache the response
      cacheStore.setCachedData(cacheKey, response);

      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get program details"
      );
    }
  },

  // Create new program
  create: async (programData) => {
    const response = await apiCall("/programs", {
      method: "POST",
      body: JSON.stringify(programData),
    });

    // Invalidate programs cache when new program is created
    useCacheStore.getState().invalidateCache("programs");

    return response;
  },

  // Update program
  update: async (prog_rk, programData) => {
    const response = await apiCall(`/programs/${prog_rk}`, {
      method: "PUT",
      body: JSON.stringify(programData),
    });

    // Invalidate program-related caches
    useCacheStore
      .getState()
      .invalidateMultiple([
        "programs",
        `programDetails_${prog_rk}`,
        "programAssignments",
      ]);

    return response;
  },

  // Delete program
  delete: async (prog_rk) => {
    const response = await apiCall(`/programs/${prog_rk}`, {
      method: "DELETE",
    });

    // Invalidate program-related caches
    useCacheStore
      .getState()
      .invalidateMultiple([
        "programs",
        `programDetails_${prog_rk}`,
        "programAssignments",
      ]);

    return response;
  },

  // Get programs for training period
  getForTrainingPeriod: async (trpe_rk) => {
    try {
      const response = await apiCall(`/programs/training-period/${trpe_rk}`, {
        method: "GET",
      });
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to get programs for training period"
      );
    }
  },

  // Invalidate programs cache (useful for manual cache management)
  invalidateProgramsCache: () => {
    useCacheStore.getState().invalidateCache("programs");
  },

  // Invalidate specific program details cache
  invalidateProgramDetailsCache: (prog_rk) => {
    useCacheStore.getState().invalidateCache(`programDetails_${prog_rk}`);
  },
};
