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
const ConfirmMeasurableDeleteModal = ({ open, onClose, measObj, refresh }) => {
  async function deleteMeas(meas_rk) {
    try {
      const response = await fetch(
        `http://localhost:5000/api//delete-measurable`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meas_rk: measObj.meas_rk,
          }),
        }
      );
      alert("Meas DELETED");
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
          <FieldLabel>Are you sure you want to delete Measurable: </FieldLabel>
          <h2>{measObj.meas_id}</h2>
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Type:</FieldLabel>
          <h2>{measObj.meas_typ}</h2>
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Units:</FieldLabel>
          <h2>{measObj.meas_unit}</h2>
        </FieldContainer>

        <ButtonContainer>
          <DeleteButton onClick={() => deleteMeas(measObj.meas_rk)}>
            Delete
          </DeleteButton>
          <CancelButton onClick={() => onClose()}>Cancel</CancelButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};
export default ConfirmMeasurableDeleteModal;
