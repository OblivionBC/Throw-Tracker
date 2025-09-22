import React, { createContext, useContext, useState } from "react";
import ErrorHandler from "../utils/errorHandler";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const addError = (error, context = "") => {
    const handledError = ErrorHandler.handle(error, context);
    const userMessage = ErrorHandler.showUserFriendlyMessage(error);

    // Limit to 5 errors to prevent spam
    setErrors((prev) => {
      const newErrors = [
        ...prev,
        {
          id: Date.now(),
          ...handledError,
          userMessage,
          context,
          timestamp: new Date(),
        },
      ];

      // Keep only the last 5 errors
      return newErrors.slice(-5);
    });
  };

  const clearError = (errorId) => {
    setErrors((prev) => prev.filter((error) => error.id !== errorId));
  };

  const clearAllErrors = () => {
    setErrors([]);
  };

  return (
    <ErrorContext.Provider
      value={{ errors, addError, clearError, clearAllErrors }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
