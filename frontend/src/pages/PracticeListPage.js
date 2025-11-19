import React from "react";
import styled from "styled-components";
import PracticesTable from "../components/tables/PracticesTable";
import "typeface-rubik";
import ErrorBoundary from "../components/ErrorBoundary";

const PracticeListPage = () => {
  return (
    <Page>
      <ErrorBoundary>
        <PracticesTable
          bAdd={true}
          bDelete={true}
          bDetail={true}
          paginationNum={8}
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

export default PracticeListPage;

