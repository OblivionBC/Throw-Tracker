import { apiCall } from "./config";

// Programs API functions
export const programsApi = {
  // Create new program
  create: async (programData) => {
    return await apiCall("/programs", {
      method: "POST",
      body: JSON.stringify(programData),
    });
  },
};
