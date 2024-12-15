import React from "react";
import { useState } from "react";
import AddMeasurableForm from "../forms/AddMeasurableForm";
import "typeface-nunito";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
} from "../styles/styles";

const AddMeasurableModal = ({ open, onClose, refresh }) => {
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
          <AddMeasurableForm
            close={() => onClose()}
            refresh={() => refresh()}
          />
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default AddMeasurableModal;
