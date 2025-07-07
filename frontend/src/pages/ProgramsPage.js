import React from "react";
import styled from "styled-components";
import ProgramContentList from "../componenents/tables/ProgramContentList";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";

const ProgramsPage = () => {
  return (
    <Page>
      <ErrorBoundary>
        <ProgramContentList data={[]} />
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

export default ProgramsPage;
