import React from "react";
import styled from "styled-components";
import TrainingPeriodList from "../componenents/tables/TrainingPeriodList";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";

const TrainingPeriodsPage = () => {
  return (
    <Page>
      <ErrorBoundary>
        <TrainingPeriodList
          paginationNum={8}
          bAdd={true}
          bEdit={true}
          bDelete={true}
          selectable={false}
        />
      </ErrorBoundary>
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

export default TrainingPeriodsPage;

