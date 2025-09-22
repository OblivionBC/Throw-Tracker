import useUserStore from "../stores/userStore";
import Logger from "../utils/logger";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL
    : "http://localhost:4000/api";

// Common fetch options
const defaultOptions = {
  credentials: "include", // This is required for cookies to be sent
  headers: {
    "Content-Type": "application/json",
  },
};

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

// Debounce mechanism to prevent rapid successive calls
const pendingRequests = new Map();
const DEBOUNCE_DELAY = 1000; // 1 second

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Helper function for making API calls
const apiCall = async (endpoint, options = {}) => {
  // Check for pending request to same endpoint
  const requestKey = `${endpoint}-${JSON.stringify(options)}`;
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }
  Logger.log("Requesting at  " + API_BASE_URL + endpoint);
  // Create the request promise and store it
  const requestPromise = (async () => {
    const url = `${API_BASE_URL}${endpoint}`;
    const fetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      // Check access token cache before making API call (except for auth endpoints)
      const isAuthEndpoint =
        endpoint.includes("/auth/login") ||
        endpoint.includes("/auth/refresh") ||
        endpoint.includes("/auth/token-status") ||
        endpoint.includes("/auth/logout") ||
        endpoint.includes("/auth/signup");

      if (!isAuthEndpoint) {
        const {
          isAccessTokenExpired,
          isRefreshTokenExpired,
          handleExpiredToken,
        } = useUserStore.getState();

        // Check if refresh token is expired (this means user needs to login again)
        if (isRefreshTokenExpired()) {
          handleExpiredToken();
          throw new Error("Refresh token expired");
        }

        // Check if access token is expired (this means we need to refresh)
        if (isAccessTokenExpired()) {
          // Will attempt refresh on 401
        }
      }
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // If access token is expired and we're not already refreshing
        if (
          response.status === 401 &&
          !isRefreshing &&
          endpoint !== "/auth/refresh" &&
          !isAuthEndpoint
        ) {
          if (isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(() => {
                return apiCall(endpoint, options);
              })
              .catch((err) => {
                throw err;
              });
          }

          isRefreshing = true;

          try {
            // Attempt to refresh the access token using refresh token
            const refreshResponse = await fetch(
              `${API_BASE_URL}/auth/refresh`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              // Update token cache with new expiration
              if (
                refreshData.accessTokenExpiresIn &&
                refreshData.refreshTokenExpiresIn
              ) {
                useUserStore
                  .getState()
                  .setTokenExpiration(
                    refreshData.accessTokenExpiresIn,
                    refreshData.refreshTokenExpiresIn
                  );
              }
              processQueue(null, true);
              // Retry the original request
              return apiCall(endpoint, options);
            } else {
              processQueue(new Error("Token refresh failed"), null);
              // Token refresh failed, immediately handle expired token
              useUserStore.getState().handleExpiredToken();
              throw new Error("Authentication failed");
            }
          } catch (refreshError) {
            Logger.error("Token refresh error:", refreshError);
            processQueue(refreshError, null);
            // Token refresh failed, immediately handle expired token
            useUserStore.getState().handleExpiredToken();
            throw new Error("Authentication failed");
          } finally {
            isRefreshing = false;
          }
        }

        // For any other 401/403 errors, immediately handle expired token
        if (
          (response.status === 401 || response.status === 403) &&
          !isAuthEndpoint
        ) {
          Logger.log("  401/403 error detected - handling expired token");
          Logger.log("  Response status:", response.status);
          Logger.log("  Is auth endpoint:", isAuthEndpoint);
          Logger.log("  Current URL:", window.location.href);
          Logger.log("  Current pathname:", window.location.pathname);

          // Handle expired token first
          try {
            useUserStore.getState().handleExpiredToken();
            Logger.log("  handleExpiredToken called successfully");
          } catch (error) {
            Logger.error("  Error calling handleExpiredToken:", error);
          }

          throw new Error("Authentication failed");
        }

        throw new Error(
          errorData.error?.message ||
            errorData.message ||
            `HTTP ${response.status}`
        );
      }
      const result = await response.json();

      // Clean up pending request after successful completion
      setTimeout(() => {
        pendingRequests.delete(requestKey);
      }, DEBOUNCE_DELAY);

      return result;
    } catch (error) {
      Logger.error("API request failed:", error);

      // Clean up pending request after error
      setTimeout(() => {
        pendingRequests.delete(requestKey);
      }, DEBOUNCE_DELAY);

      // Handle network errors
      if (!error.response && !error.status) {
        throw new Error("Network error. Please check your connection.");
      }

      // Handle timeout errors
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please try again.");
      }

      // If this is an authentication error, ensure we handle it
      if (error.message === "Authentication failed") {
        Logger.log("  Authentication error caught - redirecting to login");
        Logger.log("  Current pathname:", window.location.pathname);

        // The handleExpiredToken should have already been called, but let's ensure it
        if (window.location.pathname !== "/login") {
          try {
            useUserStore.getState().handleExpiredToken();
            Logger.log("handleExpiredToken called in fallback");
          } catch (fallbackError) {
            Logger.error(
              "  Error in fallback handleExpiredToken:",
              fallbackError
            );
          }
        } else {
          Logger.log("  Already on login page, skipping redirect");
        }
      }

      throw error;
    }
  })();

  // Store the promise for debouncing
  pendingRequests.set(requestKey, requestPromise);

  return requestPromise;
};

export { API_BASE_URL, apiCall };
