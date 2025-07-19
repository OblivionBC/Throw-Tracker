import React, { useEffect } from "react";
import { useState } from "react";
import "typeface-nunito";
import ProgramMeasurableContent from "../tables/ProgramContentList";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  AddButton,
  RowDiv,
} from "../../styles/styles";
import {
  programAthleteAssignmentsApi,
  programMeasurableAssignmentsApi,
} from "../../api";
const ProgramsModal = ({ open, onClose, refresh, trpe_rk }) => {
  const [loading, setLoading] = useState(false);
  const [programData, setProgramData] = useState([]);
  const getProgramData = async (forceRefresh = false) => {
    // Don't make API call if trpe_rk is not available
    if (!trpe_rk) {
      console.warn("ProgramsModal: trpe_rk is not available");
      return;
    }

    try {
      // Get programs assigned to this training period
      const programsResponse =
        await programAthleteAssignmentsApi.getTrainingPeriodPrograms(
          trpe_rk,
          forceRefresh
        );

      let newDataArr = [];

      // For each program, get its measurables
      for (const program of programsResponse) {
        let measurables = [];
        try {
          const measurablesResponse =
            await programMeasurableAssignmentsApi.getProgramMeasurables(
              program.prog_rk
            );
          measurables = measurablesResponse;
        } catch (error) {
          console.error(
            `Error fetching measurables for program ${program.prog_rk}:`,
            error
          );
        }
        newDataArr.push({ program, measurables });
      }
      setProgramData(newDataArr);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    // Only fetch data if modal is open and we have valid trpe_rk
    if (open && trpe_rk) {
      getProgramData(true); // Always force refresh on open
    }
  }, [trpe_rk, open]);
  if (!open || loading) return null;
  return (
    <Overlay>
      <ModalContainer>
        <CloseButton
          onClick={() => {
            onClose();
          }}
        >
          Close
        </CloseButton>

        <Content>
          <RowDiv>
            <h1>Programs Assigned to Training Period {trpe_rk}</h1>
            <AddButton onClick={() => getProgramData(true)}>Refresh</AddButton>
          </RowDiv>
          {programData.length === 0 ? (
            <div>No Programs</div>
          ) : (
            programData.map(({ program, measurables }) => (
              <div
                key={program.prog_rk}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 8,
                  marginBottom: 16,
                  padding: 12,
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: 16 }}>
                  {program.prog_nm}
                </div>
                <div style={{ fontSize: 13, color: "#555" }}>
                  <b>Notes:</b> {program.notes || "None"}
                </div>
                <div style={{ fontSize: 13, color: "#555" }}>
                  <b>Assigned by:</b> {program.assigner_first_nm}{" "}
                  {program.assigner_last_nm}
                </div>
                <div style={{ fontSize: 13, color: "#555" }}>
                  <b>Assigned on:</b>{" "}
                  {program.assigned_dt
                    ? new Date(program.assigned_dt).toLocaleDateString()
                    : "N/A"}
                </div>
                <div style={{ marginTop: 8 }}>
                  <ProgramMeasurableContent
                    data={measurables}
                    prog_rk={program.prog_rk}
                    bAdd
                    bDelete
                    bEdit
                    refresh={() => getProgramData(true)}
                  />
                </div>
              </div>
            ))
          )}
          {/* Display assigned athletes and their training periods if available */}
          {Array.isArray(programData.assignments) &&
            programData.assignments.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3>Athletes Assigned</h3>
                {programData.assignments.map((assignment, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #ddd",
                      padding: 10,
                      margin: "5px 0",
                      borderRadius: 5,
                    }}
                  >
                    <p>
                      <strong>Athlete:</strong> {assignment.athlete_first_nm}{" "}
                      {assignment.athlete_last_nm}
                    </p>
                    <p>
                      <strong>Training Period:</strong> {assignment.trpe_rk}
                    </p>
                    {assignment.notes && (
                      <p>
                        <strong>Notes:</strong> {assignment.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default ProgramsModal;
