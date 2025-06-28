import React from "react";
import dayjs from "dayjs";
import {
  Overlay,
  ModalContainer,
  FieldContainer,
  FieldLabel,
  ButtonContainer,
  DeleteButton,
  CancelButton,
} from "../../styles/styles";
import { trainingPeriodsApi } from "../../api";
const ConfirmTRPEDelete = ({ open, onClose, trpeObj, refresh }) => {
  async function deleteTRPE(meas_rk) {
    try {
      await trainingPeriodsApi.delete(trpeObj.trpe_rk);
      alert("Training Period Deleted Successfully");
      onClose();
      refresh();
    } catch (error) {
      alert(error.message);
    }
  }
  if (!open) return null;
  console.log(trpeObj);
  return (
    <Overlay>
      <ModalContainer>
        <FieldContainer>
          <FieldLabel>
            Are you sure you want to delete Training Period:{" "}
          </FieldLabel>
          <h2>{trpeObj.trpe_rk}</h2>
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Start Date: </FieldLabel>
          <h2>{dayjs(trpeObj.trpe_start_dt).format("MMM D YYYY")}</h2>
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>End Date: </FieldLabel>
          <h2>
            {trpeObj.trpe_end_dt === null
              ? "No End Date"
              : dayjs(trpeObj.trpe_end_dt).format("MMM D YYYY")}
          </h2>
        </FieldContainer>

        <ButtonContainer>
          <DeleteButton onClick={() => deleteTRPE(trpeObj.trpe_rk)}>
            Delete
          </DeleteButton>
          <CancelButton onClick={() => onClose()}>Cancel</CancelButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmTRPEDelete;
