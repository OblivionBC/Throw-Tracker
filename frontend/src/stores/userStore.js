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

      // Actions
      setUser: (user) => set({ user }),

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

      // Start automatic token refresh
      startTokenRefresh: () => {
        const {
          refreshInterval,
          expirationAlertInterval,
          tokenRefreshStarted,
        } = get();

        // Don't start if already started
        if (tokenRefreshStarted) {
          return;
        }

        // Clear existing intervals if any
        if (refreshInterval) {
          clearInterval(refreshInterval);
        }
        if (expirationAlertInterval) {
          clearInterval(expirationAlertInterval);
        }

        // Don't start token refresh if user is not authenticated
        const { user } = get();
        if (!user) {
          return;
        }

        // If token cache is not set, set a default expiration (1 hour)
        const { tokenCacheValid } = get();
        if (!tokenCacheValid) {
          get().setTokenExpiration(3600, 3600); // 1 hour default
        }

        // Set up new interval to refresh token every 45 minutes (before 1-hour expiry)
        const refreshIntervalId = setInterval(async () => {
          try {
            // Check if user is still authenticated before refreshing
            const currentUser = get().user;
            if (!currentUser) {
              get().stopTokenRefresh();
              return;
            }

            const refreshResponse = await authApi.refreshToken();

            // Update token cache with new expiration
            if (
              refreshResponse &&
              refreshResponse.accessTokenExpiresIn &&
              refreshResponse.refreshTokenExpiresIn
            ) {
              get().setTokenExpiration(
                refreshResponse.accessTokenExpiresIn,
                refreshResponse.refreshTokenExpiresIn
              );
            }

            set({ isTokenExpiring: false });
          } catch (error) {
            console.error("Automatic token refresh failed:", error);
            // If refresh fails, logout user
            get().logout();
          }
        }, 45 * 60 * 1000); // 45 minutes

        // Set up interval to check for token expiration (every 10 minutes instead of 5)
        const alertIntervalId = setInterval(async () => {
          try {
            // Check if user is still authenticated before checking token status
            const currentUser = get().user;
            if (!currentUser) {
              get().stopTokenRefresh();
              return;
            }

            // Check token status using the new endpoint
            const tokenStatus = await authApi.checkTokenStatus();

            // Update access token cache with current expiration (refresh token stays the same)
            if (tokenStatus && tokenStatus.expiresIn) {
              const { refreshTokenExpirationTime } = get();
              const refreshTokenExpiresIn = refreshTokenExpirationTime
                ? Math.floor((refreshTokenExpirationTime - Date.now()) / 1000)
                : 604800; // 7 days default
              get().setTokenExpiration(
                tokenStatus.expiresIn,
                refreshTokenExpiresIn
              );
            }

            if (tokenStatus.isExpiringSoon && !get().isTokenExpiring) {
              set({ isTokenExpiring: true });
              // Show alert when token is about to expire
              const minutesLeft = Math.floor(tokenStatus.expiresIn / 60);
              alert(
                `Your session will expire in ${minutesLeft} minutes. Please refresh your token or you will be logged out automatically.`
              );
            } else if (!tokenStatus.isExpiringSoon) {
              set({ isTokenExpiring: false });
            }
          } catch (error) {
            console.error("Token expiration check failed:", error);
            // If we can't check token status, it might be expired
            if (
              error.message.includes("401") ||
              error.message.includes("403") ||
              error.message.includes("Authentication failed")
            ) {
              get().handleExpiredToken();
            }
          }
        }, 30 * 60 * 1000); // 30 minutes instead of 10

        set({
          refreshInterval: refreshIntervalId,
          expirationAlertInterval: alertIntervalId,
          tokenRefreshStarted: true,
        });
      },

      // Stop automatic token refresh
      stopTokenRefresh: () => {
        const { refreshInterval, expirationAlertInterval } = get();
        if (refreshInterval) {
          clearInterval(refreshInterval);
        }
        if (expirationAlertInterval) {
          clearInterval(expirationAlertInterval);
        }
        set({
          refreshInterval: null,
          expirationAlertInterval: null,
          isTokenExpiring: false,
          tokenRefreshStarted: false,
        });
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
            // Start token refresh when user is authenticated (only if not already started)
            const { tokenRefreshStarted } = get();
            if (!tokenRefreshStarted) {
              get().startTokenRefresh();
            }
            return userData;
          } else {
            set({ user: null, isLoading: false });
            get().stopTokenRefresh();
            get().invalidateTokenCache();
            return null;
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
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
            get().setTokenExpiration(900, 604800); // 15 min access, 7 days refresh default
          }

          const userData = await get().fetchUser();

          set({ isLoading: false });
          return userData;
        } catch (error) {
          console.error("Login error:", error);
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
          console.error("Logout error:", error);
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
            expirationAlertInterval: null,
            isTokenExpiring: false,
            tokenRefreshStarted: false,
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
          expirationAlertInterval: null,
          isTokenExpiring: false,
          tokenRefreshStarted: false,
        });
      },

      // Handle expired token - utility function
      handleExpiredToken: () => {
        get().stopTokenRefresh();
        get().invalidateTokenCache();
        set({
          user: null,
          selectedAthlete: null,
          isLoading: false,
          error: null,
          refreshInterval: null,
          expirationAlertInterval: null,
          isTokenExpiring: false,
          tokenRefreshStarted: false,
        });
        // Force redirect to login
        window.location.href = "/login";
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
