import React from "react";
import styled from "styled-components";
import ProgramsTable from "../components/tables/ProgramsTable";
import "typeface-rubik";
import ErrorBoundary from "../components/ErrorBoundary";

const Page = styled.div`
  padding: 20px;
  height: 100vh;
  overflow: hidden;
`;

const ProgramsPage = () => {
  return (
    <Page>
      <ErrorBoundary>
        <ProgramsTable />
      </ErrorBoundary>
    </Page>
  );
};

export default ProgramsPage;
