import React from "react";
import styled from "styled-components";
import MeetList from "../componenents/tables/MeetList";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";

const MeetsListPage = () => {
  return (
    <Page>
      <ErrorBoundary>
        <MeetList />
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
