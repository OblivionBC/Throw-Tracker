import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PracticeList from "../componenents/tables/PracticeList";
import TrainingPeriodList from "../componenents/tables/TrainingPeriodList";
import LineChart from "../componenents/Chart";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 90vh;
  font-family: "Rubik", sans-serif;
`;

const LeftColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 50%;
  height: 100%;
`;

const RightColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 50%;
  height: 100%;
  overflow: hidden;
`;
const Title = styled.h1`
  display: flex;
  align-self: flex-start;
  margin: 0;
  padding: 0 5px 5px;
`;
const Practices = () => {
  const [activeTRPE, setActiveTRPE] = useState([]);
  const [activePRAC, setActivePRAC] = useState([]);

  useEffect(() => {
    console.log("Active TRPE change");
    console.log(activeTRPE);
  }, [activeTRPE]);

  return (
    <Page>
      <LeftColumn>
        <ErrorBoundary>
          <LineChart activeTRPE={activeTRPE} data={PracticeLists} />
        </ErrorBoundary>

        <ErrorBoundary>
          <TrainingPeriodList
            sharedState={activeTRPE}
            setSharedState={setActiveTRPE}
          />
        </ErrorBoundary>
      </LeftColumn>
      <RightColumn>
        <ErrorBoundary>
          <PracticeList />
        </ErrorBoundary>
      </RightColumn>
    </Page>
  );
};

//Test Data
const PracticeLists = [
  {
    prac_rk: 1,
    prac_implement: "Discus",
    prac_implement_weight: "1.75kg",
    prac_best: 37.02,
    prac_dt: "01/09/2024",
    TRPE_RK: 1,
  },
  {
    prac_rk: 2,
    prac_implement: "Javelin",
    prac_implement_weight: "800g",
    prac_best: 65.34,
    prac_dt: "02/09/2024",
    TRPE_RK: 2,
  },
  {
    prac_rk: 3,
    prac_implement: "Shot Put",
    prac_implement_weight: "7.26kg",
    prac_best: 18.44,
    prac_dt: "03/09/2024",
    TRPE_RK: 3,
  },
  {
    prac_rk: 4,
    prac_implement: "Hammer Throw",
    prac_implement_weight: "7.26kg",
    prac_best: 72.15,
    prac_dt: "04/09/2024",
    TRPE_RK: 4,
  },
  {
    prac_rk: 5,
    prac_implement: "Discus",
    prac_implement_weight: "1.75kg",
    prac_best: 32.02,
    prac_dt: "05/10/2024",
    TRPE_RK: 1,
  },
  {
    prac_rk: 6,
    prac_implement: "Javelin",
    prac_implement_weight: "800g",
    prac_best: 60.34,
    prac_dt: "02/11/2024",
    TRPE_RK: 2,
  },
  {
    prac_rk: 7,
    prac_implement: "Shot Put",
    prac_implement_weight: "7.26kg",
    prac_best: 16.44,
    prac_dt: "25/11/2024",
    TRPE_RK: 3,
  },
  {
    prac_rk: 8,
    prac_implement: "Hammer Throw",
    prac_implement_weight: "7.26kg",
    prac_best: 63.15,
    prac_dt: "22/12/2024",
    TRPE_RK: 4,
  },
];

export default Practices;
