import React, { useState, useEffect } from "react";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  StyledButton,
  FieldLabel,
  FieldOutputContainer,
  SubmitError,
} from "../../styles/styles";
import {
  personsApi,
  trainingPeriodsApi,
  programAthleteAssignmentsApi,
} from "../../api";

// Stepper Progress Bar Component
const StepperProgress = ({ currentStep, totalSteps }) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: "bold" }}>
          Step {currentStep} of {totalSteps}
        </span>
        <span style={{ fontSize: 12, color: "#666" }}>
          {currentStep === 1 && "Select Athletes"}
          {currentStep === 2 && "Select Training Periods"}
          {currentStep === 3 && "Assignment Details"}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 8,
          backgroundColor: "#e0e0e0",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(currentStep / totalSteps) * 100}%`,
            height: "100%",
            backgroundColor: "#007bff",
            transition: "width 0.3s ease",
            borderRadius: 4,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 5,
        }}
      >
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: step <= currentStep ? "#007bff" : "#e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: step <= currentStep ? "white" : "#666",
              fontWeight: "bold",
            }}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

const AssignProgramToAthletesModal = ({ open, onClose, program, refresh }) => {
  const [step, setStep] = useState(1);
  const [athletes, setAthletes] = useState([]);
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [trainingPeriods, setTrainingPeriods] = useState([]);
  const [athletePeriods, setAthletePeriods] = useState({});
  const [assignmentInfo, setAssignmentInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedAthletes([]);
      setAthletePeriods({});
      setAssignmentInfo({});
      setError("");
      fetchAthletes();
    }
    // eslint-disable-next-line
  }, [open]);

  const fetchAthletes = async () => {
    setLoading(true);
    try {
      const data = await personsApi.getAthletesForCoach();
      setAthletes(data);
    } catch (e) {
      setError("Failed to load athletes");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainingPeriods = async () => {
    setLoading(true);
    try {
      const data = await trainingPeriodsApi.getAll();
      setTrainingPeriods(data);
    } catch (e) {
      setError("Failed to load training periods");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Select Athletes
  const renderStep1 = () => (
    <>
      <h2>Select Athletes</h2>
      <FieldOutputContainer>
        <FieldLabel>
          Select one or more athletes to assign this program to:
        </FieldLabel>
        <div style={{ maxHeight: 300, overflowY: "auto", margin: "10px 0" }}>
          {athletes.map((athlete) => (
            <label
              key={athlete.prsn_rk}
              style={{ display: "block", marginBottom: 8 }}
            >
              <input
                type="checkbox"
                checked={selectedAthletes.includes(athlete.prsn_rk)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedAthletes([...selectedAthletes, athlete.prsn_rk]);
                  } else {
                    setSelectedAthletes(
                      selectedAthletes.filter((id) => id !== athlete.prsn_rk)
                    );
                  }
                }}
              />
              {athlete.prsn_first_nm} {athlete.prsn_last_nm}
            </label>
          ))}
        </div>
      </FieldOutputContainer>
      {error && <SubmitError>{error}</SubmitError>}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <StyledButton onClick={onClose}>Cancel</StyledButton>
        <StyledButton
          onClick={async () => {
            if (selectedAthletes.length === 0) {
              setError("Select at least one athlete");
              return;
            }
            await fetchTrainingPeriods();
            setStep(2);
          }}
        >
          Next
        </StyledButton>
      </div>
    </>
  );

  // Step 2: Select Training Periods
  const renderStep2 = () => (
    <>
      <h2>Select Training Periods</h2>
      <FieldOutputContainer>
        <FieldLabel>
          For each athlete, select a training period to assign this program to:
        </FieldLabel>
        <div style={{ maxHeight: 300, overflowY: "auto", margin: "10px 0" }}>
          {selectedAthletes.map((athleteId) => {
            const athlete = athletes.find((a) => a.prsn_rk === athleteId);
            const periods = trainingPeriods.filter(
              (tp) => tp.prsn_rk === athleteId
            );
            return (
              <div key={athleteId} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: "bold" }}>
                  {athlete?.prsn_first_nm} {athlete?.prsn_last_nm}
                </div>
                <select
                  value={athletePeriods[athleteId] || ""}
                  onChange={(e) =>
                    setAthletePeriods({
                      ...athletePeriods,
                      [athleteId]: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Select Training Period</option>
                  {periods.map((tp) => (
                    <option key={tp.trpe_rk} value={tp.trpe_rk}>
                      {new Date(tp.trpe_start_dt).toLocaleDateString()} -
                      {tp.trpe_end_dt
                        ? new Date(tp.trpe_end_dt).toLocaleDateString()
                        : "Active"}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </FieldOutputContainer>
      {error && <SubmitError>{error}</SubmitError>}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <StyledButton onClick={() => setStep(1)}>Back</StyledButton>
        <StyledButton
          onClick={() => {
            // Validate all selected
            for (const athleteId of selectedAthletes) {
              if (!athletePeriods[athleteId]) {
                setError("Select a training period for each athlete");
                return;
              }
            }
            setStep(3);
          }}
        >
          Next
        </StyledButton>
      </div>
    </>
  );

  // Step 3: Assignment Info
  const renderStep3 = () => (
    <>
      <h2>Assignment Info</h2>
      <FieldOutputContainer>
        <FieldLabel>
          For each athlete/training period, fill out assignment information:
        </FieldLabel>
        <div style={{ maxHeight: 300, overflowY: "auto", margin: "10px 0" }}>
          {selectedAthletes.map((athleteId) => {
            const athlete = athletes.find((a) => a.prsn_rk === athleteId);
            const trpe_rk = athletePeriods[athleteId];
            return (
              <div
                key={athleteId}
                style={{
                  marginBottom: 16,
                  border: "1px solid #eee",
                  borderRadius: 6,
                  padding: 10,
                }}
              >
                <div style={{ fontWeight: "bold" }}>
                  {athlete?.prsn_first_nm} {athlete?.prsn_last_nm}
                </div>
                <div style={{ fontSize: 13, color: "#666" }}>
                  Training Period: {trpe_rk}
                </div>
                <textarea
                  placeholder="Assignment notes (optional)"
                  value={assignmentInfo[athleteId]?.notes || ""}
                  onChange={(e) =>
                    setAssignmentInfo({
                      ...assignmentInfo,
                      [athleteId]: {
                        ...assignmentInfo[athleteId],
                        notes: e.target.value,
                      },
                    })
                  }
                  style={{
                    width: "100%",
                    minHeight: 40,
                    marginTop: 6,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                    padding: 6,
                  }}
                />
              </div>
            );
          })}
        </div>
      </FieldOutputContainer>
      {error && <SubmitError>{error}</SubmitError>}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <StyledButton onClick={() => setStep(2)}>Back</StyledButton>
        <StyledButton
          onClick={async () => {
            setLoading(true);
            setError("");
            try {
              // Prepare assignments
              const assignments = selectedAthletes.map((athleteId) => ({
                trpe_rk: athletePeriods[athleteId],
                notes: assignmentInfo[athleteId]?.notes || "",
              }));
              await programAthleteAssignmentsApi.assignToTrainingPeriods(
                program.prog_rk,
                assignments
              );
              refresh && refresh();
              onClose();
            } catch (e) {
              setError(e.message || "Failed to assign program");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          Save Assignments
        </StyledButton>
      </div>
    </>
  );

  if (!open) return null;

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>Close</CloseButton>
        <Content>
          <StepperProgress currentStep={step} totalSteps={3} />
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default AssignProgramToAthletesModal;
