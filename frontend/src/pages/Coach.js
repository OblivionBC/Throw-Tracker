import React from "react";
import styled from "styled-components";
import PracticesTable from "../components/tables/PracticesTable";
import MeasurablesTable from "../components/tables/MeasurablesTable";
import "typeface-rubik";

import ErrorBoundary from "../components/ErrorBoundary";
import AthleteTable from "../components/tables/AthleteTable";
import CoachPrograms from "../components/CoachPrograms";

const Coach = () => {
  return (
    <Page>
      <LeftColumn>
        <ErrorBoundary>
          <CoachPrograms />
        </ErrorBoundary>

        <ErrorBoundary>
          <AthleteTable />
        </ErrorBoundary>
      </LeftColumn>
      <RightColumn>
        <ErrorBoundary>
          <Block />
          <PracticesTable
            bAdd={true}
            bDelete={true}
            bDetail={true}
            paginationNum={3}
          />
          <Block />
          <MeasurablesTable paginationNum={3} />
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
