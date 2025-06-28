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
import { exercisesApi } from "../../api";
const ConfirmExerciseDelete = ({ open, onClose, excr, refresh }) => {
  async function deleteExercise(excr_rk) {
    try {
      await exercisesApi.delete(excr_rk);
      alert("Exercise Deleted Successfully");
      onClose();
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
          <FieldLabel>Are you sure you want to delete Exercise:</FieldLabel>
          <h2>{excr.excr_nm}</h2>
        </FieldContainer>

        <ButtonContainer>
          <DeleteButton onClick={() => deleteExercise(excr.excr_rk)}>
            Delete
          </DeleteButton>
          <CancelButton onClick={() => onClose()}>Cancel</CancelButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmExerciseDelete;
