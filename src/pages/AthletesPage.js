import React from "react";
import styled from "styled-components";
import AthleteList from "../componenents/tables/AthleteList";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";

const AthletesPage = () => {
  return (
    <Page>
      <ErrorBoundary>
        <AthleteList />
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

export default AthletesPage;
