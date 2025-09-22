import React from "react";
import styled from "styled-components";
import PracticeList from "../componenents/tables/PracticeList";
import Measurables from "../componenents/tables/MeasurableList";
import "typeface-rubik";

import ErrorBoundary from "../componenents/ErrorBoundary";
import AthleteList from "../componenents/tables/AthleteList";
import CoachPrograms from "../componenents/CoachPrograms";

const Coach = () => {
  return (
    <Page>
      <LeftColumn>
        <ErrorBoundary>
          <CoachPrograms />
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
