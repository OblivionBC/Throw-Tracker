import React, { useState, useEffect, useCallback } from "react";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  EditButton,
  RowContainer,
  FieldName,
  StyledButton,
} from "../../styles/styles";
import { programsApi, programAthleteAssignmentsApi } from "../../api";
import AddProgramModal from "./AddProgramModal";
import AssignProgramToAthletesModal from "./AssignProgramToAthletesModal";

const ProgramDetailsModal = ({ open, onClose, refresh, program }) => {
  const [loading, setLoading] = useState(false);
  const [programDetails, setProgramDetails] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const getProgramDetails = useCallback(async () => {
    if (!program?.prog_rk) return;
    setLoading(true);
    try {
      const [detailsResponse, assignmentsResponse] = await Promise.all([
        programsApi.getById(program.prog_rk),
        programAthleteAssignmentsApi.getProgramAssignments(program.prog_rk),
      ]);
      setProgramDetails(detailsResponse);
      setAssignments(assignmentsResponse);
    } catch (error) {
      console.error("Error fetching program details:", error);
    } finally {
      setLoading(false);
    }
  }, [program?.prog_rk]);

  useEffect(() => {
    if (open && program?.prog_rk) {
      getProgramDetails();
    }
  }, [open, getProgramDetails]);

  if (!open) return null;

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>Close</CloseButton>
        <Content>
          {loading ? (
            <div>Loading program details...</div>
          ) : (
            <div>
              <h2>Program Details: {program.prog_nm}</h2>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <StyledButton onClick={() => setEditOpen(true)}>
                  Edit
                </StyledButton>
                <StyledButton onClick={() => setAssignOpen(true)}>
                  Assign
                </StyledButton>
              </div>
              {programDetails && (
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    <h3>Program Information</h3>
                    <p>
                      <strong>Name:</strong> {programDetails.program.prog_nm}
                    </p>
                    <p>
                      <strong>Training Period:</strong>{" "}
                      {programDetails.program.trpe_rk}
                    </p>
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {new Date(
                        programDetails.program.trpe_start_dt
                      ).toLocaleDateString()}
                    </p>
                    {programDetails.program.trpe_end_dt && (
                      <p>
                        <strong>End Date:</strong>{" "}
                        {new Date(
                          programDetails.program.trpe_end_dt
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <h3>Measurables ({programDetails.measurables.length})</h3>
                    {programDetails.measurables.length > 0 ? (
                      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {programDetails.measurables.map((measurable, index) => (
                          <div
                            key={index}
                            style={{
                              border: "1px solid #ddd",
                              padding: "10px",
                              margin: "5px 0",
                              borderRadius: "5px",
                            }}
                          >
                            <p>
                              <strong>Measurable:</strong> {measurable.meas_id}{" "}
                              ({measurable.meas_unit})
                            </p>
                            <p>
                              <strong>Type:</strong> {measurable.meas_typ}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No measurables in this program.</p>
                    )}
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <h3>Athletes Assigned ({assignments.length})</h3>
                    {assignments.length > 0 ? (
                      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {assignments.map((assignment, index) => (
                          <div
                            key={index}
                            style={{
                              border: "1px solid #ddd",
                              padding: "10px",
                              margin: "5px 0",
                              borderRadius: "5px",
                            }}
                          >
                            <p>
                              <strong>Athlete:</strong>{" "}
                              {assignment.athlete_first_nm}{" "}
                              {assignment.athlete_last_nm}
                            </p>
                            <p>
                              <strong>Assigned by:</strong>{" "}
                              {assignment.assigner_first_nm}{" "}
                              {assignment.assigner_last_nm}
                            </p>
                            <p>
                              <strong>Assigned on:</strong>{" "}
                              {new Date(
                                assignment.assigned_dt
                              ).toLocaleDateString()}
                            </p>
                            {assignment.notes && (
                              <p>
                                <strong>Notes:</strong> {assignment.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No athletes assigned to this program.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </Content>
        {editOpen && (
          <AddProgramModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            refresh={refresh}
            program={program}
            editMode
          />
        )}
        {assignOpen && (
          <AssignProgramToAthletesModal
            open={assignOpen}
            onClose={() => setAssignOpen(false)}
            program={program}
            refresh={refresh}
          />
        )}
      </ModalContainer>
    </Overlay>
  );
};

export default ProgramDetailsModal;
