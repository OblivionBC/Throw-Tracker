import { apiCall } from "./config";

// Exercise API functions
export const exercisesApi = {
  // Get all exercises
  getAll: async () => {
    return await apiCall("/exercises");
  },

  // Get exercise by ID
  getById: async (excr_rk) => {
    return await apiCall(`/exercises/${excr_rk}`);
  },

  // Get exercises for a specific coach
  getForCoach: async (coach_prsn_rk) => {
    return await apiCall(`/exercises/coach/${coach_prsn_rk}`);
  },

  // Create new exercise
  create: async (exerciseData) => {
    return await apiCall("/exercises", {
      method: "POST",
      body: JSON.stringify(exerciseData),
    });
  },

  // Update exercise
  update: async (excr_rk, exerciseData) => {
    return await apiCall(`/exercises/${excr_rk}`, {
      method: "PUT",
      body: JSON.stringify(exerciseData),
    });
  },

  // Delete exercise
  delete: async (excr_rk) => {
    return await apiCall(`/exercises/${excr_rk}`, {
      method: "DELETE",
    });
  },
};
