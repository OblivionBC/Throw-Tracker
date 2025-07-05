import { apiCall } from "./config";

// Measurements API functions
export const measurementsApi = {
  // Get measurements for a practice
  getForPractice: async (prac_rk) => {
    if (!prac_rk) {
      throw new Error("Practice ID (prac_rk) is required");
    }
    return await apiCall(`/measurements/practice/${prac_rk}`);
  },

  // Get measurements for training periods
  getForTrainingPeriods: async (params) => {
    if (!params) {
      throw new Error("Parameters are required");
    }
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/measurements/training-periods?${queryString}`);
  },

  // Create new measurement
  create: async (measurementData) => {
    if (!measurementData) {
      throw new Error("Measurement data is required");
    }
    return await apiCall("/measurements", {
      method: "POST",
      body: JSON.stringify(measurementData),
    });
  },

  // Delete measurement
  delete: async (meas_rk) => {
    if (!meas_rk) {
      throw new Error("Measurement ID (meas_rk) is required");
    }
    return await apiCall(`/measurements/${meas_rk}`, {
      method: "DELETE",
    });
  },

  // Delete measurements for a practice
  deleteForPractice: async (prac_rk) => {
    if (!prac_rk) {
      throw new Error("Practice ID (prac_rk) is required");
    }
    return await apiCall(`/measurements/practice/${prac_rk}`, {
      method: "DELETE",
    });
  },
};
