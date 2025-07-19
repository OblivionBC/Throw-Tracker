import React, { useState, useEffect } from "react";
import "typeface-nunito";
import TrainingPeriodList from "../tables/TrainingPeriodList";
import AthleteEventAssignmentsList from "../tables/AthleteEventAssignmentsList";
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Content,
} from "../../styles/styles";
const AthleteDetails = ({ open, onClose, refresh, athlete }) => {
  const [loading, setLoading] = useState(false);
  const [currentPrsnRk, setCurrentPrsnRk] = useState(athlete?.prsn_rk);

  useEffect(() => {
    setCurrentPrsnRk(athlete?.prsn_rk);
    console.log(athlete);
  }, [athlete?.prsn_rk]);

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
          <AthleteEventAssignmentsList athlete_rk={currentPrsnRk} />
          <TrainingPeriodList prsn_rk={currentPrsnRk} bPrograms={true} />
        </Content>
      </ModalContainer>
    </Overlay>
  );
};

export default AthleteDetails;
