import { create } from "zustand";
import { persist } from "zustand/middleware";
import { personsApi } from "../api";

const useUserStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      selectedAthlete: null,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user }),

      setSelectedAthlete: (athleteId) => set({ selectedAthlete: athleteId }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      // Fetch user data from API
      fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const userData = await personsApi.fetchUser();
          if (userData) {
            set({ user: userData, isLoading: false });
            return userData;
          } else {
            set({ user: null, isLoading: false });
            return null;
          }
        } catch (error) {
          set({ error: error.message, isLoading: false, user: null });
          return null;
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          await personsApi.login(credentials);
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
          await personsApi.logout();
          set({
            user: null,
            selectedAthlete: null,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({ error: error.message, isLoading: false });
          // Even if logout fails, clear local state
          set({
            user: null,
            selectedAthlete: null,
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
      reset: () =>
        set({
          user: null,
          selectedAthlete: null,
          isLoading: false,
          error: null,
        }),
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
