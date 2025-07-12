import { useState, useEffect, useCallback } from "react";
import useCacheStore from "../stores/cacheStore";

/**
 * Custom hook for managing cached data with loading states
 * @param {string} cacheKey - The cache key to use
 * @param {Function} fetchFunction - Function to fetch data if not cached
 * @param {boolean} forceRefresh - Whether to force refresh the cache
 * @param {Array} dependencies - Dependencies for the useEffect
 * @returns {Object} { data, loading, error, refetch }
 */
const useCachedData = (
  cacheKey,
  fetchFunction,
  forceRefresh = false,
  dependencies = []
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getCachedData, setCachedData, isCacheValid } = useCacheStore();

  const fetchData = useCallback(
    async (force = false) => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first (unless force refresh)
        if (!force && !forceRefresh && isCacheValid(cacheKey)) {
          const cachedData = getCachedData(cacheKey);
          if (cachedData) {
            console.log(`Using cached data for ${cacheKey}`);
            setData(cachedData);
            setLoading(false);
            return cachedData;
          }
        }

        console.log(`Fetching data for ${cacheKey}`);
        const result = await fetchFunction();

        // Cache the result
        setCachedData(cacheKey, result);
        setData(result);
        setLoading(false);

        return result;
      } catch (err) {
        console.error(`Error fetching data for ${cacheKey}:`, err);
        setError(err.message || "An error occurred while fetching data");
        setLoading(false);
        throw err;
      }
    },
    [
      cacheKey,
      fetchFunction,
      forceRefresh,
      getCachedData,
      setCachedData,
      isCacheValid,
    ]
  );

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook for managing athletes data with caching
 */
export const useAthletesData = (forceRefresh = false) => {
  const { personsApi } = require("../api/persons");

  return useCachedData(
    "athletes",
    () => personsApi.getAthletesForCoach(),
    forceRefresh
  );
};

/**
 * Hook for managing measurables data with caching
 */
export const useMeasurablesData = (forceRefresh = false) => {
  const { measurablesApi } = require("../api/measurables");

  return useCachedData(
    "measurables",
    () => measurablesApi.getForCoach(),
    forceRefresh
  );
};

/**
 * Hook for managing training periods data with caching
 */
export const useTrainingPeriodsData = (forceRefresh = false) => {
  const { trainingPeriodsApi } = require("../api/trainingPeriods");

  return useCachedData(
    "trainingPeriods",
    () => trainingPeriodsApi.getAll(),
    forceRefresh
  );
};

/**
 * Hook for managing programs data with caching
 */
export const useProgramsData = (forceRefresh = false) => {
  const { programsApi } = require("../api/programs");

  return useCachedData("programs", () => programsApi.getAll(), forceRefresh);
};

/**
 * Hook for managing specific program details with caching
 */
export const useProgramDetails = (prog_rk, forceRefresh = false) => {
  const { programsApi } = require("../api/programs");

  return useCachedData(
    `programDetails_${prog_rk}`,
    () => programsApi.getById(prog_rk),
    forceRefresh,
    [prog_rk]
  );
};

/**
 * Hook for managing program assignments with caching
 */
export const useProgramAssignments = (prog_rk, forceRefresh = false) => {
  const {
    programAthleteAssignmentsApi,
  } = require("../api/programAthleteAssignments");

  return useCachedData(
    `programAssignments_${prog_rk}`,
    () => programAthleteAssignmentsApi.getProgramAssignments(prog_rk),
    forceRefresh,
    [prog_rk]
  );
};

export default useCachedData;
