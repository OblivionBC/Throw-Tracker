import { apiCall } from "./config";

// Subscriptions API functions
export const subscriptionsApi = {
  // Get available subscription plans
  getAvailablePlans: async () => {
    return await apiCall("/subscriptions/plans");
  },

  // Get current subscription for an organization
  getCurrentSubscription: async (org_rk) => {
    return await apiCall(`/subscriptions/current/${org_rk}`);
  },

  // Get subscription history for an organization
  getSubscriptionHistory: async (org_rk) => {
    return await apiCall(`/subscriptions/history/${org_rk}`);
  },

  // Create new subscription
  createSubscription: async (subscriptionData) => {
    return await apiCall("/subscriptions", {
      method: "POST",
      body: JSON.stringify(subscriptionData),
    });
  },

  // Cancel subscription
  cancelSubscription: async (
    sub_rk,
    cancellationReason = "User requested cancellation"
  ) => {
    return await apiCall(`/subscriptions/cancel/${sub_rk}`, {
      method: "POST",
      body: JSON.stringify({ cancellation_reason: cancellationReason }),
    });
  },

  // Check organization limits
  checkLimits: async (org_rk, limitType) => {
    return await apiCall(
      `/subscriptions/limits/${org_rk}?limit_type=${limitType}`
    );
  },

  // Helper function to check if organization can add more of a resource
  canAddResource: async (org_rk, resourceType) => {
    try {
      const response = await subscriptionsApi.checkLimits(org_rk, resourceType);
      return response.within_limits;
    } catch (error) {
      Logger.error(`Error checking ${resourceType} limits:`, error);
      return false; // Default to false if check fails
    }
  },

  // Helper function to get subscription limits
  getSubscriptionLimits: async (org_rk) => {
    try {
      const response = await subscriptionsApi.getCurrentSubscription(org_rk);
      return {
        max_athletes: response.max_athletes,
        max_coaches: response.max_coaches,
        max_programs: response.max_programs,
        max_meets_per_month: response.max_meets_per_month,
        storage_limit_gb: response.storage_limit_gb,
        features: response.features,
      };
    } catch (error) {
      Logger.error("Error getting subscription limits:", error);
      return null;
    }
  },
};
