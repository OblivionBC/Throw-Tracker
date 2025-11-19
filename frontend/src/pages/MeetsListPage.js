import React from "react";
import styled from "styled-components";
import MeetsTable from "../components/tables/MeetsTable";
import "typeface-rubik";
import ErrorBoundary from "../components/ErrorBoundary";

const MeetsListPage = () => {
  return (
    <Page>
      <ErrorBoundary>
        <MeetsTable />
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

export default MeetsListPage;
