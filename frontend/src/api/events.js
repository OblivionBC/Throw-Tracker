import { apiCall } from "./config";

// Events API functions
export const eventsApi = {
  // Get all events
  getAll: async () => {
    return await apiCall("/events");
  },

  // Get event by ID
  getById: async (even_rk) => {
    return await apiCall(`/events/${even_rk}`);
  },

  // Create new event
  create: async (eventData) => {
    return await apiCall("/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  },

  // Update event
  update: async (even_rk, eventData) => {
    return await apiCall(`/events/${even_rk}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    });
  },

  // Delete event
  delete: async (even_rk) => {
    return await apiCall(`/events/${even_rk}`, {
      method: "DELETE",
    });
  },
};
