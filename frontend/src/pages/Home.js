import React from "react";
import styled from "styled-components";
import LastPractice from "../components/LastPractice";
import "typeface-rubik";
import MeasurablesTable from "../components/tables/MeasurablesTable";
import ErrorBoundary from "../components/ErrorBoundary";
import MeetsTable from "../components/tables/MeetsTable";
import CurrentPrograms from "../components/CurrentPrograms";

const Home = () => {
  return (
    <Page>
      <LeftColumn>
        <ErrorBoundary>
          <MeasurablesTable paginationNum={8} />
        </ErrorBoundary>

        <ErrorBoundary>
          <CurrentPrograms />
        </ErrorBoundary>
      </LeftColumn>
      <RightColumn>
        <ErrorBoundary>
          <LastPractice />
        </ErrorBoundary>

        <ErrorBoundary>
          <MeetsTable />
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
