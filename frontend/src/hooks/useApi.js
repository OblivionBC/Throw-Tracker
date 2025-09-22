import { useCallback } from "react";
import { useError } from "../contexts/ErrorContext";

export const useApi = () => {
  const { addError } = useError();

  const apiCall = useCallback(
    async (apiFunction, context = "") => {
      try {
        return await apiFunction();
      } catch (error) {
        addError(error, context);
        throw error;
      }
    },
    [addError]
  );

  const apiCallWithSuccess = useCallback(
    async (apiFunction, onSuccess, context = "") => {
      try {
        const result = await apiFunction();
        if (onSuccess) {
          onSuccess(result);
        }
        return result;
      } catch (error) {
        addError(error, context);
        throw error;
      }
    },
    [addError]
  );

  return { apiCall, apiCallWithSuccess };
};
