import React from "react";
import styled from "styled-components";
import MeetList from "../componenents/tables/MeetList";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";

const MeetsChartPage = () => {
  return (
    <Page>
      <LeftColumn>
        <ErrorBoundary>
          <BlankChart>
            <ChartPlaceholder>
              <h3>Meets Chart</h3>
              <p>Chart data will be displayed here</p>
            </ChartPlaceholder>
          </BlankChart>
        </ErrorBoundary>
      </LeftColumn>
      <RightColumn>
        <ErrorBoundary>
          <MeetList />
        </ErrorBoundary>
      </RightColumn>
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

const LeftColumn = styled.div`
  display: flex;
  flex: 1;
  margin: 0;
  padding: 0;
  align-self: flex-start;
  flex-direction: column;
  height: 100%;
  max-width: 60%;
`;

const RightColumn = styled.div`
  display: flex;
  flex: 1;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  margin-left: 20px;
  overflow: hidden;
  max-width: 35%;
`;

const BlankChart = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartPlaceholder = styled.div`
  text-align: center;
  color: #666;

  h3 {
    margin-bottom: 10px;
    color: #333;
  }

  p {
    font-style: italic;
  }
`;

export default MeetsChartPage;
