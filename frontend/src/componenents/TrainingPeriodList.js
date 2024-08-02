import React from "react";
import styled from "styled-components";
// This is your PracticeItem component
//Test that this works and add it to the practices component
const TrainingPeriodWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #E4E19F;
  border: 2px black solid
  border-radius: 100px;
  margin: 2rem
`;

const ItemWrap = styled.p`
  font-family: "Nunito", sans-serif;
  margin-left: 15px;
`;
const TrainingPeriodItem = ({ startDate, endDate, PRSN_RK, TRPE_RK }, key) => {
  return (
    <TrainingPeriodWrap>
      <ItemWrap>TRPE Key: {TRPE_RK}</ItemWrap>
      <ItemWrap>Start Date: {startDate}</ItemWrap>
      <ItemWrap>End Date: {endDate}</ItemWrap>
      <ItemWrap>PRSN Key {PRSN_RK}</ItemWrap>
    </TrainingPeriodWrap>
  );
};

// This is your main component where you map through your data
const TrainingPeriodList = ({ data }) => {
  return (
    <div>
      {data.map((item) => (
        <TrainingPeriodItem
          key={item.TRPE_RK}
          TRPE_RK={item.TRPE_RK}
          startDate={item.trpe_start_dt}
          endDate={item.trpe_end_dt}
          PRSN_RK={item.PRSN_RK}
        />
      ))}
    </div>
  );
};

export default TrainingPeriodList;
