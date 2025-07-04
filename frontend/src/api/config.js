const API_BASE_URL = "http://localhost:3000/api";

// Common fetch options
const defaultOptions = {
  credentials: "include", // This is required for cookies to be sent
  headers: {
    "Content-Type": "application/json",
  },
};

// Helper function for making API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export { API_BASE_URL, apiCall };
