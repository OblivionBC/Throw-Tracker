import React from "react";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  StyledButton,
} from "../../styles/styles";
import { programsApi } from "../../api";

const ConfirmProgramDelete = ({ open, onClose, refresh, program }) => {
  const handleDelete = async () => {
    try {
      await programsApi.delete(program.prog_rk);
      alert("Program Deleted Successfully");
      refresh();
      onClose();
    } catch (error) {
      alert("Error deleting program: " + error.message);
      console.error("Error deleting program:", error);
    }
  };

  if (!open) return null;

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>Close</CloseButton>
        <Content>
          <h2>Confirm Delete</h2>
          <p>
            Are you sure you want to delete the program "{program.prog_nm}"?
          </p>
          <p style={{ color: "red", fontWeight: "bold" }}>
            This action cannot be undone and will delete all associated exercise
            assignments.
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
              onClick={handleDelete}
              style={{ backgroundColor: "#dc3545" }}
            >
              Delete Program
            </StyledButton>
            <StyledButton onClick={onClose}>Cancel</StyledButton>
          </div>
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmProgramDelete;
