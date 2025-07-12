import React, { useState, useEffect } from "react";
import useCacheStore from "../stores/cacheStore";
import {
  StyledButton,
  FieldOutputContainer,
  FieldLabel,
} from "../styles/styles";

const CacheManager = ({ show = false }) => {
  const [cacheStats, setCacheStats] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const { getCacheStats, clearAllCache, invalidateCache, invalidateMultiple } =
    useCacheStore();

  useEffect(() => {
    if (show) {
      updateStats();
    }
  }, [show, refreshKey]);

  const updateStats = () => {
    const stats = getCacheStats();
    setCacheStats(stats);
  };

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}m`;
  };

  const getStatusColor = (isExpired, remainingTime) => {
    if (isExpired) return "#dc3545";
    if (remainingTime < 60000) return "#ffc107"; // Less than 1 minute
    return "#28a745";
  };

  const handleInvalidateCache = (key) => {
    invalidateCache(key);
    setRefreshKey((prev) => prev + 1);
  };

  const handleInvalidateMultiple = (keys) => {
    invalidateMultiple(keys);
    setRefreshKey((prev) => prev + 1);
  };

  const handleClearAll = () => {
    clearAllCache();
    setRefreshKey((prev) => prev + 1);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        width: 400,
        maxHeight: 600,
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h3 style={{ margin: 0 }}>Cache Manager</h3>
        <div>
          <StyledButton onClick={updateStats} style={{ marginRight: 8 }}>
            Refresh
          </StyledButton>
          <StyledButton
            onClick={handleClearAll}
            style={{ backgroundColor: "#dc3545" }}
          >
            Clear All
          </StyledButton>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <StyledButton
          onClick={() =>
            handleInvalidateMultiple([
              "athletes",
              "measurables",
              "trainingPeriods",
            ])
          }
          style={{ marginRight: 8, backgroundColor: "#ffc107" }}
        >
          Invalidate All Data
        </StyledButton>
        <StyledButton
          onClick={() =>
            handleInvalidateMultiple([
              "programs",
              "programDetails",
              "programAssignments",
            ])
          }
          style={{ backgroundColor: "#17a2b8" }}
        >
          Invalidate Programs
        </StyledButton>
      </div>

      <div>
        {Object.entries(cacheStats).map(([key, stats]) => (
          <div
            key={key}
            style={{
              border: "1px solid #eee",
              borderRadius: 4,
              padding: 12,
              marginBottom: 8,
              backgroundColor: "#f8f9fa",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <FieldLabel style={{ margin: 0, fontWeight: "bold" }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </FieldLabel>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: getStatusColor(
                    stats.isExpired,
                    stats.remainingTime
                  ),
                }}
              />
            </div>

            <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
              <div>Age: {formatTime(stats.age)}</div>
              <div>TTL: {formatTime(stats.ttl)}</div>
              <div>Remaining: {formatTime(stats.remainingTime)}</div>
              <div>Status: {stats.isExpired ? "Expired" : "Valid"}</div>
            </div>

            <StyledButton
              onClick={() => handleInvalidateCache(key)}
              style={{
                fontSize: 10,
                padding: "4px 8px",
                backgroundColor: stats.isExpired ? "#6c757d" : "#dc3545",
              }}
            >
              {stats.isExpired ? "Remove" : "Invalidate"}
            </StyledButton>
          </div>
        ))}
      </div>

      {Object.keys(cacheStats).length === 0 && (
        <div
          style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}
        >
          No cached data
        </div>
      )}
    </div>
  );
};

export default CacheManager;
