import { apiCall } from "./config";

// Admin API functions
export const adminApi = {
  // Organization management
  getAllOrganizations: async () => {
    return await apiCall("/admin/organizations");
  },

  getOrganizationById: async (org_rk) => {
    return await apiCall(`/admin/organizations/${org_rk}`);
  },

  createOrganization: async (organizationData) => {
    return await apiCall("/admin/organizations", {
      method: "POST",
      body: JSON.stringify(organizationData),
    });
  },

  updateOrganization: async (org_rk, organizationData) => {
    return await apiCall(`/admin/organizations/${org_rk}`, {
      method: "PUT",
      body: JSON.stringify(organizationData),
    });
  },

  deleteOrganization: async (org_rk) => {
    return await apiCall(`/admin/organizations/${org_rk}`, {
      method: "DELETE",
    });
  },

  // Subscription management
  getAllSubscriptions: async () => {
    return await apiCall("/admin/subscriptions");
  },

  getSubscriptionAnalytics: async () => {
    return await apiCall("/admin/subscriptions/analytics");
  },

  updateSubscription: async (sub_rk, subscriptionData) => {
    return await apiCall(`/admin/subscriptions/${sub_rk}`, {
      method: "PUT",
      body: JSON.stringify(subscriptionData),
    });
  },
};
