import React, { useState } from "react";
import styled from "styled-components";
import TrainingPeriodList from "../componenents/tables/TrainingPeriodList";
import MeasurementChart from "../componenents/MeasurementChart";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";

const ChartPage = () => {
  const [activeTRPE, setActiveTRPE] = useState([]);

  return (
    <Page>
      <LeftColumn>
        <ErrorBoundary>
          <MeasurementChart activeTRPE={activeTRPE} />
        </ErrorBoundary>
      </LeftColumn>
      <RightColumn>
        <ErrorBoundary>
          <TrainingPeriodList
            sharedState={activeTRPE}
            setSharedState={setActiveTRPE}
            paginationNum={8}
            selectable={true}
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
  padding: 20px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex: 1;
  margin: 0;
  padding: 0;
  align-self: flex-start;
  flex-direction: column;
  height: 100%;
  max-width: 60%;
`;

const RightColumn = styled.div`
  display: flex;
  flex: 0.4;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  margin-left: 20px;
  overflow: hidden;
  max-width: 35%;
`;

export default ChartPage;
