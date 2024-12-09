import React from "react";
import styled from "styled-components";

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
    <Modal>
      <Overlay>
        <ModalContainer>
          <FieldContainer>
            <FieldLabel>
              Are you sure you want to delete Measurable:{" "}
            </FieldLabel>
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
            <StyledButton onClick={() => deleteMeas(measObj.meas_rk)}>
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
  max-width: 900px;
  width: 100%;
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
export default ConfirmMeasurableDeleteModal;
