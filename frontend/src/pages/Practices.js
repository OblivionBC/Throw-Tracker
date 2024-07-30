import React from "react";
import styled from "styled-components";
import placeholder from "../images/ThrowLogo.png";
import PracticeItem from "./PracticeItem";

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  border-right: 1px solid #000;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
`;

const TrainingPeriodWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const PracticeWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChartWrap = styled.div`
  display: flex;
  flex-direction: column;
  background-image: url("https://source.unsplash.com/random");
  background-size: cover;
  background-position: center;
  height: 300px;
  width: 300px;
`;

const ChartPlaceholder = styled.img`
  display: flex;
  color: #fff;
  text-decoration: none;
  border-radius: 20px;
`;

const Practices = () => {
  return (
    <Page>
      <LeftColumn>
        <TrainingPeriodWrap>
          <h1>Training</h1>
        </TrainingPeriodWrap>
        <PracticeWrap>
          <h1>Practices</h1>
          <PracticeItem data={PracticeItems} />;
        </PracticeWrap>
      </LeftColumn>
      <RightColumn>
        <ChartWrap>
          <h1>Chart</h1>
          <ChartPlaceholder src={placeholder} />
        </ChartWrap>
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
