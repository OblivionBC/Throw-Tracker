import React from "react";
import { useState } from "react";
import AddExerciseAssignmentForm from "../forms/AddExerciseAssignment";
import "typeface-nunito";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
} from "../styles/styles";
const AddExerciseAssignment = ({
  open,
  onClose,
  refresh,
  prog_rk,
  prsn_rk,
}) => {
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
          <AddExerciseAssignmentForm
            close={() => {
              console.log("CLOSING");
              onClose();
              console.log("CLOSING");
            }}
            refresh={() => refresh()}
            prog_rk={prog_rk}
            athlete_prsn_rk={prsn_rk}
          />
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default AddExerciseAssignment;
