import React, { useState, useEffect } from "react";
import {
  CompWrap,
  Title,
  RowDiv,
  AddButton,
  FieldOutputContainer,
  FieldLabel,
} from "../../styles/styles.js";
import { programAthleteAssignmentsApi, trainingPeriodsApi } from "../../api";
import useUserStore, { useUser } from "../../stores/userStore";
import ProgramDetailsModal from "./modals/ProgramDetailsModal";

const CurrentPrograms = () => {
  const [currentTrainingPeriod, setCurrentTrainingPeriod] = useState(null);
  const [trainingPeriods, setTrainingPeriods] = useState([]);
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showProgramDetails, setShowProgramDetails] = useState(false);
  const user = useUser();

  useEffect(() => {
    const fetchTrainingPeriods = async () => {
      try {
        const periods = await trainingPeriodsApi.getAll();
        setTrainingPeriods(periods);

        // Find the active training period (the one without an end date)
        const activeIndex = periods.findIndex((period) => !period.trpe_end_dt);
        if (activeIndex !== -1) {
          setCurrentPeriodIndex(activeIndex);
          setCurrentTrainingPeriod(periods[activeIndex]);
        } else if (periods.length > 0) {
          // If no active period, use the most recent one
          setCurrentTrainingPeriod(periods[0]);
        }
      } catch (error) {
        console.error("Error fetching training periods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingPeriods();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!currentTrainingPeriod) return;

      try {
        const programsData =
          await programAthleteAssignmentsApi.getTrainingPeriodPrograms(
            currentTrainingPeriod.trpe_rk
          );
        setPrograms(programsData);
      } catch (error) {
        console.error("Error fetching programs:", error);
        setPrograms([]);
      }
    };

    fetchPrograms();
  }, [currentTrainingPeriod]);

  const navigateToPreviousPeriod = () => {
    if (currentPeriodIndex > 0) {
      const newIndex = currentPeriodIndex - 1;
      setCurrentPeriodIndex(newIndex);
      setCurrentTrainingPeriod(trainingPeriods[newIndex]);
    }
  };

  const navigateToNextPeriod = () => {
    if (currentPeriodIndex < trainingPeriods.length - 1) {
      const newIndex = currentPeriodIndex + 1;
      setCurrentPeriodIndex(newIndex);
      setCurrentTrainingPeriod(trainingPeriods[newIndex]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Ongoing";
    return new Date(dateString).toLocaleDateString();
  };

  const handleProgramClick = (program) => {
    setSelectedProgram(program);
    setShowProgramDetails(true);
  };

  if (loading) {
    return <div>Loading programs...</div>;
  }

  if (!currentTrainingPeriod) {
    return <div>No training periods found.</div>;
  }

  return (
    <CompWrap>
      <ProgramDetailsModal
        open={showProgramDetails}
        onClose={() => setShowProgramDetails(false)}
        program={selectedProgram}
        refresh={() => {
          // Refresh programs when modal closes
          if (currentTrainingPeriod) {
            programAthleteAssignmentsApi
              .getTrainingPeriodPrograms(currentTrainingPeriod.trpe_rk)
              .then(setPrograms);
          }
        }}
      />

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
