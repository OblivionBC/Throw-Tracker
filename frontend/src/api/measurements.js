import { apiCall } from "./config";

// Measurements API functions
export const measurementsApi = {
  // Get measurements for a practice
  getForPractice: async (prac_rk) => {
    return await apiCall(`/measurements/practice/${prac_rk}`);
  },

  // Get measurements for training periods
  getForTrainingPeriods: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/measurements/training-periods?${queryString}`);
  },

  // Create new measurement
  create: async (measurementData) => {
    return await apiCall("/measurements", {
      method: "POST",
      body: JSON.stringify(measurementData),
    });
  },

  // Delete measurement
  delete: async (meas_rk) => {
    return await apiCall(`/measurements/${meas_rk}`, {
      method: "DELETE",
    });
  },

  // Delete measurements for a practice
  deleteForPractice: async (prac_rk) => {
    return await apiCall(`/measurements/practice/${prac_rk}`, {
      method: "DELETE",
    });
  },
};
