import React from "react";
import { useState } from "react";
import "typeface-nunito";
import TrainingPeriodList from "../tables/TrainingPeriodList";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
} from "../../styles/styles";
const AthleteDetails = ({ open, onClose, refresh, athlete }) => {
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
          <h1>{athlete.prsn_first_nm + " " + athlete.prsn_last_nm}</h1>
          <TrainingPeriodList prsn_rk={athlete.prsn_rk} bPrograms={true} />
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default AthleteDetails;
