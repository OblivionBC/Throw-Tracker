import { useState, useEffect, useCallback, useRef } from "react";
import Logger from "../utils/logger";

/**
 * Generic hook for async data fetching
 * @param {Function} fetchFn - Function that returns a promise
 * @param {Array} dependencies - Dependencies array (like useEffect deps)
 * @param {Object} options - Additional options
 * @param {boolean} options.immediate - Whether to fetch immediately (default: true)
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 * @returns {Object} { data, loading, error, refetch }
 */
export const useAsyncData = (
  fetchFn,
  dependencies = [],
  options = {}
) => {
  const { immediate = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn(abortControllerRef.current.signal);
      setData(result);
      setError(null);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        Logger.log("Request was aborted");
        return;
      }

      Logger.error("Error fetching data:", err);
      const errorMessage = err.message || "Failed to fetch data";
      setError(errorMessage);

      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

