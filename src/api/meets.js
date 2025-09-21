import { apiCall } from "./config";

// Meets API functions
export const meetsApi = {
  // Get all meets
  getAll: async () => {
    return apiCall("/meets", { method: "GET" });
  },

  // Get meet by ID
  getById: async (meet_rk) => {
    return apiCall(`/meets/${meet_rk}`, { method: "GET" });
  },

  // Create new meet
  addMeet: async (meetData) => {
    return apiCall("/meets", {
      method: "POST",
      body: JSON.stringify(meetData),
    });
  },

  // Create meet from template
  createFromTemplate: async (meetData) => {
    return apiCall("/meets/from-template", {
      method: "POST",
      body: JSON.stringify(meetData),
    });
  },

  // Create meet event
  createMeetEvent: async (meet_rk, eventData) => {
    return apiCall(`/meets/${meet_rk}/events`, {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  },

  // Update meet
  update: async (meet_rk, meetData) => {
    return apiCall(`/meets/${meet_rk}`, {
      method: "PUT",
      body: JSON.stringify(meetData),
    });
  },

  // Delete meet
  delete: async (meet_rk) => {
    return apiCall(`/meets/${meet_rk}`, { method: "DELETE" });
  },

  // Get meets for coach's organization
  getForCoachOrg: async () => {
    return apiCall("/meets/coach-org", { method: "GET" });
  },

  // Get meet schedule
  getSchedule: async (meet_rk) => {
    return apiCall(`/meets/${meet_rk}/schedule`, { method: "GET" });
  },

  // Get coach assignments for meet
  getCoachAssignments: async (meet_rk) => {
    return apiCall(`/meets/${meet_rk}/coach-assignments`, { method: "GET" });
  },

  // Check scheduling conflicts
  checkConflicts: async (conflictData) => {
    return apiCall("/meets/check-conflicts", {
      method: "POST",
      body: JSON.stringify(conflictData),
    });
  },

  // Assign coach to event
  assignCoach: async (assignmentData) => {
    return apiCall("/meets/assign-coach", {
      method: "POST",
      body: JSON.stringify(assignmentData),
    });
  },
};
