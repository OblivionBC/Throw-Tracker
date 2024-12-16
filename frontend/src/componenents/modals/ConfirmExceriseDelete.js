import React from "react";
import {
  Overlay,
  ModalContainer,
  DeleteButton,
  ButtonContainer,
  CancelButton,
  FieldLabel,
  FieldContainer,
} from "../styles/styles";
const ConfirmExerciseDelete = ({ open, onClose, excr, refresh }) => {
  async function deleteExercise(excr_rk) {
    alert("PRAC DELETED");
    try {
      //Fix the route
      const response = await fetch(
        `http://localhost:5000/api//delete-exercise`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            excr_rk: excr_rk,
          }),
        }
      );
      console.log(response);
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
