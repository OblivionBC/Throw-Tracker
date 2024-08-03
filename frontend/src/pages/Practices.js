import React, { useEffect, useState } from "react";
import styled from "styled-components";
import placeholder from "../images/ThrowLogo.png";
import PracticeItem from "../componenents/PracticeList";
import TrainingPeriodList from "../componenents/TrainingPeriodList";
import "typeface-rubik";
const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 91vh;
  font-family: "Rubik", sans-serif;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 90%;
  border-right: 1px solid #000;
`;

const RightColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 90%;
`;

const TrainingPeriodWrap = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 20px;
  width: 90%;
`;

const PracticeWrap = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 90%;
`;

const ChartWrap = styled.div`
  display: flex;
  flex-direction: column;
  background-image: url("https://source.unsplash.com/random");
  background-size: cover;
  background-position: center;
  height: 300px;
  width: 300px;
  margin-bottom: 100px;
`;

const ChartPlaceholder = styled.img`
  display: flex;
  color: #fff;
  text-decoration: none;
  border-radius: 20px;
`;

const Practices = () => {
  const [activeTRPE, setActiveTRPE] = useState([]);
  const [activePRAC, setActivePRAC] = useState([]);
  /*useEffect(() => {
    console.log(activePRAC);
  }, [activePRAC]);
  useEffect(() => {
    console.log(activeTRPE);
  }, [activeTRPE]);
*/
  return (
    <Page>
      <LeftColumn>
        <ChartWrap>
          <ChartPlaceholder src={placeholder} />
        </ChartWrap>
        <TrainingPeriodWrap>
          <TrainingPeriodList
            data={TrainingPeriodItems}
            sharedState={activeTRPE}
            setSharedState={setActiveTRPE}
          />
        </TrainingPeriodWrap>
      </LeftColumn>
      <RightColumn>
        <PracticeWrap>
          <PracticeItem
            data={PracticeItems}
            sharedState={activePRAC}
            setSharedState={setActivePRAC}
          />
        </PracticeWrap>
      </RightColumn>
    </Page>
  );
};

//Test Data
const PracticeItems = [
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
];
const TrainingPeriodItems = [
  {
    TRPE_RK: 1,
    trpe_start_dt: "01/09/2024",
    trpe_end_dt: "01/11/2024",
    PRSN_RK: 1,
  },
  {
    TRPE_RK: 2,
    trpe_start_dt: "01/11/2024",
    trpe_end_dt: "01/01/2025",
    PRSN_RK: 1,
  },
  {
    TRPE_RK: 3,
    trpe_start_dt: "01/01/2025",
    trpe_end_dt: "01/03/2025",
    PRSN_RK: 1,
  },
];

export default Practices;
