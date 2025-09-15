import React from "react";
import dayjs from "dayjs";
import MeasurementList from "../tables/MeasurementList";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  DeleteButton,
  ButtonContainer,
  CancelButton,
} from "../../styles/design-system";
import { practicesApi } from "../../api";
const ConfirmPracDeleteModal = ({ open, onClose, pracObj, refresh }) => {
  async function deletePrac(prac_rk) {
    try {
      await practicesApi.delete(prac_rk);
      alert("Practice Deleted Successfully");
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
        <h3>
          Are you sure you want to delete Practice {pracObj.prac_rk} and its{" "}
          {pracObj.measurement_count} measurements?
        </h3>
        <h4>Date: {dayjs(pracObj.prac_dt).format("MMM D YYYY")}</h4>
        <MeasurementList prac_rk={pracObj.prac_rk} />
        <ButtonContainer>
          <DeleteButton onClick={() => deletePrac(pracObj.prac_rk)}>
            Delete
          </DeleteButton>
          <CancelButton onClick={() => onClose()}>Cancel</CancelButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmPracDeleteModal;
