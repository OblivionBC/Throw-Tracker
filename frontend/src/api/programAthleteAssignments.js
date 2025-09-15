import { apiCall } from "./config";

// Program Athlete Assignments API functions (no caching)
export const programAthleteAssignmentsApi = {
  // Assign program to training periods (no caching)
  assignToTrainingPeriods: async (prog_rk, assignments) => {
    return await apiCall(
      `/program-athlete-assignments/programs/${prog_rk}/assign`,
      {
        method: "POST",
        body: JSON.stringify({ assignments }),
      }
    );
  },

  // Get program assignments (no caching)
  getProgramAssignments: async (prog_rk) => {
    return await apiCall(
      `/program-athlete-assignments/programs/${prog_rk}/assignments`,
      {
        method: "GET",
      }
    );
  },

  // Remove program from athlete (no caching)
  removeFromAthlete: async (paa_rk) => {
    return await apiCall(`/program-athlete-assignments/assignments/${paa_rk}`, {
      method: "DELETE",
    });
  },

  // Get athlete programs (no caching)
  getAthletePrograms: async (athlete_prsn_rk) => {
    return await apiCall(
      `/program-athlete-assignments/athletes/${athlete_prsn_rk}/programs`,
      {
        method: "GET",
      }
    );
  },

  // Get training period programs (no caching)
  getTrainingPeriodPrograms: async (trpe_rk) => {
    return await apiCall(
      `/program-athlete-assignments/training-periods/${trpe_rk}/programs`,
      {
        method: "GET",
      }
    );
  },

  // Invalidate program assignments cache (no-op)
  invalidateProgramAssignmentsCache: (prog_rk) => {},
};
