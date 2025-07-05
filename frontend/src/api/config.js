import useUserStore from "../stores/userStore";

const API_BASE_URL = "http://localhost:3000/api";

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
          endpoint !== "/auth/refresh"
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
            console.error("Token refresh error:", refreshError);
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
          useUserStore.getState().handleExpiredToken();
          throw new Error("Authentication failed");
        }

        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      const result = await response.json();

      // Clean up pending request after successful completion
      setTimeout(() => {
        pendingRequests.delete(requestKey);
      }, DEBOUNCE_DELAY);

      return result;
    } catch (error) {
      console.error("API request failed:", error);

      // Clean up pending request after error
      setTimeout(() => {
        pendingRequests.delete(requestKey);
      }, DEBOUNCE_DELAY);

      throw error;
    }
  })();

  // Store the promise for debouncing
  pendingRequests.set(requestKey, requestPromise);

  return requestPromise;
};

export { API_BASE_URL, apiCall };
