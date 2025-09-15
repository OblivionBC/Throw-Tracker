import React from "react";
import styled from "styled-components";
import MeasurementChart from "../componenents/MeasurementChart";
import "typeface-rubik";

const ChartPage = () => {
  return (
    <Page>
      <Column>
        <MeasurementChart />
      </Column>
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

const Column = styled.div`
  display: flex;
  flex: 1;
  margin: 0;
  padding: 0;
  align-self: center;
  flex-direction: column;
  height: 100%;
  max-width: 100%;
`;

export default ChartPage;
