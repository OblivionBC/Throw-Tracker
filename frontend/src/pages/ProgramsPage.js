import React from "react";
import styled from "styled-components";
import ProgramsList from "../componenents/tables/ProgramsList";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";

const Page = styled.div`
  padding: 20px;
  height: 100vh;
  overflow: hidden;
`;

const ProgramsPage = () => {
  return (
    <Page>
      <ErrorBoundary>
        <ProgramsList />
      </ErrorBoundary>
    </Page>
  );
};

export default ProgramsPage;
