import { apiCall } from "./config";

// Program Measurable Assignments API functions
export const programMeasurableAssignmentsApi = {
  // Add measurable to program
  addToProgram: async (prog_rk, measurableData) => {
    // Ensure is_measured is included with default value
    const dataWithDefaults = {
      ...measurableData,
      is_measured: measurableData.is_measured ?? false,
    };
    return await apiCall(
      `/program-measurable-assignments/programs/${prog_rk}/measurables`,
      {
        method: "POST",
        body: JSON.stringify(dataWithDefaults),
      }
    );
  },

  // Add multiple measurables to program (batch operation)
  addMultipleToProgram: async (prog_rk, measurables) => {
    return await apiCall(
      `/program-measurable-assignments/programs/${prog_rk}/measurables/batch`,
      {
        method: "POST",
        body: JSON.stringify({ measurables }),
      }
    );
  },

  // Get program measurables
  getProgramMeasurables: async (prog_rk) => {
    return await apiCall(
      `/program-measurable-assignments/programs/${prog_rk}/measurables`,
      {
        method: "GET",
      }
    );
  },

  // Update program measurable
  update: async (prma_rk, measurableData) => {
    // Ensure is_measured is included
    const dataWithDefaults = {
      ...measurableData,
      is_measured: measurableData.is_measured ?? false,
    };
    return await apiCall(
      `/program-measurable-assignments/assignments/${prma_rk}`,
      {
        method: "PUT",
        body: JSON.stringify(dataWithDefaults),
      }
    );
  },

  // Remove measurable from program
  removeFromProgram: async (prma_rk) => {
    return await apiCall(
      `/program-measurable-assignments/assignments/${prma_rk}`,
      {
        method: "DELETE",
      }
    );
  },

  // Reorder program measurables
  reorder: async (prog_rk, assignments) => {
    return await apiCall(
      `/program-measurable-assignments/programs/${prog_rk}/reorder`,
      {
        method: "PUT",
        body: JSON.stringify({ assignments }),
      }
    );
  },
};
