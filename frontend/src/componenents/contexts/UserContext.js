import React, { createContext, useContext, useState } from "react";
import { API_BASE_URL } from "../../config.js";
// Create a Context for the user data
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  // set to not null for testing
  const [user, setUser] = useState({});
  const [selectedAthlete, setSelectedAthleteVar] = useState(0);

  const loginComplete = (userData) => {
    setUser(userData);
  };

  const login = async (values) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api//login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });
      const jsonData = await response.json();
      if (jsonData.rowCount > 0) {
        setUser(jsonData.rows[0]);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error.message);
      return false;
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
        useUser,
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
