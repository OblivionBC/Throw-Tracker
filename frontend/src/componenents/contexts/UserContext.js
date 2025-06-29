import React, { createContext, useContext, useState } from "react";
import { personsApi } from "../../api";

// Create a Context for the user data
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  // set to not null for testing
  const [user, setUser] = useState({});
  const [selectedAthlete, setSelectedAthleteVar] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginComplete = (userData) => {
    setUser(userData);
  };

  const login = async (username, password) => {
    try {
      const jsonData = await personsApi.login({ username, password });
      setUser(jsonData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    setUser({});
    setSelectedAthlete();
    return;
  };

  const setSelectedAthlete = (athlete) => {
    return setSelectedAthleteVar(athlete);
  };

  const getUser = () => {
    if (user.prsn_role === "COACH") return selectedAthlete;
    else return user.prsn_rk;
  };

  return (
    <UserContext.Provider
      value={{
        getUser,
        user,
        setSelectedAthlete,
        signOut,
        login,
        loginComplete,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
