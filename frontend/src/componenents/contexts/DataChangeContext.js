import React, { createContext, useContext, useState, useCallback } from "react";

// Create a Context for the user data
const DataChangeContext = createContext();

export const useDataChange = () => {
  const context = useContext(DataChangeContext);
  if (!context) {
    throw new Error("useDataChange must be used within a DataChangeProvider");
  }
  return context;
};

export const DataChangeProvider = ({ children }) => {
  const [dataCache, setDataCache] = useState({
    practices: { data: null, timestamp: null, loading: false },
    measurables: { data: null, timestamp: null, loading: false },
    trainingPeriods: { data: null, timestamp: null, loading: false },
    measurements: { data: null, timestamp: null, loading: false },
  });

  const [refreshFlags, setRefreshFlags] = useState({
    practices: false,
    measurables: false,
    trainingPeriods: false,
    measurements: false,
  });

  // Cache duration in milliseconds (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  const isCacheValid = useCallback(
    (cacheKey) => {
      const cache = dataCache[cacheKey];
      if (!cache || !cache.timestamp) return false;
      return Date.now() - cache.timestamp < CACHE_DURATION;
    },
    [dataCache]
  );

  const setCacheData = useCallback((cacheKey, data) => {
    setDataCache((prev) => ({
      ...prev,
      [cacheKey]: {
        data,
        timestamp: Date.now(),
        loading: false,
      },
    }));
  }, []);

  const setCacheLoading = useCallback((cacheKey, loading) => {
    setDataCache((prev) => ({
      ...prev,
      [cacheKey]: {
        ...prev[cacheKey],
        loading,
      },
    }));
  }, []);

  const invalidateCache = useCallback((cacheKey) => {
    setDataCache((prev) => ({
      ...prev,
      [cacheKey]: {
        data: null,
        timestamp: null,
        loading: false,
      },
    }));
    setRefreshFlags((prev) => ({
      ...prev,
      [cacheKey]: !prev[cacheKey],
    }));
  }, []);

  const getCachedData = useCallback(
    (cacheKey) => {
      return dataCache[cacheKey];
    },
    [dataCache]
  );

  const value = {
    dataCache,
    refreshFlags,
    isCacheValid,
    setCacheData,
    setCacheLoading,
    invalidateCache,
    getCachedData,
  };

  return (
    <DataChangeContext.Provider value={value}>
      {children}
    </DataChangeContext.Provider>
  );
};

// Custom hook to use the PracticeContext
export const usePracDataChange = () => {
  return useContext(DataChangeContext);
};
