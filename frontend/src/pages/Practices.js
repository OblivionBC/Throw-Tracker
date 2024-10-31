import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PracticeList from "../componenents/tables/PracticeList";
import TrainingPeriodList from "../componenents/tables/TrainingPeriodList";
import LineChart from "../componenents/Chart";
import MeasurementChart from "../componenents/MeasurementChart";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";

const Practices = () => {
  const [activeTRPE, setActiveTRPE] = useState([]);
  useEffect(() => {
    console.log("Active TRPE change");
    console.log(activeTRPE);
  }, [activeTRPE]);

  return (
    <Page>
      <LeftColumn>
        <ErrorBoundary>
          <MeasurementChart activeTRPE={activeTRPE} />
        </ErrorBoundary>

        <ErrorBoundary>
          <TrainingPeriodList
            sharedState={activeTRPE}
            setSharedState={setActiveTRPE}
          />
        </ErrorBoundary>
      </LeftColumn>
      <RightColumn>
        <ErrorBoundary>
          <PracticeList />
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
const Title = styled.h1`
  display: flex;
  align-self: flex-start;
  margin: 0;
  padding: 0 5px 5px;
`;
export default Practices;
