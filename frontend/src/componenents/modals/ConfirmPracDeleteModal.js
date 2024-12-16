import React from "react";
import dayjs from "dayjs";
import MeasurementList from "../tables/MeasurementList";
import {
  Overlay,
  ModalContainer,
  DeleteButton,
  ButtonContainer,
  CancelButton,
} from "../styles/styles";
const ConfirmPracDeleteModal = ({ open, onClose, pracObj, refresh }) => {
  async function deletePrac(prac_rk) {
    alert("PRAC DELETED");
    try {
      const response = await fetch(
        `http://localhost:5000/api//delete-practice`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prac_rk: pracObj.prac_rk,
          }),
        }
      );
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
