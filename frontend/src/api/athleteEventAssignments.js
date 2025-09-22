import { apiCall } from "./config";

// Athlete Event Assignments API functions
export const athleteEventAssignmentsApi = {
  // Assign event to athlete
  assign: async (athlete_rk, etyp_rk) => {
    return await apiCall("/athlete-event-assignments/assign", {
      method: "POST",
      body: JSON.stringify({ athlete_rk, etyp_rk }),
    });
  },

  // Unassign event from athlete
  unassign: async (athlete_rk, etyp_rk) => {
    return await apiCall("/athlete-event-assignments/unassign", {
      method: "DELETE",
      body: JSON.stringify({ athlete_rk, etyp_rk }),
    });
  },

  // Get events for athlete
  getByAthlete: async (athlete_rk) => {
    return await apiCall(`/athlete-event-assignments/athlete/${athlete_rk}`);
  },

  // Get athletes for event
  getByEvent: async (etyp_rk) => {
    return await apiCall(`/athlete-event-assignments/event/${etyp_rk}`);
  },
};
