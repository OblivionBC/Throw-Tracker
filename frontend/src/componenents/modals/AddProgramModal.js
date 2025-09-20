import React, { useState } from "react";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
} from "../../styles/design-system";
import AddProgramForm from "../forms/AddProgram";

const AddProgramModal = ({ open, onClose, refresh }) => {
  const [loading] = useState(false);

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
          <h2>Add New Program</h2>
          <AddProgramForm
            close={() => {
              onClose();
            }}
            refresh={() => refresh()}
          />
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default AddProgramModal;
