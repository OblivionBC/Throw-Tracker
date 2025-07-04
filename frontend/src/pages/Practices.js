import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PracticeList from "../componenents/tables/PracticeList";
import TrainingPeriodList from "../componenents/tables/TrainingPeriodList";
import MeasurementChart from "../componenents/MeasurementChart";
import Measurables from "../componenents/tables/MeasurableList";
import "typeface-rubik";

import ErrorBoundary from "../componenents/ErrorBoundary";
import ExpandedChart from "./ExpandedChart";
import { Col } from "../styles/styles";

const Practices = () => {
  const [activeTRPE, setActiveTRPE] = useState([]);
  const [expand, setExpand] = useState(false);
  const [expandContent, setExpandContent] = useState(
    <ExpandedChart back={() => setExpand(false)} />
  );
  useEffect(() => {
    setActiveTRPE([]);
  }, []);
  if (expand) return expandContent;
  return (
    <Page>
      <LeftColumn>
        <ErrorBoundary>
          <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
            <button
              onClick={() => setExpand(true)}
              style={{ margin: "0", padding: "0" }}
            >
              Expand Chart
            </button>
            <MeasurementChart activeTRPE={activeTRPE} />
          </div>
        </ErrorBoundary>

        <ErrorBoundary>
          <TrainingPeriodList
            sharedState={activeTRPE}
            setSharedState={setActiveTRPE}
            paginationNum={5}
            bAdd={true}
            bEdit={true}
            bDelete={true}
            selectable={true}
          />
        </ErrorBoundary>
      </LeftColumn>
      <RightColumn>
        <ErrorBoundary>
          <PracticeList
            bAdd={true}
            bDelete={true}
            bDetail={true}
            paginationNum={5}
          />
          <Measurables paginationNum={3} />
        </ErrorBoundary>
      </RightColumn>
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 90vh;
  font-family: "Rubik", sans-serif;
`;

const LeftColumn = styled.div`
  display: flex;
  flex: 1;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 49%;
  height: 100%;
`;

const RightColumn = styled.div`
  display: flex;
  flex: 1;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 49%;
  height: 100%;
  margin-left: 5px;
  overflow: hidden;
`;
export default Practices;
