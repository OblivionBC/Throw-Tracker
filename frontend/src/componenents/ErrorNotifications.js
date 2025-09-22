import React from "react";
import styled from "styled-components";
import { useError } from "../contexts/ErrorContext";

const ErrorNotifications = () => {
  const { errors, clearError } = useError();

  // Auto-dismiss errors after 5 seconds
  React.useEffect(() => {
    const timers = errors.map((error) =>
      setTimeout(() => clearError(error.id), 5000)
    );

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [errors, clearError]);

  if (errors.length === 0) return null;

  return (
    <ErrorContainer>
      {errors.map((error) => (
        <ErrorToast key={error.id} type={error.code}>
          <ErrorContent>
            <ErrorMessage>{error.userMessage}</ErrorMessage>
            {process.env.REACT_APP_NODE_ENV === "development" && (
              <ErrorDetails>
                Code: {error.code} | Context: {error.context}
              </ErrorDetails>
            )}
          </ErrorContent>
          <CloseButton onClick={() => clearError(error.id)}>×</CloseButton>
        </ErrorToast>
      ))}
    </ErrorContainer>
  );
};

const ErrorContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ErrorToast = styled.div`
  background: ${(props) => {
    switch (props.type) {
      case "VALIDATION_ERROR":
        return "#fff3cd";
      case "UNAUTHORIZED":
        return "#f8d7da";
      case "NOT_FOUND":
        return "#d1ecf1";
      default:
        return "#f8d7da";
    }
  }};
  border: 1px solid
    ${(props) => {
      switch (props.type) {
        case "VALIDATION_ERROR":
          return "#ffeaa7";
        case "UNAUTHORIZED":
          return "#f5c6cb";
        case "NOT_FOUND":
          return "#bee5eb";
        default:
          return "#f5c6cb";
      }
    }};
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 300px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ErrorContent = styled.div`
  flex: 1;
`;

const ErrorMessage = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const ErrorDetails = styled.div`
  font-size: 12px;
  color: #666;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  margin-left: 8px;

  &:hover {
    color: #333;
  }
`;

export default ErrorNotifications;
