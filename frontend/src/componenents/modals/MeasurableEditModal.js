import React from "react";
import "typeface-nunito";
import EditMeasurableForm from "../forms/EditMeasurableForm";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
  AddButton,
  RowDiv,
  RowContainer,
  FieldName,
} from "../../styles/styles";
const MeasurableEditModal = ({ open, onClose, measObj, refresh }) => {
  if (!open) return null;
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
          <EditMeasurableForm
            measObj={measObj}
            close={() => onClose()}
            refresh={refresh}
          />
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default MeasurableEditModal;
