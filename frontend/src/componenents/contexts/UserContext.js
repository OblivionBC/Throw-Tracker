import React, { createContext, useContext, useState } from "react";

// Create a Context for the user data
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  // set to not null for testing
  const [user, setUser] = useState({});
  const [selectedAthlete, setSelectedAthlete] = useState("");

  const loginComplete = (userData) => {
    setUser(userData);
  };

  const login = async (values) => {
    try {
      const response = await fetch(`http://localhost:5000/api//login`, {
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
    return;
  };
  return (
    <UserContext.Provider
      value={{
        user,
        useUser,
        selectedAthlete,
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
export const setSelectedAthlete = ({ athlete }) => {
  setSelectedAthlete(athlete);
};
// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
