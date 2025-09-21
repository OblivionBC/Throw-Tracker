import React from "react";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  StyledButton,
} from "../../styles/design-system";
import { personsApi } from "../../api";
import Logger from "../../utils/logger";

const ConfirmAssignAthleteModal = ({ open, onClose, refresh, athlete }) => {
  const handleAssign = async () => {
    try {
      await personsApi.assignCoachToAthlete(athlete.prsn_rk);
      alert("Athlete assigned successfully");
      refresh();
      onClose();
    } catch (error) {
      alert("Error assigning athlete: " + error.message);
      Logger.error("Error assigning athlete:", error);
    }
  };

  if (!open) return null;

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>Close</CloseButton>
        <Content>
          <h2>Confirm Assignment</h2>
          <p>
            Are you sure you want to assign{" "}
            <strong>
              {athlete?.prsn_first_nm} {athlete?.prsn_last_nm}
            </strong>{" "}
            to yourself as their coach?
          </p>
          <p style={{ color: "#007bff", fontWeight: "bold" }}>
            This will make you responsible for managing this athlete's training
            and progress.
          </p>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <StyledButton
              onClick={handleAssign}
              style={{ backgroundColor: "#28a745" }}
            >
              Assign To Me
            </StyledButton>
            <StyledButton onClick={onClose}>Cancel</StyledButton>
          </div>
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmAssignAthleteModal;
