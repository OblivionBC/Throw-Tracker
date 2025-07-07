import React from "react";
import styled from "styled-components";
import PracticeList from "../componenents/tables/PracticeList";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";

const PracticeListPage = () => {
  return (
    <Page>
      <ErrorBoundary>
        <PracticeList
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
