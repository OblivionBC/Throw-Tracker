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
const ConfirmExerciseAssignmentDelete = ({
  open,
  onClose,
  fullClose,
  excr,
  refresh,
}) => {
  async function deleteExas({ exas_rk }) {
    try {
      //Fix the route
      console.log("DELETING");
      const response = await fetch(
        `http://localhost:5000/api/delete-exerciseAssignment`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exas_rk: excr.exas_rk,
          }),
        }
      );
      alert("Exercise Assignment DELETED");

      console.log(response);
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
          <DeleteButton onClick={() => deleteExas(excr.exas_rk)}>
            Delete
          </DeleteButton>
          <CancelButton onClick={() => onClose()}>Cancel</CancelButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};
export default ConfirmExerciseAssignmentDelete;
