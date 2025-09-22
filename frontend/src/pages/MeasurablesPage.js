import React from "react";
import styled from "styled-components";
import Measurables from "../componenents/tables/MeasurableList";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";

const MeasurablesPage = () => {
  return (
    <Page>
      <ErrorBoundary>
        <Measurables paginationNum={8} />
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

export default MeasurablesPage;
