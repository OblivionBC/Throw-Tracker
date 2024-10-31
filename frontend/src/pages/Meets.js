import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PracticeList from "../componenents/tables/PracticeList";
import TrainingPeriodList from "../componenents/tables/TrainingPeriodList";
import MeasurementChart from "../componenents/MeasurementChart";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";
import MeetList from "../componenents/tables/MeetList";

const Meets = () => {
  const [activeTRPE, setActiveTRPE] = useState([]);
  const [activePRAC, setActivePRAC] = useState([]);

  return (
    <Page>
      <LeftColumn>
        <ErrorBoundary>
          <MeasurementChart activeTRPE={activeTRPE} activePRAC={activePRAC} />
        </ErrorBoundary>

        <ErrorBoundary>
          <MeetList />
        </ErrorBoundary>
      </LeftColumn>
      <RightColumn>
        <ErrorBoundary>
          <PracticeList
            sharedState={activePRAC}
            setSharedState={setActivePRAC}
          />
        </ErrorBoundary>
      </RightColumn>
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 90vh;
  font-family: "Rubik", sans-serif;
`;

const LeftColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 50%;
  height: 100%;
`;

const RightColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 50%;
  height: 100%;
  overflow: hidden;
`;
export default Meets;
