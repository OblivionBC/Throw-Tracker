import React, { createContext, useContext, useState } from "react";

// Create a Context for the user data
export const DataChangeContext = createContext({
  pracDataChange: false,
  setPracDataChange: () => {},
});

// Create a provider component
export const DataChangeProvider = ({ children }) => {
  // set to not null for testing
  const [pracDataChange, setPracDataChange] = useState(false);

  const ChangePracticeData = async () => {
    setPracDataChange(true);
    setTimeout(() => setPracDataChange(false), 400);
    return;
  };
  return (
    <DataChangeContext.Provider
      value={{ pracDataChange, setPracDataChange, ChangePracticeData }}
    >
      {children}
    </DataChangeContext.Provider>
  );
};

// Custom hook to use the PracticeContext
export const usePracDataChange = () => {
  return useContext(DataChangeContext);
};
