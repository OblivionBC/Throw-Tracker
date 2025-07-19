import { apiCall } from "./config";

// Measurables API functions (no caching)
export const measurablesApi = {
  // Get all measurables (no caching)
  getAll: async () => {
    return await apiCall("/measurables");
  },

  // Get measurable by ID (no caching)
  getById: async (meas_rk) => {
    return await apiCall(`/measurables/${meas_rk}`);
  },

  // Get measurables for coach (no caching)
  getForCoach: async () => {
    try {
      const response = await apiCall("/measurables/coach");
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get measurables for coach"
      );
    }
  },

  // Get measurables for athletes (no caching)
  getForAthletes: async () => {
    return await apiCall("/measurables/athletes");
  },

  // Get measurables for the current user (no caching)
  getAllForPerson: async () => {
    try {
      const response = await apiCall("/measurables/person");
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get measurables for user"
      );
    }
  },

  // Create new measurable (no caching)
  create: async (measurableData) => {
    const response = await apiCall("/measurables", {
      method: "POST",
      body: JSON.stringify(measurableData),
    });
    return response;
  },

  // Update measurable (no caching)
  update: async (meas_rk, measurableData) => {
    const response = await apiCall(`/measurables/${meas_rk}`, {
      method: "PUT",
      body: JSON.stringify(measurableData),
    });
    return response;
  },

  // Delete measurable (no caching)
  delete: async (meas_rk) => {
    const response = await apiCall(`/measurables/${meas_rk}`, {
      method: "DELETE",
    });
    return response;
  },

  // Add measurable to program (no caching)
  addToProgram: async (prog_rk, measurableData) => {
    const response = await apiCall(
      `/program-measurable-assignments/programs/${prog_rk}/measurables`,
      {
        method: "POST",
        body: JSON.stringify(measurableData),
      }
    );
    return response;
  },

  // Add multiple measurables to program (batch operation, no caching)
  addMultipleToProgram: async (prog_rk, measurables) => {
    const response = await apiCall(
      `/program-measurable-assignments/programs/${prog_rk}/measurables/batch`,
      {
        method: "POST",
        body: JSON.stringify({ measurables }),
      }
    );
    return response;
  },

  // Invalidate measurables cache (no-op)
  invalidateMeasurablesCache: () => {},
};
