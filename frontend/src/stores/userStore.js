import { create } from "zustand";
import { persist } from "zustand/middleware";
import { personsApi, authApi } from "../api";

const useUserStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      selectedAthlete: null,
      isLoading: false,
      error: null,
      refreshInterval: null,
      expirationAlertInterval: null,
      isTokenExpiring: false,

      // Token cache state
      accessTokenExpirationTime: null,
      refreshTokenExpirationTime: null,
      tokenLastChecked: null,
      tokenCacheValid: false,
      tokenRefreshStarted: false,
      isRedirecting: false,

      // Actions
      setUser: (user) => {
        set({ user });
      },

      setSelectedAthlete: (athleteId) => set({ selectedAthlete: athleteId }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      // Set token expiration cache for both tokens
      setTokenExpiration: (accessTokenExpiresIn, refreshTokenExpiresIn) => {
        const accessTokenExpirationTime =
          Date.now() + accessTokenExpiresIn * 1000;
        const refreshTokenExpirationTime =
          Date.now() + refreshTokenExpiresIn * 1000;

        set({
          accessTokenExpirationTime: accessTokenExpirationTime,
          refreshTokenExpirationTime: refreshTokenExpirationTime,
          tokenLastChecked: Date.now(),
          tokenCacheValid: true,
        });
      },

      // Check if access token is expired based on cache
      isAccessTokenExpired: () => {
        const { accessTokenExpirationTime, tokenCacheValid } = get();
        if (!tokenCacheValid || !accessTokenExpirationTime) {
          return true; // Assume expired if no cache
        }
        return Date.now() >= accessTokenExpirationTime;
      },

      // Check if refresh token is expired based on cache
      isRefreshTokenExpired: () => {
        const { refreshTokenExpirationTime, tokenCacheValid } = get();
        if (!tokenCacheValid || !refreshTokenExpirationTime) {
          return true; // Assume expired if no cache
        }
        return Date.now() >= refreshTokenExpirationTime;
      },

      // Invalidate token cache
      invalidateTokenCache: () => {
        set({
          accessTokenExpirationTime: null,
          refreshTokenExpirationTime: null,
          tokenLastChecked: null,
          tokenCacheValid: false,
          tokenRefreshStarted: false,
        });
      },

      // Start automatic token refresh - disabled for simple logout on expiration
      startTokenRefresh: () => {
        // No automatic refresh - just let token expire and logout
      },

      // Stop automatic token refresh
      stopTokenRefresh: () => {
        // No automatic refresh to stop
      },

      // Fetch user data from API
      fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const userData = await personsApi.fetchUser();

          if (userData) {
            set({ user: userData, isLoading: false });
            // Note: fetchUser doesn't provide expiration info, so we don't set token cache here
            // Token cache will be set by login, refresh, or token status check
            // No automatic token refresh - let token expire naturally
            return userData;
          } else {
            set({ user: null, isLoading: false });
            get().stopTokenRefresh();
            get().invalidateTokenCache();
            return null;
          }
        } catch (error) {
          set({ error: error.message, isLoading: false, user: null });
          get().stopTokenRefresh();
          get().invalidateTokenCache();
          return null;
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const loginResponse = await authApi.login(credentials);

          // Set token expiration cache if provided
          if (
            loginResponse &&
            loginResponse.accessTokenExpiresIn &&
            loginResponse.refreshTokenExpiresIn
          ) {
            get().setTokenExpiration(
              loginResponse.accessTokenExpiresIn,
              loginResponse.refreshTokenExpiresIn
            );
          } else {
            get().setTokenExpiration(120, 604800); // 2 min access, 7 days refresh default for testing
          }

          const userData = await get().fetchUser();

          set({ isLoading: false });
          return userData;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await authApi.logout();
        } catch (error) {
          // Ignore logout errors
        } finally {
          // Stop token refresh and clear state
          get().stopTokenRefresh();
          get().invalidateTokenCache();
          set({
            user: null,
            selectedAthlete: null,
            isLoading: false,
            error: null,
            refreshInterval: null,
            isTokenExpiring: false,
            tokenRefreshStarted: false,
            isRedirecting: false,
          });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Get user ID (for backward compatibility)
      getUserId: () => {
        const { user } = get();
        return user?.id || null;
      },

      // Check if user is authenticated
      isAuthenticated: () => {
        const { user } = get();
        return !!user;
      },

      // Check if user is a coach
      isCoach: () => {
        const { user } = get();
        return user?.role === "COACH";
      },

      // Check if user is an athlete
      isAthlete: () => {
        const { user } = get();
        return user?.role === "ATHLETE";
      },

      // Get user's full name
      getUserFullName: () => {
        const { user } = get();
        if (!user) return "";
        return `${user.first_nm || ""} ${user.last_nm || ""}`.trim();
      },

      // Get user's organization
      getUserOrg: () => {
        const { user } = get();
        return user?.org_name || "";
      },

      // Reset store to initial state
      reset: () => {
        get().stopTokenRefresh();
        get().invalidateTokenCache();
        set({
          user: null,
          selectedAthlete: null,
          isLoading: false,
          error: null,
          refreshInterval: null,
          isTokenExpiring: false,
          tokenRefreshStarted: false,
          isRedirecting: false,
        });
      },

      // Handle expired token - utility function
      handleExpiredToken: () => {
        console.log("🚨 Handling expired token - redirecting to login");
        console.log("🚨 Current pathname:", window.location.pathname);

        // Check if already on login page to prevent infinite loops
        if (window.location.pathname === "/login") {
          console.log("🚨 Already on login page, skipping redirect");
          return;
        }

        // Check if we're already in the process of redirecting
        if (get().isRedirecting) {
          console.log("🚨 Already redirecting, skipping duplicate call");
          return;
        }

        // Set redirecting flag
        set({ isRedirecting: true });

        // Stop any ongoing processes
        get().stopTokenRefresh();
        get().invalidateTokenCache();

        // Clear all state
        set({
          user: null,
          selectedAthlete: null,
          isLoading: false,
          error: null,
          refreshInterval: null,
          isTokenExpiring: false,
          tokenRefreshStarted: false,
          isRedirecting: true, // Keep this true during redirect
        });

        // Force redirect to login - always redirect to ensure clean state
        console.log("🚨 About to redirect to /login");

        // Immediate redirect attempt
        try {
          console.log(
            "🚨 Attempting immediate redirect with window.location.href"
          );
          window.location.href = "/login";
        } catch (error) {
          console.error("🚨 Immediate redirect failed:", error);
          // Fallback with setTimeout
          setTimeout(() => {
            try {
              console.log(
                "🚨 Attempting delayed redirect with window.location.href"
              );
              window.location.href = "/login";
            } catch (delayedError) {
              console.error("🚨 Delayed redirect failed:", delayedError);
              try {
                console.log(
                  "🚨 Attempting redirect with window.location.replace"
                );
                window.location.replace("/login");
              } catch (replaceError) {
                console.error(
                  "🚨 window.location.replace failed:",
                  replaceError
                );
                // Last resort: force page reload
                console.log(
                  "🚨 Attempting redirect with window.location.reload"
                );
                window.location.reload();
              }
            }
          }, 100);
        }

        // Additional fallback: try again after a short delay
        setTimeout(() => {
          if (window.location.pathname !== "/login") {
            console.log("🚨 Fallback redirect check - still not on login page");
            try {
              window.location.href = "/login";
            } catch (fallbackError) {
              console.error("🚨 Fallback redirect failed:", fallbackError);
            }
          }
        }, 500);
      },
    }),
    {
      name: "user-storage", // unique name for localStorage key
      partialize: (state) => ({
        user: state.user,
        selectedAthlete: state.selectedAthlete,
      }), // only persist these fields
    }
  )
);

// Selector functions for better performance
export const useUser = () => useUserStore((state) => state.user);
export const useSelectedAthlete = () =>
  useUserStore((state) => state.selectedAthlete);
export const useIsLoading = () => useUserStore((state) => state.isLoading);
export const useError = () => useUserStore((state) => state.error);
export const useIsAuthenticated = () =>
  useUserStore((state) => state.isAuthenticated());
export const useIsCoach = () => useUserStore((state) => state.isCoach());
export const useIsAthlete = () => useUserStore((state) => state.isAthlete());

export default useUserStore;
