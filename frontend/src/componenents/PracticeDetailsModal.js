import React from "react";
import styled from "styled-components";
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
`;
const Content = styled.div``;
const EditButton = styled.button``;
const CloseButton = styled.button``;
const PracticeDetailsModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <Modal>
      <Overlay>
        <ModalContainer>
          <p>HERE IS MY MODAL</p>
          <CloseButton onClick={onClose}>Close</CloseButton>
          <Content>
            HERE IS THE CONTANT
            <EditButton>Edit</EditButton>
          </Content>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

export default PracticeDetailsModal;
