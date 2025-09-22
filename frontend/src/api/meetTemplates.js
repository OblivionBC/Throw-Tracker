import { apiCall } from "./config";

// Meet Templates API functions
export const meetTemplatesApi = {
  // Create new meet template
  create: async (templateData) => {
    return apiCall("/meet-templates", {
      method: "POST",
      body: JSON.stringify(templateData),
    });
  },

  // Get meet templates for organization
  getForOrg: async () => {
    return apiCall("/meet-templates", { method: "GET" });
  },

  // Get meet template by ID
  getById: async (template_rk) => {
    return apiCall(`/meet-templates/${template_rk}`, { method: "GET" });
  },

  // Update meet template
  update: async (template_rk, templateData) => {
    return apiCall(`/meet-templates/${template_rk}`, {
      method: "PUT",
      body: JSON.stringify(templateData),
    });
  },

  // Delete meet template
  delete: async (template_rk) => {
    return apiCall(`/meet-templates/${template_rk}`, { method: "DELETE" });
  },
  createMeetFromTemplate: async (meetData) => {
    return apiCall("/meets/from-template", {
      method: "POST",
      body: JSON.stringify(meetData),
    });
  },
};
