import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PracticeList from "../componenents/tables/PracticeList";
import TrainingPeriodList from "../componenents/tables/TrainingPeriodList";
import CurrentExcersiseList from "../componenents/tables/CurrentExerciseList";
import Measurables from "../componenents/tables/MeasurableList";
import "typeface-rubik";

import ErrorBoundary from "../componenents/ErrorBoundary";
import AthleteList from "../componenents/tables/AthleteList";

const Coach = () => {
  const [activeTRPE, setActiveTRPE] = useState([]);
  useEffect(() => {
    setActiveTRPE([]);
  }, []);

  return (
    <Page>
      <LeftColumn>
        <ErrorBoundary>
          <CurrentExcersiseList paginationNum={5} />
        </ErrorBoundary>

        <ErrorBoundary>
          <AthleteList />
        </ErrorBoundary>
      </LeftColumn>
      <RightColumn>
        <ErrorBoundary>
          <Block />
          <PracticeList
            bAdd={true}
            bDelete={true}
            bDetail={true}
            paginationNum={3}
          />
          <Block />
          <Measurables paginationNum={3} />
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
const Block = styled.div`
  height: 15px;
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
export default Coach;
