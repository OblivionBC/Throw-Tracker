import React from "react";
import { useState } from "react";
import "typeface-nunito";
import AddTRPEForm from "../forms/AddTRPEForm";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
} from "../styles/styles";
const AddTRPEModal = ({ open, onClose, refresh }) => {
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
          <AddTRPEForm close={() => onClose()} refresh={() => refresh()} />
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default AddTRPEModal;
