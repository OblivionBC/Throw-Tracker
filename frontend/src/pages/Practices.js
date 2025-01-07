import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PracticeList from "../componenents/tables/PracticeList";
import TrainingPeriodList from "../componenents/tables/TrainingPeriodList";
import MeasurementChart from "../componenents/MeasurementChart";
import Measurables from "../componenents/tables/MeasurableList";
import "typeface-rubik";
import { useUser } from "../componenents/contexts/UserContext";
import ErrorBoundary from "../componenents/ErrorBoundary";

const Practices = () => {
  const [activeTRPE, setActiveTRPE] = useState([]);
  const { getUser } = useUser();
  useEffect(() => {
    setActiveTRPE([]);
  }, [getUser()]);

  return (
    <Page>
      <LeftColumn>
        <ErrorBoundary>
          <MeasurementChart activeTRPE={activeTRPE} />
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
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 49%;
  height: 100%;
`;

const RightColumn = styled.div`
  display: flex;
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
