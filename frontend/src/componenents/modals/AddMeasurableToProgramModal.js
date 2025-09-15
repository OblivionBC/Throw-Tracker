import React from "react";
import DynamicModal from "../dynamicModals/DynamicModal";
import AddMeasurableToProgramForm from "../forms/AddMeasurableToProgram";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
} from "../../styles/design-system";

const AddMeasurableToProgramModal = ({ open, onClose, refresh, prog_rk }) => {
  if (!open) return null;

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>Close</CloseButton>
        <Content>
          <DynamicModal
            open={true}
            onClose={onClose}
            refresh={refresh}
            Component={AddMeasurableToProgramForm}
            props={{ prog_rk }}
          />
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default AddMeasurableToProgramModal;
