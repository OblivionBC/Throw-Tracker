import React, { useState, useEffect } from "react";
import { CompWrap, Title, RowDiv, AddButton } from "../styles/design-system";
import { programAthleteAssignmentsApi, trainingPeriodsApi } from "../api";
import { useApi } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import Logger from "../utils/logger";

const CurrentPrograms = () => {
  const [currentTrainingPeriod, setCurrentTrainingPeriod] = useState(null);
  const [trainingPeriods, setTrainingPeriods] = useState([]);
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch training periods first
        const periods = await apiCall(
          () => trainingPeriodsApi.getAll(),
          "Fetching training periods"
        );
        setTrainingPeriods(periods);

        // Find the active training period (the one without an end date)
        const activeIndex = periods.findIndex((period) => !period.trpe_end_dt);
        const selectedPeriod = activeIndex !== -1 
          ? periods[activeIndex] 
          : periods.length > 0 
            ? periods[0] 
            : null;

        if (selectedPeriod) {
          setCurrentPeriodIndex(activeIndex !== -1 ? activeIndex : 0);
          setCurrentTrainingPeriod(selectedPeriod);

          // Fetch programs in parallel (or immediately after) for the selected period
          try {
            const programsData = await apiCall(
              () =>
                programAthleteAssignmentsApi.getTrainingPeriodPrograms(
                  selectedPeriod.trpe_rk
                ),
              `Fetching programs for training period ${selectedPeriod.trpe_rk}`
            );
            setPrograms(programsData);
          } catch (error) {
            Logger.error("Error fetching programs:", error);
            setPrograms([]);
          }
        }
      } catch (error) {
        Logger.error("Error fetching training periods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiCall]);

  const fetchProgramsForPeriod = async (trpe_rk) => {
    if (!trpe_rk) {
      setPrograms([]);
      return;
    }

    try {
      const programsData = await apiCall(
        () => programAthleteAssignmentsApi.getTrainingPeriodPrograms(trpe_rk),
        `Fetching programs for training period ${trpe_rk}`
      );
      setPrograms(programsData);
    } catch (error) {
      Logger.error("Error fetching programs:", error);
      setPrograms([]);
    }
  };

  const navigateToPreviousPeriod = () => {
    if (currentPeriodIndex > 0) {
      const newIndex = currentPeriodIndex - 1;
      const newPeriod = trainingPeriods[newIndex];
      setCurrentPeriodIndex(newIndex);
      setCurrentTrainingPeriod(newPeriod);
      fetchProgramsForPeriod(newPeriod.trpe_rk);
    }
  };

  const navigateToNextPeriod = () => {
    if (currentPeriodIndex < trainingPeriods.length - 1) {
      const newIndex = currentPeriodIndex + 1;
      const newPeriod = trainingPeriods[newIndex];
      setCurrentPeriodIndex(newIndex);
      setCurrentTrainingPeriod(newPeriod);
      fetchProgramsForPeriod(newPeriod.trpe_rk);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Ongoing";
    return new Date(dateString).toLocaleDateString();
  };

  const handleProgramClick = (program) => {
    navigate(`/programs/${program.prog_rk}`);
  };

  if (loading) {
    return <div>Loading programs...</div>;
  }

  if (!currentTrainingPeriod) {
    return <div>No training periods found.</div>;
  }

  return (
    <CompWrap>
      <RowDiv>
        <Title>Current Programs</Title>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <AddButton
            onClick={navigateToPreviousPeriod}
            disabled={currentPeriodIndex === 0}
            style={{
              padding: "5px 10px",
              fontSize: "14px",
              opacity: currentPeriodIndex === 0 ? 0.5 : 1,
            }}
          >
            ←
          </AddButton>
          <span style={{ fontSize: "14px", fontWeight: "bold" }}>
            {formatDate(currentTrainingPeriod.trpe_start_dt)} -{" "}
            {formatDate(currentTrainingPeriod.trpe_end_dt)}
          </span>
          <AddButton
            onClick={navigateToNextPeriod}
            disabled={currentPeriodIndex === trainingPeriods.length - 1}
            style={{
              padding: "5px 10px",
              fontSize: "14px",
              opacity:
                currentPeriodIndex === trainingPeriods.length - 1 ? 0.5 : 1,
            }}
          >
            →
          </AddButton>
        </div>
      </RowDiv>

      {programs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          No programs assigned to this training period.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {programs.map((program) => (
            <div
              key={program.paa_rk}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                cursor: "pointer",
                backgroundColor: "#f9f9f9",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f0f0f0";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f9f9f9";
              }}
              onClick={() => handleProgramClick(program)}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginBottom: "5px",
                }}
              >
                {program.prog_nm}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Assigned by: {program.assigner_first_nm}{" "}
                {program.assigner_last_nm}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Assigned: {new Date(program.assigned_dt).toLocaleDateString()}
              </div>
              {program.notes && (
                <div
                  style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}
                >
                  Notes: {program.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </CompWrap>
  );
};

export default CurrentPrograms;
