import React, { createContext, useContext, useState } from "react";

// Create a Context for the user data
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  // set to not null for testing
  const [user, setUser] = useState({});

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

  const refreshUser = () => {
    //Fetch user from db
    setUser({
      prsn_first_nm: "Connor",
      prsn_last_nm: "Hengstler",
      prsn_email: "connor.hengstler@gmail.com",
      org_name: "UBC",
      prsn_role: "ATHLETE",
    });
  };
  return (
    <UserContext.Provider
      value={{ user, refreshUser, useUser, login, loginComplete }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
