import React from "react";
import styled from "styled-components";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";

const MeetsCalendarPage = () => {
  return (
    <Page>
      <ErrorBoundary>
        <CalendarPlaceholder>
          <h3>Meets Calendar</h3>
          <p>Calendar will be displayed here</p>
        </CalendarPlaceholder>
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

const CalendarPlaceholder = styled.div`
  text-align: center;
  color: #666;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h3 {
    margin-bottom: 10px;
    color: #333;
  }

  p {
    font-style: italic;
  }
`;

export default MeetsCalendarPage;
