import { apiCall } from "./config";

// Program Measurable Assignments API functions
export const programMeasurableAssignmentsApi = {
  // Add measurable to program
  addToProgram: async (prog_rk, measurableData) => {
    try {
      // Ensure is_measured is included with default value
      const dataWithDefaults = {
        ...measurableData,
        is_measured: measurableData.is_measured ?? false,
      };
      const response = await apiCall(
        `/program-measurable-assignments/programs/${prog_rk}/measurables`,
        {
          method: "POST",
          body: JSON.stringify(dataWithDefaults),
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to add measurable to program"
      );
    }
  },

  // Add multiple measurables to program (batch operation)
  addMultipleToProgram: async (prog_rk, measurables) => {
    try {
      const response = await apiCall(
        `/program-measurable-assignments/programs/${prog_rk}/measurables/batch`,
        {
          method: "POST",
          body: JSON.stringify({ measurables }),
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to add measurables to program"
      );
    }
  },

  // Get program measurables
  getProgramMeasurables: async (prog_rk) => {
    try {
      const response = await apiCall(
        `/program-measurable-assignments/programs/${prog_rk}/measurables`,
        {
          method: "GET",
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get program measurables"
      );
    }
  },

  // Update program measurable
  update: async (prma_rk, measurableData) => {
    try {
      // Ensure is_measured is included
      const dataWithDefaults = {
        ...measurableData,
        is_measured: measurableData.is_measured ?? false,
      };
      const response = await apiCall(
        `/program-measurable-assignments/assignments/${prma_rk}`,
        {
          method: "PUT",
          body: JSON.stringify(dataWithDefaults),
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update program measurable"
      );
    }
  },

  // Remove measurable from program
  removeFromProgram: async (prma_rk) => {
    try {
      const response = await apiCall(
        `/program-measurable-assignments/assignments/${prma_rk}`,
        {
          method: "DELETE",
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to remove measurable from program"
      );
    }
  },

  // Reorder program measurables
  reorder: async (prog_rk, assignments) => {
    try {
      const response = await apiCall(
        `/program-measurable-assignments/programs/${prog_rk}/reorder`,
        {
          method: "PUT",
          body: JSON.stringify({ assignments }),
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to reorder program measurables"
      );
    }
  },
};
