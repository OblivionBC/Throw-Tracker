import { apiCall } from "./config";
import useCacheStore from "../stores/cacheStore";

// Measurables API functions with caching
export const measurablesApi = {
  // Get all measurables
  getAll: async () => {
    return await apiCall("/measurables");
  },

  // Get measurable by ID
  getById: async (meas_rk) => {
    return await apiCall(`/measurables/${meas_rk}`);
  },

  // Get measurables for coach (with caching)
  getForCoach: async (forceRefresh = false) => {
    const cacheStore = useCacheStore.getState();
    const cacheKey = "measurables";

    // Check cache first (unless force refresh)
    if (!forceRefresh && cacheStore.isCacheValid(cacheKey)) {
      const cachedData = cacheStore.getCachedData(cacheKey);
      if (cachedData) {
        console.log("Using cached measurables data");
        return cachedData;
      }
    }

    try {
      console.log("Fetching measurables from API");
      const response = await apiCall("/measurables/coach");

      // Cache the response
      cacheStore.setCachedData(cacheKey, response);

      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get measurables for coach"
      );
    }
  },

  // Get measurables for athletes
  getForAthletes: async () => {
    return await apiCall("/measurables/athletes");
  },

  // Create new measurable
  create: async (measurableData) => {
    const response = await apiCall("/measurables", {
      method: "POST",
      body: JSON.stringify(measurableData),
    });

    // Invalidate measurables cache when new measurable is created
    useCacheStore.getState().invalidateCache("measurables");

    return response;
  },

  // Update measurable
  update: async (meas_rk, measurableData) => {
    const response = await apiCall(`/measurables/${meas_rk}`, {
      method: "PUT",
      body: JSON.stringify(measurableData),
    });

    // Invalidate measurables cache when measurable is updated
    useCacheStore.getState().invalidateCache("measurables");

    return response;
  },

  // Delete measurable
  delete: async (meas_rk) => {
    const response = await apiCall(`/measurables/${meas_rk}`, {
      method: "DELETE",
    });

    // Invalidate measurables cache when measurable is deleted
    useCacheStore.getState().invalidateCache("measurables");

    return response;
  },

  // Add measurable to program
  addToProgram: async (prog_rk, measurableData) => {
    const response = await apiCall(
      `/program-measurable-assignments/programs/${prog_rk}/measurables`,
      {
        method: "POST",
        body: JSON.stringify(measurableData),
      }
    );

    // Invalidate program-related caches
    useCacheStore
      .getState()
      .invalidateMultiple(["programDetails", "programAssignments", "programs"]);

    return response;
  },

  // Add multiple measurables to program (batch operation)
  addMultipleToProgram: async (prog_rk, measurables) => {
    const response = await apiCall(
      `/program-measurable-assignments/programs/${prog_rk}/measurables/batch`,
      {
        method: "POST",
        body: JSON.stringify({ measurables }),
      }
    );

    // Invalidate program-related caches
    useCacheStore
      .getState()
      .invalidateMultiple(["programDetails", "programAssignments", "programs"]);

    return response;
  },

  // Invalidate measurables cache (useful for manual cache management)
  invalidateMeasurablesCache: () => {
    useCacheStore.getState().invalidateCache("measurables");
  },
};
