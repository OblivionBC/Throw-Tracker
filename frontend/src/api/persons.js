import { apiCall } from "./config";

// Persons API functions
export const personsApi = {
  // Get all persons
  getAll: async () => {
    return await apiCall("/persons");
  },

  // Get person by ID
  getById: async (prsn_rk) => {
    return await apiCall(`/persons/${prsn_rk}`);
  },

  // Get athletes
  getAthletesForCoach: async () => {
    return await apiCall(`/persons/athletes`);
  },

  // Create new person
  create: async (personData) => {
    return await apiCall("/persons", {
      method: "POST",
      body: JSON.stringify(personData),
    });
  },

  // Update password
  updatePassword: async (prsn_rk, passwordData) => {
    return await apiCall(`/persons/${prsn_rk}/password`, {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
  },

  // Delete person
  delete: async (prsn_rk) => {
    return await apiCall(`/persons/${prsn_rk}`, {
      method: "DELETE",
    });
  },

  fetchUser: async () => {
    try {
      return await apiCall("/persons/me");
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },
};
