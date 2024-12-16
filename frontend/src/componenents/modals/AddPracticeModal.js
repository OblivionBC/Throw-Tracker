import React from "react";
import { useState } from "react";
import AddPracticeForm from "../forms/AddPracticeForm";
import "typeface-nunito";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
} from "../styles/styles";
const AddPracticeModal = ({ open, onClose, refresh }) => {
  const [loading, setLoading] = useState(false);

  if (!open || loading) return null;
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
          <AddPracticeForm close={() => onClose()} refresh={() => refresh()} />
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default AddPracticeModal;
