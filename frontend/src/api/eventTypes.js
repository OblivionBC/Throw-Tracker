import { apiCall } from "./config";

// Event Types API functions
export const eventTypesApi = {
  // Get all event types
  getAll: async () => {
    return await apiCall("/event-types");
  },

  // Get event type by ID
  getById: async (etyp_rk) => {
    return await apiCall(`/event-types/${etyp_rk}`);
  },
};
