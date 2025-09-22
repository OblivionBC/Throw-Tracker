import React from "react";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  AddButton,
  RowDiv,
  Title,
  FieldOutputContainer,
  FieldLabel,
} from "../../styles/design-system";
import { programMeasurableAssignmentsApi } from "../../api";
import Logger from "../../utils/logger";

const ConfirmMeasurableAssignmentDelete = ({
  open,
  onClose,
  refresh,
  measurable,
}) => {
  if (!open) return null;

  const handleDelete = async () => {
    try {
      await programMeasurableAssignmentsApi.removeFromProgram(
        measurable.prma_rk
      );
      alert("Measurable removed from program successfully");
      refresh();
      onClose();
    } catch (error) {
      alert("Error removing measurable: " + error.message);
      Logger.error(error.message);
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>Cancel</CloseButton>
        <Content>
          <Title>Confirm Delete</Title>
          <FieldOutputContainer>
            <FieldLabel>
              Are you sure you want to remove this measurable from the program?
            </FieldLabel>
          </FieldOutputContainer>
          <FieldOutputContainer>
            <FieldLabel>Measurable:</FieldLabel>
            <p>
              {measurable.meas_id} ({measurable.meas_typ})
            </p>
          </FieldOutputContainer>
          <FieldOutputContainer>
            <FieldLabel>Target Value:</FieldLabel>
            <p>{measurable.target_val || "Not set"}</p>
          </FieldOutputContainer>
          <FieldOutputContainer>
            <FieldLabel>Target Reps:</FieldLabel>
            <p>{measurable.target_reps || "Not set"}</p>
          </FieldOutputContainer>
          <FieldOutputContainer>
            <FieldLabel>Target Sets:</FieldLabel>
            <p>{measurable.target_sets || "Not set"}</p>
          </FieldOutputContainer>
          <FieldOutputContainer>
            <FieldLabel>Notes:</FieldLabel>
            <p>{measurable.notes || "No notes"}</p>
          </FieldOutputContainer>
        </Content>
        <RowDiv>
          <AddButton
            onClick={handleDelete}
            style={{ backgroundColor: "#dc3545" }}
          >
            Delete
          </AddButton>
        </RowDiv>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmMeasurableAssignmentDelete;
