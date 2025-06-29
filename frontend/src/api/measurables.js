import { apiCall } from "./config";

// Measurables API functions
export const measurablesApi = {
  // Get all measurables for a person
  getAllForPerson: async (prsn_rk) => {
    return await apiCall(`/measurables?prsn_rk=${prsn_rk}`);
  },

  // Get measurables for a practice
  getForPractice: async (prac_rk) => {
    return await apiCall(`/measurables/practice/${prac_rk}`);
  },

  // Create new measurable
  create: async (measurableData) => {
    return await apiCall("/measurables", {
      method: "POST",
      body: JSON.stringify(measurableData),
    });
  },

  // Update measurable
  update: async (meas_rk, measurableData) => {
    return await apiCall(`/measurables/${meas_rk}`, {
      method: "PUT",
      body: JSON.stringify(measurableData),
    });
  },

  // Delete measurable
  delete: async (meas_rk) => {
    return await apiCall(`/measurables/${meas_rk}`, {
      method: "DELETE",
    });
  },
};
