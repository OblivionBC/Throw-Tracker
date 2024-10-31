import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CurrentExcersiseList from "../componenents/tables/CurrentExerciseList";
import LastPractice from "../componenents/LastPractice";
import "typeface-rubik";
import Measurables from "../componenents/tables/MeasurableList";
import MeasurementChart from "../componenents/MeasurementChart";
import ErrorBoundary from "../componenents/ErrorBoundary";
import MeetList from "../componenents/tables/MeetList";

const Home = () => {
  const [activeTRPE, setActiveTRPE] = useState([]);
  const [activePRAC, setActivePRAC] = useState([]);

  return (
    <Page>
      <LeftColumn>
        <ErrorBoundary>
          <Measurables />
        </ErrorBoundary>

        <ErrorBoundary>
          <CurrentExcersiseList />
        </ErrorBoundary>
      </LeftColumn>
      <RightColumn>
        <ErrorBoundary>
          <LastPractice />
        </ErrorBoundary>

        <ErrorBoundary>
          <MeetList />
        </ErrorBoundary>
      </RightColumn>
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 91vh;
  font-family: "Rubik", sans-serif;
  margin-top: 5px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 50%;
  height: 100%;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
`;
export default Home;
