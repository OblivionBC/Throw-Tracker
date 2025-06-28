import { apiCall } from "./config";

// Exercise Assignments API functions
export const exerciseAssignmentsApi = {
  // Get programs and exercises for training period
  getProgramsAndExercisesForTRPE: async (trpeData) => {
    return await apiCall("/exercise-assignments/training-period", {
      method: "POST",
      body: JSON.stringify(trpeData),
    });
  },

  // Create new exercise assignment
  create: async (assignmentData) => {
    return await apiCall("/exercise-assignments", {
      method: "POST",
      body: JSON.stringify(assignmentData),
    });
  },

  // Update exercise assignment
  update: async (assignment_rk, assignmentData) => {
    return await apiCall(`/exercise-assignments/${assignment_rk}`, {
      method: "PUT",
      body: JSON.stringify(assignmentData),
    });
  },

  // Delete exercise assignment
  delete: async (assignment_rk) => {
    return await apiCall(`/exercise-assignments/${assignment_rk}`, {
      method: "DELETE",
    });
  },
};
