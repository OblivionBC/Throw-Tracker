import React, { useState, useEffect, useRef } from "react";
import "typeface-nunito";
import TrainingPeriodList from "../tables/TrainingPeriodList";
import AthleteEventAssignmentsList from "../tables/AthleteEventAssignmentsList";
import AssignEventToAthleteModal from "./AssignEventToAthleteModal";
import { personsApi } from "../../api";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  StyledButton,
} from "../../styles/design-system";
const AthleteDetails = ({ open, onClose, refresh, athlete }) => {
  const [loading, setLoading] = useState(false);
  const [currentPrsnRk, setCurrentPrsnRk] = useState(athlete?.prsn_rk);
  const [assignEventOpen, setAssignEventOpen] = useState(false);
  const eventAssignmentsRef = useRef();

  const handleEventAssignmentRefresh = async () => {
    // Refresh the event assignments table
    if (eventAssignmentsRef.current) {
      await eventAssignmentsRef.current.refresh();
    }
    // This will trigger a refresh of the parent component (AthleteList)
    if (refresh) {
      refresh();
    }
  };

  const handleUnassignMe = async () => {
    if (
      window.confirm(
        "Are you sure you want to unassign yourself from this athlete?"
      )
    ) {
      try {
        await personsApi.unassignCoachFromAthlete(athlete.prsn_rk);
        alert("Successfully unassigned from athlete");
        onClose();
        if (refresh) {
          refresh();
        }
      } catch (error) {
        alert("Error unassigning from athlete: " + error.message);
      }
    }
  };

  useEffect(() => {
    setCurrentPrsnRk(athlete?.prsn_rk);
    console.log("AthleteDetails - athlete:", athlete);
    console.log("AthleteDetails - currentPrsnRk:", athlete?.prsn_rk);
  }, [athlete?.prsn_rk]);

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h1>{athlete.prsn_first_nm + " " + athlete.prsn_last_nm}</h1>
            <div style={{ display: "flex", gap: "10px" }}>
              <StyledButton
                onClick={() => setAssignEventOpen(true)}
                style={{ backgroundColor: "#28a745" }}
              >
                Assign Events
              </StyledButton>
              <StyledButton
                onClick={handleUnassignMe}
                style={{ backgroundColor: "#dc3545" }}
              >
                Unassign To Me
              </StyledButton>
            </div>
          </div>
          <AthleteEventAssignmentsList
            ref={eventAssignmentsRef}
            athlete_rk={currentPrsnRk}
            onRefresh={handleEventAssignmentRefresh}
          />
          <TrainingPeriodList prsn_rk={currentPrsnRk} bPrograms={true} />
        </Content>
        <AssignEventToAthleteModal
          open={assignEventOpen}
          onClose={() => setAssignEventOpen(false)}
          onSuccess={handleEventAssignmentRefresh}
          selectedAthlete={athlete}
        />
      </ModalContainer>
    </Overlay>
  );
};

export default AthleteDetails;
