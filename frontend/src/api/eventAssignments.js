import { apiCall } from "./config";

// Event Assignments API functions
export const eventAssignmentsApi = {
  // Create new event assignment
  create: async (assignmentData) => {
    return await apiCall("/event-assignments", {
      method: "POST",
      body: JSON.stringify(assignmentData),
    });
  },

  // Get event assignments by meet
  getByMeet: async (meet_rk) => {
    return await apiCall(`/event-assignments/meet/${meet_rk}`);
  },

  // Get all event assignments by meet (for meet details)
  getAllByMeet: async (meet_rk) => {
    return await apiCall(`/event-assignments/meet/${meet_rk}/all`);
  },

  // Get event assignments by athlete
  getByAthlete: async (prsn_rk) => {
    return await apiCall(`/event-assignments/athlete/${prsn_rk}`);
  },

  // Get specific event assignment
  getById: async (meet_rk, prsn_rk, etyp_rk) => {
    return await apiCall(`/event-assignments/${meet_rk}/${prsn_rk}/${etyp_rk}`);
  },

  // Update event assignment
  update: async (meet_rk, prsn_rk, etyp_rk, assignmentData) => {
    return await apiCall(
      `/event-assignments/${meet_rk}/${prsn_rk}/${etyp_rk}`,
      {
        method: "PUT",
        body: JSON.stringify(assignmentData),
      }
    );
  },

  // Delete event assignment
  delete: async (meet_rk, prsn_rk, etyp_rk) => {
    return await apiCall(
      `/event-assignments/${meet_rk}/${prsn_rk}/${etyp_rk}`,
      {
        method: "DELETE",
      }
    );
  },
};
