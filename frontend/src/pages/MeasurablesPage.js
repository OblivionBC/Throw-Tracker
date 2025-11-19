import React from "react";
import styled from "styled-components";
import MeasurablesTable from "../components/tables/MeasurablesTable";
import "typeface-rubik";
import ErrorBoundary from "../components/ErrorBoundary";

const MeasurablesPage = () => {
  return (
    <Page>
      <ErrorBoundary>
        <MeasurablesTable paginationNum={8} />
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
