import React from "react";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  DeleteButton,
  ButtonContainer,
  CancelButton,
  FieldLabel,
  FieldContainer,
} from "../../styles/design-system";
import { measurablesApi } from "../../api";

const ConfirmMeasurableDeleteModal = ({ open, onClose, measObj, refresh }) => {
  async function deleteMeas(meas_rk) {
    try {
      await measurablesApi.delete(meas_rk);
      alert("Measurable Deleted Successfully");
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
        <CloseButton
          onClick={() => {
            onClose();
          }}
        >
          Close
        </CloseButton>
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
