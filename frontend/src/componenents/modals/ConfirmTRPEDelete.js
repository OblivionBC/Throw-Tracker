import React from "react";
import dayjs from "dayjs";
import Practices from "../tables/PracticeList";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  FieldContainer,
  FieldLabel,
  ButtonContainer,
  DeleteButton,
  CancelButton,
} from "../../styles/design-system";
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
        <Content>
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

          <FieldContainer>
            <FieldLabel style={{ color: "#dc3545", fontWeight: "bold" }}>
              ⚠️ Warning: All practices in this training period will also be
              deleted!
            </FieldLabel>
          </FieldContainer>

          <div
            style={{ margin: "20px 0", maxHeight: "300px", overflow: "auto" }}
          >
            <h3>Practices in this Training Period:</h3>
            <Practices
              trpe_rk={trpeObj.trpe_rk}
              bAdd={false}
              bDetail={true}
              bDelete={false}
              paginationNum={3}
            />
          </div>
        </Content>

        <ButtonContainer>
          <DeleteButton onClick={() => deleteTRPE(trpeObj.trpe_rk)}>
            Delete Training Period & All Practices
          </DeleteButton>
          <CancelButton onClick={() => onClose()}>Cancel</CancelButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmTRPEDelete;
