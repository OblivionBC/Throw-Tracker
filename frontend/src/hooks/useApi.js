import { useError } from "../contexts/ErrorContext";

export const useApi = () => {
  const { addError } = useError();

  const apiCall = async (apiFunction, context = "") => {
    try {
      return await apiFunction();
    } catch (error) {
      addError(error, context);
      throw error;
    }
  };

  const apiCallWithSuccess = async (apiFunction, onSuccess, context = "") => {
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
  };

  return { apiCall, apiCallWithSuccess };
};
