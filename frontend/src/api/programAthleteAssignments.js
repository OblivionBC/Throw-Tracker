import { apiCall } from "./config";
import useCacheStore from "../stores/cacheStore";

// Program Athlete Assignments API functions with caching
export const programAthleteAssignmentsApi = {
  // Assign program to training periods
  assignToTrainingPeriods: async (prog_rk, assignments) => {
    try {
      const response = await apiCall(
        `/program-athlete-assignments/programs/${prog_rk}/assign`,
        {
          method: "POST",
          body: JSON.stringify({ assignments }),
        }
      );

      // Invalidate related caches
      useCacheStore
        .getState()
        .invalidateMultiple([
          "programAssignments",
          `programDetails_${prog_rk}`,
          "programs",
        ]);

      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to assign program to training periods"
      );
    }
  },

  // Get program assignments (with caching)
  getProgramAssignments: async (prog_rk, forceRefresh = false) => {
    const cacheStore = useCacheStore.getState();
    const cacheKey = `programAssignments_${prog_rk}`;

    // Check cache first (unless force refresh)
    if (!forceRefresh && cacheStore.isCacheValid(cacheKey)) {
      const cachedData = cacheStore.getCachedData(cacheKey);
      if (cachedData) {
        console.log("Using cached program assignments data");
        return cachedData;
      }
    }

    try {
      console.log("Fetching program assignments from API");
      const response = await apiCall(
        `/program-athlete-assignments/programs/${prog_rk}/assignments`,
        {
          method: "GET",
        }
      );

      // Cache the response
      cacheStore.setCachedData(cacheKey, response);

      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get program assignments"
      );
    }
  },

  // Remove program from athlete
  removeFromAthlete: async (paa_rk) => {
    try {
      const response = await apiCall(
        `/program-athlete-assignments/assignments/${paa_rk}`,
        {
          method: "DELETE",
        }
      );

      // Invalidate program assignments cache
      useCacheStore.getState().invalidateCache("programAssignments");

      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to remove program from athlete"
      );
    }
  },

  // Get athlete programs
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

  // Get training period programs
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

  // Invalidate program assignments cache (useful for manual cache management)
  invalidateProgramAssignmentsCache: (prog_rk) => {
    if (prog_rk) {
      useCacheStore.getState().invalidateCache(`programAssignments_${prog_rk}`);
    } else {
      useCacheStore.getState().invalidateCache("programAssignments");
    }
  },
};
