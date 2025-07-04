// Simple test to verify the store works
import useUserStore from "./userStore";

// Test that the store can be created and accessed
const testStore = () => {
  const store = useUserStore.getState();

  // Test initial state
  console.log("Initial state:", {
    user: store.user,
    selectedAthlete: store.selectedAthlete,
    isLoading: store.isLoading,
    error: store.error,
  });

  // Test helper functions
  console.log("Is authenticated:", store.isAuthenticated());
  console.log("Is coach:", store.isCoach());
  console.log("Is athlete:", store.isAthlete());
  console.log("User ID:", store.getUserId());
  console.log("User full name:", store.getUserFullName());
  console.log("User org:", store.getUserOrg());

  // Test actions
  store.setUser({
    id: 1,
    first_nm: "John",
    last_nm: "Doe",
    role: "COACH",
    org_name: "Test Org",
  });

  console.log("After setting user:", {
    user: store.user,
    isAuthenticated: store.isAuthenticated(),
    isCoach: store.isCoach(),
    getUserFullName: store.getUserFullName(),
    getUserOrg: store.getUserOrg(),
  });

  // Test reset
  store.reset();
  console.log("After reset:", {
    user: store.user,
    isAuthenticated: store.isAuthenticated(),
  });
};

// Run test if this file is executed directly
if (typeof window !== "undefined") {
  testStore();
}

export default testStore;
