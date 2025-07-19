import { apiCall } from "./config";

// Programs API functions (no caching)
export const programsApi = {
  // Get all programs for coach (no caching)
  getAll: async () => {
    try {
      const response = await apiCall("/programs");
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get programs"
      );
    }
  },

  // Get program by ID (no caching)
  getById: async (prog_rk) => {
    try {
      const response = await apiCall(`/programs/${prog_rk}`);
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get program details"
      );
    }
  },

  // Create new program (no caching)
  create: async (programData) => {
    const response = await apiCall("/programs", {
      method: "POST",
      body: JSON.stringify(programData),
    });
    return response;
  },

  // Update program (no caching)
  update: async (prog_rk, programData) => {
    const response = await apiCall(`/programs/${prog_rk}`, {
      method: "PUT",
      body: JSON.stringify(programData),
    });
    return response;
  },

  // Delete program (no caching)
  delete: async (prog_rk) => {
    const response = await apiCall(`/programs/${prog_rk}`, {
      method: "DELETE",
    });
    return response;
  },

  // Get programs for training period (no caching)
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

  // Invalidate programs cache (no-op)
  invalidateProgramsCache: () => {},

  // Invalidate specific program details cache (no-op)
  invalidateProgramDetailsCache: (prog_rk) => {},
};
