import React from "react";
import styled from "styled-components";
import PracticeList from "../componenents/tables/PracticeList";
import TrainingPeriodList from "../componenents/tables/TrainingPeriodList";
import MeasurementChart from "../componenents/MeasurementChart";
import Measurables from "../componenents/tables/MeasurableList";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";
const ExpandedChart = ({ back }) => {
  return (
    <Page>
      <button onClick={() => back()}>Back</button>
      <LeftColumn>
        <ErrorBoundary>
          <MeasurementChart />
        </ErrorBoundary>
      </LeftColumn>
      <RightColumn>
        <ErrorBoundary>
          <TrainingPeriodList paginationNum={8} selectable={true} />
        </ErrorBoundary>
      </RightColumn>
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: rgb(234, 234, 223);
  height: 90vh;
  font-family: "Rubik", sans-serif;
`;

const LeftColumn = styled.div`
  display: flex;
  flex: 1;
  margin: 0;
  padding: 0;
  align-self: flex-start;

  flex-direction: column;
  height: 100%;
`;

const RightColumn = styled.div`
  display: flex;
  flex: .4;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  margin-right: 100px
  overflow: hidden;
`;
export default ExpandedChart;
