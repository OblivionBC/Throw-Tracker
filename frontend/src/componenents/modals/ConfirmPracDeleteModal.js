import React from "react";
import styled from "styled-components";
import { useState } from "react";
import dayjs from "dayjs";
import MeasurementList from "../tables/MeasurementList";

const ConfirmPracDeleteModal = ({ open, onClose, pracObj }) => {
  const [login, setLogin] = useState(true);
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
    } catch (error) {
      alert(error.message);
    }
  }
  if (!open) return null;

  return (
    <Modal>
      <Overlay>
        <ModalContainer>
          <h3>
            Are you sure you want to delete Practice {pracObj.prac_rk} and its{" "}
            {pracObj.measurement_count} measurements?
          </h3>
          <h4>Date: {dayjs(pracObj.prac_dt).format("MMM D YYYY")}</h4>
          <MeasurementList prac_rk={pracObj.prac_rk} />
          <ButtonContainer>
            <StyledButton onClick={() => deletePrac(pracObj.prac_rk)}>
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
export default ConfirmPracDeleteModal;
