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
  getAthletesForCoach: async (coach_prsn_rk) => {
    return await apiCall(`/persons/athletes/${coach_prsn_rk}`);
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

  // Login
  login: async (loginData) => {
    return await apiCall("/persons/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
  },
};
