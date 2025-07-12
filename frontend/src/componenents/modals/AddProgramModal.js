import React, { useState, useEffect } from "react";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
} from "../../styles/styles";
import AddProgramForm from "../forms/AddProgram";
import { trainingPeriodsApi } from "../../api";

const AddProgramModal = ({ open, onClose, refresh }) => {
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
