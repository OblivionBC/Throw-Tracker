import React, { useState, useEffect } from "react";
import {
  CompWrap,
  Title,
  RowDiv,
  AddButton,
  FieldOutputContainer,
  FieldLabel,
} from "../../styles/styles.js";
import { programsApi, programAthleteAssignmentsApi } from "../../api";
import useUserStore, { useUser } from "../../stores/userStore";
import AssignProgramModal from "./modals/AssignProgramModal";
import ProgramDetailsModal from "./modals/ProgramDetailsModal";

const CoachPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showProgramDetails, setShowProgramDetails] = useState(false);
  const user = useUser();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const programsData = await programsApi.getAll();
      setPrograms(programsData);
    } catch (error) {
      console.error("Error fetching programs:", error);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignProgram = (program) => {
    setSelectedProgram(program);
    setShowAssignModal(true);
  };

  const handleViewProgram = (program) => {
    setSelectedProgram(program);
    setShowProgramDetails(true);
  };

  if (loading) {
    return <div>Loading programs...</div>;
  }

  return (
    <CompWrap>
      <AssignProgramModal
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        program={selectedProgram}
        refresh={fetchPrograms}
      />

      <ProgramDetailsModal
        open={showProgramDetails}
        onClose={() => setShowProgramDetails(false)}
        program={selectedProgram}
        refresh={fetchPrograms}
      />

      <RowDiv>
        <Title>My Programs</Title>
        <AddButton onClick={() => (window.location.href = "/programs")}>
          Create New Program
        </AddButton>
      </RowDiv>

      {programs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          No programs created yet. Create your first program to get started.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {programs.map((program) => (
            <div
              key={program.prog_rk}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
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
                    Created:{" "}
                    {new Date(
                      program.created_dt || program.assigned_dt
                    ).toLocaleDateString()}
                  </div>
                  {program.notes && (
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        marginTop: "5px",
                      }}
                    >
                      Notes: {program.notes}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <AddButton
                    onClick={() => handleViewProgram(program)}
                    style={{
                      backgroundColor: "#17a2b8",
                      color: "white",
                      padding: "8px 15px",
                      fontSize: "14px",
                    }}
                  >
                    View Details
                  </AddButton>
                  <AddButton
                    onClick={() => handleAssignProgram(program)}
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "8px 15px",
                      fontSize: "14px",
                    }}
                  >
                    Assign to Athletes
                  </AddButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CompWrap>
  );
};

export default CoachPrograms;
