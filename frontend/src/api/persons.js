import { apiCall } from "./config";

// Persons API functions (no caching)
export const personsApi = {
  // Get all athletes for coach (no caching)
  getAthletesForCoach: async () => {
    try {
      const response = await apiCall("/persons/athletes");
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get athletes for coach"
      );
    }
  },

  // Get all persons (no caching)
  getAll: async () => {
    return await apiCall("/persons");
  },

  // Get person by ID (no caching)
  getById: async (prsn_rk) => {
    return await apiCall(`/persons/${prsn_rk}`);
  },

  // Create new person (no caching)
  create: async (personData) => {
    const response = await apiCall("/persons", {
      method: "POST",
      body: JSON.stringify(personData),
    });
    return response;
  },

  // Update person (no caching)
  update: async (prsn_rk, personData) => {
    const response = await apiCall(`/persons/${prsn_rk}`, {
      method: "PUT",
      body: JSON.stringify(personData),
    });
    return response;
  },

  // Delete person (no caching)
  delete: async (prsn_rk) => {
    const response = await apiCall(`/persons/${prsn_rk}`, {
      method: "DELETE",
    });
    return response;
  },

  // Invalidate athletes cache (no-op)
  invalidateAthletesCache: () => {},

  // Fetch current user (no caching)
  fetchUser: async () => {
    try {
      const response = await apiCall("/persons/me");
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  },
};
