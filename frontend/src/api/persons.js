import { apiCall } from "./config";
import useCacheStore from "../stores/cacheStore";

// Persons API functions with caching
export const personsApi = {
  // Get all athletes for coach (with caching)
  getAthletesForCoach: async (forceRefresh = false) => {
    const cacheStore = useCacheStore.getState();
    const cacheKey = "athletes";

    // Check cache first (unless force refresh)
    if (!forceRefresh && cacheStore.isCacheValid(cacheKey)) {
      const cachedData = cacheStore.getCachedData(cacheKey);
      if (cachedData) {
        console.log("Using cached athletes data");
        return cachedData;
      }
    }

    try {
      console.log("Fetching athletes from API");
      const response = await apiCall("/persons/athletes");

      // Cache the response
      cacheStore.setCachedData(cacheKey, response);

      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get athletes for coach"
      );
    }
  },

  // Get all persons
  getAll: async () => {
    return await apiCall("/persons");
  },

  // Get person by ID
  getById: async (prsn_rk) => {
    return await apiCall(`/persons/${prsn_rk}`);
  },

  // Create new person
  create: async (personData) => {
    const response = await apiCall("/persons", {
      method: "POST",
      body: JSON.stringify(personData),
    });

    // Invalidate athletes cache when new person is created
    useCacheStore.getState().invalidateCache("athletes");

    return response;
  },

  // Update person
  update: async (prsn_rk, personData) => {
    const response = await apiCall(`/persons/${prsn_rk}`, {
      method: "PUT",
      body: JSON.stringify(personData),
    });

    // Invalidate athletes cache when person is updated
    useCacheStore.getState().invalidateCache("athletes");

    return response;
  },

  // Delete person
  delete: async (prsn_rk) => {
    const response = await apiCall(`/persons/${prsn_rk}`, {
      method: "DELETE",
    });

    // Invalidate athletes cache when person is deleted
    useCacheStore.getState().invalidateCache("athletes");

    return response;
  },

  // Invalidate athletes cache (useful for manual cache management)
  invalidateAthletesCache: () => {
    useCacheStore.getState().invalidateCache("athletes");
  },
};
