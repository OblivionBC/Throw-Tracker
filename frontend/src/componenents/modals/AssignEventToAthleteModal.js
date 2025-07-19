import React from "react";
import styled from "styled-components";
import AssignEventToAthleteForm from "../forms/AssignEventToAthleteForm";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  z-index: 1;

  &:hover {
    color: #333;
  }
`;

const Content = styled.div`
  padding: 20px;
`;

const AssignEventToAthleteModal = ({ open, onClose, onSuccess }) => {
  if (!open) return null;

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Content>
          <AssignEventToAthleteForm
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default AssignEventToAthleteModal;
