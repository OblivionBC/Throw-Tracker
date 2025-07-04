import React from "react";
import {
  Overlay,
  ModalContainer,
  DeleteButton,
  ButtonContainer,
  CancelButton,
  FieldLabel,
  FieldContainer,
} from "../../styles/styles";
import { exerciseAssignmentsApi } from "../../api";

const ConfirmExerciseAssignmentDelete = ({
  open,
  onClose,
  fullClose,
  excr,
  refresh,
}) => {
  async function deleteExas() {
    try {
      await exerciseAssignmentsApi.delete(excr.exas_rk);
      alert("Exercise Assignment DELETED");

      onClose();
      fullClose();
      refresh();
    } catch (error) {
      alert(error.message);
    }
  }

  if (!open) return null;

  return (
    <Overlay>
      <ModalContainer>
        <FieldContainer>
          <FieldLabel>
            Are you sure you want to delete the Assignment of Excercise:
          </FieldLabel>
          <h2>{excr.excr_nm}</h2>
        </FieldContainer>

        <ButtonContainer>
          <DeleteButton onClick={deleteExas}>Delete</DeleteButton>
          <CancelButton onClick={() => onClose()}>Cancel</CancelButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmExerciseAssignmentDelete;
