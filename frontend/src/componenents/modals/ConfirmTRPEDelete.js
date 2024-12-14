import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

const ConfirmTRPEDelete = ({ open, onClose, trpeObj, refresh }) => {
  async function deleteTRPE(meas_rk) {
    alert("PRAC DELETED");
    try {
      //Fix the route
      const response = await fetch(
        `http://localhost:5000/api//delete-trainingPeriod`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trpe_rk: trpeObj.trpe_rk,
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
  console.log(trpeObj);
  return (
    <Modal>
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
            <StyledButton onClick={() => deleteTRPE(trpeObj.trpe_rk)}>
              Delete
            </StyledButton>
            <CancelButton onClick={() => onClose()}>Cancel</CancelButton>
          </ButtonContainer>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  padding: 12px 24px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.9);
  width: 100%;
  height: 100%;
`;
const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 1400px;
  width: 70%;
  position: fixed;
  background-color: white;
  border-radius: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 20%;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const FieldLabel = styled.h4`
  color: grey;
  margin-right: 20px;
`;
export default ConfirmTRPEDelete;
