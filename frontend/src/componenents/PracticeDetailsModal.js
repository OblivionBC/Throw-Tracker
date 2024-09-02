import React from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";
const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
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
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
`;
const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  position: fixed;
  background-color: white;
`;
const Content = styled.div``;
const EditButton = styled.button``;
const CloseButton = styled.button``;
const PracticeDetailsModal = ({ open, onClose, pracObj }) => {
  const [measurables, setMeasurables] = useEffect([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurables = async () => {
      if (open === true) {
        setLoading(true);
        try {
          const params = new URLSearchParams({
            key: JSON.stringify(pracObj.prac_rk),
          });
          const response = await fetch(
            `http://localhost:5000/api//get-measurableForPrac?${params}`
          );
          const jsonData = await response.json();
          setMeasurables(jsonData);
        } catch (error) {
          console.error(error.message);
        }
        setLoading(false);
      }
    };
    fetchMeasurables();
  }, [open]);

  if (!open) return null;
  console.log("HERES THE PRAC IN MODAL");
  console.log(pracObj);
  console.log(pracObj.prac_best);
  return (
    <Modal>
      <Overlay>
        <ModalContainer>
          <p>HERE IS MY MODAL</p>
          <CloseButton onClick={onClose}>Close</CloseButton>
          <Content>HERE IS THE CONTANT {pracObj.prac_best}</Content>
          <EditButton>Edit</EditButton>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

export default PracticeDetailsModal;
