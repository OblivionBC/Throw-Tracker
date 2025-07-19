import { apiCall } from "./config";

// Program Athlete Assignments API functions (no caching)
export const programAthleteAssignmentsApi = {
  // Assign program to training periods (no caching)
  assignToTrainingPeriods: async (prog_rk, assignments) => {
    try {
      const response = await apiCall(
        `/program-athlete-assignments/programs/${prog_rk}/assign`,
        {
          method: "POST",
          body: JSON.stringify({ assignments }),
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to assign program to training periods"
      );
    }
  },

  // Get program assignments (no caching)
  getProgramAssignments: async (prog_rk) => {
    try {
      const response = await apiCall(
        `/program-athlete-assignments/programs/${prog_rk}/assignments`,
        {
          method: "GET",
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get program assignments"
      );
    }
  },

  // Remove program from athlete (no caching)
  removeFromAthlete: async (paa_rk) => {
    try {
      const response = await apiCall(
        `/program-athlete-assignments/assignments/${paa_rk}`,
        {
          method: "DELETE",
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to remove program from athlete"
      );
    }
  },

  // Get athlete programs (no caching)
  getAthletePrograms: async (athlete_prsn_rk) => {
    try {
      const response = await apiCall(
        `/program-athlete-assignments/athletes/${athlete_prsn_rk}/programs`,
        {
          method: "GET",
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get athlete programs"
      );
    }
  },

  // Get training period programs (no caching)
  getTrainingPeriodPrograms: async (trpe_rk) => {
    try {
      const response = await apiCall(
        `/program-athlete-assignments/training-periods/${trpe_rk}/programs`,
        {
          method: "GET",
        }
      );
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to get training period programs"
      );
    }
  },

  // Invalidate program assignments cache (no-op)
  invalidateProgramAssignmentsCache: (prog_rk) => {},
};
